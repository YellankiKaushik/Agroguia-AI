'use client'

import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, ChevronDown, Clock, Edit3, FileText, Home, Menu, RefreshCw, Settings, Sparkles, User, X } from 'lucide-react'
import type { FarmerProfileData } from './sections/ProfileWizard'
import LandingPage from './sections/LandingPage'
import { LanguageProvider, useLanguage } from './sections/LanguageContext'
import LanguageSelector from './sections/LanguageSelector'

const ProfileWizard = dynamic(() => import('./sections/ProfileWizard'), { ssr: false })
const DashboardTabs = dynamic(() => import('./sections/DashboardTabs'), { ssr: false })
const DashboardHero = dynamic(() => import('./sections/DashboardHero'), { ssr: false })
const CropTimeline = dynamic(() => import('./sections/CropTimeline'), { ssr: false })
const FinancialDashboard = dynamic(() => import('./sections/FinancialDashboard'), { ssr: false })
const SchemesLoansInsurance = dynamic(() => import('./sections/SchemesLoansInsurance'), { ssr: false })
const VoiceUpdate = dynamic(() => import('./sections/VoiceUpdate'), { ssr: false })
const AdvisoryHistoryView = dynamic(
  () => import('./sections/ManagementViews').then((mod) => mod.AdvisoryHistoryView),
  { ssr: false }
)
const ScheduleManagement = dynamic(
  () => import('./sections/ManagementViews').then((mod) => mod.ScheduleManagement),
  { ssr: false }
)
const SettingsKB = dynamic(
  () => import('./sections/ManagementViews').then((mod) => mod.SettingsKB),
  { ssr: false }
)

const MANAGER_AGENT_ID = '69ec55d4a57e78ed3c81ed7c'

const THEME_VARS = {
  '--background': '120 15% 98%',
  '--foreground': '150 30% 10%',
  '--primary': '142 76% 26%',
  '--primary-foreground': '120 15% 98%',
  '--secondary': '120 15% 92%',
  '--accent': '160 60% 30%',
  '--card': '120 15% 96%',
  '--card-foreground': '150 30% 10%',
  '--border': '120 15% 88%',
  '--muted': '120 15% 92%',
  '--muted-foreground': '150 10% 40%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '120 15% 98%',
  '--ring': '142 76% 26%',
  '--radius': '0.875rem',
  '--popover': '120 15% 96%',
  '--popover-foreground': '150 30% 10%',
  '--input': '120 15% 88%',
} as React.CSSProperties

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
          <div className="max-w-md rounded-[2rem] border border-red-400/20 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-red-400/25 bg-red-500/10 text-red-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-xs uppercase text-red-200/80">System recovery</p>
            <h2 className="mt-2 text-xl font-semibold text-white">The intelligence workspace paused unexpectedly.</h2>
          <p className="mb-4 mt-2 text-sm leading-6 text-slate-400">Your farm data is safe. Retry the interface, and AGROGUIA.AI will restore the workspace state.</p>
          <details className="mb-5 rounded-lg border border-white/10 bg-black/25 p-3 text-left text-xs text-slate-500">
            <summary className="cursor-pointer text-slate-300">Technical detail</summary>
            <p className="mt-2 break-words">{this.state.error}</p>
          </details>
          <button onClick={() => this.setState({ hasError: false, error: '' })} className="rounded-md bg-emerald-200 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-emerald-100">Restore workspace</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const MOCK_FARMER = { name: 'Raju Patil', village: 'Muddebihal', district: 'Bijapur', state: 'Karnataka', land_size_acres: 4, soil_type: 'Black Cotton Soil', current_crop: 'Soybean', crop_stage: 'Flowering (Day 45)', sowing_date: '2026-03-10', irrigation_type: 'Rainfed' }
