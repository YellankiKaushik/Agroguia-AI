'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FiMenu, FiHome, FiUser, FiClock, FiSettings, FiFileText, FiRefreshCw, FiX, FiEdit3, FiChevronDown } from 'react-icons/fi'
import ProfileWizard from './sections/ProfileWizard'
import type { FarmerProfileData } from './sections/ProfileWizard'
import DashboardTabs from './sections/DashboardTabs'
import LandingPage from './sections/LandingPage'
import DashboardHero from './sections/DashboardHero'
import CropTimeline from './sections/CropTimeline'
import FinancialDashboard from './sections/FinancialDashboard'
import SchemesLoansInsurance from './sections/SchemesLoansInsurance'
import VoiceUpdate from './sections/VoiceUpdate'
import { AdvisoryHistoryView, ScheduleManagement, SettingsKB } from './sections/ManagementViews'
import { LanguageProvider, useLanguage } from './sections/LanguageContext'
import LanguageSelector from './sections/LanguageSelector'

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
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Try again</button>
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
      setAuthError(err?.message || 'Network error')
    }

    setSubmitting(false)
  }

  return (
    <div style={THEME_VARS} className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-border shadow-xl">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-2xl font-bold text-primary">{t('app_title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('app_tagline')}</p>
          <LanguageSelector size="sm" />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" />
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (optional)" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" />
              </>
            )}
            {mode === 'login' && (
              <input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} placeholder="Email or username" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" />
            )}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" />
            {authError && <p className="text-xs text-destructive">{authError}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
            </Button>
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full text-xs text-primary hover:underline">
              {mode === 'login' ? 'Create an account' : 'Already have an account? Login'}
            </button>
            {onBackToLanding && (
              <button type="button" onClick={onBackToLanding} className="w-full text-xs text-muted-foreground hover:text-foreground hover:underline mt-2">
                Back to Home
              </button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

type ViewType = 'dashboard' | 'profile' | 'history' | 'schedules' | 'settings'

const NAV_ITEMS: { id: ViewType; labelKey: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', labelKey: 'nav_dashboard', icon: <FiHome /> },
  { id: 'profile', labelKey: 'nav_profile', icon: <FiUser /> },
  { id: 'history', labelKey: 'nav_history', icon: <FiFileText /> },
  { id: 'schedules', labelKey: 'nav_schedules', icon: <FiClock /> },
  { id: 'settings', labelKey: 'nav_settings', icon: <FiSettings /> },
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
        setSaveError(data.error || 'Failed to save profile. Please try again.')
      }
    } catch (e: any) {
      setSaveError(e?.message || 'Network error. Please try again.')
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
        setGenError(result?.error ?? 'Failed to generate advisory')
      }
    } catch (e: any) {
      setGenError(e?.message ?? 'Network error')
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <FiRefreshCw className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">{t('loading_profile')}</p>
        </div>
      </div>
    )
  }

  if ((!profile && !profileLoading) || editingProfile) {
    return <ProfileWizard onSave={handleSaveProfile} saving={savingProfile} userName={profile?.name ?? ''} saveError={saveError} />
  }

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-56 bg-card/90 backdrop-blur-lg border-r border-border z-40 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h1 className="text-lg font-bold text-primary">{t('app_title')}</h1>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(false)}><FiX /></Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setView(item.id); setSidebarOpen(false); if (item.id === 'history') loadHistory() }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${view === item.id ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'}`}>
              {item.icon} {t(item.labelKey)}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex flex-wrap gap-1.5">
            {['Weather', 'Pest', 'Protection', 'Market', 'Schemes', 'Insurance', 'Loan', 'Fraud', 'Waste', 'Voice'].map(name => (
              <Badge key={name} variant="outline" className="text-xs py-0">{name}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Powered by AGROGUIA.AI Intelligence Engine</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}><FiMenu /></Button>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{farmerInfo.name}</h2>
              <p className="text-xs text-muted-foreground">{farmerInfo.district}, {farmerInfo.state ?? ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector size="sm" />
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">{t('sample_data')}</Label>
              <Switch checked={showSample} onCheckedChange={(v) => { setShowSample(v); if (v) setShowDetailedTabs(true) }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">{currentUser.name || currentUser.email}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
            </div>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 max-w-5xl mx-auto w-full space-y-4">
            {view === 'dashboard' && (
              <>
                <DashboardHero farmer={farmerInfo} weather={MOCK_WEATHER} alerts={MOCK_ALERTS} actions={MOCK_ACTIONS} />
                <CropTimeline stages={MOCK_TIMELINE.stages} cropName={farmerInfo.current_crop} />
                <FinancialDashboard {...MOCK_FINANCIAL} />
                <SchemesLoansInsurance schemes={MOCK_SCHEMES} insurance={MOCK_INSURANCE} loan={MOCK_LOAN} />
                <VoiceUpdate voiceSummary={MOCK_VOICE} />

                <div className="flex gap-2 items-center flex-wrap">
                  <Button onClick={handleGenerate} disabled={generating} className="gap-2">
                    <FiRefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                    {generating ? t('dash_generating') : t('dash_generate')}
                  </Button>
                  {activeAdvisory && !showDetailedTabs && (
                    <Button variant="outline" onClick={() => setShowDetailedTabs(true)} className="gap-1">
                      <FiChevronDown className="h-4 w-4" /> Show Detailed Advisory
                    </Button>
                  )}
                </div>
                {genError && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-lg">{genError}</p>}

                {showDetailedTabs && activeAdvisory && (
                  <DashboardTabs advisory={activeAdvisory} voiceSummaries={activeVoice} />
                )}

                {!activeAdvisory && !showSample && (
                  <Card className="bg-card/80 backdrop-blur-lg border-border">
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground text-sm">{t('dash_empty')}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t('dash_empty_hint')}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {view === 'profile' && profile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{t('profile_title')}</h2>
                  <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)} className="gap-1">
                    <FiEdit3 className="h-3.5 w-3.5" /> Edit Profile
                  </Button>
                </div>
                <Card className="bg-card/80 backdrop-blur-lg border-border">
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
                        <div key={i} className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">{String(label)}</span>
                          <span className="font-medium">{String(val ?? '--')}</span>
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
      <div style={THEME_VARS} className="min-h-screen bg-background text-foreground font-sans">
        <LanguageProvider>
          {authLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Loading...</div>
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

