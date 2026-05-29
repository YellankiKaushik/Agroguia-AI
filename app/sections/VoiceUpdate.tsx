'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Mic, PhoneOff, Play, Square } from 'lucide-react'
import { useLanguage } from './LanguageContext'

const VOICE_AGENT_ID = '69ec55d4a57e78ed3c81ed7c'

interface VoiceUpdateProps {
  voiceSummary: {
    kannada: string
    english: string
  }
}

export default function VoiceUpdate({ voiceSummary }: VoiceUpdateProps) {
  const { lang, speechLang } = useLanguage()
  const [ttsPlaying, setTtsPlaying] = useState(false)
  const [voiceCallActive, setVoiceCallActive] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('')
  const [transcript, setTranscript] = useState('')

  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const nextPlayTimeRef = useRef(0)
  const isMutedRef = useRef(false)

  const playTTS = () => {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const text = lang === 'kn' ? voiceSummary?.kannada : voiceSummary?.english
    if (!text) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = speechLang
    u.onend = () => setTtsPlaying(false)
    u.onerror = () => setTtsPlaying(false)
    setTtsPlaying(true)
    window.speechSynthesis.speak(u)
  }

  const stopTTS = () => {
    window.speechSynthesis.cancel()
    setTtsPlaying(false)
  }

  const startVoiceCall = useCallback(async () => {
    try {
      setVoiceStatus('Connecting...')
      setVoiceCallActive(true)
      setTranscript('')
      nextPlayTimeRef.current = 0

      // 1. Start session
      const res = await fetch('https://voice-sip.studio.lyzr.ai/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: VOICE_AGENT_ID }),
      })
      const data = await res.json()
      const wsUrl = data?.wsUrl
      const sampleRate = data?.audioConfig?.sampleRate ?? 16000

      if (!wsUrl) {
        setVoiceStatus('Failed to start session')
        setVoiceCallActive(false)
        return
      }

      // 2. Audio context
      const audioCtx = new AudioContext({ sampleRate })
      audioContextRef.current = audioCtx

      // 3. Get mic
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate, channelCount: 1 } })
      streamRef.current = stream
      const source = audioCtx.createMediaStreamSource(stream)
      const processor = audioCtx.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      // Silent gain to prevent echo
      const silentGain = audioCtx.createGain()
      silentGain.gain.value = 0
      silentGain.connect(audioCtx.destination)
      source.connect(processor)
      processor.connect(silentGain)

      // 4. Connect WebSocket
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setVoiceStatus('Connected - speak now')
      }

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current) return
        if (ws.readyState !== WebSocket.OPEN) return
        const input = e.inputBuffer.getChannelData(0)
        const pcm16 = new Int16Array(input.length)
        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]))
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
        }
        const bytes = new Uint8Array(pcm16.buffer)
        let binary = ''
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
        const b64 = btoa(binary)
        ws.send(JSON.stringify({ type: 'audio', audio: b64, sampleRate }))
      }

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data)
          if (msg.type === 'audio' && msg.audio && audioContextRef.current) {
            const raw = atob(msg.audio)
            const bytes = new Uint8Array(raw.length)
            for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
            const pcm16 = new Int16Array(bytes.buffer)
            const float32 = new Float32Array(pcm16.length)
            for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768
            const ab = audioContextRef.current.createBuffer(1, float32.length, sampleRate)
            ab.getChannelData(0).set(float32)
            const sn = audioContextRef.current.createBufferSource()
            sn.buffer = ab
            sn.connect(audioContextRef.current.destination)
            const now = audioContextRef.current.currentTime
            const startTime = Math.max(now, nextPlayTimeRef.current)
            sn.start(startTime)
            nextPlayTimeRef.current = startTime + ab.duration
          } else if (msg.type === 'transcript') {
            setTranscript(prev => prev + (msg.text ?? '') + '\n')
          } else if (msg.type === 'thinking') {
            setVoiceStatus('Thinking...')
          } else if (msg.type === 'clear') {
            setVoiceStatus('Connected - speak now')
          } else if (msg.type === 'error') {
            setVoiceStatus('Error: ' + (msg.message ?? 'Unknown'))
          }
        } catch { /* ignore parse errors */ }
      }

      ws.onclose = () => {
        setVoiceStatus('Disconnected')
        setVoiceCallActive(false)
      }

      ws.onerror = () => {
        setVoiceStatus('Connection error')
        setVoiceCallActive(false)
      }
    } catch (err: any) {
      setVoiceStatus('Error: ' + (err?.message ?? 'Failed'))
      setVoiceCallActive(false)
    }
  }, [])

  const endVoiceCall = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    nextPlayTimeRef.current = 0
    setVoiceCallActive(false)
    setVoiceStatus('')
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endVoiceCall()
    }
  }, [endVoiceCall])

  const langLabel = lang === 'kn' ? 'Kannada' : lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'
  const voiceHasError = /error|failed|unavailable/i.test(voiceStatus)

  return (
    <Card className="rounded-lg border border-white/10 bg-white/[0.035] text-slate-100 backdrop-blur-xl transition-all duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-emerald-200/70">Voice-first advisory</p>
            <h3 className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
              <Mic className="h-4 w-4 text-emerald-200" />
              Voice update
            </h3>
          </div>
          <Badge variant="outline" className="border-white/10 bg-black/25 text-xs text-slate-400">{langLabel}</Badge>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* TTS play button */}
          <Button
            onClick={ttsPlaying ? stopTTS : playTTS}
            className={`h-11 gap-2 rounded-md font-semibold transition-all duration-300 ${ttsPlaying ? 'bg-red-500/15 text-red-200 hover:bg-red-500/20' : 'bg-emerald-200 text-slate-950 hover:bg-emerald-100'}`}
            size="lg"
          >
            {ttsPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {ttsPlaying ? 'Stop' : `Play in ${langLabel}`}
          </Button>

          {/* Live voice call button */}
          <Button
            onClick={voiceCallActive ? endVoiceCall : startVoiceCall}
            variant={voiceCallActive ? 'destructive' : 'outline'}
            className="h-11 gap-2 rounded-md border-white/15 bg-white/[0.03] text-slate-200 hover:bg-white/10 hover:text-white"
            size="lg"
          >
            {voiceCallActive ? <PhoneOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {voiceCallActive ? 'End Voice Call' : 'Talk to Advisor'}
          </Button>
        </div>

        {/* Voice call status */}
        {voiceStatus && (
          <div role="status" aria-live="polite" className={`mt-4 rounded-lg border p-3 text-xs ${voiceHasError ? 'border-red-400/20 bg-red-950/20 text-red-100' : 'border-emerald-300/15 bg-emerald-300/[0.055] text-emerald-100'}`}>
            <div className="flex items-center gap-2">
              {voiceHasError ? <AlertTriangle className="h-3.5 w-3.5" /> : voiceCallActive && <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />}
              <span>{voiceStatus}</span>
            </div>
            {voiceHasError && <p className="mt-1 text-red-200/70">Voice advisory is optional. You can continue using the written dashboard intelligence.</p>}
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mt-4 max-h-32 overflow-y-auto rounded-lg border border-white/10 bg-black/25 p-3" aria-label="Voice transcript">
            <p className="whitespace-pre-wrap text-xs text-slate-400">{transcript}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
