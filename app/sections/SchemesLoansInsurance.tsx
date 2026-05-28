'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FiFileText, FiShield, FiDollarSign } from 'react-icons/fi'

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
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardContent className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Schemes */}
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
              <FiFileText className="h-3.5 w-3.5 text-blue-600" />
              SCHEMES
            </h4>
            {Array.isArray(schemes?.enrolled) && schemes.enrolled.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs mb-1 p-1.5 rounded bg-green-50 border border-green-100">
                <span>{s.name}</span>
                <Badge variant="outline" className="text-xs py-0 bg-green-100 text-green-800 border-green-200">{s.status}</Badge>
              </div>
            ))}
            <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-xs font-medium text-amber-800">
                {Array.isArray(schemes?.missing) ? schemes.missing.length : 0} schemes not enrolled
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Missing: {schemes?.total_missing_benefit ?? ''}
              </p>
              {Array.isArray(schemes?.missing) && schemes.missing.slice(0, 2).map((s, i) => (
                <div key={i} className="text-xs mt-1 text-amber-600">
                  - {s.name}: {s.benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Loans */}
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
              <FiDollarSign className="h-3.5 w-3.5 text-green-600" />
              LOANS
            </h4>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                <p className="text-xs font-medium text-red-800">Current: {loan?.current?.lender ?? '--'}</p>
                <p className="text-xs text-red-600">{loan?.current?.amount ?? ''} @ {loan?.current?.rate ?? ''}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 border border-green-100">
                <p className="text-xs font-medium text-green-800">Better: {loan?.better?.lender ?? '--'}</p>
                <p className="text-xs text-green-600">{loan?.better?.amount ?? ''} @ {loan?.better?.rate ?? ''}</p>
              </div>
              <p className="text-xs font-semibold text-primary">Saving: {loan?.saving ?? '--'}</p>
            </div>
          </div>

          {/* Insurance */}
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
              <FiShield className="h-3.5 w-3.5 text-purple-600" />
              INSURANCE
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Policy</span>
                <span className="font-medium">{insurance?.policy ?? '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Damage</span>
                <span className="font-medium">{insurance?.damage_percent ?? '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insured Sum</span>
                <span className="font-medium">{insurance?.insured_sum ?? '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payout</span>
                <span className="font-bold text-primary">{insurance?.expected_payout ?? '--'}</span>
              </div>
              {insurance?.missing_document && (
                <div className="mt-1 p-1.5 rounded bg-amber-50 border border-amber-100">
                  <p className="text-xs text-amber-700">Missing: {insurance.missing_document}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
