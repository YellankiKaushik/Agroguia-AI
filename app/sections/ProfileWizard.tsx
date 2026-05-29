'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, ChevronLeft, ChevronRight, Droplet, MapPin, Sun, User } from 'lucide-react'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'

export interface FarmerProfileData {
  name: string
  location_district: string
  location_state: string
  location_village: string
  land_size_acres: number
  soil_type: string
  irrigation_type: string
  current_crop: string
  crop_stage: string
  sowing_date: string
  bank_account_status: string
  insurance_policy: string
  loan_status: string
  budget_inputs: number
  preferred_language: string
  phone: string
}

interface ProfileWizardProps {
  onSave: (profile: FarmerProfileData) => Promise<void>
  saving: boolean
  userName: string
  saveError?: string
}

const SOIL_TYPES = [
  { value: 'Black Cotton Soil', label: 'Black Cotton', color: 'bg-gray-800' },
  { value: 'Red', label: 'Red Soil', color: 'bg-red-700' },
  { value: 'Alluvial', label: 'Alluvial', color: 'bg-amber-600' },
  { value: 'Laterite', label: 'Laterite', color: 'bg-orange-700' },
  { value: 'Sandy', label: 'Sandy', color: 'bg-yellow-400' },
  { value: 'Clay', label: 'Clay', color: 'bg-amber-800' },
]

const WATER_SOURCES = [
  { value: 'Rainfed', label: 'Rainfed', icon: Droplet },
  { value: 'Borewell', label: 'Borewell', icon: Droplet },
  { value: 'Canal', label: 'Canal', icon: Droplet },
  { value: 'Drip', label: 'Drip', icon: Droplet },
  { value: 'Sprinkler', label: 'Sprinkler', icon: Droplet },
  { value: 'Flood', label: 'Flood', icon: Droplet },
]

const CROPS = [
  { value: 'Soybean', label: 'Soybean' },
  { value: 'Cotton', label: 'Cotton' },
  { value: 'Rice', label: 'Rice' },
  { value: 'Wheat', label: 'Wheat' },
  { value: 'Sugarcane', label: 'Sugarcane' },
  { value: 'Grape', label: 'Grape' },
  { value: 'Jowar', label: 'Jowar' },
  { value: 'Tur Dal', label: 'Tur Dal' },
]

const LANGUAGES = [
  { value: 'Kannada', native: 'ಕನ್ನಡ' },
  { value: 'Telugu', native: 'తెలుగు' },
  { value: 'Hindi', native: 'हिंदी' },
  { value: 'Marathi', native: 'मराठी' },
  { value: 'English', native: 'English' },
]

const TOTAL_STEPS = 7

