'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FiArrowRight, 
  FiCpu, 
  FiAlertTriangle, 
  FiTrendingUp, 
  FiDatabase, 
  FiShield, 
  FiPhoneCall, 
  FiZap, 
  FiLayers, 
  FiCheck, 
  FiCompass, 
  FiActivity, 
  FiUsers, 
  FiTrendingDown,
  FiFileText
} from 'react-icons/fi'

interface LandingPageProps {
  onGetStarted: () => void
  onLoginClick: () => void
}

export default function LandingPage({ onGetStarted, onLoginClick }: LandingPageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'advisory' | 'finance' | 'voice' | 'risk'>('advisory')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans overflow-x-hidden">
      {/* Background Decorative Neural Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Glow Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            AG
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            AGROGUIA.AI
          </span>
          <Badge variant="outline" className="hidden sm:inline-flex border-emerald-500/30 text-emerald-400 bg-emerald-950/30 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
            v1.0 Live
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onLoginClick} 
            className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            Sign In
          </button>
          <Button 
            onClick={onGetStarted}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300"
          >
            Launch Console
          </Button>
        </div>
      </header>

      {/* Section 1: Hero Section */}
      <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs font-semibold mb-6">
          <FiZap className="w-3.5 h-3.5" />
          <span>Intelligent Agriculture Decision Engine</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          The Operating System for{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent bg-[size:200%]">
            Intelligent Farming
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed mb-10">
          Empowering small and mid-sized farms to eliminate uncertainty. AGROGUIA.AI unifies agronomic recommendations, localized risk forecasting, and financial planning into one cohesive intelligence layer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16 z-10">
          <Button 
            size="lg"
            onClick={onGetStarted}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 h-12 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all"
          >
            Generate AI Farm Dashboard <FiArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={onGetStarted}
            className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white px-8 h-12"
          >
            Quick Sandbox
          </Button>
        </div>

        {/* Dashboard Preview Element */}
        <div className="w-full max-w-5xl rounded-xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-sm p-4 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-4 md:mb-6">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-855" style={{ backgroundColor: '#ef4444' }} />
              <span className="w-3 h-3 rounded-full bg-slate-855" style={{ backgroundColor: '#eab308' }} />
              <span className="w-3 h-3 rounded-full bg-slate-855" style={{ backgroundColor: '#22c55e' }} />
            </div>
            <div className="text-xs text-slate-500 font-mono bg-slate-950 px-4 py-1 rounded-md border border-slate-900">
              console.agroguia.ai/dashboard
            </div>
            <div className="w-12 h-2 bg-slate-800 rounded" />
          </div>

          {/* Interactive Mock Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            <div className="lg:col-span-2 space-y-6">
              {/* Financial Dashboard */}
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-900">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Financial Forecast (Soybean)</span>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] bg-emerald-950/20">Optimized</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500">Expected Yield Value</p>
                    <p className="text-base md:text-xl font-bold text-white">Rs. 48,000</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Optimized Cost Plan</p>
                    <p className="text-base md:text-xl font-bold text-teal-400">Rs. 12,000</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Net Estimated Profit</p>
                    <p className="text-base md:text-xl font-bold text-emerald-400">Rs. 40,000</p>
                  </div>
                </div>
              </div>

              {/* Action Modules Tabs Previews */}
              <div className="space-y-3">
                <div className="flex border-b border-slate-900 text-xs">
                  {['Weather Alerts', 'Pest Risk Control', 'Financial Planning'].map((tab, idx) => (
                    <button 
                      key={tab} 
                      className={`pb-2 px-3 border-b-2 font-medium transition-all ${idx === 0 ? 'border-emerald-500 text-emerald-400 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 space-y-3">
                  <div className="flex items-center gap-3 border-l-2 border-emerald-500 pl-3">
                    <div>
                      <h4 className="text-xs font-semibold text-white">Weather Pre-empt Spray Window</h4>
                      <p className="text-[11px] text-slate-400">18mm precipitation predicted on Day 47. Schedule foliar spray 24h prior.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-l-2 border-red-500 pl-3">
                    <div>
                      <h4 className="text-xs font-semibold text-white">Fungal Alert: Yellow Mosaic Virus Risk</h4>
                      <p className="text-[11px] text-slate-400">Humidity thresholds hit 84%. Active recommendation: Spray Mancozeb (600g/acre).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Onboarding Summary */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400">Farmer Context Matrix</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span className="text-slate-500">Location</span>
                    <span className="text-slate-300">Bijapur, Karnataka</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span className="text-slate-500">Crop Focus</span>
                    <span className="text-slate-300">Soybean (Flowering)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span className="text-slate-500">Soil Condition</span>
                    <span className="text-slate-300">Black Cotton Soil</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span className="text-slate-500">Risk Profile</span>
                    <span className="text-slate-300 text-yellow-500 font-semibold">Medium</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-md">
                <div className="flex items-center gap-2 mb-1.5">
                  <FiPhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">Voice Synthesis Active</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  "Spray Mancozeb at 6 AM tomorrow to mitigate fungal risk prior to rain."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Problem */}
      <section className="px-6 py-20 border-t border-slate-900 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold mb-3">The Problem</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Farming under the stress of high uncertainty
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Every week, farmers make complex, high-risk calls. Without localized, contextual intelligence, they operate in the dark, leading to expensive mistakes and missed opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FiAlertTriangle className="w-6 h-6 text-red-500" />,
                title: "Agronomic Guesswork",
                desc: "Applying sprays too early wastes costly inputs. Applying too late allows pest disease to wipe out seasonal yield entirely."
              },
              {
                icon: <FiTrendingDown className="w-6 h-6 text-orange-500" />,
                title: "Financial Leakage",
                desc: "Lack of comparative awareness causes farmers to secure predatory credit rates from local lenders instead of low-interest schemes."
              },
              {
                icon: <FiCompass className="w-6 h-6 text-yellow-500" />,
                title: "Subsidies Unclaimed",
                desc: "Complex guidelines and missed deadlines block eligible families from receiving vital government support funds annually."
              },
              {
                icon: <FiLayers className="w-6 h-6 text-slate-500" />,
                title: "Fragmented Platforms",
                desc: "Farming apps force users to cross-reference multiple disjointed sources for weather, markets, and scheme registration rules."
              }
            ].map((prob, i) => (
              <Card key={i} className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="p-2 w-fit rounded-lg bg-slate-950 border border-slate-800">
                    {prob.icon}
                  </div>
                  <h4 className="text-base font-bold text-white">{prob.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{prob.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Solution */}
      <section className="px-6 py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold mb-3">The Solution</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              A Unified Intelligent Layer for Agronomy and Finance
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              AGROGUIA.AI acts as a cohesive farm co-pilot. Instead of generic suggestions, our system parses your unique soil type, irrigation structure, crop maturity timeline, and financial buffers to formulate a structured operational blueprint.
            </p>
            
            <div className="space-y-4">
              {[
                { title: "Context-Aware Decisions", text: "Evaluating crop stage and localized constraints dynamically." },
                { title: "Integrated Agronomy & Finance", text: "Aligning chemicals and schedules with your input budget limits." },
                { title: "Longitudinal Memory", text: "Saving every generated plan to build an audit trail of farm outcomes." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative p-6 rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-md">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Advisory Engine Processing Graph</h4>
            
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2"><FiDatabase className="w-4 h-4 text-emerald-400" /> Farmer Context Packet</span>
                <span className="text-emerald-400 font-mono">100% Parsed</span>
              </div>
              
              <div className="flex justify-center my-2 text-slate-600">
                <div className="h-6 w-px bg-slate-850" style={{ width: '1px', height: '24px', backgroundColor: '#334155' }} />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2"><FiCpu className="w-4 h-4 text-teal-400" /> OpenRouter Reasoner Completions</span>
                <span className="text-teal-400 font-mono">Synthesizing...</span>
              </div>

              <div className="flex justify-center my-2 text-slate-600">
                <div className="h-6 w-px bg-slate-850" style={{ width: '1px', height: '24px', backgroundColor: '#334155' }} />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2"><FiLayers className="w-4 h-4 text-emerald-400" /> Enforcement & Schema Alignment</span>
                <span className="text-emerald-400 font-mono">Defaults Merged</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="px-6 py-20 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold mb-3">Process Workflow</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Four steps to intelligent control</h3>
            <p className="text-slate-400 leading-relaxed">
              We convert technical setup into operational output in under three minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection line for desktops */}
            <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-px bg-slate-850 pointer-events-none" style={{ backgroundColor: '#1e293b' }} />
            
            {[
              { step: "01", title: "Create Identity", desc: "Set up your secure, private profile with standalone credentials." },
              { step: "02", title: "Define Profile Matrix", desc: "Input location, current crop, growth stages, soil type, and input budget." },
              { step: "03", title: "Synthesize Intel", desc: "Our engine hits OpenRouter to structure a contextual crop blueprint." },
              { step: "04", title: "Execute & Manage", desc: "Interact via dashboard, track historical recommendations, and use voice logs." }
            ].map((item, i) => (
              <div key={i} className="relative space-y-4">
                <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg relative z-10">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Core Features */}
      <section className="px-6 py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold mb-3">Core Modules</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">A complete agricultural intelligence matrix</h3>
            <p className="text-slate-400 leading-relaxed">
              AGROGUIA.AI brings critical agricultural facets together, running them through structured rules.
            </p>
          </div>

          {/* Interactive Feature selector */}
          <div className="flex justify-center flex-wrap gap-2 mb-12">
            {[
              { id: 'advisory', label: 'AI Advisory Engine' },
              { id: 'finance', label: 'Financial Arbitrage' },
              { id: 'voice', label: 'Voice Accessibility' },
              { id: 'risk', label: 'Fraud & Security' }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeFeatureTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveFeatureTab(tab.id as any)}
                className={`text-xs ${activeFeatureTab === tab.id ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-600' : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:bg-slate-900 hover:text-white'}`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-md">
            {activeFeatureTab === 'advisory' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Advisory</Badge>
                  <h3 className="text-2xl font-bold text-white">Hyper-Contextual Crop Blueprinting</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By parsing active farmer details, growth stage timing, soil constraints, and pesticide parameters, our engine creates specific advisories containing targeted actions instead of generic crop suggestions.
                  </p>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Grounded in specific sowing date calendars</div>
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Immediate pest detection treatment windows</div>
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Fertilizer quantities calibrated by soil capacity</div>
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 text-xs font-mono space-y-2 max-h-56 overflow-y-auto">
                  <p className="text-slate-500">// AI advisory blueprint result</p>
                  <p className="text-emerald-400">"pest_advisory": &#123;</p>
                  <p className="pl-4 text-slate-350">"primary_disease_name": "Yellow Mosaic Virus",</p>
                  <p className="pl-4 text-slate-350">"action_window_hours": 48,</p>
                  <p className="pl-4 text-slate-350">"immediate_action": "Spray Mancozeb 600g/acre",</p>
                  <p className="pl-4 text-slate-350">"overall_risk": "High"</p>
                  <p className="text-emerald-400">&#125;</p>
                </div>
              </div>
            )}

            {activeFeatureTab === 'finance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Finance</Badge>
                  <h3 className="text-2xl font-bold text-white">Cost Reduction & Subsidies Discovery</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Access transparent market analytics. AGROGUIA.AI continuously audits eligible government subsidies, monitors crop insurance payout steps, and compares predatory NBFC rates against low-interest options (KCC).
                  </p>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> KCC vs NBFC comparative pricing calculators</div>
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Mandi price variance comparison & transportation cost offsets</div>
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Proactive subsidy deadline tracking alerts</div>
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 text-xs space-y-3">
                  <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase">
                    <span>Lender Comparison Matrix</span>
                    <span className="text-red-400 font-mono font-semibold">Interest Gap Alert</span>
                  </div>
                  <div className="p-3 bg-red-950/10 border border-red-950/30 rounded text-slate-355">
                    <p className="font-semibold text-white">Local NBFC: 18% Rate</p>
                    <p className="text-[11px] text-slate-450">Total cost on Rs. 1L: Rs. 1,10,400 over 1yr</p>
                  </div>
                  <div className="p-3 bg-emerald-950/10 border border-emerald-900/30 rounded text-slate-355">
                    <p className="font-semibold text-emerald-400">SBI KCC: 4% Subsidized Rate</p>
                    <p className="text-[11px] text-slate-400">Total cost on Rs. 1L: Rs. 1,04,000. Saving Rs. 6,400/yr</p>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'voice' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Voice Accessibility</Badge>
                  <h3 className="text-2xl font-bold text-white">Voice-First Interaction Blueprint</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed for field conditions where writing is impractical. Play text summaries in regional languages instantly or talk directly to the advisor layer using voice stream interfaces.
                  </p>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> TTS readout for individual modules</div>
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Multi-language translations including Hindi, Kannada, Telugu</div>
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Conversational voice streams for immediate query response</div>
                  </div>
                </div>
                <div className="bg-slate-950 p-6 rounded-lg border border-slate-900 flex flex-col items-center justify-center space-y-4 min-h-56">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                    <FiPhoneCall className="w-5 h-5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-white">Voice Streaming Active</p>
                    <p className="text-[11px] text-slate-400">Transcribing query and generating response summary...</p>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'risk' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Security & Risk</Badge>
                  <h3 className="text-2xl font-bold text-white">Digital safety and fraud avoidance</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Protecting farmers from rising digital scams. The engine incorporates security checks that flag suspicious messages, OTP requests, and false subsidy application portals.
                  </p>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Digital safety score checks based on device parameters</div>
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Simulation matrices for phishing attempts</div>
                    <div className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Interactive safety guidelines for digital transactions</div>
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold font-mono text-[10px]">Phishing Simulation Check</span>
                    <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px]">Scam Flagged</Badge>
                  </div>
                  <div className="p-3 bg-red-950/10 border border-red-950/30 rounded text-[11px] space-y-2 text-slate-300">
                    <p className="italic text-slate-400">"Your PM-KISAN subsidy is suspended. Click below to verify your Aadhaar and enter OTP."</p>
                    <p className="text-red-400 font-semibold">// Safety Verdict: Threat. Government services do not ask for OTP verification.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 6: AI & Technology */}
      <section className="px-6 py-20 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold mb-3">Technology Stack</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Production-grade agricultural infrastructure</h3>
            <p className="text-slate-400 leading-relaxed">
              Engineered with reliability and modularity as design priorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiCpu className="w-6 h-6 text-emerald-400" />,
                title: "OpenRouter Pipeline",
                desc: "Harnessing open-source LLMs (Qwen-2.5-72B-Instruct) for reasoning operations, running prompts against dynamic inputs under strict JSON compliance."
              },
              {
                icon: <FiDatabase className="w-6 h-6 text-teal-400" />,
                title: "MongoDB Atlas State",
                desc: "High-performance multi-tenant persistence layer housing profile properties, transaction matrices, and comprehensive advisory histories."
              },
              {
                icon: <FiLayers className="w-6 h-6 text-indigo-400" />,
                title: "Next.js App Server",
                desc: "Utilizing Next.js 14 API routers and Server components, shielding provider secrets while minimizing browser payload latencies."
              }
            ].map((tech, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 transition-all space-y-4">
                <div className="p-2 w-fit rounded-lg bg-slate-950 border border-slate-850">
                  {tech.icon}
                </div>
                <h4 className="text-lg font-bold text-white">{tech.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Impact & Vision */}
      <section className="px-6 py-24 border-t border-slate-900 relative">
        {/* Visual decoration overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">Vision & Impact</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Democratizing agricultural intelligence layer-by-layer
          </h3>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed font-normal">
            Good farm decisions shouldn't be a privilege limited to large scale corporate growers with specialized agronomist budgets. Our mission is to put the power of professional crop planning, risk management, and financial optimization directly in the pockets of everyday farmers globally.
          </p>
          <div className="flex justify-center gap-12 pt-6 flex-wrap">
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-extrabold text-white">Rs. 49k+</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Average Subsidies Identified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-extrabold text-white">48 hrs</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Pest Mitigation Window</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-extrabold text-white">100%</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Data Ownership Scoped</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="px-6 py-20 border-t border-slate-900 bg-slate-950/80">
        <div className="max-w-5xl mx-auto p-8 md:p-12 rounded-2xl border border-slate-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none" />
          
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            Ready to upgrade your farm intelligence?
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Establish your profile matrix, run localized risk optimizations, and plan cost schedules today.
          </p>
          <div className="pt-4">
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 h-12 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all"
            >
              Start Your Intelligent Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-900 text-center text-xs text-slate-500 space-y-4">
        <p>© 2026 AGROGUIA.AI Intelligence Layer. Designed for OpenAI × Outskill Hackathon.</p>
        <p className="max-w-md mx-auto text-[10px] text-slate-605 leading-relaxed">
          Disclaimer: Recommendations generated by the AI Advisory engine are for planning support. Verify active chemical configurations with local agronomists before application.
        </p>
      </footer>
    </div>
  )
}
