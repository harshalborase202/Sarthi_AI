"""
Sarthi AI — Schemes Database
Mirrors the frontend's src/data/schemes.js — single source of truth for eligibility rules.
"""

SCHEMES_DATABASE = [
    {
        "id": "pm-vidyalaxmi",
        "name": "PM Vidyalaxmi Scheme",
        "govtLevel": "Central Government",
        "ministry": "Ministry of Education",
        "category": "Education & Scholarship",
        "shortDesc": "Collateral-free, guarantor-free educational loans up to ₹7.5 Lakhs for meritorious students from EWS/LMI families.",
        "badge": "98% Match",
        "officialUrl": "https://pmvidyalaxmi.ac.in/",
        "targetGroup": "Meritorious Students from EWS/LMI Families",
        "benefitAmount": "Up to ₹7.5 Lakhs Collateral-Free Education Loan",
        "maxIncome": 800000,
        "minAge": 17,
        "maxAge": 30,
        "allowedStates": ["All"],
        "allowedEducation": ["class12", "graduate", "postGraduate"],
        "allowedGender": ["male", "female", "other"],
        "allowedCategory": ["general", "obc", "sc", "st", "ews"],
        "allowedOccupation": ["student"],
        "whyQualify": [
            "Enrolled/admission in QCI-ranked top 860 institutions.",
            "3% interest subvention on loan up to ₹7.5L during moratorium.",
            "CIBIL score not required — government-backed guarantee."
        ],
        "documents": [
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True},
            {"id": "admission_letter", "name": "Admission Offer Letter from QCI-ranked Institution", "required": True},
            {"id": "income_cert", "name": "Income Certificate (Family Annual Income Proof)", "required": True},
            {"id": "marksheet", "name": "Class 12 / Last Qualifying Exam Marksheet", "required": True},
            {"id": "bank", "name": "Bank Account Details (for Loan Disbursement)", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Age Check", "status": "pass", "detail": "17–30 years"},
                {"id": "node2", "label": "Student Status", "status": "pass", "detail": "Enrolled in higher education"},
                {"id": "node3", "label": "Income Cap", "status": "pass", "detail": "Family income ≤ ₹8 Lakhs/year"},
                {"id": "node4", "label": "Institution Rank", "status": "pass", "detail": "QCI Top 860 college verified"},
                {"id": "node5", "label": "Loan Sanctioned", "status": "pass", "detail": "Up to ₹7.5L collateral-free"}
            ]
        }
    },
    {
        "id": "post-matric-mah",
        "name": "Maharashtra Post-Matric Scholarship",
        "govtLevel": "Maharashtra State Government",
        "ministry": "Social Justice & Special Assistance Dept.",
        "category": "Education & Scholarship",
        "shortDesc": "Full tuition fee waiver + maintenance allowance for SC/ST/OBC/EWS students pursuing post-10th education in Maharashtra.",
        "badge": "95% Match",
        "officialUrl": "https://mahadbt.maharashtra.gov.in/",
        "targetGroup": "SC/ST/OBC/EWS Students in Maharashtra",
        "benefitAmount": "Full Tuition + ₹550–₹1,200/month Maintenance Allowance",
        "maxIncome": 250000,
        "minAge": 16,
        "maxAge": 30,
        "allowedStates": ["Maharashtra"],
        "allowedEducation": ["class12", "graduate", "postGraduate"],
        "allowedGender": ["male", "female", "other"],
        "allowedCategory": ["sc", "st", "obc", "ews"],
        "allowedOccupation": ["student"],
        "whyQualify": [
            "Category belongs to SC/ST/OBC/EWS as verified by caste certificate.",
            "Enrolled in a government-recognized institution in Maharashtra.",
            "Family income is within the state-specified ceiling."
        ],
        "documents": [
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True},
            {"id": "caste_cert", "name": "Caste Certificate (SC/ST/OBC/EWS)", "required": True},
            {"id": "income_cert", "name": "Income Certificate (Parent/Guardian)", "required": True},
            {"id": "bonafide", "name": "Bonafide Certificate from Institution", "required": True},
            {"id": "bank", "name": "Bank Passbook (Student's Account)", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "State Domicile", "status": "pass", "detail": "Maharashtra Resident"},
                {"id": "node2", "label": "Category Verified", "status": "pass", "detail": "SC/ST/OBC/EWS Certificate"},
                {"id": "node3", "label": "Income Check", "status": "pass", "detail": "Family income ≤ ₹2.5 Lakhs"},
                {"id": "node4", "label": "Enrollment Status", "status": "pass", "detail": "Post-Matric Student"},
                {"id": "node5", "label": "Scholarship Disbursed", "status": "pass", "detail": "Fee Reimbursement + Allowance"}
            ]
        }
    },
    {
        "id": "aicte-pragati",
        "name": "AICTE Pragati Scholarship",
        "govtLevel": "Central Government",
        "ministry": "All India Council for Technical Education",
        "category": "Education & Scholarship",
        "shortDesc": "Annual scholarship of ₹50,000 + tuition fee reimbursement for women pursuing technical education (engineering/pharmacy/architecture).",
        "badge": "93% Match",
        "officialUrl": "https://www.aicte-pragati-saksham-gov.in/",
        "targetGroup": "Women in Technical Education",
        "benefitAmount": "₹50,000/year + full tuition fee",
        "maxIncome": 800000,
        "minAge": 17,
        "maxAge": 30,
        "allowedStates": ["All"],
        "allowedEducation": ["graduate"],
        "allowedGender": ["female"],
        "allowedCategory": ["general", "obc", "sc", "st", "ews"],
        "allowedOccupation": ["student"],
        "whyQualify": [
            "Female student enrolled in AICTE-approved technical degree program.",
            "Only first two girls from one family are eligible.",
            "Requires 18 credits minimum per semester."
        ],
        "documents": [
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True},
            {"id": "admission_letter", "name": "Admission Letter from AICTE-approved Institution", "required": True},
            {"id": "income_cert", "name": "Family Income Certificate", "required": True},
            {"id": "marksheet", "name": "Last Qualifying Exam Marksheet", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Gender Check", "status": "pass", "detail": "Female Student"},
                {"id": "node2", "label": "Course Type", "status": "pass", "detail": "AICTE Technical Degree"},
                {"id": "node3", "label": "Income Criterion", "status": "pass", "detail": "Annual income ≤ ₹8 Lakhs"},
                {"id": "node4", "label": "Credit Score", "status": "pass", "detail": "18+ credits/semester"},
                {"id": "node5", "label": "Grant Approved", "status": "pass", "detail": "₹50,000 + tuition disbursed"}
            ]
        }
    },
    {
        "id": "pm-kisan",
        "name": "PM Kisan Samman Nidhi",
        "govtLevel": "Central Government",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "Agriculture & Farming",
        "shortDesc": "₹6,000 annual direct income support in 3 equal installments of ₹2,000 to small and marginal farmer families.",
        "badge": "85% Match",
        "officialUrl": "https://pmkisan.gov.in/",
        "targetGroup": "Small & Marginal Farmers",
        "benefitAmount": "₹6,000 per year (3 installments)",
        "maxIncome": 600000,
        "minAge": 18,
        "maxAge": 75,
        "allowedStates": ["All"],
        "allowedEducation": ["below10th", "class10", "class12", "graduate", "postGraduate"],
        "allowedGender": ["male", "female", "other"],
        "allowedCategory": ["general", "obc", "sc", "st", "ews"],
        "allowedOccupation": ["farmer"],
        "whyQualify": [
            "Registered as landholding farmer/agriculturist.",
            "Family is not paying income tax in previous assessment year."
        ],
        "documents": [
            {"id": "land_records", "name": "Land Ownership Records (7/12 Extract / Khasra)", "required": True},
            {"id": "aadhaar", "name": "Aadhaar Linked Bank Account", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Occupation Check", "status": "pass", "detail": "Agriculturist / Farmer"},
                {"id": "node2", "label": "Landholding Status", "status": "pass", "detail": "Cultivable Land Record Verified"},
                {"id": "node3", "label": "Tax Exemption", "status": "pass", "detail": "Non-Income Tax Payer"},
                {"id": "node4", "label": "DBT Credit", "status": "pass", "detail": "₹2,000 Installment Authorized"}
            ]
        }
    },
    {
        "id": "pm-svanidhi",
        "name": "PM SVANidhi Scheme",
        "govtLevel": "Central Government",
        "ministry": "Ministry of Housing and Urban Affairs",
        "category": "Micro-Credit & Entrepreneurship",
        "shortDesc": "Collateral-free working capital loan up to ₹50,000 for street vendors and self-employed micro-entrepreneurs.",
        "badge": "82% Match",
        "officialUrl": "https://pmsvanidhi.mohua.gov.in/",
        "targetGroup": "Urban Vendors & Micro-Entrepreneurs",
        "benefitAmount": "₹10,000 to ₹50,000 Collateral-Free Loan",
        "maxIncome": 500000,
        "minAge": 18,
        "maxAge": 65,
        "allowedStates": ["All"],
        "allowedEducation": ["below10th", "class10", "class12", "graduate", "postGraduate"],
        "allowedGender": ["male", "female", "other"],
        "allowedCategory": ["general", "obc", "sc", "st", "ews"],
        "allowedOccupation": ["selfEmployed", "unemployed"],
        "whyQualify": [
            "Engaged in vending/self-employment in urban/peri-urban areas.",
            "Eligible for 7% interest subsidy on prompt repayment."
        ],
        "documents": [
            {"id": "vending_cert", "name": "Certificate of Vending / Urban Local Body Identity", "required": True},
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Occupation Status", "status": "pass", "detail": "Self-Employed / Artisan"},
                {"id": "node2", "label": "ULB Registration", "status": "pass", "detail": "Vending Certificate Verified"},
                {"id": "node3", "label": "Credit Sanction", "status": "pass", "detail": "₹10,000 1st Tranche Collateral-Free"}
            ]
        }
    },
    {
        "id": "ladki-bahin",
        "name": "Mukhyamantri Majhi Ladki Bahin Yojana",
        "govtLevel": "Maharashtra State Government",
        "ministry": "Women and Child Development Department",
        "category": "Financial Assistance for Women",
        "shortDesc": "Monthly financial assistance of ₹1,500 directly transferred to eligible women in Maharashtra aged 21 to 65.",
        "badge": "95% Match",
        "officialUrl": "https://ladkibahin.maharashtra.gov.in/",
        "targetGroup": "Women Residents of Maharashtra",
        "benefitAmount": "₹1,500 per month (₹18,000 per year)",
        "maxIncome": 250000,
        "minAge": 21,
        "maxAge": 65,
        "allowedStates": ["Maharashtra"],
        "allowedEducation": ["below10th", "class10", "class12", "graduate", "postGraduate"],
        "allowedGender": ["female"],
        "allowedCategory": ["general", "obc", "sc", "st", "ews"],
        "allowedOccupation": ["student", "farmer", "unemployed", "selfEmployed", "salaried"],
        "whyQualify": [
            "Female resident of Maharashtra aged 21-65 years.",
            "Annual family income is less than ₹2.50 Lakhs.",
            "Aadhaar-seeded active bank account."
        ],
        "documents": [
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True},
            {"id": "domicile", "name": "Domicile Certificate or Orange/Yellow Ration Card", "required": True},
            {"id": "income_cert", "name": "Income Certificate / Yellow Ration Card", "required": True},
            {"id": "bank", "name": "Bank Passbook Linked with Aadhaar", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Gender & Age Check", "status": "pass", "detail": "Female (21-65 yrs)"},
                {"id": "node2", "label": "State Domicile", "status": "pass", "detail": "Maharashtra Resident"},
                {"id": "node3", "label": "Income Cap", "status": "pass", "detail": "Family Income <= ₹2.50 Lakhs"},
                {"id": "node4", "label": "Monthly Benefit", "status": "pass", "detail": "₹1,500/month Authorized"}
            ]
        }
    },
    {
        "id": "pm-vishwakarma",
        "name": "PM Vishwakarma Yojana",
        "govtLevel": "Central Government",
        "ministry": "Ministry of Micro, Small and Medium Enterprises",
        "category": "Artisan & Traditional Crafts",
        "shortDesc": "End-to-end support for traditional artisans and craftspeople including ₹15,000 toolkit incentive, skill training, and collateral-free loan up to ₹3.0 Lakhs at 5% interest.",
        "badge": "94% Match",
        "officialUrl": "https://pmvishwakarma.gov.in/",
        "targetGroup": "Traditional Artisans & Craftspeople",
        "benefitAmount": "₹15,000 Toolkit Grant + ₹3.0 Lakh Collateral-Free Loan @ 5%",
        "maxIncome": 500000,
        "minAge": 18,
        "maxAge": 65,
        "allowedStates": ["All"],
        "allowedEducation": ["below10th", "class10", "class12", "graduate", "postGraduate"],
        "allowedGender": ["male", "female", "other"],
        "allowedCategory": ["general", "obc", "sc", "st", "ews"],
        "allowedOccupation": ["selfEmployed", "unemployed"],
        "whyQualify": [
            "Engaged in one of 18 traditional family-based trades.",
            "Age is 18 years or above.",
            "Has not availed loan under PMEGP or MUDRA in past 5 years."
        ],
        "documents": [
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True},
            {"id": "bank", "name": "Aadhaar Linked Bank Passbook", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Trade Verification", "status": "pass", "detail": "Verified in 18 Traditional Crafts"},
                {"id": "node2", "label": "Skill Assessment", "status": "pass", "detail": "Basic 5-day Training Completed"},
                {"id": "node3", "label": "Toolkit Incentive", "status": "pass", "detail": "₹15,000 e-Voucher Issued"}
            ]
        }
    },
    {
        "id": "pm-surya-ghar",
        "name": "PM Surya Ghar: Muft Bijli Yojana",
        "govtLevel": "Central Government",
        "ministry": "Ministry of New and Renewable Energy",
        "category": "Clean Energy & Renewable Subsidy",
        "shortDesc": "Roof-top solar installation subsidy up to ₹78,000 to provide up to 300 units of free electricity every month for eligible residential households.",
        "badge": "91% Match",
        "officialUrl": "https://pmsuryaghar.gov.in/",
        "targetGroup": "Residential Households",
        "benefitAmount": "Up to ₹78,000 Rooftop Solar Subsidy + Free Electricity",
        "maxIncome": 1000000,
        "minAge": 18,
        "maxAge": 80,
        "allowedStates": ["All"],
        "allowedEducation": ["below10th", "class10", "class12", "graduate", "postGraduate"],
        "allowedGender": ["male", "female", "other"],
        "allowedCategory": ["general", "obc", "sc", "st", "ews"],
        "allowedOccupation": ["salaried", "selfEmployed", "farmer", "unemployed", "student"],
        "whyQualify": [
            "Residential household with suitable roof space for solar panels.",
            "Valid DISCOM electricity connection in applicant's name."
        ],
        "documents": [
            {"id": "electricity_bill", "name": "Latest DISCOM Electricity Bill", "required": True},
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Household Check", "status": "pass", "detail": "Residential Electricity Meter"},
                {"id": "node2", "label": "Subsidy Transfer", "status": "pass", "detail": "Up to ₹78,000 Credited via DBT"}
            ]
        }
    },
    {
        "id": "ayushman-bharat",
        "name": "Ayushman Bharat PM-JAY",
        "govtLevel": "Central Government",
        "ministry": "Ministry of Health and Family Welfare",
        "category": "Healthcare & Insurance",
        "shortDesc": "World's largest health assurance scheme providing cashless health coverage up to ₹5.0 Lakhs per family per year for secondary and tertiary hospital care.",
        "badge": "97% Match",
        "officialUrl": "https://pmjay.gov.in/",
        "targetGroup": "Low-Income Families & Senior Citizens (70+)",
        "benefitAmount": "₹5,00,000 per year Cashless Hospitalization Coverage",
        "maxIncome": 300000,
        "minAge": 0,
        "maxAge": 100,
        "allowedStates": ["All"],
        "allowedEducation": ["below10th", "class10", "class12", "graduate", "postGraduate"],
        "allowedGender": ["male", "female", "other"],
        "allowedCategory": ["general", "obc", "sc", "st", "ews"],
        "allowedOccupation": ["salaried", "selfEmployed", "farmer", "unemployed", "student"],
        "whyQualify": [
            "SECC 2011 vulnerable family classification or senior citizen aged 70+.",
            "Cashless treatment at over 29,000 empanelled public and private hospitals across India."
        ],
        "documents": [
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True},
            {"id": "ration_card", "name": "Family Ration Card / Ayushman Card", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Family Eligibility", "status": "pass", "detail": "SECC Listed / Senior Citizen 70+"},
                {"id": "node2", "label": "Hospitalization", "status": "pass", "detail": "Cashless Treatment up to ₹5 Lakhs"}
            ]
        }
    }
]


