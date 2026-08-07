export const SCHEMES_DATABASE = [
  {
    id: "pm-vidyalaxmi",
    name: "PM Vidyalaxmi Scheme",
    govtLevel: "Central Government",
    ministry: "Ministry of Education",
    category: "Education Loan & Interest Subsidy",
    shortDesc: "Financial support and full interest subsidy on higher education loans for eligible students admitted to top-ranked higher educational institutions.",
    badge: "96% Match",
    officialUrl: "https://www.vidyalakshmi.co.in/",
    targetGroup: "Students in Higher Education",
    benefitAmount: "Up to ₹10.0 Lakh Loan (Interest Subsidy)",
    maxIncome: 800000,
    minAge: 17,
    maxAge: 30,
    allowedStates: ["All"],
    allowedEducation: ["graduate", "postGraduate"],
    allowedGender: ["male", "female", "other"],
    allowedCategory: ["general", "obc", "sc", "st", "ews"],
    allowedOccupation: ["student"],
    whyQualify: [
      "Age is within higher education range (17 - 30 years).",
      "Annual family income is under ₹8.0 Lakhs cap for full interest waiver.",
      "Currently pursuing or enrolled in higher technical/degree education."
    ],
    documents: [
      { id: "aadhaar", name: "Aadhaar Card of Applicant", required: true },
      { id: "income_cert", name: "Family Income Certificate (Form 16 / Tehsildar)", required: true },
      { id: "admission_proof", name: "College Admission Letter & Fee Structure", required: true },
      { id: "marksheet", name: "10th & 12th Marksheets", required: true },
      { id: "bank_passbook", name: "Applicant Bank Passbook (Aadhaar Seeded)", required: false }
    ],
    decisionTree: {
      nodes: [
        { id: "node1", label: "Profile Evaluation", status: "pass", detail: "Age >= 17 & Student Status" },
        { id: "node2", label: "Income Verification", status: "pass", detail: "Income <= ₹8,00,000 Cap" },
        { id: "node3", label: "Institution Ranking", status: "pass", detail: "NIRF Top 100 / Govt Institution" },
        { id: "node4", label: "Final Approval", status: "pass", detail: "Eligible for 100% Interest Subsidy" }
      ]
    }
  },
  {
    id: "mh-post-matric",
    name: "Maharashtra Post-Matric Scholarship",
    govtLevel: "Maharashtra State Government",
    ministry: "Social Justice & Special Assistance Department",
    category: "State Scholarship",
    shortDesc: "Tuition fee waiver and maintenance allowance for post-matriculation students belonging to SC/ST/OBC/EWS categories in Maharashtra.",
    badge: "92% Match",
    officialUrl: "https://mahadbt.maharashtra.gov.in/",
    targetGroup: "Post-10th Students in Maharashtra",
    benefitAmount: "100% Tuition Fee Waiver + ₹1,200/month stipend",
    maxIncome: 250000,
    minAge: 15,
    maxAge: 35,
    allowedStates: ["Maharashtra"],
    allowedEducation: ["class12", "graduate", "postGraduate"],
    allowedGender: ["male", "female", "other"],
    allowedCategory: ["sc", "st", "obc", "ews"],
    allowedOccupation: ["student"],
    whyQualify: [
      "Resident of Maharashtra State.",
      "Category falls under SC/ST/OBC/EWS reservation benefits.",
      "Family annual income below ₹2.50 Lakhs limit."
    ],
    documents: [
      { id: "domicile", name: "Maharashtra Domicile Certificate", required: true },
      { id: "caste_cert", name: "Caste Certificate & Validity", required: true },
      { id: "income_cert", name: "Income Certificate from Competent Authority", required: true },
      { id: "ration_card", name: "Ration Card copy", required: false }
    ],
    decisionTree: {
      nodes: [
        { id: "node1", label: "State Domicile", status: "pass", detail: "Maharashtra Resident" },
        { id: "node2", label: "Category Check", status: "pass", detail: "SC / ST / OBC / EWS Category" },
        { id: "node3", label: "Income Limit", status: "pass", detail: "Income <= ₹2.5 Lakhs" },
        { id: "node4", label: "Fee Reimbursement", status: "pass", detail: "Granted via MahaDBT" }
      ]
    }
  },
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scholarship for Girls",
    govtLevel: "Central Government",
    ministry: "Ministry of Education & AICTE",
    category: "Female Education & Empowerment",
    shortDesc: "Scholarship of ₹50,000 per annum for eligible girl students admitted to first year diploma/degree technical courses.",
    badge: "88% Match",
    officialUrl: "https://scholarships.gov.in/",
    targetGroup: "Female Technical Degree/Diploma Students",
    benefitAmount: "₹50,000 per year till graduation",
    maxIncome: 800000,
    minAge: 17,
    maxAge: 26,
    allowedStates: ["All"],
    allowedEducation: ["graduate"],
    allowedGender: ["female"],
    allowedCategory: ["general", "obc", "sc", "st", "ews"],
    allowedOccupation: ["student"],
    whyQualify: [
      "Female applicant pursuing technical degree/diploma.",
      "Maximum 2 girl children per family eligible.",
      "Family income within ₹8.0 Lakhs per annum."
    ],
    documents: [
      { id: "aadhaar", name: "Aadhaar Card of Applicant", required: true },
      { id: "bonafide", name: "Bonafide Certificate from AICTE Institute", required: true },
      { id: "declaration", name: "Parental Girl Child Declaration Affidavit", required: true },
      { id: "bank", name: "Bank Account Details", required: true }
    ],
    decisionTree: {
      nodes: [
        { id: "node1", label: "Gender Check", status: "pass", detail: "Female Candidate" },
        { id: "node2", label: "Course Validation", status: "pass", detail: "AICTE Approved Technical Degree" },
        { id: "node3", label: "Income Cap", status: "pass", detail: "Income <= ₹8,00,000" },
        { id: "node4", label: "Stipend Approval", status: "pass", detail: "₹50,000/yr Direct Benefit Transfer" }
      ]
    }
  },
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    govtLevel: "Central Government",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agricultural Support",
    shortDesc: "Direct income support of ₹6,000 per year in 3 equal installments to landholding farmer families across India.",
    badge: "85% Match",
    officialUrl: "https://pmkisan.gov.in/",
    targetGroup: "Small & Marginal Farmers",
    benefitAmount: "₹6,000 per year (3 installments)",
    maxIncome: 600000,
    minAge: 18,
    maxAge: 75,
    allowedStates: ["All"],
    allowedEducation: ["below10th", "class10", "class12", "graduate", "postGraduate"],
    allowedGender: ["male", "female", "other"],
    allowedCategory: ["general", "obc", "sc", "st", "ews"],
    allowedOccupation: ["farmer"],
    whyQualify: [
      "Registered as landholding farmer/agriculturist.",
      "Family is not paying income tax in previous assessment year."
    ],
    documents: [
      { id: "land_records", name: "Land Ownership Records (7/12 Extract / Khasra)", required: true },
      { id: "aadhaar", name: "Aadhaar Linked Bank Account", required: true }
    ],
    decisionTree: {
      nodes: [
        { id: "node1", label: "Occupation Check", status: "pass", detail: "Agriculturist / Farmer" },
        { id: "node2", label: "Landholding Status", status: "pass", detail: "Cultivable Land Record Verified" },
        { id: "node3", label: "Tax Exemption", status: "pass", detail: "Non-Income Tax Payer" },
        { id: "node4", label: "DBT Credit", status: "pass", detail: "₹2,000 Installment Authorized" }
      ]
    }
  },
  {
    id: "pm-svanidhi",
    name: "PM SVANidhi Scheme",
    govtLevel: "Central Government",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Micro-Credit & Entrepreneurship",
    shortDesc: "Collateral-free working capital loan up to ₹50,000 for street vendors and self-employed micro-entrepreneurs.",
    badge: "82% Match",
    officialUrl: "https://pmsvanidhi.mohua.gov.in/",
    targetGroup: "Urban Vendors & Micro-Entrepreneurs",
    benefitAmount: "₹10,000 to ₹50,000 Collateral-Free Loan",
    maxIncome: 500000,
    minAge: 18,
    maxAge: 65,
    allowedStates: ["All"],
    allowedEducation: ["below10th", "class10", "class12", "graduate", "postGraduate"],
    allowedGender: ["male", "female", "other"],
    allowedCategory: ["general", "obc", "sc", "st", "ews"],
    allowedOccupation: ["selfEmployed", "unemployed"],
    whyQualify: [
      "Engaged in vending/self-employment in urban/peri-urban areas.",
      "Eligible for 7% interest subsidy on prompt repayment."
    ],
    documents: [
      { id: "vending_cert", name: "Certificate of Vending / Urban Local Body Identity", required: true },
      { id: "aadhaar", name: "Aadhaar Card", required: true }
    ],
    decisionTree: {
      nodes: [
        { id: "node1", label: "Occupation Status", status: "pass", detail: "Self-Employed / Artisan" },
        { id: "node2", label: "ULB Registration", status: "pass", detail: "Vending Certificate Verified" },
        { id: "node3", label: "Credit Sanction", status: "pass", detail: "₹10,000 1st Tranche Collateral-Free" }
      ]
    }
  },
  {
    id: "ladki-bahin",
    name: "Mukhyamantri Majhi Ladki Bahin Yojana",
    govtLevel: "Maharashtra State Government",
    ministry: "Women and Child Development Department",
    category: "Financial Assistance for Women",
    shortDesc: "Monthly financial assistance of ₹1,500 directly transferred to eligible women in Maharashtra aged 21 to 65.",
    badge: "95% Match",
    officialUrl: "https://ladkibahin.maharashtra.gov.in/",
    targetGroup: "Women Residents of Maharashtra",
    benefitAmount: "₹1,500 per month (₹18,000 per year)",
    maxIncome: 250000,
    minAge: 21,
    maxAge: 65,
    allowedStates: ["Maharashtra"],
    allowedEducation: ["below10th", "class10", "class12", "graduate", "postGraduate"],
    allowedGender: ["female"],
    allowedCategory: ["general", "obc", "sc", "st", "ews"],
    allowedOccupation: ["student", "farmer", "unemployed", "selfEmployed", "salaried"],
    whyQualify: [
      "Female resident of Maharashtra aged 21-65 years.",
      "Annual family income is less than ₹2.50 Lakhs.",
      "Aadhaar-seeded active bank account."
    ],
    documents: [
      { id: "aadhaar", name: "Aadhaar Card", required: true },
      { id: "domicile", name: "Domicile Certificate or Orange/Yellow Ration Card", required: true },
      { id: "income_cert", name: "Income Certificate / Yellow Ration Card", required: true },
      { id: "bank", name: "Bank Passbook Linked with Aadhaar", required: true }
    ],
    decisionTree: {
      nodes: [
        { id: "node1", label: "Gender & Age Check", status: "pass", detail: "Female (21-65 yrs)" },
        { id: "node2", label: "State Domicile", status: "pass", detail: "Maharashtra Resident" },
        { id: "node3", label: "Income Cap", status: "pass", detail: "Family Income <= ₹2.50 Lakhs" },
        { id: "node4", label: "Monthly Benefit", status: "pass", detail: "₹1,500/month Authorized" }
      ]
    }
  },
  {
    id: "pm-vishwakarma",
    name: "PM Vishwakarma Yojana",
    govtLevel: "Central Government",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    category: "Artisan & Traditional Crafts",
    shortDesc: "End-to-end support for traditional artisans and craftspeople including ₹15,000 toolkit incentive, skill training, and collateral-free loan up to ₹3.0 Lakhs at 5% interest.",
    badge: "94% Match",
    officialUrl: "https://pmvishwakarma.gov.in/",
    targetGroup: "Traditional Artisans & Craftspeople",
    benefitAmount: "₹15,000 Toolkit Grant + ₹3.0 Lakh Collateral-Free Loan @ 5%",
    maxIncome: 500000,
    minAge: 18,
    maxAge: 65,
    allowedStates: ["All"],
    allowedEducation: ["below10th", "class10", "class12", "graduate", "postGraduate"],
    allowedGender: ["male", "female", "other"],
    allowedCategory: ["general", "obc", "sc", "st", "ews"],
    allowedOccupation: ["selfEmployed", "unemployed"],
    whyQualify: [
      "Engaged in one of 18 traditional family-based trades (Barber, Tailor, Carpenter, Blacksmith, Mason, etc.).",
      "Age is 18 years or above on the date of registration.",
      "Family member has not availed loan under PMEGP, PM SVANidhi or Mudra in past 5 years."
    ],
    documents: [
      { id: "aadhaar", name: "Aadhaar Card of Artisan", required: true },
      { id: "bank_passbook", name: "Aadhaar Linked Bank Passbook", required: true },
      { id: "skill_certificate", name: "Gram Panchayat / ULB Trade Verification", required: true }
    ],
    decisionTree: {
      nodes: [
        { id: "node1", label: "Trade Verification", status: "pass", detail: "Verified in 18 Traditional Crafts" },
        { id: "node2", label: "Gram Panchayat Auth", status: "pass", detail: "Local Body Endorsement" },
        { id: "node3", label: "Skill Assessment", status: "pass", detail: "Basic 5-day Training Completed" },
        { id: "node4", label: "Toolkit Incentive", status: "pass", detail: "₹15,000 e-Voucher Issued" }
      ]
    }
  },
  {
    id: "pm-surya-ghar",
    name: "PM Surya Ghar: Muft Bijli Yojana",
    govtLevel: "Central Government",
    ministry: "Ministry of New and Renewable Energy",
    category: "Clean Energy & Renewable Subsidy",
    shortDesc: "Roof-top solar installation subsidy up to ₹78,000 to provide up to 300 units of free electricity every month for eligible residential households.",
    badge: "91% Match",
    officialUrl: "https://pmsuryaghar.gov.in/",
    targetGroup: "Residential Households",
    benefitAmount: "Up to ₹78,000 Rooftop Solar Subsidy + Free Electricity",
    maxIncome: 1000000,
    minAge: 18,
    maxAge: 80,
    allowedStates: ["All"],
    allowedEducation: ["below10th", "class10", "class12", "graduate", "postGraduate"],
    allowedGender: ["male", "female", "other"],
    allowedCategory: ["general", "obc", "sc", "st", "ews"],
    allowedOccupation: ["salaried", "selfEmployed", "farmer", "unemployed", "student"],
    whyQualify: [
      "Residential household with suitable roof space for solar panels.",
      "Valid DISCOM electricity connection in applicant's name.",
      "Has not claimed solar subsidy under previous MNRE schemes."
    ],
    documents: [
      { id: "electricity_bill", name: "Latest DISCOM Electricity Bill", required: true },
      { id: "aadhaar", name: "Aadhaar Card", required: true },
      { id: "bank_passbook", name: "Bank Account Details for Subsidy Transfer", required: true }
    ],
    decisionTree: {
      nodes: [
        { id: "node1", label: "Household Check", status: "pass", detail: "Residential Electricity Meter" },
        { id: "node2", label: "Technical Feasibility", status: "pass", detail: "DISCOM Solar Rooftop Sanction" },
        { id: "node3", label: "Installation", status: "pass", detail: "Rooftop Solar Plant Set Up" },
        { id: "node4", label: "Subsidy Transfer", status: "pass", detail: "Up to ₹78,000 Credited via DBT" }
      ]
    }
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    govtLevel: "Central Government",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare & Insurance",
    shortDesc: "World's largest health assurance scheme providing cashless health coverage up to ₹5.0 Lakhs per family per year for secondary and tertiary hospital care.",
    badge: "97% Match",
    officialUrl: "https://pmjay.gov.in/",
    targetGroup: "Low-Income Families & Senior Citizens (70+)",
    benefitAmount: "₹5,00,000 per year Cashless Hospitalization Coverage",
    maxIncome: 300000,
    minAge: 0,
    maxAge: 100,
    allowedStates: ["All"],
    allowedEducation: ["below10th", "class10", "class12", "graduate", "postGraduate"],
    allowedGender: ["male", "female", "other"],
    allowedCategory: ["general", "obc", "sc", "st", "ews"],
    allowedOccupation: ["salaried", "selfEmployed", "farmer", "unemployed", "student"],
    whyQualify: [
      "SECC 2011 vulnerable family classification or senior citizen aged 70+.",
      "Cashless treatment at over 29,000 empanelled public and private hospitals across India.",
      "Covers pre-hospitalization (3 days) and post-hospitalization (15 days)."
    ],
    documents: [
      { id: "aadhaar", name: "Aadhaar Card", required: true },
      { id: "ration_card", name: "Family Ration Card / Ayushman Card", required: true }
    ],
    decisionTree: {
      nodes: [
        { id: "node1", label: "Family Eligibility", status: "pass", detail: "SECC Listed / Senior Citizen 70+" },
        { id: "node2", label: "Card Generation", status: "pass", detail: "Ayushman Card E-KYC Verified" },
        { id: "node3", label: "Hospitalization", status: "pass", detail: "Cashless Treatment up to ₹5 Lakhs" }
      ]
    }
  }
];

