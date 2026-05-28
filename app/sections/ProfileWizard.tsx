'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FiChevronRight, FiChevronLeft, FiCheck, FiSun, FiDroplet, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
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
  { value: 'Rainfed', label: 'Rainfed', icon: FiDroplet },
  { value: 'Borewell', label: 'Borewell', icon: FiDroplet },
  { value: 'Canal', label: 'Canal', icon: FiDroplet },
  { value: 'Drip', label: 'Drip', icon: FiDroplet },
  { value: 'Sprinkler', label: 'Sprinkler', icon: FiDroplet },
  { value: 'Flood', label: 'Flood', icon: FiDroplet },
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
          lang === 'kn' ? 'Namaskara. FarmerOS nimma vaiyaktika krishi salahagara. Nimmma hottavannu set up maadona.'
            : 'Welcome to FarmerOS. Your personal farm advisor. Let us set up your farm.'
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-green-50 to-background">
      <Card className="w-full max-w-lg bg-card/90 backdrop-blur-lg border-border shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-primary">FarmerOS</CardTitle>
            <span className="text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1 mt-3">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-border'}`} />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <FiSun className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Namaskara</h3>
              <p className="text-sm text-muted-foreground">
                FarmerOS is your personal farm advisor. Let&apos;s set up your farm in a few simple steps.
              </p>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">{t('profile_choose_language')}</p>
                <LanguageSelector size="lg" />
              </div>
            </div>
          )}

          {/* Step 2: Basic Details */}
          {step === 2 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FiUser className="h-4 w-4" /> Basic Details
              </h3>
              <div>
                <Label>Name</Label>
                <Input placeholder="Raju Patil" value={form.name} onChange={e => updateField('name', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Village</Label>
                  <Input placeholder="Muddebihal" value={form.location_village} onChange={e => updateField('location_village', e.target.value)} />
                </div>
                <div>
                  <Label>{t('profile_district')}</Label>
                  <Input placeholder="Bijapur" value={form.location_district} onChange={e => updateField('location_district', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t('profile_state')}</Label>
                  <Input placeholder="Karnataka" value={form.location_state} onChange={e => updateField('location_state', e.target.value)} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input placeholder="+91 9876543210" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Your Farm */}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FiMapPin className="h-4 w-4" /> Your Farm
              </h3>
              <div>
                <Label>{t('profile_land_size')}</Label>
                <Input type="number" placeholder="4" value={form.land_size_acres || ''} onChange={e => updateField('land_size_acres', parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <Label>{t('profile_soil_type')}</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {SOIL_TYPES.map(soil => (
                    <button
                      key={soil.value}
                      onClick={() => updateField('soil_type', soil.value)}
                      className={`p-2 rounded-lg border text-xs text-center transition-all ${form.soil_type === soil.value ? 'border-primary ring-2 ring-primary/30 bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    >
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${soil.color}`} />
                      {soil.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Water Source</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {WATER_SOURCES.map(ws => (
                    <button
                      key={ws.value}
                      onClick={() => updateField('irrigation_type', ws.value)}
                      className={`p-2 rounded-lg border text-xs text-center transition-all flex flex-col items-center gap-1 ${form.irrigation_type === ws.value ? 'border-primary ring-2 ring-primary/30 bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    >
                      <FiDroplet className="h-4 w-4 text-blue-500" />
                      {ws.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Your Crop */}
          {step === 4 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FiSun className="h-4 w-4" /> Your Crop
              </h3>
              <div>
                <Label>What are you growing?</Label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {CROPS.map(crop => (
                    <button
                      key={crop.value}
                      onClick={() => updateField('current_crop', crop.value)}
                      className={`p-2 rounded-lg border text-xs text-center transition-all ${form.current_crop === crop.value ? 'border-primary ring-2 ring-primary/30 bg-primary/5 font-bold' : 'border-border hover:border-primary/50'}`}
                    >
                      {crop.label}
                    </button>
                  ))}
                </div>
                <Input className="mt-2" placeholder="Or type crop name..." value={form.current_crop} onChange={e => updateField('current_crop', e.target.value)} />
              </div>
              <div>
                <Label>{t('profile_sowing_date')}</Label>
                <Input type="date" value={form.sowing_date} onChange={e => updateField('sowing_date', e.target.value)} />
              </div>
              <div>
                <Label>Crop Stage</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest-ready'].map(stage => (
                    <button
                      key={stage}
                      onClick={() => updateField('crop_stage', stage)}
                      className={`p-2 rounded-lg border text-xs text-center transition-all ${form.crop_stage === stage ? 'border-primary ring-2 ring-primary/30 bg-primary/5 font-bold' : 'border-border hover:border-primary/50'}`}
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
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Financial Profile</h3>
              <div>
                <Label>Do you have a bank account?</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['Yes', 'No'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateField('bank_account_status', opt === 'Yes' ? 'Active' : 'None')}
                      className={`p-3 rounded-lg border text-sm transition-all ${(form.bank_account_status === 'Active' && opt === 'Yes') || (form.bank_account_status === 'None' && opt === 'No') ? 'border-primary ring-2 ring-primary/30 bg-primary/5 font-bold' : 'border-border hover:border-primary/50'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Are you insured?</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['Yes', 'No'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateField('insurance_policy', opt === 'Yes' ? 'PMFBY Active' : 'None')}
                      className={`p-3 rounded-lg border text-sm transition-all ${(form.insurance_policy === 'PMFBY Active' && opt === 'Yes') || (form.insurance_policy === 'None' && opt === 'No') ? 'border-primary ring-2 ring-primary/30 bg-primary/5 font-bold' : 'border-border hover:border-primary/50'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Do you have a loan?</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['Yes', 'No'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateField('loan_status', opt === 'Yes' ? 'Active KCC' : 'No Loan')}
                      className={`p-3 rounded-lg border text-sm transition-all ${(form.loan_status === 'Active KCC' && opt === 'Yes') || (form.loan_status === 'No Loan' && opt === 'No') ? 'border-primary ring-2 ring-primary/30 bg-primary/5 font-bold' : 'border-border hover:border-primary/50'}`}
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
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Language Preference</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred language for advisories</p>
              <div className="grid grid-cols-1 gap-2">
                {LANGUAGES.map(lng => (
                  <button
                    key={lng.value}
                    onClick={() => updateField('preferred_language', lng.value)}
                    className={`p-4 rounded-lg border text-left transition-all flex items-center justify-between ${form.preferred_language === lng.value ? 'border-primary ring-2 ring-primary/30 bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <div>
                      <span className="text-sm font-medium">{lng.value}</span>
                      <span className="text-sm text-muted-foreground ml-2">{lng.native}</span>
                    </div>
                    {form.preferred_language === lng.value && <FiCheck className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Done */}
          {step === 7 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <FiCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Your farm is now set up!</h3>
              <p className="text-sm text-muted-foreground">
                Today you have 3 actions. Shall I tell you what to do?
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-left text-sm space-y-1">
                <p><strong>Name:</strong> {form.name || '--'}</p>
                <p><strong>Location:</strong> {form.location_district || '--'}, {form.location_state || '--'}</p>
                <p><strong>Farm:</strong> {form.land_size_acres} acres, {form.soil_type || '--'}</p>
                <p><strong>Crop:</strong> {form.current_crop || '--'} ({form.crop_stage || '--'})</p>
                <p><strong>Language:</strong> {form.preferred_language}</p>
              </div>
            </div>
          )}

          {saveError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{saveError}</p>}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-2">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(s => s - 1)}>
                <FiChevronLeft className="mr-1" /> Back
              </Button>
            ) : <div />}
            {step < TOTAL_STEPS ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                {step === 1 ? "Let's Go" : 'Next'} <FiChevronRight className="ml-1" />
              </Button>
            ) : (
              <Button onClick={() => onSave(form)} disabled={saving} className="bg-green-600 hover:bg-green-700">
                {saving ? 'Saving...' : <><FiCheck className="mr-1" /> Start Dashboard</>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