const MOCK_WEATHER = { humidity: '84%', rainfall_forecast: '18mm in 48hrs', temperature: '29C', wind_speed: '12 kmph', season: 'Kharif 2026' }
const MOCK_ALERTS = [
  { level: 'HIGH', label: 'Fungal Risk', detail: 'Yellow Mosaic Virus - Action in 48hrs', color: 'red' },
  { level: 'MED', label: 'Rain in 48hrs', detail: '18mm rainfall expected', color: 'yellow' },
  { level: 'LOW', label: 'Market Up', detail: 'Soybean prices rising', color: 'green' },
]
const MOCK_ACTIONS = [
  { action: 'Spray Mancozeb tomorrow', done: false, priority: 'High', detail: '600 gram per acre' },
  { action: 'No water today', done: false, priority: 'Low', detail: 'Rainfed - rain expected' },
  { action: 'Check soil moisture', done: false, priority: 'Medium', detail: 'Before next irrigation cycle' },
]
const MOCK_TIMELINE = { stages: [
  { label: 'Sown', date: 'Mar 10', completed: true },
  { label: 'Vegetative', date: 'Apr 1', completed: true },
  { label: 'Flowering', date: 'Apr 24', completed: true, current: true },
  { label: 'Harvest', date: 'Jun 5', completed: false },
]}
const MOCK_FINANCIAL = { expected_income: 48000, input_cost: 12000, waste_income: 4000, net_profit: 40000 }
const MOCK_SCHEMES = { missing: [{ name: 'PM-KISAN', benefit: 'Rs.6,000/year', status: 'Not enrolled' }, { name: 'Karnataka Raitha Siri', benefit: 'Rs.5,000', status: 'Not enrolled' }, { name: 'Soil Health Card', benefit: 'Free soil test', status: 'Not done' }], total_missing_benefit: 'Rs.11,000/year', enrolled: [{ name: 'PMFBY', status: 'Active', benefit: 'Crop insurance' }] }
const MOCK_INSURANCE = { policy: 'PMFBY Soybean 2026', damage_type: 'Fungal disease', affected_area: '2.5 acres of 4', damage_percent: '60%', insured_sum: 'Rs.40,000', expected_payout: 'Rs.24,000', missing_document: 'Crop loss photograph' }
const MOCK_LOAN = { current: { lender: 'Local NBFC', amount: 'Rs.1L', rate: '18%' }, better: { lender: 'KCC', amount: 'Rs.1.5L', rate: '4% post subsidy' }, saving: 'Rs.49,000 over 5 years' }
const MOCK_VOICE = { kannada: 'Raju, nale beLige fungal roga barthide. NaaLe beLige 6 ganTege Mancozeb spray maadi. 600 gram per acre upayogisi.', english: 'Raju, fungal disease risk is coming tomorrow. Spray Mancozeb at 6 AM tomorrow. Use 600 grams per acre.' }