/**
 * Evaluates profile against all schemes in SCHEMES_DATABASE
 * Returns { eligible: [...], ineligible: [...] } with detailed failure reasons
 */
export function evaluateProfile(profile) {
  const age = Number(profile.age) || 0;
  const income = Number(profile.income) || 0;
  const state = profile.state || "";
  const gender = profile.gender || "";
  const category = profile.category || "";
  const occupation = profile.occupation || "";
  const education = profile.education || "";

  const eligible = [];
  const ineligible = [];

  SCHEMES_DATABASE.forEach((scheme) => {
    const failedCriteria = [];

    // 1. Age check
    if (age < scheme.minAge || age > scheme.maxAge) {
      failedCriteria.push({
        ruleName: "Age Criterion",
        userValue: `${age} years`,
        requiredValue: `${scheme.minAge} to ${scheme.maxAge} years`,
        gap: age < scheme.minAge ? `Under age by ${scheme.minAge - age} years` : `Exceeds max age by ${age - scheme.maxAge} years`
      });
    }

    // 2. Income check
    if (income > scheme.maxIncome) {
      const diff = income - scheme.maxIncome;
      failedCriteria.push({
        ruleName: "Family Annual Income Cap",
        userValue: `₹${income.toLocaleString('en-IN')}`,
        requiredValue: `Up to ₹${scheme.maxIncome.toLocaleString('en-IN')}`,
        gap: `Exceeds ceiling by ₹${diff.toLocaleString('en-IN')}`
      });
    }

    // 3. State check
    if (!scheme.allowedStates.includes("All") && !scheme.allowedStates.includes(state)) {
      failedCriteria.push({
        ruleName: "State Domicile Requirement",
        userValue: state || "Not specified",
        requiredValue: scheme.allowedStates.join(", "),
        gap: `Scheme restricted to ${scheme.allowedStates.join(", ")} residents`
      });
    }

    // 4. Gender check
    if (!scheme.allowedGender.includes(gender)) {
      failedCriteria.push({
        ruleName: "Gender Eligibility",
        userValue: gender.toUpperCase() || "Not specified",
        requiredValue: scheme.allowedGender.map(g => g.toUpperCase()).join(" / "),
        gap: "Gender criteria mismatch"
      });
    }

    // 5. Category check
    if (!scheme.allowedCategory.includes(category)) {
      failedCriteria.push({
        ruleName: "Reservation Category",
        userValue: category.toUpperCase() || "Not specified",
        requiredValue: scheme.allowedCategory.map(c => c.toUpperCase()).join(", "),
        gap: "Category not covered under this specific scheme quota"
      });
    }

    // 6. Occupation check
    if (scheme.allowedOccupation && !scheme.allowedOccupation.includes(occupation)) {
      failedCriteria.push({
        ruleName: "Occupation Status",
        userValue: occupation || "Other",
        requiredValue: scheme.allowedOccupation.join(", "),
        gap: `Requires occupation to be ${scheme.allowedOccupation.join(" or ")}`
      });
    }

    if (failedCriteria.length === 0) {
      // Calculate dynamic match score
      let score = 95;
      if (income <= scheme.maxIncome * 0.5) score += 3;
      if (scheme.allowedStates.includes(state)) score += 2;
      eligible.push({
        ...scheme,
        matchScore: Math.min(score, 99)
      });
    } else {
      ineligible.push({
        ...scheme,
        failedCriteria
      });
    }
  });

  return { eligible, ineligible };
}
