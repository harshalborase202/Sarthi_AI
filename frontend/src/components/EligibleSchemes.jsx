import React, { useState } from 'react';
import { Award, CheckCircle, ExternalLink, GitBranch, ArrowRight, UserCheck, AlertTriangle, Search, Filter, X } from 'lucide-react';
import { translations } from '../data/translations';

export default function EligibleSchemes({ eligibleList, ineligibleList, profile, onSelectScheme, onViewIneligible, onEditProfile, language }) {
  const t = translations[language] || translations.EN;
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = eligibleList.filter(scheme => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
                          scheme.name.toLowerCase().includes(query) || 
                          scheme.category.toLowerCase().includes(query) ||
                          (scheme.benefits && scheme.benefits.toLowerCase().includes(query)) ||
                          (scheme.description && scheme.description.toLowerCase().includes(query));
    if (filterCategory === 'All') return matchesSearch;
    if (filterCategory === 'Central') return matchesSearch && scheme.govtLevel.includes('Central');
    if (filterCategory === 'State') return matchesSearch && !scheme.govtLevel.includes('Central');
    if (filterCategory === 'Education') return matchesSearch && (scheme.category.includes('Education') || scheme.category.includes('Scholarship'));
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto pt-4 pb-20 px-4 space-y-6">
      
      {/* Active Citizen Profile Summary Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-on-surface">
          <div className="flex items-center gap-1.5 font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
            <UserCheck className="w-4 h-4 text-primary" /> Active Profile
          </div>
          <span className="bg-surface-container-high px-2.5 py-1 rounded-md font-bold">Age: {profile.age} yrs</span>
          <span className="bg-surface-container-high px-2.5 py-1 rounded-md font-bold">State: {profile.state}</span>
          <span className="bg-surface-container-high px-2.5 py-1 rounded-md font-bold">Income: ₹{Number(profile.income).toLocaleString('en-IN')}</span>
          <span className="bg-surface-container-high px-2.5 py-1 rounded-md font-bold capitalize">Category: {profile.category}</span>
        </div>

        <button
          onClick={onEditProfile}
          className="text-xs font-bold text-primary hover:text-primary-container border border-primary/30 px-3.5 py-1.5 rounded-lg hover:bg-primary/5 transition-all cursor-pointer"
        >
          {t.editProfile}
        </button>
      </div>

      {/* Main Title & Ineligible Schemes Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            {t.scoredTitle}
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 font-medium">
            {t.scoredSubtitle} ({eligibleList.length} {t.matchedSchemesFound})
          </p>
        </div>

        {ineligibleList.length > 0 && (
          <button
            onClick={onViewIneligible}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 rounded-xl font-bold text-xs hover:bg-amber-100 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{t.viewIneligible} ({ineligibleList.length})</span>
          </button>
        )}
      </div>

      {/* User-Centric Search Bar (Full Width & Prominent) */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-3 shadow-sm space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by scheme name, benefit, or keyword (e.g. scholarship, loan, farmer, 10 lakh)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs md:text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-container"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills directly integrated below search bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-outline-variant/30">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {['All', 'Central', 'State', 'Education'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface text-on-surface-variant border border-outline-variant/60 hover:bg-surface-container'
                }`}
              >
                {cat === 'All' ? 'All Schemes' : `${cat} Schemes`}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-bold text-on-surface-variant">
            Showing {filteredSchemes.length} of {eligibleList.length} schemes
          </span>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="space-y-5">
        {filteredSchemes.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 text-center space-y-2">
            <Search className="w-8 h-8 text-outline mx-auto" />
            <p className="text-sm font-bold text-on-surface">No schemes found matching "{searchQuery}"</p>
            <p className="text-xs text-on-surface-variant">Try adjusting your search terms or selecting 'All Schemes'.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterCategory('All'); }}
              className="mt-2 text-xs font-bold text-primary hover:underline"
            >
              Clear filters & search
            </button>
          </div>
        ) : (
          filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/40 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {scheme.govtLevel}
                    </span>
                    <span className="text-xs text-on-surface-variant font-semibold">
                      {scheme.ministry || scheme.category}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-on-surface">
                    {scheme.name}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-black shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{scheme.matchScore || '98%'} Match</span>
                </div>
              </div>

              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                {scheme.description}
              </p>

              {/* Benefits & Target Beneficiaries Box */}
              <div className="bg-surface rounded-xl p-4 border border-outline-variant/40 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Key Benefit Amount</span>
                  <span className="font-extrabold text-primary text-sm">{scheme.benefits || 'Up to ₹10.0 Lakh Loan (Interest Subsidy)'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Target Beneficiaries</span>
                  <span className="font-bold text-on-surface">{scheme.targetBeneficiaries || 'Students in Higher Education'}</span>
                </div>
              </div>

              {/* Reasoning Summary */}
              {scheme.whyQualify && scheme.whyQualify.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider block">Why You Qualify:</span>
                  <ul className="space-y-1">
                    {scheme.whyQualify.map((reason, idx) => (
                      <li key={idx} className="text-xs font-semibold text-on-surface flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant/40">
                <button
                  onClick={() => onSelectScheme(scheme)}
                  className="py-2.5 px-5 bg-primary hover:bg-primary-container text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Decision Logic & Checklist</span>
                  <ArrowRight className="w-4 h-4 text-saffron" />
                </button>

                {scheme.officialUrl && (
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 hover:underline"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