const SAMPLE_ADVISORY = {
  farmer_summary: { name: 'Raju Patil', location: 'Bijapur, Karnataka', crop: 'Soybean', crop_stage: 'Flowering', land_size: '4 acres', overall_risk: 'Medium' },
  weather_advisory: JSON.stringify({ todays_actions: [{ action: 'Spray Mancozeb before evening', priority: 'High', reason: 'Fungal risk due to humidity' }], seven_day_calendar: [{ day: 'Fri', date: '25 Apr', action: 'Spray', weather_summary: 'Humid 84%' }, { day: 'Sat', date: '26 Apr', action: 'Monitor', weather_summary: 'Rain 18mm' }], risk_level: 'Medium', fungal_risk_flag: true, fungal_risk_details: 'Yellow Mosaic Virus risk due to humidity > 80%', summary: 'Moderate weather risk. Rain expected in 48 hours.' }),
  pest_advisory: JSON.stringify({ threats: [{ threat_name: 'Yellow Mosaic Virus', type: 'Viral', risk_level: 'High', visual_symptoms: 'Yellow patches on leaves', action_window_hours: 48, immediate_action: 'Spray Mancozeb 600g/acre', affected_crop_parts: 'Leaves' }], primary_disease_name: 'Yellow Mosaic Virus', overall_risk: 'High', summary: 'High fungal pressure due to humidity.' }),
  protection_plan: JSON.stringify({ spray_plan: { chemicals: [{ name: 'Mancozeb', quantity_per_acre: '600g', mixing_ratio: '2.5g/L', method: 'Foliar spray', timing: 'Early morning' }], weather_restrictions: 'Do not spray if rain within 4 hours' }, fertilizer_plan: { fertilizers: [{ name: 'DAP', quantity_per_acre: '25kg', method: 'Soil application', stage: 'Flowering', budget_alternative: 'SSP 50kg' }], cumulative_vs_recommended: '55% applied' }, cost_summary: { spray_cost: '800', fertilizer_cost: '1,500', total_cost: '2,300', remaining_budget: '9,700' }, summary: 'Protection plan within budget.' }),
  crop_strategy: JSON.stringify({ crop_recommendations: [{ rank: 1, crop_name: 'Soybean', net_profit_per_acre: '12,000', soil_compatibility: 'Excellent', water_requirement: 'Low', risk_level: 'Medium', seed_variety: 'JS-335', purchase_source: 'IISR Indore' }], intercropping_suggestion: 'Consider intercropping with pigeon pea.', summary: 'Soybean is optimal for black cotton soil.' }),
  market_intelligence: JSON.stringify({ market_intelligence: { mandi_comparison: [{ mandi_name: 'Bijapur', distance_km: 5, price_per_quintal: '4,200', transport_cost: '50', net_price: '4,150' }, { mandi_name: 'Hubli', distance_km: 120, price_per_quintal: '4,500', transport_cost: '350', net_price: '4,150' }], best_market: 'Bijapur Mandi', sell_or_wait: 'Wait 2 weeks', sell_wait_analysis: 'Prices expected to rise post-rain.', msp_status: 'MSP Rs.4,600', storage_advisory: 'Store in dry place up to 2 weeks.' }, summary: 'Wait for better price post monsoon.' }),
  government_schemes: JSON.stringify({ enrolled_schemes: [{ name: 'PMFBY', benefit_amount: 'Crop insurance', status: 'Active' }], missing_schemes: [{ name: 'PM-KISAN', priority_rank: 1, annual_benefit: '6,000', eligibility_match: '95%', documents_required: ['Aadhaar', 'Land Record'], application_steps: ['Visit bank', 'Fill form'], deadline: '30 Jun 2026', portal_or_office: 'pmkisan.gov.in' }, { name: 'Karnataka Raitha Siri', priority_rank: 2, annual_benefit: '5,000', eligibility_match: '90%', documents_required: ['Aadhaar', 'RTC'], application_steps: ['Visit Taluk office'], deadline: '31 Dec 2026', portal_or_office: 'raitamitra.kar.nic.in' }], deadline_alerts: [{ scheme_name: 'PM-KISAN', deadline: '30 Jun 2026', days_remaining: 66 }], total_potential_benefits: '11,000', summary: 'Enroll in PM-KISAN and Raitha Siri.' }),
  insurance_status: JSON.stringify({ eligibility_verdict: 'Eligible', document_checklist: [{ document: 'Aadhaar Card', status: 'Ready', notes: '' }, { document: 'Crop photo', status: 'Pending', notes: 'Take photo of affected area' }], expected_payout: '24,000', filing_steps: ['Report damage within 72h', 'Call 1800-XXX', 'Submit photos'], summary: 'Eligible for PMFBY claim of Rs.24,000.' }),
  loan_advisory: JSON.stringify({ loan_options: [{ lender: 'SBI', loan_type: 'KCC', interest_rate: '4%', eligible_amount: '1,50,000', tenure: '5 years', emi: '2,800', total_cost: '1,68,000', is_predatory: false }, { lender: 'Local NBFC', loan_type: 'Personal', interest_rate: '18%', eligible_amount: '1,00,000', tenure: '1 year', emi: '9,200', total_cost: '1,10,400', is_predatory: true, predatory_flag: 'Very high rate' }], best_recommendation: 'SBI KCC', recommendation_reason: 'Lowest interest with govt subsidy.', documents_required: ['Aadhaar', 'Land Record', 'Income Proof'], summary: 'SBI KCC at 4% is best. Avoid local NBFC.' }),
  fraud_awareness: JSON.stringify({ digital_risk_score: 35, risk_level: 'Low', risk_factors: ['Uses public WiFi', 'Shares phone'], awareness_story: 'Ramu from Bijapur got a fake PM-KISAN call asking for OTP. He refused and reported.', five_golden_rules: ['Never share OTP', 'Never click unknown links', 'Verify caller', 'Use screen lock', 'Check bank statements'], fraud_simulation: { scenario: 'SMS from PM-KISAN', fake_message: 'Your payment blocked. Share OTP to release.', correct_response: 'Ignore and call 1930.', why_its_fraud: 'Govt never asks OTP.' }, trending_frauds: ['Fake PM-KISAN apps', 'WhatsApp loan scams'], summary: 'Low risk. Follow 5 golden rules.' }),
  waste_value: JSON.stringify({ waste_inventory: [{ waste_type: 'Soybean stalks', quantity_tonnes: 2, value_per_tonne: '2,000', total_value: '4,000' }], nearby_buyers: [{ buyer_name: 'Bijapur Biogas Plant', buyer_type: 'Biogas', distance_km: 11, price_per_tonne: '2,500', min_quantity: '1 tonne', contact: '9876543210', transaction_process: 'Call, schedule pickup' }], total_waste_income: '4,000', composting_guide: { steps: ['Collect stalks', 'Shred', 'Mix with cow dung', 'Water every 3 days'], timeline: '45 days', soil_benefits: 'Improves water retention' }, summary: 'Soybean stalks can earn Rs.4,000.' }),
  total_income_projection: { harvest_income: '48,000', waste_income: '4,000', scheme_benefits: '11,000', total_annual: '63,000' },
  voice_summaries: { weather: 'Spray Mancozeb before rain.', pest: 'Yellow Mosaic Virus risk high.', protection: 'Apply spray plan today.', market: 'Wait 2 weeks for better price.', schemes: 'Enroll in PM-KISAN.', insurance: 'PMFBY claim eligible Rs.24,000.', loans: 'KCC at 4% is best.', fraud: 'Never share OTP.', waste: 'Soybean stalks worth Rs.4,000.' },
}

