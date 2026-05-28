'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { listSchedules, pauseSchedule, resumeSchedule, triggerScheduleNow, getScheduleLogs, cronToHuman } from '@/lib/scheduler'
import type { Schedule, ExecutionLog } from '@/lib/scheduler'
import { uploadAndTrainDocument, getDocuments, deleteDocuments } from '@/lib/ragKnowledgeBase'
import type { RAGDocument } from '@/lib/ragKnowledgeBase'
import { FiClock, FiPlay, FiPause, FiUpload, FiTrash2, FiRefreshCw, FiFile } from 'react-icons/fi'
import { useLanguage } from './LanguageContext'

const DAILY_SCHEDULE_ID = '69ec55e7e35ffb1f44aa60eb'
const WEEKLY_SCHEDULE_ID = '69ec55e7e35ffb1f44aa60ec'

const KB_CONFIG = [
  { id: '69ec5538c73c0e5666b521ed', nameKey: 'pest_disease_kb', descKey: 'pest_disease_kb_desc' },
  { id: '69ec5539c73c0e5666b521ef', nameKey: 'govt_schemes_kb', descKey: 'govt_schemes_kb_desc' },
  { id: '69ec5539f46eb457ee3dec86', nameKey: 'waste_buyer_kb', descKey: 'waste_buyer_kb_desc' },
  { id: '69ec6345e01f11b1c83837c9', nameKey: 'pesticide_library_kb', descKey: 'pesticide_library_kb_desc' },
  { id: '69ec6345f21aec41d26fc452', nameKey: 'fertilizer_guide_kb', descKey: 'fertilizer_guide_kb_desc' },
  { id: '69ec6345fb43bc0103630b8d', nameKey: 'market_price_kb', descKey: 'market_price_kb_desc' },
  { id: '69ec6346c73c0e5666b52256', nameKey: 'insurance_policies_kb', descKey: 'insurance_policies_kb_desc' },
  { id: '69ec6346e01f11b1c83837cb', nameKey: 'loan_parameters_kb', descKey: 'loan_parameters_kb_desc' },
  { id: '69ec6346f21aec41d26fc454', nameKey: 'tenancy_law_kb', descKey: 'tenancy_law_kb_desc' },
  { id: '69ec6347f46eb457ee3dece7', nameKey: 'fraud_cases_kb', descKey: 'fraud_cases_kb_desc' },
]

/* ---- ADVISORY HISTORY ---- */
interface HistoryViewProps {
  history: any[]
  loadingHistory: boolean
  onRefresh: () => void
}

