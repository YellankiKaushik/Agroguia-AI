'use client'

import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  AudioLines,
  BarChart3,
  BrainCircuit,
  CalendarClock,
  Check,
  ChevronRight,
  CloudSun,
  Database,
  Fingerprint,
  Gauge,
  Landmark,
  Layers3,
  LineChart,
  LockKeyhole,
  MapPinned,
  Network,
  Radar,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
  onLoginClick: () => void
}

type FeatureTab = 'advisory' | 'finance' | 'voice' | 'risk'
type IconListItem = [string, string, LucideIcon]

const problemSignals = [
  {
    icon: AlertTriangle,
    label: 'Spray timing risk',
    title: 'One wrong protection window can define the season.',
    copy: 'Farmers decide under humidity shifts, pest pressure, rainfall windows, and thin input budgets. Guessing too early wastes money. Waiting too long can collapse yield.',
  },
  {
    icon: WalletCards,
    label: 'Household finance pressure',
    title: 'Agronomy and credit decisions are still disconnected.',
    copy: 'Loan rates, insurance eligibility, scheme benefits, and input purchases shape every farm action, yet most tools treat them as separate problems.',
  },
  {
    icon: Layers3,
    label: 'Fragmented intelligence',
    title: 'Weather apps, market lists, and subsidy portals do not plan together.',
    copy: 'Farmers are forced to reconcile scattered signals manually when what they need is a single operational decision surface.',
  },
]

const solutionModules = [
  'AI advisory engine',
  'Weather intelligence',
  'Pest and disease risk',
  'Financial planning',
  'Scheme discovery',
  'Insurance readiness',
  'Market timing',
  'Voice summaries',
]

const workflow = [
  ['01', 'Create account', 'Secure farmer identity with cookie-based auth and user-scoped data.'],
  ['02', 'Complete profile', 'Capture crop stage, soil, irrigation, budget, finance, and language context.'],
  ['03', 'Generate advisory', 'OpenRouter reasoning returns a structured multi-module decision packet.'],
  ['04', 'Operate dashboard', 'Review actions, listen by voice, track history, and plan the next week.'],
]

const featureGrid: IconListItem[] = [
  ['AI Advisory Engine', 'Structured crop decisions with weather, pest, budget, and stage context.', BrainCircuit],
  ['Pest Intelligence', 'Risk windows, symptoms, treatment timing, and protection priorities.', Radar],
  ['Weather Forecasting', 'Rainfall and humidity signals converted into action timing.', CloudSun],
  ['Financial Planning', 'Input costs, loan alternatives, subsidy value, and profit visibility.', WalletCards],
  ['Scheme Discovery', 'Eligible programs, required documents, deadlines, and next steps.', Landmark],
  ['Risk Analysis', 'Seasonal, pest, finance, and digital fraud risks in one view.', ShieldCheck],
  ['Income Projection', 'Harvest, waste value, and scheme benefits combined into a forecast.', TrendingUp],
  ['Crop Guidance', 'Crop strategy, soil fit, seed direction, and stage-specific actions.', Sprout],
  ['Farmer Analytics', 'History-aware profile and advisory records scoped to each user.', BarChart3],
  ['Smart Recommendations', 'Clear next actions designed for weekly operational decisions.', Sparkles],
]

const techStack: IconListItem[] = [
  ['OpenRouter', 'LLM reasoning layer producing JSON advisory packets under a strict schema contract.', BrainCircuit],
  ['Open-source AI models', 'Flexible model routing for crop, finance, risk, and policy synthesis.', Network],
  ['MongoDB Atlas', 'Persistent farmer profiles and advisory history with authenticated ownership.', Database],
  ['Next.js architecture', 'Unified application routes, server-only secrets, and app-router UI workflows.', Layers3],
  ['Structured defaults', 'Deterministic schema merging keeps dashboards stable when model output varies.', Fingerprint],
  ['Scalable extensions', 'RAG, scheduler, and upload proxies prepare the platform for proactive intelligence.', CalendarClock],
]

