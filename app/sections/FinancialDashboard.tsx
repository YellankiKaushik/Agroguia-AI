'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

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
    { label: 'Expected Income', value: expected_income, icon: <FiTrendingUp className="h-3.5 w-3.5 text-green-600" />, positive: true },
    { label: 'Input Cost', value: input_cost, icon: <FiTrendingDown className="h-3.5 w-3.5 text-red-500" />, positive: false },
    { label: 'Waste Income', value: waste_income, icon: <FiTrendingUp className="h-3.5 w-3.5 text-green-600" />, positive: true },
  ]

  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardContent className="py-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <FiDollarSign className="h-4 w-4 text-primary" />
          FINANCIAL DASHBOARD
        </h3>
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-2">
                {row.icon}
                <span className="text-sm text-muted-foreground">{row.label}</span>
              </div>
              <span className={`text-sm font-medium ${row.positive ? 'text-green-700' : 'text-red-600'}`}>
                {row.positive ? '' : '- '}Rs.{formatRupees(row.value)}
              </span>
            </div>
          ))}
          {/* Net profit line */}
          <div className="flex items-center justify-between pt-2 mt-1 border-t-2 border-primary/30">
            <span className="text-sm font-bold text-foreground">NET PROFIT</span>
            <span className="text-lg font-bold text-primary">Rs.{formatRupees(net_profit)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
