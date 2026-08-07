// BharatAI Scheme Navigator Interactive Application
let currentView = 'form';
let currentLang = 'en';

const sampleSchemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    category: 'Agriculture & Farmer Welfare',
    type: 'Central Sector Scheme',
    benefit: '₹6,000 / year',
    benefitDesc: 'Direct income support of ₹6,000 per year paid in three equal installments to small & marginal farmers.',
    eligibility: 'Landholding farmer families with cultivable land up to 2 hectares and annual family income within limits.',
    documents: ['Aadhaar Card', 'Land Ownership Records (7/12 extract)', 'Bank Account Details', 'e-KYC Verification'],
    status: 'Eligible',
    matchScore: '98% Match'
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    category: 'Healthcare & Insurance',
    type: 'Centrally Sponsored Scheme',
    benefit: '₹5 Lakhs coverage / family',
    benefitDesc: 'Free health insurance cover of up to ₹5,000,000 per family per year for secondary and tertiary care hospitalization.',
    eligibility: 'Families listed in SECC 2011 database, low-income households, and designated informal sector workers.',
    documents: ['Aadhaar Card / Ration Card', 'Income Certificate', 'Mobile Number linked with Aadhaar'],
    status: 'Eligible',
    matchScore: '95% Match'
  },
  {
    id: 'pm-awaya-yojana',
    name: 'Pradhan Mantri Awas Yojana (PMAY-U / Gramin)',
    category: 'Housing & Urban Poverty Alleviation',
    type: 'Credit Linked Subsidy Scheme',
    benefit: 'Up to ₹2.67 Lakhs subsidy',
    benefitDesc: 'Interest subsidy on housing loans for construction or purchase of first pucca home for EWS/LIG families.',
    eligibility: 'Family must not own a pucca house in India; annual income up to ₹3 Lakhs (EWS) or ₹6 Lakhs (LIG).',
    documents: ['Salary Slip / Income Proof', 'Property Registration Papers', 'Aadhaar Card & PAN Card', 'Affidavit of No Pucca House'],
    status: 'Eligible',
    matchScore: '89% Match'
  }
];

const ineligibleSchemes = [
  {
    name: 'PM National Apprenticeship Promotion Scheme (NAPS)',
    reason: 'Age limit criteria (Max 30 years). Your entered age exceeds the scheme limit by 5 years.',
    fixHint: 'Explore Skill India training modules or MUDRA loan schemes suitable for mature entrepreneurs.'
  },
  {
    name: 'Post-Matric Scholarship for SC/ST Students',
    reason: 'Annual family income threshold exceeded (Max ₹2.5 Lakhs).',
    fixHint: 'Consider National Overseas Scholarship or Higher Education Credit Guarantee schemes.'
  }
];

