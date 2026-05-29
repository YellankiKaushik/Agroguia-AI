'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Sun } from 'lucide-react'

interface Stage {
  label: string
  date: string
  completed: boolean
  current?: boolean
}

interface CropTimelineProps {
  stages: Stage[]
  cropName: string
}

export default function CropTimeline({ stages, cropName }: CropTimelineProps) {
  if (!Array.isArray(stages) || stages.length === 0) return null

  return (
    <Card className="rounded-lg border border-white/10 bg-white/[0.035] text-slate-100 backdrop-blur-xl transition-all duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-emerald-200/70">Crop cycle intelligence</p>
            <h3 className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
              <Sun className="h-4 w-4 text-emerald-200" />
              {cropName} timeline
            </h3>
          </div>
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-slate-400">{stages.length} stages</span>
        </div>
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute left-0 right-0 top-3 h-1 rounded-full bg-white/10" />
          {/* Completed progress */}
          {(() => {
            const currentIdx = stages.findIndex(s => s.current)
            const completedPct = currentIdx >= 0 ? ((currentIdx + 0.5) / (stages.length - 1)) * 100 : 0
            return (
              <div
                className="absolute left-0 top-3 h-1 rounded-full bg-emerald-200 transition-all duration-500"
                style={{ width: `${Math.min(completedPct, 100)}%` }}
              />
            )
          })()}
          {/* Stage dots */}
          <div className="relative flex justify-between">
            {stages.map((stage, i) => (
              <div key={i} className="flex flex-col items-center" style={{ width: `${100 / stages.length}%` }}>
                <div
                  className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    stage.current
                      ? 'w-7 h-7 bg-emerald-200 border-emerald-200 shadow-md shadow-emerald-950/40'
                      : stage.completed
                        ? 'w-4 h-4 bg-emerald-200 border-emerald-200'
                        : 'w-4 h-4 bg-black/25 border-white/15'
                  }`}
                >
                  {stage.current && (
                    <div className="h-2 w-2 rounded-full bg-slate-950" />
                  )}
                </div>
                <span className={`mt-2 text-center text-xs leading-tight ${stage.current ? 'font-bold text-emerald-200' : stage.completed ? 'font-medium text-slate-200' : 'text-slate-500'}`}>
                  {stage.label}
                </span>
                <span className={`text-xs ${stage.current ? 'font-medium text-emerald-200' : 'text-slate-500'}`}>
                  {stage.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