const tabContent: Record<FeatureTab, { title: string; copy: string; bullets: string[]; panel: React.ReactNode }> = {
  advisory: {
    title: 'A decision packet, not a chatbot answer.',
    copy: 'AGROGUIA.AI converts farmer context into structured modules that the dashboard can render, store, replay, and compare across seasons.',
    bullets: ['JSON advisory contract', 'Weather and pest action windows', 'Crop stage and budget alignment'],
    panel: (
      <div className="space-y-3 rounded-lg border border-white/10 bg-black/35 p-4 font-mono text-[11px] text-slate-300">
        <div className="text-emerald-300">pest_advisory {'{'}</div>
        <div className="pl-4 text-slate-400">primary_disease: &quot;Yellow Mosaic Virus&quot;</div>
        <div className="pl-4 text-slate-400">action_window_hours: 48</div>
        <div className="pl-4 text-slate-400">immediate_action: &quot;Spray Mancozeb 600g/acre&quot;</div>
        <div className="pl-4 text-amber-200">risk_level: &quot;High&quot;</div>
        <div className="text-emerald-300">{'}'}</div>
      </div>
    ),
  },
  finance: {
    title: 'Farm operations tied to household economics.',
    copy: 'The platform connects input planning, lender comparisons, scheme discovery, insurance readiness, and income projection inside the same advisory flow.',
    bullets: ['KCC versus high-rate lender comparison', 'Scheme benefit discovery', 'Waste and harvest income projection'],
    panel: (
      <div className="space-y-3 rounded-lg border border-white/10 bg-black/35 p-4 text-sm">
        <div className="flex items-center justify-between rounded-md border border-red-400/20 bg-red-950/20 p-3">
          <span className="text-slate-300">Local NBFC</span>
          <span className="font-semibold text-red-200">18% rate</span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-emerald-400/20 bg-emerald-950/20 p-3">
          <span className="text-slate-300">SBI KCC</span>
          <span className="font-semibold text-emerald-200">4% subsidized</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">Projected annual value: harvest + schemes + waste resale</div>
      </div>
    ),
  },
  voice: {
    title: 'Designed for field conditions and shared devices.',
    copy: 'Voice summaries make high-value advisories usable when typing is slow, literacy varies, or decisions happen away from a desk.',
    bullets: ['Speech synthesis for modules', 'Regional language support', 'Live voice interaction surface'],
    panel: (
      <div className="rounded-lg border border-white/10 bg-black/35 p-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
          <AudioLines className="h-7 w-7" />
        </div>
        <div className="mt-5 space-y-2 text-center">
          <div className="text-sm font-semibold text-white">Voice advisory ready</div>
          <div className="text-xs leading-relaxed text-slate-400">&quot;Spray before rainfall. Keep photos ready for insurance claim filing.&quot;</div>
        </div>
      </div>
    ),
  },
  risk: {
    title: 'Risk intelligence includes the digital world too.',
    copy: 'The advisory layer flags unsafe loan patterns, missing documents, suspicious subsidy messages, and preventable mistakes that leak income.',
    bullets: ['Fraud awareness simulations', 'Insurance document readiness', 'Deadline and action alerts'],
    panel: (
      <div className="space-y-3 rounded-lg border border-white/10 bg-black/35 p-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">PM-KISAN OTP request</span>
          <Badge className="border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/10">Threat</Badge>
        </div>
        <p className="rounded-md border border-red-400/15 bg-red-950/20 p-3 leading-relaxed text-slate-400">Government services do not ask farmers to share OTPs over calls or messages.</p>
      </div>
    ),
  },
}