// Content Dictionary for Bilingual Support
const dict = {
  en: {
    title: "Tell us about yourself",
    subtitle: "We need a few details to find the best government schemes for you.",
    ageLabel: "Age",
    ageInfo: "Determines which age-based schemes apply to you.",
    genderLabel: "Gender",
    stateLabel: "State",
    eduLabel: "Education Level",
    incomeLabel: "Annual Family Income",
    incomeInfo: "Used to check income-based eligibility limits.",
    categoryLabel: "Category",
    categoryInfo: "Some schemes reserve slots or have different income limits by category.",
    trustNotice: "Your data is used only to match schemes and is never stored on our servers.",
    submitBtn: "Find My Schemes",
    eligibleHeader: "Recommended Government Schemes",
    eligibleSub: "Based on your verified profile details, you qualify for 3 major schemes.",
    reasoningHeader: "BharatAI Matching Intelligence",
    reasoningSub: "Transparency engine breakdown of why you qualified for these schemes.",
    unqualifiedHeader: "Schemes You Didn't Qualify For",
    unqualifiedSub: "Below are schemes where criteria weren't met, along with guidance.",
    viewDetails: "View Scheme Details & Apply",
    applyNow: "Proceed to Official Portal",
    backBtn: "← Back to Eligible Schemes"
  },
  hi: {
    title: "अपने बारे में जानकारी दें",
    subtitle: "आपके लिए सर्वोत्तम सरकारी योजनाएँ खोजने के लिए हमें कुछ विवरण चाहिए।",
    ageLabel: "आयु (उम्र)",
    ageInfo: "यह निर्धारित करता है कि आप पर कौन सी आयु-आधारित योजनाएँ लागू होती हैं।",
    genderLabel: "लिंग",
    stateLabel: "राज्य",
    eduLabel: "शिक्षा का स्तर",
    incomeLabel: "वार्षिक पारिवारिक आय",
    incomeInfo: "आय आधारित पात्रता सीमाओं की जांच के लिए उपयोग किया जाता है।",
    categoryLabel: "वर्ग / श्रेणी",
    categoryInfo: "कुछ योजनाओं में श्रेणी के अनुसार अलग सीमाएं होती हैं।",
    trustNotice: "आपका डेटा केवल योजनाओं के मिलान के लिए उपयोग किया जाता है और सर्वर पर सहेजा नहीं जाता है।",
    submitBtn: "मेरी योजनाएँ खोजें",
    eligibleHeader: "अनुशंसित सरकारी योजनाएं",
    eligibleSub: "आपके प्रोफ़ाइल के आधार पर आप 3 प्रमुख योजनाओं के लिए पात्र हैं।",
    reasoningHeader: "BharatAI एआई तर्क और विश्लेषक",
    reasoningSub: "पारदर्शिता इंजन: जानें आप इन योजनाओं के लिए क्यों पात्र हैं।",
    unqualifiedHeader: "योजनाएं जिनके लिए आप अयोग्य हैं",
    unqualifiedSub: "नीचे वे योजनाएं दी गई हैं जिनकी शर्तें पूरी नहीं हुईं, साथ ही मार्गदर्शन भी।",
    viewDetails: "योजना विवरण देखें और आवेदन करें",
    applyNow: "आधिकारिक पोर्टल पर जाएं",
    backBtn: "← वापस योजनाओं पर जाएं"
  }
};

