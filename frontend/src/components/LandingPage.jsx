import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Globe, Brain, CheckCircle2, FileText, Sparkles, ArrowRight, Building2, Landmark, ChevronRight, Award, GraduationCap, Sprout, HeartHandshake, Coins, Plus, Minus, HelpCircle } from 'lucide-react';
import { translations } from '../data/translations';

export default function LandingPage({ language }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.EN;

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const FAQS = [
    {
      q: "How does SarthiAI calculate scheme match percentages?",
      a: "SarthiAI combines hard policy rules (age limits, income caps, domicile restrictions) with soft AI match scores to rank schemes transparently, showing you exact field-by-field rationale."
    },
    {
      q: "Is my personal information stored on government or cloud servers?",
      a: "No. SarthiAI operates on a strict Data Sovereignty principle. All profile inputs and document OCR scans are evaluated locally/ephemerally. Zero personal data is saved unless you explicitly request memory retention in the Memory Center."
    },
    {
      q: "What makes SarthiAI different from black-box chatbots?",
      a: "SarthiAI functions like Google Maps for Government Schemes—rendering interactive decision flowcharts, pinpointing exact failed rules if you don't qualify, and tracking required documents before you apply."
    },
    {
      q: "Are the scheme application links official?",
      a: "Yes, 100%. All application buttons redirect directly to verified Indian Government portal domains (.gov.in / .nic.in), such as myscheme.gov.in and scholarships.gov.in."
    }
  ];

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F6F9] text-on-background select-none font-sans pb-24 relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      
      {/* Official Top Announcement Strip (Tricolor Accent) */}
      <div className="bg-[#0A1A2F] text-white text-[11px] py-2 px-4 flex justify-between items-center border-b-2 border-saffron shadow-sm relative z-30">
        <div className="flex items-center gap-3 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-1 bg-saffron/20 text-saffron px-2.5 py-0.5 rounded font-black">
            <span>🇮🇳</span> भारत सरकार
          </div>
          <span className="opacity-40">|</span>
          <span className="font-semibold text-slate-200">Government of India</span>
          <span className="hidden md:inline opacity-40">|</span>
          <span className="hidden md:inline text-slate-300">इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय | Ministry of Electronics & IT</span>
          
          <div className="ml-auto hidden lg:flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Portal Live</span>
          </div>
        </div>
      </div>

      {/* Official Government Header Banner */}
      <header className="bg-white/95 backdrop-blur-md border-b border-outline-variant/60 shadow-sm py-4 px-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Ashoka Pillar Emblem & Portal Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md border-2 border-saffron">
              <ShieldCheck className="w-7 h-7 text-saffron" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-black text-primary tracking-tight">SarthiAI</span>
                <span className="bg-saffron/15 text-saffron text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-saffron/30">
                  Official Portal
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium">National AI Scheme Navigator & Decision Transparency Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/20">
              <Landmark className="w-4 h-4 text-saffron" />
              <span>SarthiAI Initiative</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/get-started')}
              className="py-2.5 px-5 bg-primary hover:bg-primary-container text-white font-extrabold text-xs rounded-xl shadow-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Enter SarthiAI</span>
              <ArrowRight className="w-3.5 h-3.5 text-saffron" />
            </motion.button>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-12">
        
        {/* Main Visual Hero Section with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-outline-variant/60 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden space-y-8"
        >
          {/* Top Navy/Saffron Accent Line */}
          <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-primary via-primary-container to-saffron" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <h1 className="text-3xl md:text-5xl font-black text-primary leading-tight tracking-tight">
                Discover every government scheme you qualify for — <span className="text-saffron">transparently & instantly.</span>
              </h1>

              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed max-w-xl">
                SarthiAI acts like Google Maps for Indian Government Schemes—visualizing exact policy rule paths, AI match confidence scores, and document readiness checklists before applying on official portal domains (.gov.in).
              </p>

              {/* Single Prominent Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/get-started')}
                  className="w-full sm:w-auto py-4 px-10 bg-primary hover:bg-primary-container text-white font-black text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 inline-flex items-center justify-center gap-3 cursor-pointer group ring-4 ring-saffron/20"
                >
                  <span>Enter SarthiAI →</span>
                  <ArrowRight className="w-5 h-5 text-saffron group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No login required to search</span>
                </div>
              </div>
            </div>

            {/* Right Rich Visual Hero Card with Floating Animations */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="/images/hero_banner.png"
                  alt="Diverse Indian Citizens using SarthiAI digital government services"
                  className="w-full h-80 lg:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

                {/* Floating Glassmorphism Badges with Motion */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-white/60 p-3 rounded-2xl shadow-lg flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    96%
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-outline block">AI Policy Match</span>
                    <span className="text-xs font-extrabold text-primary">PM Vidyalaxmi</span>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xl space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-primary flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-saffron" /> SarthiAI Verified
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Live Processing
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-medium">
                    Cross-referencing Maharashtra & Central schemes...
                  </p>
                </motion.div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Live Stat Counter Strip (4 Animated Badges) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white border border-outline-variant/60 rounded-2xl p-5 text-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-black text-primary">500+</div>
            <div className="text-xs font-bold text-on-surface">Central & State Schemes</div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white border border-outline-variant/60 rounded-2xl p-5 text-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-black text-emerald-600">100%</div>
            <div className="text-xs font-bold text-on-surface">Data Sovereignty & Privacy</div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white border border-outline-variant/60 rounded-2xl p-5 text-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-black text-saffron">3 Languages</div>
            <div className="text-xs font-bold text-on-surface">English, Hindi & Marathi</div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white border border-outline-variant/60 rounded-2xl p-5 text-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-black text-primary">Explainable</div>
            <div className="text-xs font-bold text-on-surface">Decision Tree Flowcharts</div>
          </motion.div>
        </motion.div>

        {/* Interactive UI Preview Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-outline-variant/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/40 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-saffron tracking-wider block">Visual Interface Preview</span>
              <h2 className="text-xl font-black text-primary">Transparent Scheme Discovery & OCR Verification</h2>
            </div>
            <span className="text-xs font-bold text-outline bg-surface px-3 py-1 rounded-full border border-outline-variant/40">
              Zero Black-Box Logic
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* UI Mockup Image */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border-2 border-outline-variant/60 shadow-lg bg-slate-900 group">
              <img
                src="/images/scheme_preview.png"
                alt="SarthiAI decision tree flowchart and document checklist UI"
                className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-500"
              />
            </div>

            {/* Explanatory Bullet Cards */}
            <div className="lg:col-span-5 space-y-4">
              <motion.div whileHover={{ x: 4 }} className="p-4 bg-surface rounded-2xl border border-outline-variant/40 space-y-1 transition-all">
                <div className="font-bold text-sm text-primary flex items-center gap-2">
                  <Brain className="w-4 h-4 text-saffron" /> Live AI Reasoning Stream
                </div>
                <p className="text-xs text-on-surface-variant">
                  Watch SarthiAI process rules in real-time with confidence levels and policy evaluation logs.
                </p>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} className="p-4 bg-surface rounded-2xl border border-outline-variant/40 space-y-1 transition-all">
                <div className="font-bold text-sm text-primary flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> Document Readiness & OCR
                </div>
                <p className="text-xs text-on-surface-variant">
                  Scan Aadhaar, Income Certificates, or marksheets with serverless Gemini 2.5 OCR.
                </p>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} className="p-4 bg-surface rounded-2xl border border-outline-variant/40 space-y-1 transition-all">
                <div className="font-bold text-sm text-primary flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" /> Negotiated Memory Center
                </div>
                <p className="text-xs text-on-surface-variant">
                  You decide what data is remembered and for how long. Images are never saved.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Welfare Categories Overview Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-primary">Covered Welfare Departments</h2>
            <p className="text-xs text-on-surface-variant">Comprehensive coverage across key central & state departments.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.02 }} className="bg-white border border-outline-variant/60 rounded-2xl p-5 space-y-2 shadow-sm hover:border-primary transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5 text-saffron" />
              </div>
              <h3 className="font-bold text-sm text-on-surface">Education & Loans</h3>
              <p className="text-xs text-on-surface-variant">PM Vidyalaxmi, AICTE Pragati, MahaDBT Post-Matric scholarships.</p>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.02 }} className="bg-white border border-outline-variant/60 rounded-2xl p-5 space-y-2 shadow-sm hover:border-primary transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-on-surface">Agriculture & Farmers</h3>
              <p className="text-xs text-on-surface-variant">PM-KISAN Samman Nidhi, crop insurance & fertilizer subsidies.</p>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.02 }} className="bg-white border border-outline-variant/60 rounded-2xl p-5 space-y-2 shadow-sm hover:border-primary transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-on-surface">Women & Child Support</h3>
              <p className="text-xs text-on-surface-variant">Ladki Bahin Yojana, Sukanya Samriddhi, maternal assistance.</p>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.02 }} className="bg-white border border-outline-variant/60 rounded-2xl p-5 space-y-2 shadow-sm hover:border-primary transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-on-surface">Micro-Loans & Vendors</h3>
              <p className="text-xs text-on-surface-variant">PM SVANidhi collateral-free credit for urban self-employed.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive FAQ Accordion Section */}
        <div className="bg-white border border-outline-variant/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 justify-center">
            <HelpCircle className="w-5 h-5 text-saffron" />
            <h2 className="text-xl font-black text-primary">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-outline-variant/60 rounded-2xl overflow-hidden transition-all bg-surface"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-sm text-on-surface flex justify-between items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <Minus className="w-4 h-4 text-saffron shrink-0" /> : <Plus className="w-4 h-4 text-primary shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/30 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* High-Class CTA Launch Section */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-primary via-primary-container to-slate-900 text-white p-8 md:p-12 rounded-3xl text-center space-y-5 shadow-2xl relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-1.5 bg-saffron text-primary font-black text-xs px-3.5 py-1 rounded-full">
            <Sparkles className="w-4 h-4" /> Instant Citizen Scheme Discovery
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Ready to discover your scheme eligibility?</h2>
          <p className="text-xs md:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
            Take 2 minutes to enter your profile details and explore matched schemes with complete explainable AI decision paths.
          </p>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/get-started')}
              className="py-4 px-10 bg-saffron hover:bg-amber-400 text-primary font-black text-base rounded-2xl shadow-xl transition-all duration-200 inline-flex items-center gap-2 cursor-pointer group ring-4 ring-white/20"
            >
              <span>Enter SarthiAI →</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* Official Portal Footer Disclaimer */}
        <footer className="border-t border-outline-variant/60 pt-6 text-center text-xs text-on-surface-variant space-y-2">
          <p className="font-extrabold text-primary">
            SarthiAI is a guidance platform designed under the SarthiAI framework. All scheme applications redirect to official portal domains (.gov.in / .nic.in).
          </p>
          <p className="text-[11px] opacity-75">
            © 2026 SarthiAI • Government Scheme Navigator & Decision Transparency Portal
          </p>
        </footer>

      </main>
    </div>
  );
}