export function AdvisoryHistoryView({ history, loadingHistory, onRefresh }: HistoryViewProps) {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('history_title')}</h2>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loadingHistory}>
          <FiRefreshCw className={`h-3.5 w-3.5 mr-1 ${loadingHistory ? 'animate-spin' : ''}`} /> {t('history_refresh')}
        </Button>
      </div>
      {history.length === 0 && !loadingHistory && (
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardContent className="py-8 text-center text-muted-foreground text-sm">{t('history_empty')}</CardContent>
        </Card>
      )}
      {loadingHistory && <div className="animate-pulse space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-lg" />)}</div>}
      <ScrollArea className="max-h-[600px]">
        <div className="space-y-2 pr-2">
          {history.map((h: any) => {
            const id = h?._id ?? h?.id ?? ''
            const isOpen = expanded === id
            const summary = (() => { try { return JSON.parse(h?.farmer_summary ?? '{}') } catch { return null } })()
            return (
              <Card key={id} className="bg-card/80 backdrop-blur-lg border-border cursor-pointer" onClick={() => setExpanded(isOpen ? null : id)}>
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{summary?.crop ?? h?.crop ?? 'Advisory'} - {summary?.location ?? h?.location ?? ''}</p>
                      <p className="text-xs text-muted-foreground">{h?.generated_at ? new Date(h.generated_at).toLocaleDateString() : ''}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{isOpen ? t('history_collapse') : t('history_expand')}</Badge>
                  </div>
                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-border text-xs space-y-2">
                      {h?.total_income_projection && <p><strong>{t('history_income')}</strong> {h.total_income_projection}</p>}
                      {h?.weather_advisory && <p><strong>{t('history_weather')}</strong> {String(h.weather_advisory).slice(0, 200)}...</p>}
                      {h?.pest_advisory && <p><strong>{t('history_pest')}</strong> {String(h.pest_advisory).slice(0, 200)}...</p>}
                      {h?.schemes_eligible && <p><strong>{t('history_schemes')}</strong> {String(h.schemes_eligible).slice(0, 200)}...</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

/* ---- SCHEDULE MANAGEMENT ---- */
export function ScheduleManagement() {
  const { t } = useLanguage()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<ExecutionLog[]>([])
  const [error, setError] = useState('')
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    loadSchedules()
    return () => { mountedRef.current = false }
  }, [])

  const loadSchedules = async () => {
    setLoading(true)
    setError('')
    const res = await listSchedules()
    if (mountedRef.current) {
      if (res.success) {
        const relevant = res.schedules.filter(s => s.id === DAILY_SCHEDULE_ID || s.id === WEEKLY_SCHEDULE_ID)
        setSchedules(relevant.length > 0 ? relevant : res.schedules.slice(0, 2))
      } else {
        setError(res.error ?? 'Failed to load schedules')
      }
      setLoading(false)
    }
  }

  const handleToggle = async (sched: Schedule) => {
    setLoading(true)
    if (sched.is_active) {
      await pauseSchedule(sched.id)
    } else {
      await resumeSchedule(sched.id)
    }
    await loadSchedules()
  }

  const handleTrigger = async (id: string) => {
    setLoading(true)
    await triggerScheduleNow(id)
    await loadSchedules()
  }

  const handleLogs = async (id: string) => {
    const res = await getScheduleLogs(id, { limit: 5 })
    if (res.success) setLogs(res.executions)
  }

  const scheduleInfo = [
    { id: DAILY_SCHEDULE_ID, nameKey: 'sched_daily', descKey: 'sched_daily_desc' },
    { id: WEEKLY_SCHEDULE_ID, nameKey: 'sched_weekly', descKey: 'sched_weekly_desc' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t('sched_title')}</h2>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scheduleInfo.map(info => {
          const sched = schedules.find(s => s.id === info.id)
          return (
            <Card key={info.id} className="bg-card/80 backdrop-blur-lg border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><FiClock className="text-primary" /> {t(info.nameKey)}</CardTitle>
                <p className="text-xs text-muted-foreground">{t(info.descKey)}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {sched ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant={sched.is_active ? 'default' : 'secondary'}>{sched.is_active ? t('sched_active') : t('sched_paused')}</Badge>
                      <p className="text-xs text-muted-foreground">{sched.cron_expression ? cronToHuman(sched.cron_expression) : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">{sched.is_active ? t('sched_pause') : t('sched_activate')}</Label>
                      <Switch checked={sched.is_active} onCheckedChange={() => handleToggle(sched)} disabled={loading} />
                    </div>
                    {sched.next_run_time && <p className="text-xs text-muted-foreground">{t('sched_next')} {new Date(sched.next_run_time).toLocaleString()}</p>}
                    {sched.last_run_at && <p className="text-xs text-muted-foreground">{t('sched_last')} {new Date(sched.last_run_at).toLocaleString()}</p>}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleTrigger(sched.id)} disabled={loading}><FiPlay className="h-3 w-3 mr-1" /> {t('sched_run_now')}</Button>
                      <Button variant="outline" size="sm" onClick={() => handleLogs(sched.id)}>{t('sched_logs')}</Button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">{loading ? t('sched_loading') : t('sched_not_found')}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
      {logs.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm">{t('sched_recent_logs')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 text-xs">
                  <span>{new Date(log.executed_at).toLocaleString()}</span>
                  <Badge variant={log.success ? 'default' : 'destructive'}>{log.success ? t('sched_success') : t('sched_failed')}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/* ---- SETTINGS / KB MANAGEMENT ---- */
export function SettingsKB() {
  const { t } = useLanguage()
  const [kbDocs, setKbDocs] = useState<Record<string, RAGDocument[]>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [loadingKb, setLoadingKb] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const loadDocs = async (ragId: string) => {
    setLoadingKb(ragId)
    const res = await getDocuments(ragId)
    if (res.success && Array.isArray(res.documents)) {
      setKbDocs(prev => ({ ...prev, [ragId]: res.documents ?? [] }))
    }
    setLoadingKb(null)
  }

  const handleUpload = async (ragId: string, file: File) => {
    setUploading(ragId)
    await uploadAndTrainDocument(ragId, file)
    await loadDocs(ragId)
    setUploading(null)
  }

  const handleDelete = async (ragId: string, fileName: string) => {
    await deleteDocuments(ragId, [fileName])
    await loadDocs(ragId)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t('settings_title')}</h2>
      {KB_CONFIG.map(kb => {
        const docs = kbDocs[kb.id] ?? []
        const isLoading = loadingKb === kb.id
        const isUploading = uploading === kb.id
        return (
          <Card key={kb.id} className="bg-card/80 backdrop-blur-lg border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><FiFile className="text-primary" /> {t(kb.nameKey)}</CardTitle>
              <p className="text-xs text-muted-foreground">{t(kb.descKey)}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => loadDocs(kb.id)} disabled={isLoading}>
                  <FiRefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} /> {t('settings_load_docs')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => fileRefs.current[kb.id]?.click()} disabled={isUploading}>
                  <FiUpload className="h-3 w-3 mr-1" /> {isUploading ? t('settings_uploading') : t('settings_upload')}
                </Button>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  ref={el => { fileRefs.current[kb.id] = el }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(kb.id, file)
                    e.target.value = ''
                  }}
                />
              </div>
              {docs.length > 0 && (
                <div className="space-y-1">
                  {docs.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 text-xs">
                      <div>
                        <span className="font-medium">{doc.fileName}</span>
                        {doc.status && <Badge variant="outline" className="ml-2 text-xs">{doc.status}</Badge>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(kb.id, doc.fileName)}>
                        <FiTrash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {docs.length === 0 && !isLoading && <p className="text-xs text-muted-foreground">{t('settings_no_docs')}</p>}
            </CardContent>
          </Card>
        )
      })}
      <Separator />
      <Card className="bg-card/80 backdrop-blur-lg border-border">
        <CardHeader className="pb-2"><CardTitle className="text-sm">{t('settings_agents')}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {[
              { nameKey: 'agent_coordinator', roleKey: 'agent_coordinator_role' },
              { nameKey: 'agent_weather', roleKey: 'agent_weather_role' },
              { nameKey: 'agent_pest', roleKey: 'agent_pest_role' },
              { nameKey: 'agent_protection', roleKey: 'agent_protection_role' },
              { nameKey: 'agent_crop', roleKey: 'agent_crop_role' },
              { nameKey: 'agent_schemes', roleKey: 'agent_schemes_role' },
              { nameKey: 'agent_insurance', roleKey: 'agent_insurance_role' },
              { nameKey: 'agent_loan', roleKey: 'agent_loan_role' },
              { nameKey: 'agent_fraud', roleKey: 'agent_fraud_role' },
              { nameKey: 'agent_waste', roleKey: 'agent_waste_role' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-secondary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <div><p className="font-medium">{t(a.nameKey)}</p><p className="text-muted-foreground">{t(a.roleKey)}</p></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
