import React, { useState } from 'react';
import { Search, ExternalLink, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

interface SchemeDetail {
  id: string;
  name: string;
  category: string;
  benefit: string;
  eligibility: string;
  status: 'Eligible' | 'Action Required' | 'Ineligible';
  officialUrl: string;
}

const allSchemes: SchemeDetail[] = [
  {
    id: '1',
    name: 'PM-KISAN Samman Nidhi',
    category: 'Agriculture',
    benefit: '₹6,000 / year income support',
    eligibility: 'Landholding small & marginal farmers',
    status: 'Eligible',
    officialUrl: 'https://pmkisan.gov.in'
  },
  {
    id: '2',
    name: 'Ayushman Bharat PM-JAY',
    category: 'Healthcare',
    benefit: '₹5 Lakhs health insurance cover',
    eligibility: 'Low-income households in SECC database',
    status: 'Eligible',
    officialUrl: 'https://pmjay.gov.in'
  },
  {
    id: '3',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    category: 'Housing',
    benefit: 'Up to ₹2.67 Lakhs interest subsidy',
    eligibility: 'EWS/LIG families without a pucca home',
    status: 'Action Required',
    officialUrl: 'https://pmaymis.gov.in'
  },
  {
    id: '4',
    name: 'PM Mudra Yojana (PMMY)',
    category: 'Business & Credit',
    benefit: 'Collateral-free loans up to ₹10 Lakhs',
    eligibility: 'Micro enterprises and non-farm entrepreneurs',
    status: 'Eligible',
    officialUrl: 'https://mudra.org.in'
  }
];

export const SchemeExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Agriculture', 'Healthcare', 'Housing', 'Business & Credit'];

  const filtered = allSchemes.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      
      <div className="bg-white rounded-2xl p-6 border border-[#c3c6d1] shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-[#00366b] flex items-center gap-2">
          <ShieldCheck className="text-[#1b4d89]" size={28} />
          Government Scheme Explorer
        </h1>
        <p className="text-xs md:text-sm text-[#424750]">
          Search verified central & state welfare programs matching your profile facts.
        </p>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3.5 text-[#737781]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scheme name or benefit..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fb] border border-[#c3c6d1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4d89]"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#1b4d89] text-white'
                    : 'bg-[#f2f4f6] text-[#424750] hover:bg-[#e0e3e5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl p-5 border border-[#c3c6d1] shadow-sm flex flex-col justify-between hover:border-[#1b4d89] transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f2f4f6] text-[#424750] px-2.5 py-0.5 rounded-full">
                  {scheme.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    scheme.status === 'Eligible'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {scheme.status === 'Eligible' ? '✅ Eligible' : '⚠️ Action Required'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#00366b] mt-1">{scheme.name}</h3>
              <p className="text-sm font-semibold text-[#8f4e00] mt-1 flex items-center gap-1">
                <CheckCircle2 size={15} className="text-[#138808]" />
                {scheme.benefit}
              </p>
              <p className="text-xs text-[#424750] mt-2 bg-[#f7f9fb] p-2.5 rounded-lg border border-[#c3c6d1]">
                {scheme.eligibility}
              </p>
            </div>

            <div className="pt-4 border-t border-[#f2f4f6] mt-4 flex items-center justify-between">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#1b4d89] hover:underline flex items-center gap-1"
              >
                Official Portal <ExternalLink size={12} />
              </a>
              <button
                onClick={() => alert(`Applying for ${scheme.name} with verified profile facts...`)}
                className="bg-[#1b4d89] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#00366b] transition-colors flex items-center gap-1"
              >
                Apply Now <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
