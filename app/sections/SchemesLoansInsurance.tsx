'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, IndianRupee, ShieldCheck } from 'lucide-react'

interface Scheme {
  name: string
  benefit: string
  status: string
}

interface SchemesLoansInsuranceProps {
  schemes: {
    missing: Scheme[]
    total_missing_benefit: string
    enrolled: Scheme[]
  }
  insurance: {
    policy: string
    damage_type: string
    affected_area: string
    damage_percent: string
    insured_sum: string
    expected_payout: string
    missing_document: string
  }
  loan: {
    current: { lender: string; amount: string; rate: string }
    better: { lender: string; amount: string; rate: string }
    saving: string
  }
}

export default function SchemesLoansInsurance({ schemes, insurance, loan }: SchemesLoansInsuranceProps) {
  return (
    <Card className="rounded-lg border border-white/10 bg-white/[0.035] text-slate-100 backdrop-blur-xl transition-all duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]">
      <CardContent className="p-5">
        <div className="mb-5">
          <p className="text-xs uppercase text-emerald-200/70">Opportunity and protection intelligence</p>
          <h3 className="mt-1 text-sm font-semibold text-white">Schemes, loans, and insurance readiness</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Schemes */}
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <FileText className="h-4 w-4 text-teal-200" />
              Scheme discovery
            </h4>
            {Array.isArray(schemes?.enrolled) && schemes.enrolled.map((s, i) => (
              <div key={i} className="mb-2 flex items-center justify-between rounded-md border border-emerald-400/20 bg-emerald-950/20 p-2 text-xs">
                <span className="text-slate-200">{s.name}</span>
                <Badge variant="outline" className="border-emerald-400/20 bg-emerald-300/10 py-0 text-xs text-emerald-100">{s.status}</Badge>
              </div>
            ))}
            <div className="mt-3 rounded-lg border border-amber-400/20 bg-amber-950/20 p-3">
              <p className="text-xs font-semibold text-amber-200">
                {Array.isArray(schemes?.missing) ? schemes.missing.length : 0} schemes not enrolled
              </p>
              <p className="mt-1 text-xs text-amber-100/80">
                Missing: {schemes?.total_missing_benefit ?? ''}
              </p>
              {Array.isArray(schemes?.missing) && schemes.missing.slice(0, 2).map((s, i) => (
                <div key={i} className="mt-1 text-xs text-amber-200/80">
                  - {s.name}: {s.benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Loans */}
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <IndianRupee className="h-4 w-4 text-emerald-200" />
              Loan optimization
            </h4>
            <div className="space-y-2">
              <div className="rounded-lg border border-red-400/20 bg-red-950/20 p-3">
                <p className="text-xs font-semibold text-red-200">Current: {loan?.current?.lender ?? '--'}</p>
                <p className="mt-1 text-xs text-red-100/80">{loan?.current?.amount ?? ''} @ {loan?.current?.rate ?? ''}</p>
              </div>
              <div className="rounded-lg border border-emerald-400/20 bg-emerald-950/20 p-3">
                <p className="text-xs font-semibold text-emerald-200">Better: {loan?.better?.lender ?? '--'}</p>
                <p className="mt-1 text-xs text-emerald-100/80">{loan?.better?.amount ?? ''} @ {loan?.better?.rate ?? ''}</p>
              </div>
              <p className="rounded-md border border-emerald-300/15 bg-emerald-300/[0.055] p-2 text-xs font-semibold text-emerald-100">Saving: {loan?.saving ?? '--'}</p>
            </div>
          </div>

          {/* Insurance */}
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-200" />
              Insurance readiness
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Policy</span>
                <span className="font-medium text-slate-200">{insurance?.policy ?? '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Damage</span>
                <span className="font-medium text-slate-200">{insurance?.damage_percent ?? '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Insured Sum</span>
                <span className="font-medium text-slate-200">{insurance?.insured_sum ?? '--'}</span>
              </div>
              <div className="flex justify-between rounded-md border border-emerald-300/15 bg-emerald-300/[0.055] p-2">
                <span className="text-emerald-100/80">Payout</span>
                <span className="font-bold text-emerald-100">{insurance?.expected_payout ?? '--'}</span>
              </div>
              {insurance?.missing_document && (
                <div className="mt-2 rounded border border-amber-400/20 bg-amber-950/20 p-2">
                  <p className="text-xs text-amber-200">Missing: {insurance.missing_document}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