function IntelligenceConsole() {
  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="hidden rounded-md border border-white/10 bg-black/30 px-3 py-1 font-mono text-[11px] text-slate-500 sm:block">
          agroguia.ai/intelligence-console
        </div>
        <div className="h-2 w-16 rounded-full bg-white/10" />
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="border-b border-white/10 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-emerald-200/70">Farm decision packet</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Soybean, flowering stage</h3>
            </div>
            <Badge className="border border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/10">Schema validated</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Net estimate', 'Rs. 40,000', 'after input costs'],
              ['Rain window', '18mm', 'forecast in 48h'],
              ['Action risk', 'High', 'fungal pressure'],
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-[11px] uppercase text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Protection action timeline</p>
                <p className="text-xs text-slate-500">Converted from crop stage, humidity, rainfall, and disease risk.</p>
              </div>
              <Activity className="h-5 w-5 text-emerald-200" />
            </div>
            <div className="space-y-3">
              {[
                ['Today', 'Check leaf symptoms and soil moisture', 'Monitor'],
                ['Tomorrow 6 AM', 'Spray Mancozeb 600g per acre before rain', 'Critical'],
                ['48 hours', 'Avoid irrigation and photograph affected area', 'Insurance'],
              ].map(([time, action, level]) => (
                <div key={time} className="grid grid-cols-[88px_1fr_auto] items-center gap-3 rounded-md border border-white/5 bg-white/[0.025] px-3 py-2 text-xs">
                  <span className="font-mono text-slate-500">{time}</span>
                  <span className="text-slate-300">{action}</span>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase text-emerald-100">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-slate-500">Context matrix</p>
                <p className="mt-1 text-sm font-medium text-white">Raju Patil, Bijapur</p>
              </div>
              <MapPinned className="h-5 w-5 text-teal-200" />
            </div>
            <div className="space-y-2 text-xs">
              {[
                ['Land', '4 acres'],
                ['Soil', 'Black cotton'],
                ['Irrigation', 'Rainfed'],
                ['Budget', 'Rs. 12,000'],
                ['Insurance', 'PMFBY active'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-slate-300">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.055] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-100">
              <BrainCircuit className="h-4 w-4" />
              AI recommendation
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Prioritize spray before forecast rain, preserve claim evidence, and delay market sale two weeks unless local mandi price crosses MSP.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage({ onGetStarted, onLoginClick }: LandingPageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureTab>('advisory')
  const activeTab = useMemo(() => tabContent[activeFeatureTab], [activeFeatureTab])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07100d] text-slate-100 selection:bg-emerald-300 selection:text-slate-950">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07100d]/85 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button onClick={onGetStarted} className="group flex items-center gap-3 text-left" aria-label="Open AGROGUIA.AI authentication">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-300/25 bg-emerald-300/10 text-sm font-bold text-emerald-100 shadow-lg shadow-emerald-950/30">
              AG
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">AGROGUIA.AI</span>
              <span className="hidden text-[11px] uppercase text-slate-500 sm:block">Farm intelligence layer</span>
            </span>
          </button>

          <nav className="hidden items-center gap-6 text-sm text-slate-400 lg:flex">
            <a href="#problem" className="transition-colors hover:text-white">Problem</a>
            <a href="#solution" className="transition-colors hover:text-white">Solution</a>
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#technology" className="transition-colors hover:text-white">Technology</a>
            <a href="#vision" className="transition-colors hover:text-white">Vision</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={onLoginClick} className="hidden text-sm font-medium text-slate-400 transition-colors hover:text-white sm:inline-flex">
              Sign in
            </button>
            <Button onClick={onGetStarted} className="h-9 rounded-md bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-100">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate min-h-[calc(100vh-65px)] border-b border-white/10 px-4 pb-12 pt-16 sm:px-6 lg:pt-20">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(45,212,191,0.20),transparent_42%),linear-gradient(180deg,rgba(7,16,13,0)_0%,#07100d_92%)]" />

          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-5xl text-center">
              <Badge className="mb-5 border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100 hover:bg-emerald-300/10">
                AI Infrastructure for Intelligent Agriculture
              </Badge>
              <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-[1.03] text-white sm:text-6xl lg:text-7xl">
                AGROGUIA.AI
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
                The operating system for farm decisions, combining advisory, pest risk, weather timing, finance, schemes, voice, and planning into one intelligent dashboard.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button onClick={onGetStarted} size="lg" className="h-12 rounded-md bg-emerald-200 px-6 font-semibold text-slate-950 hover:bg-emerald-100">
                  Generate AI Farm Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={onGetStarted} size="lg" variant="outline" className="h-12 rounded-md border-white/15 bg-white/[0.03] px-6 text-white hover:bg-white/10 hover:text-white">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-12 lg:mt-14">
              <IntelligenceConsole />
            </div>

            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 text-xs text-slate-400 sm:grid-cols-3">
              {[
                ['Structured output', 'JSON advisory modules, not raw chat'],
                ['User scoped', 'Profiles and history protected by auth'],
                ['Voice ready', 'Summaries designed for field access'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-md border border-white/10 bg-white/[0.025] px-4 py-3">
                  <span className="font-semibold text-slate-200">{title}</span>
                  <span className="mt-1 block">{copy}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="problem" className="border-b border-white/10 bg-[#091410] px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="text-sm font-medium uppercase text-emerald-200/70">The Problem</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Farmers do not experience uncertainty as data. They experience it as irreversible loss.
                </h2>
              </div>
              <p className="text-base leading-8 text-slate-400">
                Every crop cycle repeats expensive decisions: when to spray, whether to irrigate, when to sell, what scheme deadline matters, which loan is safe, and whether an insurance claim is worth filing.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {problemSignals.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="group rounded-lg border border-white/10 bg-white/[0.035] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/25 hover:bg-white/[0.055]">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="text-xs uppercase text-slate-500">{item.label}</span>
                      <Icon className="h-5 w-5 text-emerald-100/80" />
                    </div>
                    <h3 className="text-xl font-semibold leading-snug text-white">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-400">{item.copy}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="solution" className="border-b border-white/10 px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase text-emerald-200/70">The Solution</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                A centralized agricultural intelligence platform.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-400">
                AGROGUIA.AI collects farmer context once, turns it into a structured advisory packet, renders it as operational dashboard modules, and stores the history so decisions compound over time.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {solutionModules.map((module) => (
                  <span key={module} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-slate-300">
                    {module}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-500">Reasoning pipeline</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Context to decision</h3>
                </div>
                <Gauge className="h-5 w-5 text-emerald-200" />
              </div>
              {([
                ['Farmer profile', 'land, soil, crop, budget, language', Database],
                ['OpenRouter reasoner', 'multi-module synthesis', BrainCircuit],
                ['Schema enforcement', 'defaults merged for UI stability', Fingerprint],
                ['Dashboard intelligence', 'actions, history, voice, planning', LineChart],
              ] as IconListItem[]).map(([title, copy, StepIcon], index) => {
                return (
                  <div key={title} className="relative pl-10">
                    {index < 3 && <span className="absolute left-[15px] top-9 h-9 w-px bg-white/10" />}
                    <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/25 text-emerald-100">
                      <StepIcon className="h-4 w-4" />
                    </span>
                    <div className="pb-6">
                      <h4 className="text-sm font-semibold text-white">{title}</h4>
                      <p className="mt-1 text-xs text-slate-500">{copy}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#091410] px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase text-emerald-200/70">How It Works</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">From profile to farm operating rhythm.</h2>
              <p className="mt-5 text-base leading-8 text-slate-400">The interface hides complexity while preserving a serious intelligence workflow underneath.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflow.map(([step, title, copy]) => (
                <article key={step} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <div className="mb-8 font-mono text-sm text-emerald-200">{step}</div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-white/10 px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-medium uppercase text-emerald-200/70">Core Features</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Ten modules, one decision surface.
                </h2>
                <p className="mt-6 text-base leading-8 text-slate-400">
                  The product connects the practical realities of farming: biology, climate, price, policy, credit, insurance, fraud risk, and voice-first access.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {(Object.keys(tabContent) as FeatureTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFeatureTab(tab)}
                      className={`rounded-md border px-3 py-2 text-xs font-medium capitalize transition-all ${
                        activeFeatureTab === tab
                          ? 'border-emerald-200 bg-emerald-200 text-slate-950'
                          : 'border-white/10 bg-white/[0.035] text-slate-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{activeTab.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-400">{activeTab.copy}</p>
                    <div className="mt-5 space-y-3">
                      {activeTab.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-center gap-2 text-sm text-slate-300">
                          <Check className="h-4 w-4 text-emerald-200" />
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                  {activeTab.panel}
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {featureGrid.map(([title, copy, FeatureIcon]) => {
                return (
                  <article key={title as string} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/[0.05]">
                    <FeatureIcon className="h-5 w-5 text-emerald-100" />
                    <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{copy}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="technology" className="border-b border-white/10 bg-[#091410] px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase text-emerald-200/70">AI & Technology</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Built like infrastructure, presented like a product.</h2>
              <p className="mt-5 text-base leading-8 text-slate-400">
                The current stack keeps secrets server-side, scopes data by authenticated user, and normalizes LLM output for reliable dashboard consumption.
              </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {techStack.map(([title, copy, TechIcon]) => {
                return (
                  <article key={title as string} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-black/25 text-emerald-100">
                      <TechIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{copy}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="vision" className="border-b border-white/10 px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase text-emerald-200/70">Impact & Vision</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                Farmers should operate with the same decision support systems high-performing industries take for granted.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                AGROGUIA.AI is AI for confidence: a rural intelligence layer that helps protect yield, stabilize income, and turn reactive firefighting into planned operations.
              </p>
            </div>
            <div className="grid gap-3">
              {([
                ['Reduce uncertainty', 'Translate unknowns into concrete weekly next actions.', ShieldCheck],
                ['Democratize expertise', 'Make agronomy, finance, and policy intelligence accessible.', Landmark],
                ['Compound decisions', 'Store advisory history so planning improves across seasons.', ReceiptText],
              ] as IconListItem[]).map(([title, copy, VisionIcon]) => {
                return (
                  <div key={title as string} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                    <div className="flex items-start gap-4">
                      <VisionIcon className="mt-1 h-5 w-5 shrink-0 text-emerald-100" />
                      <div>
                        <h3 className="font-semibold text-white">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-5xl rounded-lg border border-emerald-300/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(255,255,255,0.04)_45%,rgba(45,212,191,0.12))] p-8 text-center sm:p-12">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-md border border-emerald-200/30 bg-emerald-200/10 text-emerald-100">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Start building your AI farm intelligence system.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Create your profile, generate your first structured advisory, and open the dashboard where crop, risk, finance, and voice intelligence work together.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={onGetStarted} size="lg" className="h-12 rounded-md bg-emerald-200 px-6 font-semibold text-slate-950 hover:bg-white">
                Generate Your Smart Farming Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={onLoginClick} size="lg" variant="outline" className="h-12 rounded-md border-white/15 bg-black/20 px-6 text-white hover:bg-white/10 hover:text-white">
                Sign In
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-slate-500 sm:px-6">
        <p>© 2026 AGROGUIA.AI Intelligence Layer. Built for OpenAI x Outskill Hackathon.</p>
        <p className="mx-auto mt-3 max-w-2xl leading-6">
          Advisory outputs support planning and should be verified with local agronomists, official scheme offices, and current field conditions before action.
        </p>
      </footer>
    </div>
  )
}