function renderApp() {
  const container = document.getElementById('app-container');
  const d = dict[currentLang] || dict.en;

  if (currentView === 'form') {
    container.innerHTML = `
      <div class="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant shadow-sm p-6 md:p-8 mt-2 rounded-lg">
        <div class="mb-6 text-center">
          <h1 class="text-2xl md:text-3xl font-bold text-on-surface mb-2">${d.title}</h1>
          <p class="text-on-surface-variant text-sm md:text-base">${d.subtitle}</p>
        </div>
        <form id="profile-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-on-surface flex items-center gap-1" for="age">
                ${d.ageLabel}
                <span class="material-symbols-outlined text-base text-outline cursor-pointer" title="${d.ageInfo}">info</span>
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <span class="material-symbols-outlined text-lg">calendar_month</span>
                </span>
                <input class="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container" id="age" name="age" placeholder="e.g. 35" value="35" required type="number">
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-on-surface" for="gender">${d.genderLabel}</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <span class="material-symbols-outlined text-lg">wc</span>
                </span>
                <select class="w-full pl-10 pr-8 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container cursor-pointer" id="gender" name="gender">
                  <option value="male" selected>Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-on-surface" for="state">${d.stateLabel}</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                <span class="material-symbols-outlined text-lg">map</span>
              </span>
              <select class="w-full pl-10 pr-8 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container cursor-pointer" id="state" name="state">
                <option value="maharashtra" selected>Maharashtra</option>
                <option value="delhi">Delhi</option>
                <option value="karnataka">Karnataka</option>
                <option value="gujarat">Gujarat</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-on-surface" for="education">${d.eduLabel}</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                <span class="material-symbols-outlined text-lg">school</span>
              </span>
              <select class="w-full pl-10 pr-8 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container cursor-pointer" id="education" name="education">
                <option value="higher_secondary" selected>Higher Secondary (12th)</option>
                <option value="graduate">Graduate</option>
                <option value="secondary">Secondary (10th)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-on-surface flex items-center gap-1" for="income">
                ${d.incomeLabel}
                <span class="material-symbols-outlined text-base text-outline cursor-pointer" title="${d.incomeInfo}">info</span>
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <span class="material-symbols-outlined text-lg">currency_rupee</span>
                </span>
                <select class="w-full pl-10 pr-8 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container cursor-pointer" id="income" name="income">
                  <option value="1_2.5L" selected>₹1 Lakh - ₹2.5 Lakhs</option>
                  <option value="0_1L">Up to ₹1 Lakh</option>
                  <option value="2.5_5L">₹2.5 Lakhs - ₹5 Lakhs</option>
                </select>
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-on-surface flex items-center gap-1" for="category">
                ${d.categoryLabel}
                <span class="material-symbols-outlined text-base text-outline cursor-pointer" title="${d.categoryInfo}">info</span>
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <span class="material-symbols-outlined text-lg">group</span>
                </span>
                <select class="w-full pl-10 pr-8 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container cursor-pointer" id="category" name="category">
                  <option value="obc" selected>OBC</option>
                  <option value="open">General / Open</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 bg-surface rounded-lg border border-outline-variant mt-2">
            <span class="material-symbols-outlined text-primary text-xl mt-0.5">shield_lock</span>
            <p class="text-xs text-on-surface-variant leading-relaxed">${d.trustNotice}</p>
          </div>

          <div class="pt-2">
            <button id="submit-form-btn" type="button" class="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-container transition-all shadow-sm">
              <span class="material-symbols-outlined text-lg">search</span>
              ${d.submitBtn}
            </button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('submit-form-btn').addEventListener('click', () => {
      switchView('schemes');
    });

  } else if (currentView === 'schemes') {
    container.innerHTML = `
      <div class="w-full max-w-3xl space-y-4">
        <div class="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-on-surface">${d.eligibleHeader}</h1>
            <p class="text-xs md:text-sm text-on-surface-variant mt-1">${d.eligibleSub}</p>
          </div>
          <span class="bg-tertiary-container text-on-tertiary-container text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <span class="material-symbols-outlined text-base">verified</span> Verified Match
          </span>
        </div>

        <div class="space-y-4">
          ${sampleSchemes.map(s => `
            <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm hover:border-secondary transition-all">
              <div class="flex justify-between items-start gap-2 mb-2">
                <span class="text-xs font-semibold px-2.5 py-1 bg-surface-container text-primary rounded-full">${s.category}</span>
                <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${s.matchScore}</span>
              </div>
              <h2 class="text-lg font-bold text-primary mb-1">${s.name}</h2>
              <p class="text-sm font-semibold text-secondary mb-2">${s.benefit}</p>
              <p class="text-xs md:text-sm text-on-surface-variant mb-4">${s.benefitDesc}</p>
              <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-outline-variant">
                <span class="text-xs text-outline">${s.type}</span>
                <button onclick="window.viewSchemeDetail('${s.id}')" class="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1">
                  ${d.viewDetails} <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

  } else if (currentView === 'detail') {
    const s = sampleSchemes[0]; // Active detail scheme
    container.innerHTML = `
      <div class="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 shadow-sm space-y-6">
        <button onclick="window.switchView('schemes')" class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          ${d.backBtn}
        </button>
        <div>
          <span class="text-xs font-bold px-3 py-1 bg-primary-container text-white rounded-full">${s.category}</span>
          <h1 class="text-2xl font-bold text-primary mt-3">${s.name}</h1>
          <div class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span class="text-xs text-amber-800 uppercase font-bold tracking-wider">Key Benefit</span>
            <p class="text-lg font-bold text-amber-900">${s.benefit}</p>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-bold text-on-surface">Eligibility Criteria Matched</h3>
          <p class="text-xs md:text-sm text-on-surface-variant bg-surface p-3 rounded-lg border border-outline-variant">${s.eligibility}</p>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-bold text-on-surface">Required Documents Checklist</h3>
          <ul class="space-y-2">
            ${s.documents.map(doc => `
              <li class="flex items-center gap-2 text-xs md:text-sm text-on-surface">
                <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                ${doc}
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="pt-4 border-t border-outline-variant flex flex-col gap-2">
          <button class="w-full py-3 bg-secondary-container text-on-secondary-container font-bold rounded-lg hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2">
            ${d.applyNow}
            <span class="material-symbols-outlined text-lg">open_in_new</span>
          </button>
        </div>
      </div>
    `;

  } else if (currentView === 'reasoning') {
    container.innerHTML = `
      <div class="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 shadow-sm space-y-6">
        <div class="border-b border-outline-variant pb-4">
          <h1 class="text-xl font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">psychology</span>
            ${d.reasoningHeader}
          </h1>
          <p class="text-xs text-on-surface-variant mt-1">${d.reasoningSub}</p>
        </div>

        <div class="space-y-4">
          <div class="p-4 bg-surface rounded-lg border border-outline-variant space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-primary">Matched Factor: Income & Category</span>
              <span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Pass</span>
            </div>
            <p class="text-xs text-on-surface-variant">Your annual family income (₹1L - ₹2.5L) falls well below the ceiling of ₹3,000,000 for EWS/OBC reservations.</p>
          </div>

          <div class="p-4 bg-surface rounded-lg border border-outline-variant space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-primary">Matched Factor: Domicile & Region</span>
              <span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Pass</span>
            </div>
            <p class="text-xs text-on-surface-variant">State preference set to Maharashtra, enabling both Central Sector & Maharashtra State level agricultural subsidies.</p>
          </div>

          <div class="p-4 bg-surface rounded-lg border border-outline-variant space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-primary">Matched Factor: Age Eligibility</span>
              <span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Pass</span>
            </div>
            <p class="text-xs text-on-surface-variant">Age 35 meets adult citizen criteria without exceeding upper age limits for general family schemes.</p>
          </div>
        </div>
      </div>
    `;

  } else if (currentView === 'ineligible') {
    container.innerHTML = `
      <div class="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 shadow-sm space-y-6">
        <div class="border-b border-outline-variant pb-4">
          <h1 class="text-xl font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-600">cancel</span>
            ${d.unqualifiedHeader}
          </h1>
          <p class="text-xs text-on-surface-variant mt-1">${d.unqualifiedSub}</p>
        </div>

        <div class="space-y-4">
          ${ineligibleSchemes.map(item => `
            <div class="p-4 bg-rose-50/50 border border-rose-200 rounded-lg space-y-2">
              <h3 class="text-sm font-bold text-rose-900">${item.name}</h3>
              <p class="text-xs text-rose-700"><strong>Reason:</strong> ${item.reason}</p>
              <div class="p-2 bg-white rounded border border-rose-100 text-xs text-on-surface-variant flex items-center gap-1.5">
                <span class="material-symbols-outlined text-amber-600 text-base">lightbulb</span>
                <span><strong>Recommendation:</strong> ${item.fixHint}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Update navigation buttons active state
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const target = btn.getAttribute('data-nav');
    if (target === currentView || (currentView === 'detail' && target === 'schemes')) {
      btn.className = "nav-btn flex flex-col items-center justify-center text-primary font-bold transition-all";
    } else {
      btn.className = "nav-btn flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all";
    }
  });
}

function switchView(viewName) {
  currentView = viewName;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.switchView = switchView;
window.viewSchemeDetail = (id) => {
  switchView('detail');
};

document.addEventListener('DOMContentLoaded', () => {
  // Navigation event listeners
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-nav');
      switchView(target);
    });
  });

  // Language toggles
  document.getElementById('lang-en').addEventListener('click', () => {
    currentLang = 'en';
    updateLangUI();
    renderApp();
  });

  document.getElementById('lang-hi').addEventListener('click', () => {
    currentLang = 'hi';
    updateLangUI();
    renderApp();
  });

  document.getElementById('lang-mr').addEventListener('click', () => {
    currentLang = 'hi'; // Fallback / demo
    updateLangUI();
    renderApp();
  });

  document.getElementById('header-brand').addEventListener('click', () => {
    switchView('form');
  });

  renderApp();
});

function updateLangUI() {
  document.getElementById('lang-en').className = currentLang === 'en' ? 'px-1.5 py-0.5 rounded bg-primary text-white transition-all' : 'px-1.5 py-0.5 rounded hover:bg-surface-container-high transition-all';
  document.getElementById('lang-hi').className = currentLang === 'hi' ? 'px-1.5 py-0.5 rounded bg-primary text-white transition-all' : 'px-1.5 py-0.5 rounded hover:bg-surface-container-high transition-all';
}
