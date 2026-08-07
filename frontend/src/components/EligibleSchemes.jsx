import React, { useState } from 'react';
import { Award, CheckCircle, ExternalLink, GitBranch, ArrowRight, UserCheck, AlertTriangle, Search, Filter } from 'lucide-react';
import { translations } from '../data/translations';

export default function EligibleSchemes({ eligibleList, ineligibleList, profile, onSelectScheme, onViewIneligible, onEditProfile, language }) {
  const t = translations[language] || translations.EN;
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = eligibleList.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scheme.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterCategory === 'All') return matchesSearch;
    if (filterCategory === 'Central') return matchesSearch && scheme.govtLevel.includes('Central');
    if (filterCategory === 'State') return matchesSearch && !scheme.govtLevel.includes('Central');
    if (filterCategory === 'Education') return matchesSearch && (scheme.category.includes('Education') || scheme.category.includes('Scholarship'));
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto pt-4 pb-16 px-4 space-y-6">
      
      {/* Profile Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-on-surface">
          <div className="flex items-center gap-1.5 font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
            <UserCheck className="w-4 h-4 text-primary" /> Active Profile
          </div>
          <span className="bg-surface-container-high px-2.5 py-1 rounded-md">Age: {profile.age} yrs</span>
          <span className="bg-surface-container-high px-2.5 py-1 rounded-md">State: {profile.state}</span>
          <span className="bg-surface-container-high px-2.5 py-1 rounded-md">Income: ₹{Number(profile.income).toLocaleString('en-IN')}</span>
          <span className="bg-surface-container-high px-2.5 py-1 rounded-md capitalize">Category: {profile.category}</span>
        </div>

        <button
          onClick={onEditProfile}
          className="text-xs font-bold text-primary hover:text-primary-container border border-primary/30 px-3.5 py-1.5 rounded-lg hover:bg-primary/5 transition-all"
        >
          {t.editProfile}
        </button>
      </div>

      {/* Main Title & Ineligible Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            {t.scoredTitle}
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            {t.scoredSubtitle} ({eligibleList.length} {t.matchedSchemesFound})
          </p>
        </div>

        {ineligibleList.length > 0 && (
          <button
            onClick={onViewIneligible}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 rounded-xl font-bold text-xs hover:bg-amber-100 transition-all cursor-pointer shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{t.viewIneligible} ({ineligibleList.length})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Central', 'State', 'Education'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/60 hover:bg-surface-container'
              }`}
            >
              {cat === 'All' ? 'All Schemes' : `${cat} Schemes`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scheme name or benefit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="space-y-5">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
          >
            {/* Top Info Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {scheme.govtLevel}
                  </span>
                  <span className="text-xs font-medium text-on-surface-variant">
                    {scheme.ministry}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-on-surface">{scheme.name}</h2>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl font-extrabold text-sm shadow-sm">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{scheme.matchScore || 95}% {t.matchScore}</span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              {scheme.shortDesc}
            </p>

            {/* Financial Benefit highlight box */}
            <div className="bg-surface-container-low/60 border border-outline-variant/40 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-outline uppercase text-[10px] font-bold tracking-wider block">Key Benefit Amount</span>
                <span className="font-extrabold text-primary text-sm">{scheme.benefitAmount}</span>
              </div>
              <div>
                <span className="text-outline uppercase text-[10px] font-bold tracking-wider block">Target Beneficiaries</span>
                <span className="font-semibold text-on-surface">{scheme.targetGroup}</span>
              </div>
            </div>

            {/* Why You Qualify Bullet list */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">{t.whyQualify}:</span>
              <ul className="space-y-1">
                {scheme.whyQualify.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/40">
              <button
                onClick={() => onSelectScheme(scheme)}
                className="py-2.5 px-4 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <GitBranch className="w-4 h-4 text-saffron" />
                <span>{t.viewFlowchart}</span>
              </button>

              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-surface hover:bg-surface-container text-primary font-bold text-xs rounded-xl border border-outline-variant flex items-center gap-1.5 transition-all"
              >
                <span>{t.officialPortal}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
