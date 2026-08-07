import React from 'react';
import { AlertCircle, ArrowLeft, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { translations } from '../data/translations';

export default function WhyNotEligible({ ineligibleList, eligibleList, onBack, onSelectScheme, language }) {
  const t = translations[language] || translations.EN;

  return (
    <div className="w-full max-w-5xl mx-auto pt-4 pb-16 px-4 space-y-6">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Eligible Schemes</span>
      </button>

      {/* Header */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          <h1 className="text-2xl font-extrabold text-on-surface">
            {t.whyNotEligibleTitle}
          </h1>
        </div>
        <p className="text-xs md:text-sm text-on-surface-variant">
          {t.whyNotEligibleSubtitle} (Showing {ineligibleList.length} non-matching schemes).
        </p>
      </div>

      {/* Non-Eligible Scheme Breakdown List */}
      <div className="space-y-6">
        {ineligibleList.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-outline-variant/40 pb-3">
              <div>
                <span className="text-[11px] font-bold text-error bg-error-container/50 px-2.5 py-0.5 rounded-full">
                  Did Not Qualify
                </span>
                <h2 className="text-xl font-bold text-on-surface mt-1">{scheme.name}</h2>
                <p className="text-xs text-on-surface-variant">{scheme.govtLevel} • {scheme.ministry}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-outline">Benefit Value</span>
                <div className="text-sm font-extrabold text-primary">{scheme.benefitAmount}</div>
              </div>
            </div>

            {/* Audit Table of Failed Criteria */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface font-bold border-b border-outline-variant/60">
                    <th className="py-2.5 px-3 rounded-l-lg">{t.failedRule}</th>
                    <th className="py-2.5 px-3">{t.actualValue}</th>
                    <th className="py-2.5 px-3">{t.requiredValue}</th>
                    <th className="py-2.5 px-3 rounded-r-lg">{t.difference}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-on-surface-variant">
                  {scheme.failedCriteria.map((fail, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-lowest/80">
                      <td className="py-3 px-3 font-bold text-error flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-error shrink-0" />
                        <span>{fail.ruleName}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-on-surface">{fail.userValue}</td>
                      <td className="py-3 px-3 font-medium">{fail.requiredValue}</td>
                      <td className="py-3 px-3 font-bold text-amber-700 bg-amber-50 rounded-md">{fail.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))}
      </div>

      {/* Recommended Alternatives */}
      {eligibleList.length > 0 && (
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-on-surface">{t.alternativeSchemes}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibleList.slice(0, 2).map((alt) => (
              <div
                key={alt.id}
                onClick={() => onSelectScheme(alt)}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 space-y-2 hover:border-primary transition-all cursor-pointer shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {alt.matchScore}% Match
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-bold text-sm text-on-surface">{alt.name}</h4>
                <p className="text-xs text-on-surface-variant line-clamp-2">{alt.shortDesc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