export default function ProfileWizard({ onSave, saving, userName, saveError }: ProfileWizardProps) {
  const { t, lang, speechLang } = useLanguage()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FarmerProfileData>({
    name: userName || '',
    location_district: '',
    location_state: '',
    location_village: '',
    land_size_acres: 0,
    soil_type: '',
    irrigation_type: '',
    current_crop: '',
    crop_stage: '',
    sowing_date: '',
    bank_account_status: '',
    insurance_policy: '',
    loan_status: '',
    budget_inputs: 0,
    preferred_language: 'Kannada',
    phone: '',
  })

  useEffect(() => {
    const langMap: Record<string, string> = { en: 'English', hi: 'Hindi', kn: 'Kannada', te: 'Telugu' }
    setForm(prev => ({ ...prev, preferred_language: langMap[lang] ?? 'English' }))
  }, [lang])

  const updateField = (field: keyof FarmerProfileData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Welcome voice
  useEffect(() => {
    if (step === 1 && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        const u = new SpeechSynthesisUtterance(
          lang === 'kn' ? 'Namaskara. AGROGUIA.AI nimma vaiyaktika krishi salahagara. Nimmma hottavannu set up maadona.'
            : 'Welcome to AGROGUIA.AI. Your personal farm advisor. Let us set up your farm.'
        )
        u.lang = speechLang
        window.speechSynthesis.speak(u)
      }, 500)
      return () => { clearTimeout(timer); window.speechSynthesis.cancel() }
    }
  }, [step, lang, speechLang])

  const canProceed = () => {
    if (step === 2) return form.name && form.location_district && form.phone
    if (step === 3) return form.land_size_acres > 0 && form.soil_type && form.irrigation_type
    if (step === 4) return form.current_crop && form.sowing_date
    return true
  }

  const progress = Math.round((step / TOTAL_STEPS) * 100)
  const inputClass =
    'h-11 border-white/10 bg-black/25 text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus-visible:border-emerald-300/40 focus-visible:ring-2 focus-visible:ring-emerald-300/20'
  const labelClass = 'mb-2 block text-xs font-medium text-slate-300'
  const optionClass = (selected: boolean, extra = '') =>
    `rounded-lg border text-slate-300 transition-all duration-300 hover:border-emerald-300/25 hover:bg-white/[0.05] ${selected ? 'border-emerald-300/40 bg-emerald-300/10 text-white ring-2 ring-emerald-300/20' : 'border-white/10 bg-white/[0.025]'} ${extra}`
  const stepTitles = [
    'Welcome',
    'Identity',
    'Farm Context',
    'Crop Cycle',
    'Finance',
    'Language',
    'Ready',
  ]
  const stepDescriptions: Record<number, string> = {
    1: 'Initialize language and advisory preferences for your farm intelligence layer.',
    2: 'Secure the farmer identity and location context used by advisory modules.',
    3: 'Calibrate land, soil, and irrigation signals for better operational guidance.',
    4: 'Connect crop stage and sowing date to risk, weather, and protection timing.',
    5: 'Add finance, insurance, and loan context for practical recommendations.',
    6: 'Choose the language used for advisory generation and voice-first access.',
    7: 'Review the farm intelligence profile before opening the dashboard.',
  }

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-[#07100d] px-4 py-8 text-slate-100 selection:bg-emerald-300 selection:text-slate-950 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(45,212,191,0.18),transparent_42%),linear-gradient(180deg,rgba(7,16,13,0)_0%,#07100d_92%)]" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="hidden lg:block">
          <div className="max-w-lg">
            <div className="mb-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
              AI Farm Intelligence Profile Calibration
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Configure the operating system for your farm decisions.
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-400">
              AGROGUIA.AI uses this profile to personalize crop guidance, weather timing, pest risk, finance, schemes, insurance, and voice summaries.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1
              const completed = stepNumber < step
              const active = stepNumber === step
              return (
                <div key={title} className={`rounded-lg border px-4 py-3 transition-all duration-300 ${active ? 'border-emerald-300/30 bg-emerald-300/10' : completed ? 'border-emerald-300/20 bg-white/[0.035]' : 'border-white/10 bg-white/[0.025]'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-semibold ${completed ? 'border-emerald-300/30 bg-emerald-300/15 text-emerald-100' : active ? 'border-emerald-200/40 bg-emerald-200 text-slate-950' : 'border-white/10 bg-black/25 text-slate-500'}`}>
                      {completed ? <Check className="h-4 w-4" /> : stepNumber}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-slate-500">{stepNumber === step ? stepDescriptions[stepNumber] : completed ? 'Completed' : 'Upcoming'}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <Card className="w-full overflow-hidden rounded-lg border border-white/10 bg-slate-950/90 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="hidden rounded-md border border-white/10 bg-black/30 px-3 py-1 font-mono text-[11px] text-slate-500 sm:block">
              agroguia.ai/profile-calibration
            </div>
            <div className="h-2 w-16 rounded-full bg-white/10" />
          </div>
          <CardHeader className="space-y-5 p-6 pb-4 sm:p-8 sm:pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase text-emerald-200/70">Step {step} of {TOTAL_STEPS}</p>
                <CardTitle className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  {stepTitles[step - 1]}
                </CardTitle>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{stepDescriptions[step]}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.035] p-1">
                <LanguageSelector size="sm" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Profile calibration</span>
                <span className="font-mono text-emerald-200">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-black/25">
                <div className="h-full rounded-full bg-emerald-200 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < step ? 'bg-emerald-200' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-6 pt-0 sm:p-8 sm:pt-0">

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 py-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-300/10 text-emerald-100 shadow-lg shadow-emerald-950/30">
                <Sun className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">Namaskara, let&apos;s calibrate your farm AI.</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
                  This setup turns your farm context into a structured intelligence profile for personalized advisory.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-300/15 bg-emerald-300/[0.055] p-4 text-left">
                <p className="text-sm font-semibold text-emerald-100">What gets configured</p>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Location, soil, irrigation, crop stage, finance, insurance, and language signals used by your dashboard.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="mb-3 text-xs text-slate-500">{t('profile_choose_language')}</p>
                <div className="flex justify-center">
                  <LanguageSelector size="lg" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Basic Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <User className="h-4 w-4 text-emerald-200" /> Farmer identity
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  These details scope the advisory profile to the right person and geography.
                </p>
              </div>
              <div>
                <Label className={labelClass}>Name</Label>
                <Input className={inputClass} placeholder="Raju Patil" value={form.name} onChange={e => updateField('name', e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className={labelClass}>Village</Label>
                  <Input className={inputClass} placeholder="Muddebihal" value={form.location_village} onChange={e => updateField('location_village', e.target.value)} />
                </div>
                <div>
                  <Label className={labelClass}>{t('profile_district')}</Label>
                  <Input className={inputClass} placeholder="Bijapur" value={form.location_district} onChange={e => updateField('location_district', e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className={labelClass}>{t('profile_state')}</Label>
                  <Input className={inputClass} placeholder="Karnataka" value={form.location_state} onChange={e => updateField('location_state', e.target.value)} />
                </div>
                <div>
                  <Label className={labelClass}>Phone</Label>
                  <Input className={inputClass} placeholder="+91 9876543210" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Your Farm */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <MapPin className="h-4 w-4 text-emerald-200" /> Farm context matrix
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Soil, land, and water availability shape crop fit, risk windows, and input planning.
                </p>
              </div>
              <div>
                <Label className={labelClass}>{t('profile_land_size')}</Label>
                <Input className={inputClass} type="number" placeholder="4" value={form.land_size_acres || ''} onChange={e => updateField('land_size_acres', parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <Label className={labelClass}>{t('profile_soil_type')}</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SOIL_TYPES.map(soil => (
                    <button
                      type="button"
                      key={soil.value}
                      onClick={() => updateField('soil_type', soil.value)}
                      aria-pressed={form.soil_type === soil.value}
                      className={optionClass(form.soil_type === soil.value, 'p-3 text-center text-xs')}
                    >
                      <div className={`mx-auto mb-2 h-6 w-6 rounded-full border border-white/20 ${soil.color}`} />
                      {soil.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className={labelClass}>Water Source</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {WATER_SOURCES.map(ws => (
                    <button
                      type="button"
                      key={ws.value}
                      onClick={() => updateField('irrigation_type', ws.value)}
                      aria-pressed={form.irrigation_type === ws.value}
                      className={optionClass(form.irrigation_type === ws.value, 'flex flex-col items-center gap-2 p-3 text-center text-xs')}
                    >
                      <Droplet className="h-4 w-4 text-teal-200" />
                      {ws.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Your Crop */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Sun className="h-4 w-4 text-emerald-200" /> Crop cycle intelligence
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Crop and stage data help AGROGUIA.AI time protection, weather, and market recommendations.
                </p>
              </div>
              <div>
                <Label className={labelClass}>What are you growing?</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {CROPS.map(crop => (
                    <button
                      type="button"
                      key={crop.value}
                      onClick={() => updateField('current_crop', crop.value)}
                      aria-pressed={form.current_crop === crop.value}
                      className={optionClass(form.current_crop === crop.value, 'p-3 text-center text-xs font-medium')}
                    >
                      {crop.label}
                    </button>
                  ))}
                </div>
                <Input className={`${inputClass} mt-3`} placeholder="Or type crop name..." value={form.current_crop} onChange={e => updateField('current_crop', e.target.value)} />
              </div>
              <div>
                <Label className={labelClass}>{t('profile_sowing_date')}</Label>
                <Input className={inputClass} type="date" value={form.sowing_date} onChange={e => updateField('sowing_date', e.target.value)} />
              </div>
              <div>
                <Label className={labelClass}>Crop Stage</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest-ready'].map(stage => (
                    <button
                      type="button"
                      key={stage}
                      onClick={() => updateField('crop_stage', stage)}
                      aria-pressed={form.crop_stage === stage}
                      className={optionClass(form.crop_stage === stage, 'p-3 text-center text-xs font-medium')}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Financial Profile */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <h3 className="text-lg font-semibold text-white">Finance and risk readiness</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Finance context helps connect crop advice with input budgets, insurance, schemes, and safer decisions.
                </p>
              </div>
              <div>
                <Label className={labelClass}>Do you have a bank account?</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {['Yes', 'No'].map(opt => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => updateField('bank_account_status', opt === 'Yes' ? 'Active' : 'None')}
                      aria-pressed={(form.bank_account_status === 'Active' && opt === 'Yes') || (form.bank_account_status === 'None' && opt === 'No')}
                      className={optionClass((form.bank_account_status === 'Active' && opt === 'Yes') || (form.bank_account_status === 'None' && opt === 'No'), 'p-3 text-sm font-medium')}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className={labelClass}>Are you insured?</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {['Yes', 'No'].map(opt => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => updateField('insurance_policy', opt === 'Yes' ? 'PMFBY Active' : 'None')}
                      aria-pressed={(form.insurance_policy === 'PMFBY Active' && opt === 'Yes') || (form.insurance_policy === 'None' && opt === 'No')}
                      className={optionClass((form.insurance_policy === 'PMFBY Active' && opt === 'Yes') || (form.insurance_policy === 'None' && opt === 'No'), 'p-3 text-sm font-medium')}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className={labelClass}>Do you have a loan?</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {['Yes', 'No'].map(opt => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => updateField('loan_status', opt === 'Yes' ? 'Active KCC' : 'No Loan')}
                      aria-pressed={(form.loan_status === 'Active KCC' && opt === 'Yes') || (form.loan_status === 'No Loan' && opt === 'No')}
                      className={optionClass((form.loan_status === 'Active KCC' && opt === 'Yes') || (form.loan_status === 'No Loan' && opt === 'No'), 'p-3 text-sm font-medium')}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Language Preference */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <h3 className="text-lg font-semibold text-white">Voice and advisory language</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Choose your preferred language for dashboard advisories and voice-first access.</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {LANGUAGES.map(lng => (
                  <button
                    type="button"
                    key={lng.value}
                    onClick={() => updateField('preferred_language', lng.value)}
                    aria-pressed={form.preferred_language === lng.value}
                    className={optionClass(form.preferred_language === lng.value, 'flex items-center justify-between p-4 text-left')}
                  >
                    <div>
                      <span className="text-sm font-medium text-white">{lng.value}</span>
                      <span className="ml-2 text-sm text-slate-500">{lng.native}</span>
                    </div>
                    {form.preferred_language === lng.value && <Check className="h-5 w-5 text-emerald-200" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Done */}
          {step === 7 && (
            <div className="space-y-5 py-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-300/10 text-emerald-100 shadow-lg shadow-emerald-950/30">
                <Check className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">Your farm intelligence profile is ready.</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
                  AGROGUIA.AI can now generate your dashboard across crop, risk, weather, finance, schemes, and voice guidance.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-300/15 bg-emerald-300/[0.055] p-4 text-left text-sm">
                <div className="grid gap-2 text-slate-400 sm:grid-cols-2">
                  <p><strong className="text-slate-200">Name:</strong> {form.name || '--'}</p>
                  <p><strong className="text-slate-200">Location:</strong> {form.location_district || '--'}, {form.location_state || '--'}</p>
                  <p><strong className="text-slate-200">Farm:</strong> {form.land_size_acres} acres, {form.soil_type || '--'}</p>
                  <p><strong className="text-slate-200">Crop:</strong> {form.current_crop || '--'} ({form.crop_stage || '--'})</p>
                  <p><strong className="text-slate-200">Language:</strong> {form.preferred_language}</p>
                </div>
              </div>
            </div>
          )}

          {saveError && (
            <div className="rounded-lg border border-red-400/20 bg-red-950/20 p-4 text-sm text-red-100">
              <p className="text-xs font-semibold uppercase text-red-200/80">Profile save interrupted</p>
              <p className="mt-1 leading-6">{saveError}</p>
              <p className="mt-1 text-xs text-red-200/70">Review your connection and submit again. Your entered setup details remain on this screen.</p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-5">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="h-11 rounded-md border-white/15 bg-white/[0.03] text-slate-200 hover:bg-white/10 hover:text-white">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            ) : <div />}
            {step < TOTAL_STEPS ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="h-11 rounded-md bg-emerald-200 font-semibold text-slate-950 transition-all duration-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40">
                {step === 1 ? "Let's Go" : 'Next'} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => onSave(form)} disabled={saving} className="h-11 rounded-md bg-emerald-200 font-semibold text-slate-950 transition-all duration-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40">
                {saving ? 'Saving...' : <><Check className="mr-1 h-4 w-4" /> Start Dashboard</>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

