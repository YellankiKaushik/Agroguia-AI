'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FiSun } from 'react-icons/fi'

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
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardContent className="py-4">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <FiSun className="h-4 w-4 text-primary" />
          CROP TIMELINE - {cropName}
        </h3>
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute top-3 left-0 right-0 h-1 bg-border rounded-full" />
          {/* Completed progress */}
          {(() => {
            const currentIdx = stages.findIndex(s => s.current)
            const completedPct = currentIdx >= 0 ? ((currentIdx + 0.5) / (stages.length - 1)) * 100 : 0
            return (
              <div
                className="absolute top-3 left-0 h-1 bg-primary rounded-full transition-all duration-500"
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
                      ? 'w-7 h-7 bg-primary border-primary shadow-md shadow-primary/30'
                      : stage.completed
                        ? 'w-4 h-4 bg-primary border-primary'
                        : 'w-4 h-4 bg-card border-border'
                  }`}
                >
                  {stage.current && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className={`text-xs mt-2 text-center leading-tight ${stage.current ? 'font-bold text-primary' : stage.completed ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {stage.label}
                </span>
                <span className={`text-xs ${stage.current ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
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