type AuthUser = {
  id: string
  name: string
  email: string
  username?: string
}

function AuthScreen({ onAuthSuccess, onBackToLanding }: { onAuthSuccess: (user: AuthUser) => void; onBackToLanding?: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')
  const { t } = useLanguage()
  const isRegister = mode === 'register'
  const authInputClass =
    'h-11 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-emerald-300/40 focus:bg-white/[0.035] focus:ring-2 focus:ring-emerald-300/20'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setSubmitting(true)

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload =
        mode === 'login'
          ? {
              password,
              ...(emailOrUsername.includes('@') ? { email: emailOrUsername } : { username: emailOrUsername }),
            }
          : { name, email, username, password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok || !data?.success) {
        setAuthError(data?.error || 'Authentication failed')
        setSubmitting(false)
        return
      }

      onAuthSuccess(data.user)
    } catch (err: any) {
      setAuthError(err?.message || 'Unable to reach the authentication service. Please check your connection and try again.')
    }

    setSubmitting(false)
  }

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-[#07100d] px-4 py-8 text-slate-100 selection:bg-emerald-300 selection:text-slate-950 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(45,212,191,0.20),transparent_42%),linear-gradient(180deg,rgba(7,16,13,0)_0%,#07100d_92%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col">
        <header className="flex items-center justify-between gap-4 py-2">
          <button type="button" onClick={onBackToLanding} className="group flex items-center gap-3 text-left" aria-label="Back to AGROGUIA.AI home">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-300/25 bg-emerald-300/10 text-sm font-bold text-emerald-100 shadow-lg shadow-emerald-950/30 transition-all duration-300 group-hover:border-emerald-200/40 group-hover:bg-emerald-300/15">
              AG
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">AGROGUIA.AI</span>
              <span className="hidden text-[11px] uppercase text-slate-500 sm:block">Farm intelligence layer</span>
            </span>
          </button>
          <div className="rounded-md border border-white/10 bg-white/[0.035] p-1 backdrop-blur-xl">
            <LanguageSelector size="sm" />
          </div>
        </header>

        <main className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <section className="order-2 lg:order-1">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
                Secure access to your farm intelligence system
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {isRegister ? 'Create your AI farm command account.' : 'Continue into your AI farm command center.'}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                {isRegister
                  ? 'Build a secure farmer identity before generating personalized advisory, weather, risk, finance, scheme, and voice intelligence.'
                  : 'Sign in to access your profile, advisory history, dashboard intelligence, and operational farm decision packets.'}
              </p>
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ['Structured AI', 'JSON advisory modules'],
                ['User scoped', 'Protected profile history'],
                ['Voice ready', 'Field-first summaries'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-md border border-white/10 bg-white/[0.025] px-4 py-3">
                  <span className="text-xs font-semibold text-slate-200">{title}</span>
                  <span className="mt-1 block text-[11px] leading-5 text-slate-500">{copy}</span>
                </div>
              ))}
            </div>
          </section>

          <Card className="order-1 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-950/90 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl lg:order-2">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </div>
              <div className="hidden rounded-md border border-white/10 bg-black/30 px-3 py-1 font-mono text-[11px] text-slate-500 sm:block">
                agroguia.ai/auth
              </div>
              <div className="h-2 w-16 rounded-full bg-white/10" />
            </div>
            <CardHeader className="space-y-4 p-6 pb-4 text-left sm:p-8 sm:pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase text-emerald-200/70">{isRegister ? 'Create profile access' : 'Authenticated intelligence'}</p>
                  <CardTitle className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    {isRegister ? 'Start your AGROGUIA account' : 'Welcome back to AGROGUIA.AI'}
                  </CardTitle>
                </div>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-medium text-emerald-100">
                  Secure
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-400">
                {isRegister ? t('app_tagline') : 'Open your dashboard and continue generating structured farm intelligence.'}
              </p>
            </CardHeader>
            <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <>
                    <label className="block space-y-2">
                      <span className="text-xs font-medium text-slate-300">Full name</span>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Raju Patil" className={authInputClass} />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-xs font-medium text-slate-300">Email address</span>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="farmer@example.com" className={authInputClass} />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-xs font-medium text-slate-300">Username <span className="text-slate-500">(optional)</span></span>
                      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="raju_soybean" className={authInputClass} />
                    </label>
                  </>
                )}
                {!isRegister && (
                  <label className="block space-y-2">
                    <span className="text-xs font-medium text-slate-300">Email or username</span>
                    <input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} placeholder="farmer@example.com" className={authInputClass} />
                  </label>
                )}
                <label className="block space-y-2">
                  <span className="text-xs font-medium text-slate-300">Password</span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={authInputClass} />
                </label>
                {authError && (
                  <div role="alert" className="rounded-lg border border-red-400/20 bg-red-950/20 px-3 py-3 text-xs leading-5 text-red-100">
                    <p className="font-semibold">Access check failed</p>
                    <p className="mt-1 text-red-200/80">{authError}</p>
                  </div>
                )}
                <Button type="submit" className="h-12 w-full rounded-md bg-emerald-200 font-semibold text-slate-950 transition-all duration-300 hover:bg-emerald-100" disabled={submitting}>
                  {submitting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  {submitting ? 'Securing workspace...' : isRegister ? 'Create intelligence account' : 'Enter dashboard'}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode(isRegister ? 'login' : 'register')}
                  className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  {isRegister ? 'Already have an account? Sign in' : 'New to AGROGUIA.AI? Create an account'}
                </button>
                {onBackToLanding && (
                  <button type="button" onClick={onBackToLanding} className="w-full text-xs text-slate-500 transition-colors hover:text-white">
                    Back to landing page
                  </button>
                )}
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

