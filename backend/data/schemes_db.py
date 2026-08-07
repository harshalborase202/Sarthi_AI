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
            "Category belongs to SC/ST/OBC/EWS as verified by cast certificate.",
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
        "id": "nsp-scholarship",
        "name": "NSP Merit-cum-Means Scholarship",
        "govtLevel": "Central Government",
        "ministry": "Ministry of Minority Affairs",
        "category": "Education & Scholarship",
        "shortDesc": "Scholarship for minority community students pursuing professional and technical courses at undergraduate/postgraduate level.",
        "badge": "88% Match",
        "officialUrl": "https://scholarships.gov.in/",
        "targetGroup": "Minority Community Students",
        "benefitAmount": "Up to ₹20,000/year (course fee + maintenance)",
        "maxIncome": 250000,
        "minAge": 17,
        "maxAge": 32,
        "allowedStates": ["All"],
        "allowedEducation": ["graduate", "postGraduate"],
        "allowedGender": ["male", "female", "other"],
        "allowedCategory": ["obc", "general"],
        "allowedOccupation": ["student"],
        "whyQualify": [
            "Belongs to a minority community (Muslim, Christian, Sikh, Buddhist, Jain, Zoroastrian).",
            "Enrolled in professional/technical degree program.",
            "Scored 50%+ in last qualifying exam."
        ],
        "documents": [
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True},
            {"id": "minority_cert", "name": "Minority Community Certificate", "required": True},
            {"id": "income_cert", "name": "Income Certificate", "required": True},
            {"id": "marksheet", "name": "Previous Qualifying Exam Marksheet (50%+)", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Minority Status", "status": "pass", "detail": "Verified Community Certificate"},
                {"id": "node2", "label": "Academic Merit", "status": "pass", "detail": "50%+ in qualifying exam"},
                {"id": "node3", "label": "Income Check", "status": "pass", "detail": "Family income ≤ ₹2.5 Lakhs"},
                {"id": "node4", "label": "Professional Course", "status": "pass", "detail": "Technical Degree Program"}
            ]
        }
    },
    {
        "id": "pmegp",
        "name": "Prime Minister's Employment Generation Programme (PMEGP)",
        "govtLevel": "Central Government",
        "ministry": "Ministry of MSME (via KVIC)",
        "category": "Entrepreneurship & Self-Employment",
        "shortDesc": "Subsidy of 15-35% on project cost up to ₹25 Lakhs for new micro-enterprises in manufacturing or service sector.",
        "badge": "80% Match",
        "officialUrl": "https://www.kviconline.gov.in/pmegpeportal/",
        "targetGroup": "Aspiring Micro-Entrepreneurs (18+ years)",
        "benefitAmount": "15–35% subsidy on project cost (up to ₹25L)",
        "maxIncome": 1000000,
        "minAge": 18,
        "maxAge": 55,
        "allowedStates": ["All"],
        "allowedEducation": ["class8", "below10th", "class10", "class12", "graduate", "postGraduate"],
        "allowedGender": ["male", "female", "other"],
        "allowedCategory": ["general", "obc", "sc", "st", "ews"],
        "allowedOccupation": ["selfEmployed", "unemployed"],
        "whyQualify": [
            "Minimum 8th class pass for projects above ₹10 Lakhs.",
            "EDP training completed or arranged through KVIC/KVIB.",
            "Special preference for SC/ST/OBC/women/ex-servicemen."
        ],
        "documents": [
            {"id": "aadhaar", "name": "Aadhaar Card", "required": True},
            {"id": "project_report", "name": "Detailed Project Report (DPR)", "required": True},
            {"id": "education_cert", "name": "Educational Qualification Certificate", "required": True},
            {"id": "bank", "name": "Bank Account for Loan Disbursement", "required": True}
        ],
        "decisionTree": {
            "nodes": [
                {"id": "node1", "label": "Age Eligibility", "status": "pass", "detail": "18–55 years"},
                {"id": "node2", "label": "Education Check", "status": "pass", "detail": "Min. 8th class pass"},
                {"id": "node3", "label": "Project Viability", "status": "pass", "detail": "DPR approved by KVIC"},
                {"id": "node4", "label": "Subsidy Sanctioned", "status": "pass", "detail": "15-35% of project cost"}
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