def evaluate_profile(profile: dict) -> dict:
    """
    Evaluate a citizen profile against all schemes.
    Returns {"eligible": [...], "ineligible": [...]} with detailed reasoning.
    Mirrors the frontend evaluateProfile() function in schemes.js.
    """
    age = int(profile.get("age", 0) or 0)
    income = int(profile.get("income", 0) or 0)
    state = profile.get("state", "")
    gender = profile.get("gender", "")
    category = profile.get("category", "")
    occupation = profile.get("occupation", "")
    education = profile.get("education", "")

    eligible = []
    ineligible = []

    for scheme in SCHEMES_DATABASE:
        failed_criteria = []

        # 1. Age check
        if age < scheme["minAge"] or age > scheme["maxAge"]:
            failed_criteria.append({
                "ruleName": "Age Criterion",
                "userValue": f"{age} years",
                "requiredValue": f"{scheme['minAge']} to {scheme['maxAge']} years",
                "gap": (
                    f"Under age by {scheme['minAge'] - age} years"
                    if age < scheme["minAge"]
                    else f"Exceeds max age by {age - scheme['maxAge']} years"
                )
            })

        # 2. Income check
        if income > scheme["maxIncome"]:
            diff = income - scheme["maxIncome"]
            failed_criteria.append({
                "ruleName": "Family Annual Income Cap",
                "userValue": f"₹{income:,}",
                "requiredValue": f"Up to ₹{scheme['maxIncome']:,}",
                "gap": f"Exceeds ceiling by ₹{diff:,}"
            })

        # 3. State check
        if "All" not in scheme["allowedStates"] and state not in scheme["allowedStates"]:
            failed_criteria.append({
                "ruleName": "State Domicile Requirement",
                "userValue": state or "Not specified",
                "requiredValue": ", ".join(scheme["allowedStates"]),
                "gap": f"Scheme restricted to {', '.join(scheme['allowedStates'])} residents"
            })

        # 4. Gender check
        if gender and gender not in scheme["allowedGender"]:
            failed_criteria.append({
                "ruleName": "Gender Eligibility",
                "userValue": gender.upper() or "Not specified",
                "requiredValue": " / ".join(g.upper() for g in scheme["allowedGender"]),
                "gap": "Gender criteria mismatch"
            })

        # 5. Category check
        if category and category not in scheme["allowedCategory"]:
            failed_criteria.append({
                "ruleName": "Reservation Category",
                "userValue": category.upper() or "Not specified",
                "requiredValue": ", ".join(c.upper() for c in scheme["allowedCategory"]),
                "gap": "Category not covered under this specific scheme quota"
            })

        # 6. Occupation check
        if scheme.get("allowedOccupation") and occupation and occupation not in scheme["allowedOccupation"]:
            failed_criteria.append({
                "ruleName": "Occupation Status",
                "userValue": occupation or "Other",
                "requiredValue": ", ".join(scheme["allowedOccupation"]),
                "gap": f"Requires occupation to be {' or '.join(scheme['allowedOccupation'])}"
            })

        if not failed_criteria:
            # Dynamic match score calculation
            score = 95
            if income <= scheme["maxIncome"] * 0.5:
                score += 3
            if state in scheme["allowedStates"]:
                score += 2
            eligible.append({**scheme, "matchScore": min(score, 99)})
        else:
            ineligible.append({**scheme, "failedCriteria": failed_criteria})

    return {"eligible": eligible, "ineligible": ineligible}
