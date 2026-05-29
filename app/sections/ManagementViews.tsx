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
import { AlertTriangle, Clock, DatabaseZap, File, FileSearch, Play, RefreshCw, Trash2, Upload } from 'lucide-react'
import { useLanguage } from './LanguageContext'

const glassCardClass = 'rounded-lg border border-white/10 bg-white/[0.035] text-slate-100 backdrop-blur-xl transition-all duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]'
const panelClass = 'rounded-lg border border-white/10 bg-black/20'
const outlineButtonClass = 'rounded-md border-white/15 bg-white/[0.03] text-slate-200 hover:bg-white/10 hover:text-white'
const loadingBarClass = 'h-2 animate-pulse rounded-full bg-white/[0.07]'

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
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-emerald-200/70">Advisory memory</p>
          <h2 className="mt-1 text-lg font-semibold text-white">{t('history_title')}</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loadingHistory} className={outlineButtonClass}>
          <RefreshCw className={`mr-1 h-3.5 w-3.5 ${loadingHistory ? 'animate-spin' : ''}`} /> {t('history_refresh')}
        </Button>
      </div>
      {history.length === 0 && !loadingHistory && (
        <Card className="rounded-[1.5rem] border border-dashed border-emerald-300/20 bg-white/[0.035] text-slate-100 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-300/10 text-emerald-100">
              <FileSearch className="h-5 w-5" />
            </div>
            <p className="text-xs uppercase text-emerald-200/70">No advisory memory yet</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{t('history_empty')}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Generated advisory packets will appear here as farm intelligence memory after your first AI run.</p>
          </CardContent>
        </Card>
      )}
      {loadingHistory && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div className={`${loadingBarClass} w-2/3`} />
              <div className={`${loadingBarClass} mt-3 w-1/3`} />
            </div>
          ))}
        </div>
      )}
      <ScrollArea className="max-h-[600px]">
        <div className="space-y-2 pr-2">
          {history.map((h: any) => {
            const id = h?._id ?? h?.id ?? ''
            const isOpen = expanded === id
            const summary = (() => { try { return JSON.parse(h?.farmer_summary ?? '{}') } catch { return null } })()
            return (
              <Card key={id} className={`${glassCardClass} cursor-pointer`} onClick={() => setExpanded(isOpen ? null : id)}>
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{summary?.crop ?? h?.crop ?? 'Advisory'} - {summary?.location ?? h?.location ?? ''}</p>
                      <p className="text-xs text-slate-500">{h?.generated_at ? new Date(h.generated_at).toLocaleDateString() : ''}</p>
                    </div>
                    <Badge variant="outline" className="border-white/10 bg-black/25 text-xs text-slate-300">{isOpen ? t('history_collapse') : t('history_expand')}</Badge>
                  </div>
                  {isOpen && (
                    <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-xs text-slate-400">
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
      <div>
        <p className="text-xs uppercase text-emerald-200/70">Automation control</p>
        <h2 className="mt-1 text-lg font-semibold text-white">{t('sched_title')}</h2>
      </div>
      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-950/20 p-4 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-200" />
            <div>
              <p className="text-xs font-semibold uppercase text-red-200/80">Automation status unavailable</p>
              <p className="mt-1 leading-6">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scheduleInfo.map(info => {
          const sched = schedules.find(s => s.id === info.id)
          return (
            <Card key={info.id} className={glassCardClass}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-white"><Clock className="h-4 w-4 text-emerald-200" /> {t(info.nameKey)}</CardTitle>
                <p className="text-xs text-slate-500">{t(info.descKey)}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {sched ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant={sched.is_active ? 'default' : 'secondary'}>{sched.is_active ? t('sched_active') : t('sched_paused')}</Badge>
                      <p className="text-xs text-slate-500">{sched.cron_expression ? cronToHuman(sched.cron_expression) : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">{sched.is_active ? t('sched_pause') : t('sched_activate')}</Label>
                      <Switch checked={sched.is_active} onCheckedChange={() => handleToggle(sched)} disabled={loading} />
                    </div>
                    {sched.next_run_time && <p className="text-xs text-slate-500">{t('sched_next')} {new Date(sched.next_run_time).toLocaleString()}</p>}
                    {sched.last_run_at && <p className="text-xs text-slate-500">{t('sched_last')} {new Date(sched.last_run_at).toLocaleString()}</p>}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleTrigger(sched.id)} disabled={loading} className={outlineButtonClass}><Play className="mr-1 h-3 w-3" /> {t('sched_run_now')}</Button>
                      <Button variant="outline" size="sm" onClick={() => handleLogs(sched.id)} className={outlineButtonClass}>{t('sched_logs')}</Button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4">
                    {loading ? (
                      <div className="space-y-2">
                        <div className={`${loadingBarClass} w-3/4`} />
                        <div className={`${loadingBarClass} w-1/2`} />
                      </div>
                    ) : (
                      <p className="text-xs leading-5 text-slate-500">{t('sched_not_found')} Configure this automation to enable scheduled advisory intelligence.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
      {logs.length > 0 && (
        <Card className={glassCardClass}>
          <CardHeader className="pb-2"><CardTitle className="text-sm">{t('sched_recent_logs')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className={`${panelClass} flex items-center justify-between p-2 text-xs`}>
                  <span>{new Date(log.executed_at).toLocaleString()}</span>
                  <Badge variant="outline" className={log.success ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100' : 'border-red-400/20 bg-red-500/10 text-red-100'}>{log.success ? t('sched_success') : t('sched_failed')}</Badge>
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
      <div>
        <p className="text-xs uppercase text-emerald-200/70">System knowledge base</p>
        <h2 className="mt-1 text-lg font-semibold text-white">{t('settings_title')}</h2>
      </div>
      {KB_CONFIG.map(kb => {
        const docs = kbDocs[kb.id] ?? []
        const isLoading = loadingKb === kb.id
        const isUploading = uploading === kb.id
        return (
          <Card key={kb.id} className={glassCardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-white"><File className="h-4 w-4 text-emerald-200" /> {t(kb.nameKey)}</CardTitle>
              <p className="text-xs text-slate-500">{t(kb.descKey)}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => loadDocs(kb.id)} disabled={isLoading} className={outlineButtonClass}>
                  <RefreshCw className={`mr-1 h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} /> {t('settings_load_docs')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => fileRefs.current[kb.id]?.click()} disabled={isUploading} className={outlineButtonClass}>
                  <Upload className="mr-1 h-3 w-3" /> {isUploading ? t('settings_uploading') : t('settings_upload')}
                </Button>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  aria-label={`Upload document for ${t(kb.nameKey)}`}
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
                    <div key={i} className={`${panelClass} flex items-center justify-between p-2 text-xs`}>
                      <div>
                        <span className="font-medium">{doc.fileName}</span>
                        {doc.status && <Badge variant="outline" className="ml-2 border-emerald-300/20 bg-emerald-300/10 text-xs text-emerald-100">{doc.status}</Badge>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(kb.id, doc.fileName)} aria-label={`Delete ${doc.fileName}`} className="text-slate-400 hover:bg-red-400/10 hover:text-red-100">
                        <Trash2 className="h-3 w-3 text-red-200" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {isLoading && (
                <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <div className={`${loadingBarClass} w-2/3`} />
                  <div className={`${loadingBarClass} mt-2 w-1/3`} />
                </div>
              )}
              {docs.length === 0 && !isLoading && (
                <div className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 text-center">
                  <DatabaseZap className="mx-auto h-5 w-5 text-emerald-200" />
                  <p className="mt-2 text-xs font-medium text-slate-300">{t('settings_no_docs')}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Upload trusted source material to strengthen this intelligence module.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
      <Separator />
      <Card className={glassCardClass}>
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
              <div key={i} className="flex items-center gap-2 rounded border border-white/5 bg-black/20 p-2">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-200" />
                <div><p className="font-medium text-white">{t(a.nameKey)}</p><p className="text-slate-500">{t(a.roleKey)}</p></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
