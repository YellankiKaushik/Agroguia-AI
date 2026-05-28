'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FiCloud, FiAlertTriangle, FiShield, FiTrendingUp, FiDollarSign, FiFileText, FiLock, FiTrash2, FiVolume2 } from 'react-icons/fi'
import { useLanguage } from './LanguageContext'

function safeParseJSON(str: string): any {
  if (!str) return null
  try { return JSON.parse(str) } catch {
    const match = str.match(/```json\s*([\s\S]*?)\s*```/)
    if (match) try { return JSON.parse(match[1]) } catch { return null }
    return null
  }
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-1">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-2 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-2 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-3 mb-1">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm">{line.slice(2)}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm">{line.replace(/^\d+\.\s/, '')}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm">{line}</p>
      })}
    </div>
  )
}

function VoiceBtn({ text, speechLang, listenLabel, stopLabel }: { text?: string; speechLang?: string; listenLabel?: string; stopLabel?: string }) {
  const [playing, setPlaying] = useState(false)
  const speak = () => {
    if (!text || typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = speechLang ?? 'en-IN'
    u.onend = () => setPlaying(false)
    u.onerror = () => setPlaying(false)
    setPlaying(true)
    window.speechSynthesis.speak(u)
  }
  const stop = () => { window.speechSynthesis.cancel(); setPlaying(false) }
  if (!text) return null
  return (
    <Button variant="outline" size="sm" onClick={playing ? stop : speak} className="gap-1">
      <FiVolume2 className="h-3.5 w-3.5" /> {playing ? (stopLabel ?? 'Stop') : (listenLabel ?? 'Listen')}
    </Button>
  )
}

function riskColor(risk?: string) {
  const r = (risk ?? '').toLowerCase()
  if (r.includes('high') || r.includes('critical')) return 'destructive'
  if (r.includes('medium') || r.includes('moderate')) return 'secondary'
  return 'outline'
}

interface DashboardTabsProps {
  advisory: any
  voiceSummaries: any
}

export default function DashboardTabs({ advisory, voiceSummaries }: DashboardTabsProps) {
  const { t, speechLang } = useLanguage()
  const weather = safeParseJSON(advisory?.weather_advisory)
  const pest = safeParseJSON(advisory?.pest_advisory)
  const protection = safeParseJSON(advisory?.protection_plan)
  const crop = safeParseJSON(advisory?.crop_strategy)
  const market = safeParseJSON(advisory?.market_intelligence)
  const schemes = safeParseJSON(advisory?.government_schemes)
  const insurance = safeParseJSON(advisory?.insurance_status)
  const loan = safeParseJSON(advisory?.loan_advisory)
  const fraud = safeParseJSON(advisory?.fraud_awareness)
  const waste = safeParseJSON(advisory?.waste_value)

  const vProps = { speechLang, listenLabel: t('voice_listen'), stopLabel: t('voice_stop') }

  const tabItems = [
    { value: 'weather', label: t('tab_weather'), icon: <FiCloud /> },
    { value: 'pest', label: t('tab_pest'), icon: <FiAlertTriangle /> },
    { value: 'protection', label: t('tab_protection'), icon: <FiShield /> },
    { value: 'crop', label: t('tab_crop'), icon: <FiTrendingUp /> },
    { value: 'market', label: t('tab_market'), icon: <FiDollarSign /> },
    { value: 'schemes', label: t('tab_schemes'), icon: <FiFileText /> },
    { value: 'insurance', label: t('tab_insurance'), icon: <FiLock /> },
    { value: 'fraud', label: t('tab_fraud'), icon: <FiAlertTriangle /> },
    { value: 'waste', label: t('tab_waste'), icon: <FiTrash2 /> },
  ]

  return (
    <Tabs defaultValue="weather" className="w-full">
      <ScrollArea className="w-full">
        <TabsList className="flex w-max gap-1 mb-4">
          {tabItems.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs px-3">
              {tab.icon} {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>

      {/* WEATHER */}
      <TabsContent value="weather">
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2"><FiCloud /> {t('weather_title')}</CardTitle>
            <div className="flex gap-2 items-center">
              {weather?.risk_level && <Badge variant={riskColor(weather.risk_level)}>{weather.risk_level}</Badge>}
              <VoiceBtn text={voiceSummaries?.weather} {...vProps} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {weather?.summary && <p className="text-sm text-muted-foreground">{weather.summary}</p>}
            {weather?.fungal_risk_flag && (
              <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                <strong>{t('weather_fungal')}</strong> {weather?.fungal_risk_details ?? t('weather_fungal_default')}
              </div>
            )}
            {Array.isArray(weather?.todays_actions) && weather.todays_actions.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">{t('weather_today')}</h4>
                <div className="space-y-2">
                  {weather.todays_actions.map((a: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/50">
                      <Badge variant={riskColor(a?.priority)} className="text-xs shrink-0 mt-0.5">{a?.priority ?? 'Normal'}</Badge>
                      <div><p className="text-sm font-medium">{a?.action ?? ''}</p><p className="text-xs text-muted-foreground">{a?.reason ?? ''}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(weather?.seven_day_calendar) && weather.seven_day_calendar.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">{t('weather_7day')}</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {weather.seven_day_calendar.map((d: any, i: number) => (
                    <div key={i} className="min-w-[120px] p-2 rounded-lg bg-secondary/30 border border-border text-xs">
                      <p className="font-semibold">{d?.day ?? ''}</p>
                      <p className="text-muted-foreground">{d?.date ?? ''}</p>
                      <p className="mt-1">{d?.weather_summary ?? ''}</p>
                      <p className="text-primary font-medium mt-1">{d?.action ?? ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!weather && advisory?.weather_advisory && renderMarkdown(String(advisory.weather_advisory))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* PEST */}
      <TabsContent value="pest">
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2"><FiAlertTriangle /> {t('pest_title')}</CardTitle>
            <div className="flex gap-2 items-center">
              {pest?.overall_risk && <Badge variant={riskColor(pest.overall_risk)}>{pest.overall_risk}</Badge>}
              <VoiceBtn text={voiceSummaries?.pest} {...vProps} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pest?.primary_disease_name && <p className="text-sm"><strong>{t('pest_primary')}</strong> {pest.primary_disease_name}</p>}
            {pest?.summary && <p className="text-sm text-muted-foreground">{pest.summary}</p>}
            {Array.isArray(pest?.threats) && pest.threats.map((th: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/40 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{th?.threat_name ?? 'Unknown'}</span>
                  <Badge variant={riskColor(th?.risk_level)}>{th?.risk_level ?? ''}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{t('pest_type')}: {th?.type ?? ''} | {t('pest_parts')}: {th?.affected_crop_parts ?? ''}</p>
                <p className="text-xs"><strong>{t('pest_symptoms')}</strong> {th?.visual_symptoms ?? ''}</p>
                <p className="text-xs"><strong>{t('pest_action')} ({th?.action_window_hours ?? '?'}h {t('pest_window')}):</strong> {th?.immediate_action ?? ''}</p>
              </div>
            ))}
            {!pest && advisory?.pest_advisory && renderMarkdown(String(advisory.pest_advisory))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* PROTECTION */}
      <TabsContent value="protection">
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2"><FiShield /> {t('protection_title')}</CardTitle>
            <VoiceBtn text={voiceSummaries?.protection} {...vProps} />
          </CardHeader>
          <CardContent className="space-y-4">
            {protection?.summary && <p className="text-sm text-muted-foreground">{protection.summary}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">{t('protection_spray')}</h4>
                {Array.isArray(protection?.spray_plan?.chemicals) && protection.spray_plan.chemicals.map((c: any, i: number) => (
                  <div key={i} className="p-2 mb-2 rounded-lg bg-secondary/30 border border-border text-xs space-y-0.5">
                    <p className="font-medium">{c?.name ?? ''}</p>
                    <p>{t('protection_qty')}: {c?.quantity_per_acre ?? ''} | {t('protection_mix')}: {c?.mixing_ratio ?? ''}</p>
                    <p>{t('protection_method')}: {c?.method ?? ''} | {t('protection_time')}: {c?.timing ?? ''}</p>
                  </div>
                ))}
                {protection?.spray_plan?.weather_restrictions && <p className="text-xs text-muted-foreground mt-1">{t('protection_restrictions')} {protection.spray_plan.weather_restrictions}</p>}
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">{t('protection_fertilizer')}</h4>
                {Array.isArray(protection?.fertilizer_plan?.fertilizers) && protection.fertilizer_plan.fertilizers.map((f: any, i: number) => (
                  <div key={i} className="p-2 mb-2 rounded-lg bg-secondary/30 border border-border text-xs space-y-0.5">
                    <p className="font-medium">{f?.name ?? ''}</p>
                    <p>{t('protection_qty')}: {f?.quantity_per_acre ?? ''} | {t('protection_stage')}: {f?.stage ?? ''}</p>
                    <p>{t('protection_method')}: {f?.method ?? ''}</p>
                    {f?.budget_alternative && <p className="text-primary">{t('protection_budget_alt')} {f.budget_alternative}</p>}
                  </div>
                ))}
                {protection?.fertilizer_plan?.cumulative_vs_recommended && <p className="text-xs text-muted-foreground mt-1">{protection.fertilizer_plan.cumulative_vs_recommended}</p>}
              </div>
            </div>
            {protection?.cost_summary && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><span className="text-muted-foreground">{t('protection_spray_cost')}</span><p className="font-semibold">{protection.cost_summary?.spray_cost ?? ''}</p></div>
                <div><span className="text-muted-foreground">{t('protection_fert_cost')}</span><p className="font-semibold">{protection.cost_summary?.fertilizer_cost ?? ''}</p></div>
                <div><span className="text-muted-foreground">{t('protection_total')}</span><p className="font-semibold">{protection.cost_summary?.total_cost ?? ''}</p></div>
                <div><span className="text-muted-foreground">{t('protection_remaining')}</span><p className="font-semibold">{protection.cost_summary?.remaining_budget ?? ''}</p></div>
              </div>
            )}
            {Array.isArray(protection?.weekly_calendar) && protection.weekly_calendar.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">{t('protection_weekly')}</h4>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {protection.weekly_calendar.map((d: any, i: number) => (
                    <div key={i} className="min-w-[100px] p-2 rounded-lg bg-secondary/30 border border-border text-xs">
                      <p className="font-semibold">{d?.day ?? ''}</p>
                      <Badge variant="outline" className="text-xs mb-1">{d?.type ?? ''}</Badge>
                      <p>{d?.action ?? ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!protection && advisory?.protection_plan && renderMarkdown(String(advisory.protection_plan))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* CROP STRATEGY */}
      <TabsContent value="crop">
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FiTrendingUp /> {t('crop_title')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {crop?.summary && <p className="text-sm text-muted-foreground">{crop.summary}</p>}
            {Array.isArray(crop?.crop_recommendations) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {crop.crop_recommendations.map((c: any, i: number) => (
                  <div key={i} className={`p-3 rounded-lg border ${i === 0 ? 'bg-primary/10 border-primary/30' : 'bg-secondary/30 border-border'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={i === 0 ? 'default' : 'outline'}>{t('crop_rank')} #{c?.rank ?? i + 1}</Badge>
                      <Badge variant={riskColor(c?.risk_level)}>{c?.risk_level ?? ''}</Badge>
                    </div>
                    <h4 className="font-semibold text-sm">{c?.crop_name ?? ''}</h4>
                    <p className="text-xs text-primary font-medium">{c?.net_profit_per_acre ?? ''}</p>
                    <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      <p>{t('crop_soil')}: {c?.soil_compatibility ?? ''}</p>
                      <p>{t('crop_water')}: {c?.water_requirement ?? ''}</p>
                      <p>{t('crop_seed')}: {c?.seed_variety ?? ''}</p>
                      <p>{t('crop_source')}: {c?.purchase_source ?? ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {crop?.intercropping_suggestion && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <h4 className="font-medium text-sm mb-1">{t('crop_intercrop')}</h4>
                <p className="text-sm">{crop.intercropping_suggestion}</p>
              </div>
            )}
            {!crop && advisory?.crop_strategy && renderMarkdown(String(advisory.crop_strategy))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* MARKET */}
      <TabsContent value="market">
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2"><FiDollarSign /> {t('market_title')}</CardTitle>
            <VoiceBtn text={voiceSummaries?.market} {...vProps} />
          </CardHeader>
          <CardContent className="space-y-4">
            {market?.summary && <p className="text-sm text-muted-foreground">{market.summary}</p>}
            {(() => {
              const mi = market?.market_intelligence ?? market
              return (
                <>
                  {Array.isArray(mi?.mandi_comparison) && mi.mandi_comparison.length > 0 && (
                    <Table>
                      <TableHeader><TableRow>
                        <TableHead className="text-xs">{t('market_mandi')}</TableHead>
                        <TableHead className="text-xs">{t('market_dist')}</TableHead>
                        <TableHead className="text-xs">{t('market_price_q')}</TableHead>
                        <TableHead className="text-xs">{t('market_transport')}</TableHead>
                        <TableHead className="text-xs">{t('market_net')}</TableHead>
                      </TableRow></TableHeader>
                      <TableBody>
                        {mi.mandi_comparison.map((m: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs font-medium">{m?.mandi_name ?? ''}</TableCell>
                            <TableCell className="text-xs">{m?.distance_km ?? ''}km</TableCell>
                            <TableCell className="text-xs">{m?.price_per_quintal ?? ''}</TableCell>
                            <TableCell className="text-xs">{m?.transport_cost ?? ''}</TableCell>
                            <TableCell className="text-xs font-semibold">{m?.net_price ?? ''}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {mi?.best_market && <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-sm"><strong>{t('market_best')}</strong> {mi.best_market}</div>}
                  {mi?.sell_or_wait && (
                    <div className="p-2 rounded-lg bg-secondary/30 border border-border text-sm">
                      <strong>{t('market_recommend')}</strong> {mi.sell_or_wait}
                      {mi?.sell_wait_analysis && <p className="text-xs text-muted-foreground mt-1">{mi.sell_wait_analysis}</p>}
                    </div>
                  )}
                  {mi?.msp_status && <Badge variant="outline" className="text-xs">{mi.msp_status}</Badge>}
                  {mi?.storage_advisory && <p className="text-xs text-muted-foreground">{mi.storage_advisory}</p>}
                </>
              )
            })()}
            {!market && advisory?.market_intelligence && renderMarkdown(String(advisory.market_intelligence))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* SCHEMES */}
      <TabsContent value="schemes">
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2"><FiFileText /> {t('schemes_title')}</CardTitle>
            <VoiceBtn text={voiceSummaries?.schemes} {...vProps} />
          </CardHeader>
          <CardContent className="space-y-4">
            {schemes?.summary && <p className="text-sm text-muted-foreground">{schemes.summary}</p>}
            {schemes?.total_potential_benefits && <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-sm font-semibold">{t('schemes_total_benefits')} {schemes.total_potential_benefits}</div>}
            {Array.isArray(schemes?.enrolled_schemes) && schemes.enrolled_schemes.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">{t('schemes_enrolled')}</h4>
                {schemes.enrolled_schemes.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/10 mb-1">
                    <span className="text-sm">{s?.name ?? ''}</span>
                    <div className="flex gap-2"><Badge variant="default" className="text-xs">{s?.status ?? ''}</Badge><span className="text-xs font-medium">{s?.benefit_amount ?? ''}</span></div>
                  </div>
                ))}
              </div>
            )}
            {Array.isArray(schemes?.missing_schemes) && schemes.missing_schemes.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">{t('schemes_eligible')}</h4>
                {schemes.missing_schemes.map((s: any, i: number) => (
                  <details key={i} className="p-2 rounded-lg bg-secondary/30 border border-border mb-2">
                    <summary className="cursor-pointer text-sm font-medium flex items-center justify-between">
                      <span>{s?.name ?? ''}</span>
                      <span className="text-xs text-primary">{s?.annual_benefit ?? ''}</span>
                    </summary>
                    <div className="mt-2 space-y-1 text-xs">
                      <p><strong>{t('schemes_match')}</strong> {s?.eligibility_match ?? ''}</p>
                      <p><strong>{t('schemes_deadline')}</strong> {s?.deadline ?? ''}</p>
                      <p><strong>{t('schemes_portal')}</strong> {s?.portal_or_office ?? ''}</p>
                      {Array.isArray(s?.documents_required) && <p><strong>{t('schemes_docs')}</strong> {s.documents_required.join(', ')}</p>}
                      {Array.isArray(s?.application_steps) && (
                        <ol className="ml-4 list-decimal">{s.application_steps.map((st: string, j: number) => <li key={j}>{st}</li>)}</ol>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            )}
            {Array.isArray(schemes?.deadline_alerts) && schemes.deadline_alerts.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-1">{t('schemes_deadline_alerts')}</h4>
                {schemes.deadline_alerts.map((d: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs p-1.5 rounded bg-destructive/10 mb-1">
                    <span>{d?.scheme_name ?? ''}</span>
                    <span className="font-medium">{d?.days_remaining ?? '?'} {t('schemes_days')} ({d?.deadline ?? ''})</span>
                  </div>
                ))}
              </div>
            )}
            {!schemes && advisory?.government_schemes && renderMarkdown(String(advisory.government_schemes))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* INSURANCE & LOANS */}
      <TabsContent value="insurance">
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2"><FiLock /> {t('insurance_title')}</CardTitle>
            <div className="flex gap-2">
              <VoiceBtn text={voiceSummaries?.insurance} {...vProps} />
              <VoiceBtn text={voiceSummaries?.loans} {...vProps} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Insurance */}
            <div>
              <h4 className="font-medium text-sm mb-2">{t('insurance_status')}</h4>
              {insurance?.summary && <p className="text-sm text-muted-foreground mb-2">{insurance.summary}</p>}
              {insurance?.eligibility_verdict && <Badge variant="outline" className="mb-2">{insurance.eligibility_verdict}</Badge>}
              {insurance?.expected_payout && <p className="text-sm"><strong>{t('insurance_payout')}</strong> {insurance.expected_payout}</p>}
              {insurance?.payout_calculation && <p className="text-xs text-muted-foreground">{insurance.payout_calculation}</p>}
              {Array.isArray(insurance?.document_checklist) && insurance.document_checklist.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">{t('insurance_documents')}</p>
                  {insurance.document_checklist.map((d: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs p-1 border-b border-border/50">
                      <span>{d?.document ?? ''}</span>
                      <Badge variant={d?.status === 'Ready' ? 'default' : 'secondary'} className="text-xs">{d?.status ?? ''}</Badge>
                    </div>
                  ))}
                </div>
              )}
              {Array.isArray(insurance?.filing_steps) && insurance.filing_steps.length > 0 && (
                <div className="mt-2"><p className="text-xs font-medium mb-1">{t('insurance_filing')}</p>
                  <ol className="ml-4 list-decimal text-xs space-y-0.5">{insurance.filing_steps.map((s: string, i: number) => <li key={i}>{s}</li>)}</ol>
                </div>
              )}
            </div>
            {/* Loans */}
            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-sm mb-2">{t('loan_title')}</h4>
              {loan?.summary && <p className="text-sm text-muted-foreground mb-2">{loan.summary}</p>}
              {loan?.best_recommendation && <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-sm mb-2"><strong>{t('loan_recommended')}</strong> {loan.best_recommendation}<br /><span className="text-xs text-muted-foreground">{loan?.recommendation_reason ?? ''}</span></div>}
              {Array.isArray(loan?.loan_options) && loan.loan_options.length > 0 && (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead className="text-xs">{t('loan_lender')}</TableHead>
                    <TableHead className="text-xs">{t('loan_rate')}</TableHead>
                    <TableHead className="text-xs">{t('loan_amount')}</TableHead>
                    <TableHead className="text-xs">{t('loan_emi')}</TableHead>
                    <TableHead className="text-xs">{t('loan_flag')}</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {loan.loan_options.map((l: any, i: number) => (
                      <TableRow key={i} className={l?.is_predatory ? 'bg-destructive/10' : ''}>
                        <TableCell className="text-xs">{l?.lender ?? ''}</TableCell>
                        <TableCell className="text-xs">{l?.interest_rate ?? ''}</TableCell>
                        <TableCell className="text-xs">{l?.eligible_amount ?? ''}</TableCell>
                        <TableCell className="text-xs">{l?.emi ?? ''}</TableCell>
                        <TableCell className="text-xs">{l?.is_predatory ? <Badge variant="destructive">{t('loan_predatory')}</Badge> : <Badge variant="outline">{t('loan_safe')}</Badge>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {loan?.subvention_eligibility && <p className="text-xs text-muted-foreground mt-1">{t('loan_subvention')} {loan.subvention_eligibility}</p>}
              {Array.isArray(loan?.documents_required) && <p className="text-xs text-muted-foreground mt-1">{t('loan_docs')} {loan.documents_required.join(', ')}</p>}
            </div>
            {!insurance && advisory?.insurance_status && renderMarkdown(String(advisory.insurance_status))}
            {!loan && advisory?.loan_advisory && renderMarkdown(String(advisory.loan_advisory))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* FRAUD */}
      <TabsContent value="fraud">
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2"><FiAlertTriangle /> {t('fraud_title')}</CardTitle>
            <VoiceBtn text={voiceSummaries?.fraud} {...vProps} />
          </CardHeader>
          <CardContent className="space-y-4">
            {fraud?.summary && <p className="text-sm text-muted-foreground">{fraud.summary}</p>}
            {fraud?.digital_risk_score != null && (
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-secondary border-2 border-border">
                  <span className="text-lg font-bold">{fraud.digital_risk_score}</span>
                </div>
                <div><p className="text-sm font-medium">{t('fraud_risk_score')}</p>{fraud?.risk_level && <Badge variant={riskColor(fraud.risk_level)}>{fraud.risk_level}</Badge>}</div>
              </div>
            )}
            {Array.isArray(fraud?.risk_factors) && fraud.risk_factors.length > 0 && (
              <div><h4 className="font-medium text-sm mb-1">{t('fraud_risk_factors')}</h4><ul className="ml-4 list-disc text-xs space-y-0.5">{fraud.risk_factors.map((f: string, i: number) => <li key={i}>{f}</li>)}</ul></div>
            )}
            {fraud?.awareness_story && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border"><h4 className="font-medium text-sm mb-1">{t('fraud_story')}</h4><p className="text-xs">{fraud.awareness_story}</p></div>
            )}
            {Array.isArray(fraud?.five_golden_rules) && fraud.five_golden_rules.length > 0 && (
              <div><h4 className="font-medium text-sm mb-1">{t('fraud_rules')}</h4><ol className="ml-4 list-decimal text-xs space-y-0.5">{fraud.five_golden_rules.map((r: string, i: number) => <li key={i}>{r}</li>)}</ol></div>
            )}
            {fraud?.fraud_simulation && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 space-y-1">
                <h4 className="font-medium text-sm">{t('fraud_simulation')}</h4>
                <p className="text-xs"><strong>{t('fraud_scenario')}</strong> {fraud.fraud_simulation?.scenario ?? ''}</p>
                <p className="text-xs italic bg-destructive/10 p-1.5 rounded">{fraud.fraud_simulation?.fake_message ?? ''}</p>
                <p className="text-xs"><strong>{t('fraud_correct')}</strong> {fraud.fraud_simulation?.correct_response ?? ''}</p>
                <p className="text-xs text-muted-foreground">{fraud.fraud_simulation?.why_its_fraud ?? ''}</p>
              </div>
            )}
            {Array.isArray(fraud?.trending_frauds) && fraud.trending_frauds.length > 0 && (
              <div><h4 className="font-medium text-sm mb-1">{t('fraud_trending')}</h4><ul className="ml-4 list-disc text-xs space-y-0.5">{fraud.trending_frauds.map((f: string, i: number) => <li key={i}>{f}</li>)}</ul></div>
            )}
            {!fraud && advisory?.fraud_awareness && renderMarkdown(String(advisory.fraud_awareness))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* WASTE */}
      <TabsContent value="waste">
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2"><FiTrash2 /> {t('waste_title')}</CardTitle>
            <VoiceBtn text={voiceSummaries?.waste} {...vProps} />
          </CardHeader>
          <CardContent className="space-y-4">
            {waste?.summary && <p className="text-sm text-muted-foreground">{waste.summary}</p>}
            {waste?.total_waste_income && <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-sm font-semibold">{t('waste_total')} {waste.total_waste_income}</div>}
            {Array.isArray(waste?.waste_inventory) && waste.waste_inventory.length > 0 && (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">{t('waste_type')}</TableHead>
                  <TableHead className="text-xs">{t('waste_qty')}</TableHead>
                  <TableHead className="text-xs">{t('waste_value_t')}</TableHead>
                  <TableHead className="text-xs">{t('waste_total_val')}</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {waste.waste_inventory.map((w: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs">{w?.waste_type ?? ''}</TableCell>
                      <TableCell className="text-xs">{w?.quantity_tonnes ?? ''}</TableCell>
                      <TableCell className="text-xs">{w?.value_per_tonne ?? ''}</TableCell>
                      <TableCell className="text-xs font-medium">{w?.total_value ?? ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {Array.isArray(waste?.nearby_buyers) && waste.nearby_buyers.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">{t('waste_buyers')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {waste.nearby_buyers.map((b: any, i: number) => (
                    <div key={i} className="p-2 rounded-lg bg-secondary/30 border border-border text-xs space-y-0.5">
                      <p className="font-medium">{b?.buyer_name ?? ''}</p>
                      <p>Type: {b?.buyer_type ?? ''} | {b?.distance_km ?? '?'}km</p>
                      <p>Price: {b?.price_per_tonne ?? ''} | Min: {b?.min_quantity ?? ''}</p>
                      <p>{t('waste_contact')} {b?.contact ?? ''}</p>
                      {b?.transaction_process && <p className="text-muted-foreground">{b.transaction_process}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {waste?.composting_guide && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <h4 className="font-medium text-sm mb-1">{t('waste_compost')}</h4>
                {Array.isArray(waste.composting_guide?.steps) && <ol className="ml-4 list-decimal text-xs space-y-0.5">{waste.composting_guide.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}</ol>}
                {waste.composting_guide?.timeline && <p className="text-xs mt-1"><strong>{t('waste_timeline')}</strong> {waste.composting_guide.timeline}</p>}
                {waste.composting_guide?.soil_benefits && <p className="text-xs"><strong>{t('waste_benefits')}</strong> {waste.composting_guide.soil_benefits}</p>}
              </div>
            )}
            {!waste && advisory?.waste_value && renderMarkdown(String(advisory.waste_value))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
