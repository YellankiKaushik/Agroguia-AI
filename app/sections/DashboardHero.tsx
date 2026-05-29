'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, Cloud, Droplet, MapPin, Thermometer, Wind } from 'lucide-react'
import { useLanguage } from './LanguageContext'

interface Alert {
  level: string
  label: string
  detail: string
  color: string
}

interface Action {
  action: string
  done: boolean
  priority: string
  detail: string
}

interface DashboardHeroProps {
  farmer: {
    name: string
    village?: string
    district: string
    state?: string
    land_size_acres: number
    current_crop: string
    crop_stage: string
    sowing_date?: string
    irrigation_type?: string
    soil_type?: string
  }
  weather: {
    humidity: string
    rainfall_forecast: string
    temperature: string
    wind_speed: string
    season: string
  }
  alerts: Alert[]
  actions: Action[]
  onToggleAction?: (index: number) => void
}

function alertBadgeClass(level: string): string {
  const l = level.toUpperCase()
  if (l === 'HIGH') return 'border-red-400/20 bg-red-950/30 text-red-200'
  if (l === 'MED') return 'border-amber-400/20 bg-amber-950/30 text-amber-200'
  return 'border-emerald-400/20 bg-emerald-950/30 text-emerald-200'
}

function alertDotClass(level: string): string {
  const l = level.toUpperCase()
  if (l === 'HIGH') return 'bg-red-500'
  if (l === 'MED') return 'bg-amber-500'
  return 'bg-green-500'
}

function priorityBadgeVariant(priority: string): 'destructive' | 'secondary' | 'outline' {
  const p = (priority ?? '').toLowerCase()
  if (p === 'high') return 'destructive'
  if (p === 'medium') return 'secondary'
  return 'outline'
}

export default function DashboardHero({ farmer, weather, alerts, actions, onToggleAction }: DashboardHeroProps) {
  const { t } = useLanguage()
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({})

  const toggleAction = (idx: number) => {
    setCheckedActions(prev => ({ ...prev, [idx]: !prev[idx] }))
    onToggleAction?.(idx)
  }

  return (
    <div className="space-y-4">
      {/* Top farmer info bar */}
      <Card className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 hover:border-emerald-300/20">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase text-emerald-200/70">Active farm intelligence profile</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{farmer.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-teal-200" />
                <span>{farmer.district}{farmer.state ? `, ${farmer.state}` : ''}</span>
                <span className="text-slate-600">|</span>
                <span>{farmer.land_size_acres} Acres</span>
                <span className="text-slate-600">|</span>
                <span>{farmer.current_crop} {farmer.crop_stage}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs">
                <Thermometer className="mb-1 h-3.5 w-3.5 text-amber-200" />
                <span>{weather.temperature}</span>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs">
                <Droplet className="mb-1 h-3.5 w-3.5 text-teal-200" />
                <span>{weather.humidity}</span>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs">
                <Wind className="mb-1 h-3.5 w-3.5 text-emerald-200" />
                <span>{weather.wind_speed}</span>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs">
                <Cloud className="mb-1 h-3.5 w-3.5 text-sky-200" />
                <span>{weather.rainfall_forecast}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions + Alerts side by side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Today's Actions */}
        <Card className="rounded-lg border border-white/10 bg-white/[0.035] text-slate-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/[0.05]">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-emerald-200/70">AI action queue</p>
                <h3 className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                  Today&apos;s actions
                </h3>
              </div>
              <Badge variant="outline" className="border-white/10 bg-black/25 text-xs text-slate-400">{actions?.length ?? 0} tasks</Badge>
            </div>
            <div className="space-y-2">
              {Array.isArray(actions) && actions.map((act, i) => (
                <div key={i} className="flex items-start gap-3 rounded-md border border-white/5 bg-black/20 p-3">
                  <button
                    type="button"
                    onClick={() => toggleAction(i)}
                    aria-label={`${checkedActions[i] ? 'Mark incomplete' : 'Mark complete'}: ${act.action}`}
                    aria-pressed={checkedActions[i]}
                    className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${checkedActions[i] ? 'border-emerald-200 bg-emerald-200' : 'border-white/20 hover:border-emerald-300/50'}`}
                  >
                    {checkedActions[i] && <CheckCircle2 className="h-3 w-3 text-slate-950" />}
                  </button>
                  <div className={`flex-1 ${checkedActions[i] ? 'opacity-50 line-through' : ''}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-slate-100">{act.action}</span>
                      <Badge variant={priorityBadgeVariant(act.priority)} className="text-xs py-0">{act.priority}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{act.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="rounded-lg border border-white/10 bg-white/[0.035] text-slate-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/[0.05]">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-amber-200/70">Risk intelligence</p>
                <h3 className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
                  <AlertTriangle className="h-4 w-4 text-amber-200" />
                  Alerts
                </h3>
              </div>
              <Badge variant="outline" className="border-white/10 bg-black/25 text-xs text-slate-400">{alerts?.length ?? 0} signals</Badge>
            </div>
            <div className="space-y-2">
              {Array.isArray(alerts) && alerts.map((alert, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${alertBadgeClass(alert.level)}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alertDotClass(alert.level)}`} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold">{alert.level}</span>
                      <span className="text-sm font-medium">{alert.label}</span>
                    </div>
                    <p className="text-xs mt-0.5 opacity-80">{alert.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