type ViewType = 'dashboard' | 'profile' | 'history' | 'schedules' | 'settings'

const NAV_ITEMS: { id: ViewType; labelKey: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', labelKey: 'nav_dashboard', icon: <Home className="h-4 w-4" /> },
  { id: 'profile', labelKey: 'nav_profile', icon: <User className="h-4 w-4" /> },
  { id: 'history', labelKey: 'nav_history', icon: <FileText className="h-4 w-4" /> },
  { id: 'schedules', labelKey: 'nav_schedules', icon: <Clock className="h-4 w-4" /> },
  { id: 'settings', labelKey: 'nav_settings', icon: <Settings className="h-4 w-4" /> },
]

function AppShell({ currentUser, onLogout }: { currentUser: AuthUser; onLogout: () => Promise<void> }) {
  const { t } = useLanguage()
  const [view, setView] = useState<ViewType>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [advisory, setAdvisory] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [showSample, setShowSample] = useState(false)
  const [showDetailedTabs, setShowDetailedTabs] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)

  const loadProfile = useCallback(async () => {
    setProfileLoading(true)
    try {
      const res = await fetch('/api/farmer-profiles')
      const data = await res.json()
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setProfile(data.data[0])
      }
    } catch { /* ignore */ }
    setProfileLoading(false)
  }, [])

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch('/api/advisory-history')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) setHistory(data.data)
    } catch { /* ignore */ }
    setHistoryLoading(false)
  }, [])

  useEffect(() => { loadProfile() }, [loadProfile])

  const handleSaveProfile = async (formData: FarmerProfileData) => {
    setSavingProfile(true)
    setSaveError('')
    try {
      const method = profile ? 'PUT' : 'POST'
      const body = profile ? { ...formData, id: profile._id ?? profile.id } : formData
      const res = await fetch('/api/farmer-profiles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setProfile(data.data)
        setEditingProfile(false)
        setView('dashboard')
      } else {
        setSaveError(data.error || 'We could not save the farm profile yet. Please try again.')
      }
    } catch (e: any) {
      setSaveError(e?.message || 'Unable to reach the profile service. Please check your connection and try again.')
    }
    setSavingProfile(false)
  }

  const handleGenerate = async () => {
    if (!profile) return
    setGenerating(true)
    setGenError('')
    try {
      const profileMsg = `Generate comprehensive farm advisory for: Name: ${profile?.name ?? ''}, Location: ${profile?.location_district ?? ''} ${profile?.location_state ?? ''}, Land: ${profile?.land_size_acres ?? ''}acres, Soil: ${profile?.soil_type ?? ''}, Crop: ${profile?.current_crop ?? ''}, Stage: ${profile?.crop_stage ?? ''}, Sowing: ${profile?.sowing_date ?? ''}, Irrigation: ${profile?.irrigation_type ?? ''}, Bank: ${profile?.bank_account_status ?? ''}, Insurance: ${profile?.insurance_policy ?? ''}, Loan: ${profile?.loan_status ?? ''}, Budget: Rs.${profile?.budget_inputs ?? 0}, Language: ${profile?.preferred_language ?? 'English'}`
      const result = await callAIAgent(profileMsg, MANAGER_AGENT_ID)
      if (result.success) {
        const parsed = result?.response?.result ?? result?.response ?? null
        setAdvisory(parsed)
        setShowDetailedTabs(true)
        try {
          await fetch('/api/advisory-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: profile?.user_id ?? '',
              crop: profile?.current_crop ?? '',
              location: `${profile?.location_district ?? ''}, ${profile?.location_state ?? ''}`,
              weather_advisory: typeof parsed?.weather_advisory === 'string' ? parsed.weather_advisory : JSON.stringify(parsed?.weather_advisory ?? ''),
              pest_advisory: typeof parsed?.pest_advisory === 'string' ? parsed.pest_advisory : JSON.stringify(parsed?.pest_advisory ?? ''),
              protection_plan: typeof parsed?.protection_plan === 'string' ? parsed.protection_plan : JSON.stringify(parsed?.protection_plan ?? ''),
              market_intel: typeof parsed?.market_intelligence === 'string' ? parsed.market_intelligence : JSON.stringify(parsed?.market_intelligence ?? ''),
              schemes_eligible: typeof parsed?.government_schemes === 'string' ? parsed.government_schemes : JSON.stringify(parsed?.government_schemes ?? ''),
              insurance_status: typeof parsed?.insurance_status === 'string' ? parsed.insurance_status : JSON.stringify(parsed?.insurance_status ?? ''),
              loan_options: typeof parsed?.loan_advisory === 'string' ? parsed.loan_advisory : JSON.stringify(parsed?.loan_advisory ?? ''),
              waste_value: typeof parsed?.waste_value === 'string' ? parsed.waste_value : JSON.stringify(parsed?.waste_value ?? ''),
              total_income_projection: JSON.stringify(parsed?.total_income_projection ?? ''),
              farmer_summary: JSON.stringify(parsed?.farmer_summary ?? ''),
            }),
          })
        } catch { /* ignore history save errors */ }
      } else {
      setGenError(result?.error ?? 'The AI advisory engine could not complete this request.')
      }
    } catch (e: any) {
      setGenError(e?.message ?? 'Unable to reach the advisory engine. Please check your connection and try again.')
    }
    setGenerating(false)
  }

  const activeAdvisory = showSample ? SAMPLE_ADVISORY : advisory
  const activeVoice = activeAdvisory?.voice_summaries

  const farmerInfo = profile ? {
    name: profile?.name ?? MOCK_FARMER.name,
    village: profile?.location_village ?? MOCK_FARMER.village,
    district: profile?.location_district ?? MOCK_FARMER.district,
    state: profile?.location_state ?? MOCK_FARMER.state,
    land_size_acres: profile?.land_size_acres ?? MOCK_FARMER.land_size_acres,
    current_crop: profile?.current_crop ?? MOCK_FARMER.current_crop,
    crop_stage: profile?.crop_stage ?? MOCK_FARMER.crop_stage,
    sowing_date: profile?.sowing_date ?? MOCK_FARMER.sowing_date,
    irrigation_type: profile?.irrigation_type ?? MOCK_FARMER.irrigation_type,
    soil_type: profile?.soil_type ?? MOCK_FARMER.soil_type,
  } : MOCK_FARMER

  if (profileLoading) {
    return (
      <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07100d] text-slate-100">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(45,212,191,0.18),transparent_42%),linear-gradient(180deg,rgba(7,16,13,0)_0%,#07100d_92%)]" />
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10 shadow-lg shadow-emerald-950/30">
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-200" />
          </div>
          <p className="mt-5 text-xs uppercase text-emerald-200/70">Profile calibration</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Preparing your farm intelligence layer</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{t('loading_profile')}</p>
          <div className="mt-6 space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-2 animate-pulse rounded-full bg-white/[0.06]" />)}
          </div>
        </div>
      </div>
    )
  }

  if ((!profile && !profileLoading) || editingProfile) {
    return <ProfileWizard onSave={handleSaveProfile} saving={savingProfile} userName={profile?.name ?? ''} saveError={saveError} />
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#07100d] text-slate-100 selection:bg-emerald-300 selection:text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_35%_-10%,rgba(45,212,191,0.16),transparent_38%),linear-gradient(180deg,rgba(7,16,13,0)_0%,#07100d_92%)]" />
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950/90 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-300 md:sticky ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-300/25 bg-emerald-300/10 text-sm font-bold text-emerald-100 shadow-lg shadow-emerald-950/30">
                AG
              </span>
              <div>
                <h1 className="text-sm font-semibold text-white">{t('app_title')}</h1>
                <p className="hidden text-[11px] uppercase text-slate-500 sm:block">Farm intelligence OS</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="rounded-md text-slate-400 hover:bg-white/[0.06] hover:text-white md:hidden" onClick={() => setSidebarOpen(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="mt-4 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.055] p-3">
            <p className="text-xs font-semibold text-emerald-100">Intelligence engine</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">Profile, advisory, finance, risk, and planning modules connected.</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2 p-3" aria-label="Dashboard sections">
          {NAV_ITEMS.map(item => (
            <button key={item.id} type="button" onClick={() => { setView(item.id); setSidebarOpen(false); if (item.id === 'history') loadHistory() }} aria-current={view === item.id ? 'page' : undefined} className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all duration-300 ${view === item.id ? 'border-emerald-300/30 bg-emerald-300/10 text-white' : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white'}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-300 ${view === item.id ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-black/25 text-slate-500 group-hover:text-emerald-100'}`}>
                {item.icon}
              </span>
              <span>{t(item.labelKey)}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="flex flex-wrap gap-1.5">
            {['Weather', 'Pest', 'Protection', 'Market', 'Schemes', 'Insurance', 'Loan', 'Fraud', 'Waste', 'Voice'].map(name => (
              <Badge key={name} variant="outline" className="border-white/10 bg-white/[0.025] py-0 text-[10px] font-medium text-slate-400 hover:bg-white/[0.04]">{name}</Badge>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">Powered by AGROGUIA.AI Intelligence Engine</p>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07100d]/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="sm" className="rounded-md text-slate-400 hover:bg-white/[0.06] hover:text-white md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-4 w-4" /></Button>
            <div className="hidden h-9 w-px bg-white/10 md:block" />
            <div>
              <p className="text-[11px] uppercase text-emerald-200/70">Farm command profile</p>
              <h2 className="truncate text-sm font-semibold text-white">{farmerInfo.name}</h2>
              <p className="truncate text-xs text-slate-500">{farmerInfo.district}, {farmerInfo.state ?? ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden rounded-md border border-white/10 bg-white/[0.035] p-1 lg:block">
              <LanguageSelector size="sm" />
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 sm:flex">
              <Label className="text-xs text-slate-400">{t('sample_data')}</Label>
              <Switch checked={showSample} onCheckedChange={(v) => { setShowSample(v); if (v) setShowDetailedTabs(true) }} />
            </div>
            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-2 py-1.5">
              <span className="hidden max-w-32 truncate text-xs text-slate-400 sm:inline">{currentUser.name || currentUser.email}</span>
              <Button variant="outline" size="sm" onClick={onLogout} className="h-8 rounded-md border-white/15 bg-white/[0.03] text-xs text-slate-200 hover:bg-white/10 hover:text-white">Logout</Button>
            </div>
          </div>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6 lg:p-8">
            {view === 'dashboard' && (
              <>
                <section className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs uppercase text-emerald-200/70">Dashboard intelligence layer</p>
                      <h1 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">Farm decision command center</h1>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                        Review profile-aware recommendations, generate advisory packets, and operate crop, finance, risk, and planning modules from one console.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        ['Profile', profile ? 'Ready' : 'Missing'],
                        ['Advisory', activeAdvisory ? 'Loaded' : 'Pending'],
                        ['History', `${history.length}`],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
                          <p className="text-[11px] text-slate-500">{label}</p>
                          <p className="mt-1 font-semibold text-slate-200">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                <DashboardHero farmer={farmerInfo} weather={MOCK_WEATHER} alerts={MOCK_ALERTS} actions={MOCK_ACTIONS} />
                <CropTimeline stages={MOCK_TIMELINE.stages} cropName={farmerInfo.current_crop} />
                <FinancialDashboard {...MOCK_FINANCIAL} />
                <SchemesLoansInsurance schemes={MOCK_SCHEMES} insurance={MOCK_INSURANCE} loan={MOCK_LOAN} />
                <VoiceUpdate voiceSummary={MOCK_VOICE} />

                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] p-3">
                  <Button onClick={handleGenerate} disabled={generating} className="h-11 gap-2 rounded-md bg-emerald-200 font-semibold text-slate-950 transition-all duration-300 hover:bg-emerald-100">
                    <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                    {generating ? t('dash_generating') : t('dash_generate')}
                  </Button>
                  {activeAdvisory && !showDetailedTabs && (
                    <Button variant="outline" onClick={() => setShowDetailedTabs(true)} className="h-11 gap-1 rounded-md border-white/15 bg-white/[0.03] text-slate-200 hover:bg-white/10 hover:text-white">
                      <ChevronDown className="h-4 w-4" /> Show Detailed Advisory
                    </Button>
                  )}
                </div>
                {generating && (
                  <Card className="overflow-hidden rounded-lg border border-emerald-300/15 bg-emerald-300/[0.045] text-slate-100 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-300/10 text-emerald-100">
                          <Sparkles className="h-5 w-5 animate-pulse" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase text-emerald-200/70">AI advisory generation</p>
                          <h3 className="mt-1 font-semibold text-white">Synthesizing crop, weather, pest, finance, and scheme signals.</h3>
                          <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            {['Profile context', 'Risk windows', 'Dashboard-safe output'].map(label => (
                              <div key={label} className="h-2 animate-pulse rounded-full bg-white/[0.08]" title={label} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {genError && (
                  <Card className="rounded-lg border border-red-400/20 bg-red-950/20 text-red-100 backdrop-blur-xl">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-400/25 bg-red-500/10">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs uppercase text-red-200/80">Advisory engine unavailable</p>
                          <p className="mt-1 text-sm leading-6 text-red-100">{genError}</p>
                          <p className="mt-1 text-xs text-red-200/70">Check connectivity and retry generation. Existing dashboard data remains available.</p>
                        </div>
                      </div>
                      <Button onClick={handleGenerate} disabled={generating} className="h-10 rounded-md bg-red-100 text-sm font-semibold text-red-950 hover:bg-white">Retry advisory</Button>
                    </CardContent>
                  </Card>
                )}

                {showDetailedTabs && activeAdvisory && (
                  <DashboardTabs advisory={activeAdvisory} voiceSummaries={activeVoice} />
                )}

                {!activeAdvisory && !showSample && (
                  <Card className="rounded-[1.5rem] border border-dashed border-emerald-300/20 bg-white/[0.035] text-slate-100 shadow-2xl shadow-black/20 backdrop-blur-xl">
                    <CardContent className="p-8 text-center sm:p-10">
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-100">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <p className="text-xs uppercase text-emerald-200/70">No advisory generated yet</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">{t('dash_empty')}</h3>
                      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{t('dash_empty_hint')}</p>
                      <Button onClick={handleGenerate} disabled={generating} className="mt-6 h-11 rounded-md bg-emerald-200 font-semibold text-slate-950 hover:bg-emerald-100">
                        Generate first intelligence packet
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {view === 'profile' && profile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-emerald-200/70">Farm intelligence profile</p>
                    <h2 className="mt-1 text-lg font-semibold text-white">{t('profile_title')}</h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)} className="gap-1 rounded-md border-white/15 bg-white/[0.03] text-slate-200 hover:bg-white/10 hover:text-white">
                    <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                  </Button>
                </div>
                <Card className="rounded-lg border border-white/10 bg-white/[0.035] text-slate-100 backdrop-blur-xl">
                  <CardContent className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {[
                        [t('profile_name'), profile?.name],
                        [t('profile_district'), profile?.location_district],
                        [t('profile_state'), profile?.location_state],
                        [t('profile_land_size'), `${profile?.land_size_acres ?? ''} ${t('profile_acres')}`],
                        [t('profile_soil_type'), profile?.soil_type],
                        [t('profile_irrigation'), profile?.irrigation_type],
                        [t('profile_current_crop'), profile?.current_crop],
                        [t('profile_crop_stage'), profile?.crop_stage],
                        [t('profile_sowing_date'), profile?.sowing_date],
                        [t('profile_bank_status'), profile?.bank_account_status],
                        [t('profile_insurance'), profile?.insurance_policy],
                        [t('profile_loan_status'), profile?.loan_status],
                        [t('profile_budget'), `Rs. ${profile?.budget_inputs ?? 0}`],
                        [t('profile_pref_lang'), profile?.preferred_language],
                      ].map(([label, val], i) => (
                        <div key={i} className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-slate-500">{String(label)}</span>
                          <span className="font-medium text-slate-200">{String(val ?? '--')}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {view === 'history' && (
              <AdvisoryHistoryView history={history} loadingHistory={historyLoading} onRefresh={loadHistory} />
            )}
            {view === 'schedules' && <ScheduleManagement />}
            {view === 'settings' && <SettingsKB />}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}

export default function Page() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authMode, setAuthMode] = useState<'landing' | 'auth'>('landing')

  const loadCurrentUser = useCallback(async () => {
    setAuthLoading(true)
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (res.ok && data?.success && data?.user) {
        setAuthUser(data.user)
      } else {
        setAuthUser(null)
      }
    } catch {
      setAuthUser(null)
    }
    setAuthLoading(false)
  }, [])

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // no-op
    }
    setAuthUser(null)
  }, [])

  return (
    <ErrorBoundary>
      <div style={THEME_VARS} className="min-h-screen bg-[#07100d] text-slate-100 font-sans">
        <LanguageProvider>
          {authLoading ? (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-6 py-5 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-300/10">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-200" />
                </div>
                <p className="text-xs uppercase text-emerald-200/70">AGROGUIA.AI</p>
                <p className="mt-1 text-sm text-slate-400">Loading your intelligent agriculture workspace...</p>
              </div>
            </div>
          ) : authUser ? (
            <AppShell currentUser={authUser} onLogout={handleLogout} />
          ) : authMode === 'landing' ? (
            <LandingPage 
              onGetStarted={() => setAuthMode('auth')} 
              onLoginClick={() => setAuthMode('auth')} 
            />
          ) : (
            <AuthScreen 
              onAuthSuccess={setAuthUser} 
              onBackToLanding={() => setAuthMode('landing')} 
            />
          )}
        </LanguageProvider>
      </div>
    </ErrorBoundary>
  )
}

