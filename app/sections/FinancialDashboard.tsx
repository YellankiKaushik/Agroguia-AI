'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { IndianRupee, TrendingDown, TrendingUp } from 'lucide-react'

interface FinancialDashboardProps {
  expected_income: number
  input_cost: number
  waste_income: number
  net_profit: number
}

function formatRupees(n: number): string {
  return n.toLocaleString('en-IN')
}

export default function FinancialDashboard({ expected_income, input_cost, waste_income, net_profit }: FinancialDashboardProps) {
  const rows = [
    { label: 'Expected Income', value: expected_income, icon: <TrendingUp className="h-3.5 w-3.5 text-emerald-200" />, positive: true },
    { label: 'Input Cost', value: input_cost, icon: <TrendingDown className="h-3.5 w-3.5 text-red-200" />, positive: false },
    { label: 'Waste Income', value: waste_income, icon: <TrendingUp className="h-3.5 w-3.5 text-teal-200" />, positive: true },
  ]

  return (
    <Card className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] text-slate-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/[0.05]">
      <CardContent className="p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-emerald-200/70">Financial decision support</p>
            <h3 className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
              <IndianRupee className="h-4 w-4 text-emerald-200" />
              Farm economics
            </h3>
          </div>
          <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-right">
            <p className="text-[11px] text-emerald-100/80">Net profit</p>
            <p className="text-lg font-semibold text-emerald-100">Rs.{formatRupees(net_profit)}</p>
          </div>
        </div>
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-white/5 bg-black/20 px-3 py-2">
              <div className="flex items-center gap-2">
                {row.icon}
                <span className="text-sm text-slate-400">{row.label}</span>
              </div>
              <span className={`text-sm font-semibold ${row.positive ? 'text-emerald-200' : 'text-red-200'}`}>
                {row.positive ? '' : '- '}Rs.{formatRupees(row.value)}
              </span>
            </div>
          ))}
          {/* Net profit line */}
          <div className="mt-3 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.055] p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-emerald-100">Decision margin</span>
              <span className="text-sm font-semibold text-white">Rs.{formatRupees(net_profit)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Income, input cost, and waste value combined into one operating estimate.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
