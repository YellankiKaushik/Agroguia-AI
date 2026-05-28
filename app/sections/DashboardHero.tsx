'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FiMapPin, FiDroplet, FiWind, FiThermometer, FiCheckCircle, FiAlertTriangle, FiCloud } from 'react-icons/fi'
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
  if (l === 'HIGH') return 'bg-red-100 text-red-800 border-red-200'
  if (l === 'MED') return 'bg-amber-100 text-amber-800 border-amber-200'
  return 'bg-green-100 text-green-800 border-green-200'
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
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">{farmer.name}</h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <FiMapPin className="h-3.5 w-3.5" />
                <span>{farmer.district}{farmer.state ? `, ${farmer.state}` : ''}</span>
                <span className="mx-1">|</span>
                <span>{farmer.land_size_acres} Acres</span>
                <span className="mx-1">|</span>
                <span>{farmer.current_crop} {farmer.crop_stage}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 text-xs bg-card px-2 py-1 rounded-md border border-border">
                <FiThermometer className="h-3 w-3 text-orange-500" />
                <span>{weather.temperature}</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-card px-2 py-1 rounded-md border border-border">
                <FiDroplet className="h-3 w-3 text-blue-500" />
                <span>{weather.humidity}</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-card px-2 py-1 rounded-md border border-border">
                <FiWind className="h-3 w-3 text-teal-500" />
                <span>{weather.wind_speed}</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-card px-2 py-1 rounded-md border border-border">
                <FiCloud className="h-3 w-3 text-blue-400" />
                <span>{weather.rainfall_forecast}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions + Alerts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Actions */}
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardContent className="py-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <FiCheckCircle className="h-4 w-4 text-primary" />
              TODAY&apos;S ACTIONS
            </h3>
            <div className="space-y-2">
              {Array.isArray(actions) && actions.map((act, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <button
                    onClick={() => toggleAction(i)}
                    className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${checkedActions[i] ? 'bg-primary border-primary' : 'border-border hover:border-primary/50'}`}
                  >
                    {checkedActions[i] && <FiCheckCircle className="h-3 w-3 text-primary-foreground" />}
                  </button>
                  <div className={`flex-1 ${checkedActions[i] ? 'opacity-50 line-through' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{act.action}</span>
                      <Badge variant={priorityBadgeVariant(act.priority)} className="text-xs py-0">{act.priority}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{act.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="bg-card/80 backdrop-blur-lg border-border">
          <CardContent className="py-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <FiAlertTriangle className="h-4 w-4 text-amber-500" />
              ALERTS
            </h3>
            <div className="space-y-2">
              {Array.isArray(alerts) && alerts.map((alert, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${alertBadgeClass(alert.level)}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alertDotClass(alert.level)}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
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
