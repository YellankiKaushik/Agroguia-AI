'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiMic, FiPlay, FiSquare, FiPhoneOff } from 'react-icons/fi'
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endVoiceCall()
    }
  }, [])

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
        const b64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)))
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

  const langLabel = lang === 'kn' ? 'Kannada' : lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'

  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardContent className="py-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <FiMic className="h-4 w-4 text-primary" />
          VOICE UPDATE
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* TTS play button */}
          <Button
            onClick={ttsPlaying ? stopTTS : playTTS}
            className={`gap-2 ${ttsPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
            size="lg"
          >
            {ttsPlaying ? <FiSquare className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
            {ttsPlaying ? 'Stop' : `Play in ${langLabel}`}
          </Button>

          {/* Live voice call button */}
          <Button
            onClick={voiceCallActive ? endVoiceCall : startVoiceCall}
            variant={voiceCallActive ? 'destructive' : 'outline'}
            className="gap-2"
            size="lg"
          >
            {voiceCallActive ? <FiPhoneOff className="h-4 w-4" /> : <FiMic className="h-4 w-4" />}
            {voiceCallActive ? 'End Voice Call' : 'Talk to Advisor'}
          </Button>
        </div>

        {/* Voice call status */}
        {voiceStatus && (
          <div className="mt-3 flex items-center gap-2">
            {voiceCallActive && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
            <Badge variant="outline" className="text-xs">{voiceStatus}</Badge>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mt-3 p-3 rounded-lg bg-secondary/30 border border-border max-h-32 overflow-y-auto">
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{transcript}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
