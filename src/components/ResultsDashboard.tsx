import React, { useState } from 'react';
import { ShieldCheck, HeartPulse, GraduationCap, CheckCircle2, ChevronRight, AlertCircle, TrendingUp, Info } from 'lucide-react';
import clsx from 'clsx';

type ResultTab = 'matched' | 'why' | 'unqualified';

export const ResultsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResultTab>('matched');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Your Scheme Matches</h1>
        <p className="text-slate-600 mt-2">Based on your profile, we've found 3 strong matches and 2 schemes you might qualify for with changes.</p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl shadow-sm border border-slate-200 sticky top-16 z-30">
        <TabButton active={activeTab === 'matched'} onClick={() => setActiveTab('matched')} icon={<ShieldCheck size={18} />} label="Top Matches" badge="3" />
        <TabButton active={activeTab === 'why'} onClick={() => setActiveTab('why')} icon={<TrendingUp size={18} />} label="AI Insight" />
        <TabButton active={activeTab === 'unqualified'} onClick={() => setActiveTab('unqualified')} icon={<AlertCircle size={18} />} label="Other Options" badge="2" />
      </div>

      <div className="mt-6">
        {activeTab === 'matched' && <MatchedSchemesView />}
        {activeTab === 'why' && <AIInsightView />}
        {activeTab === 'unqualified' && <UnqualifiedSchemesView />}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: string }> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-300",
      active ? "bg-white text-primary-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
    )}
  >
    {icon} 
    <span className="hidden sm:inline">{label}</span>
    {badge && (
      <span className={clsx("px-1.5 py-0.5 rounded-full text-[10px] ml-1", active ? "bg-primary-100 text-primary-800" : "bg-slate-200 text-slate-600")}>
        {badge}
      </span>
    )}
  </button>
);

const MatchedSchemesView = () => (
  <div className="space-y-4 animate-in fade-in duration-300">
    <SchemeCard 
      title="Ayushman Bharat PM-JAY"
      category="Healthcare"
      icon={<HeartPulse size={24} className="text-rose-500" />}
      benefit="₹5 Lakhs health cover per family/year"
      matchScore={98}
      highlight
    />
    <SchemeCard 
      title="PM Awas Yojana (Urban)"
      category="Housing"
      icon={<ShieldCheck size={24} className="text-emerald-500" />}
      benefit="Up to ₹2.67 Lakhs interest subsidy"
      matchScore={89}
    />
    <SchemeCard 
      title="Post-Matric Scholarship"
      category="Education"
      icon={<GraduationCap size={24} className="text-indigo-500" />}
      benefit="Full tuition fee waiver"
      matchScore={85}
    />
  </div>
);

const SchemeCard: React.FC<{ title: string, category: string, icon: React.ReactNode, benefit: string, matchScore: number, highlight?: boolean }> = ({ title, category, icon, benefit, matchScore, highlight }) => (
  <div className={clsx(
    "bg-white rounded-2xl p-5 border transition-all hover:shadow-md",
    highlight ? "border-primary-300 ring-1 ring-primary-100 shadow-sm" : "border-slate-200"
  )}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          {icon}
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{category}</span>
          <h3 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">{title}</h3>
        </div>
      </div>
      <div className={clsx(
        "flex flex-col items-center justify-center px-3 py-1 rounded-lg border",
        highlight ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-600"
      )}>
        <span className="text-sm font-bold">{matchScore}%</span>
        <span className="text-[10px] font-semibold uppercase">Match</span>
      </div>
    </div>
    
    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 mb-4">
      <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
        <CheckCircle2 size={16} className="text-amber-500" /> {benefit}
      </p>
    </div>

    <button className={clsx(
      "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors",
      highlight ? "bg-primary-900 text-white hover:bg-primary-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    )}>
      View Details & Apply <ChevronRight size={18} />
    </button>
  </div>
);

const AIInsightView = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
    <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
      <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
        <TrendingUp size={24} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">Why did I get these results?</h3>
        <p className="text-sm text-slate-600 mt-1">SathiAI's transparency engine analyzed your profile against 400+ central and state schemes.</p>
      </div>
    </div>

    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      
      <InsightTrailItem 
        title="Income Threshold Cleared"
        desc="Your family income (₹1L-2.5L) falls below the EWS threshold of ₹8L, unlocking housing and health subsidies."
        status="pass"
      />
      <InsightTrailItem 
        title="State-Level Preference"
        desc="Being a resident of Maharashtra prioritized the state's specific healthcare add-ons over central baseline covers."
        status="pass"
        memoryBadge="From Memory"
      />
      <InsightTrailItem 
        title="Age & Education Alignment"
        desc="Age 35 and higher secondary education unlocked specific upskilling and credit-linked schemes."
        status="pass"
      />
    </div>
  </div>
);

const InsightTrailItem: React.FC<{ title: string, desc: string, status: 'pass', memoryBadge?: string }> = ({ title, desc, memoryBadge }) => (
  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
      <CheckCircle2 size={20} />
    </div>
    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
        {memoryBadge && (
          <span className="text-[9px] font-bold uppercase bg-primary-100 text-primary-700 px-2 py-0.5 rounded cursor-pointer hover:bg-primary-200 transition-colors">
            {memoryBadge}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const UnqualifiedSchemesView = () => (
  <div className="space-y-4 animate-in fade-in duration-300">
    
    <div className="bg-guidance-light border border-guidance-300 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <Info className="text-guidance mt-0.5" size={20} />
        <div>
          <h3 className="text-md font-bold text-guidance-dark">PM National Apprenticeship Promotion</h3>
          <p className="text-sm text-guidance-dark/80 mt-1">You exceed the maximum age limit of 30 years.</p>
        </div>
      </div>
      <div className="bg-white/60 p-3 rounded-xl border border-guidance-200">
        <p className="text-sm font-semibold text-slate-700 mb-2">Alternative Recommendation:</p>
        <button className="text-sm text-primary-700 font-bold hover:underline flex items-center gap-1">
          Explore Skill India PMKVY (No age bar) <ChevronRight size={16} />
        </button>
      </div>
    </div>

    <div className="bg-guidance-light border border-guidance-300 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <Info className="text-guidance mt-0.5" size={20} />
        <div>
          <h3 className="text-md font-bold text-guidance-dark">Stand Up India Loan</h3>
          <p className="text-sm text-guidance-dark/80 mt-1">Requires an SC/ST or Women entrepreneur profile.</p>
        </div>
      </div>
      <div className="bg-white/60 p-3 rounded-xl border border-guidance-200">
        <p className="text-sm font-semibold text-slate-700 mb-2">Alternative Recommendation:</p>
        <button className="text-sm text-primary-700 font-bold hover:underline flex items-center gap-1">
          Check MUDRA Tarun Scheme instead <ChevronRight size={16} />
        </button>
      </div>
    </div>

  </div>
);
