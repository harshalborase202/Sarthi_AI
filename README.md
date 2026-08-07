# 🇮🇳 Sarthi AI (BharatAI) - Government Scheme Navigator & Explainable AI Assistant

> **Empowering Indian Citizens with Transparent, Explainable, and Actionable Government Scheme Discovery.**
> *Combining PS03 (Trustworthy AI Interface for Govt Schemes) + PS01 (Explainable AI & Transparent Reasoning)*

---

## 🌟 Overview

**Sarthi AI** (BharatAI) is a state-of-the-art **AI Government Scheme Navigator & Decision Visualizer**. Unlike traditional black-box chatbots, Sarthi AI functions like *Google Maps for Government Schemes*—visualizing the exact reasoning path, confidence levels, rule-matching mechanics, and document readiness checklist for every scheme recommendation.

![Project Vision](https://img.shields.io/badge/Focus-Explainable%20AI%20%2B%20Govt%20Schemes-orange?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Frontend-React%20%7C%20TailwindCSS%20%7C%20Framer%20Motion-blue?style=for-the-badge)
![Hackathon Ready](https://img.shields.io/badge/Hackathon-Prototype%20Ready-success?style=for-the-badge)

---

## 🔥 Key Highlights & Features

### 1. 👤 Profile-Based Eligibility Engine
- Simple, clean onboarding interface capturing essential parameters: **Age, State, Education, Income, Category, and Gender**.
- Dynamic real-time re-evaluation when parameters change.

### 2. 🧠 Explainable AI Panel (PS01 Integration)
- **Live Reasoning Stream**: Shows live step-by-step processing ("Understanding profile...", "Verifying state income caps...", "Cross-referencing central database...").
- **Transparent Field Rationale**: Explains *why* each data point (e.g., Age, Income) is being evaluated.

### 3. 🎯 Visual Scheme Scoring & Match Percentage
- Dynamic Match Score (e.g., `92% Match`) calculated based on hard policy constraints and soft AI match scores.
- Interactive cards featuring top government schemes (e.g., **PM Vidyalaxmi**, **Maharashtra Post-Matric Scholarship**, **AICTE Pragati Scheme**).

### 4. 🌳 Interactive Decision & Eligibility Tree
- Visual decision tree (Graph/Flow diagram) rendering rule branches (e.g., `Age > 18` ➔ `Income < ₹8L` ➔ `Engineering Student`).
- Live node updates as users adjust their inputs.

### 5. 📄 Document Readiness Tracker
- Tracks required vs uploaded documents (Aadhaar, Income Certificate, Domicile, Bonafide Certificate).
- Calculates a **Document Completion Bar** to ensure citizens know what documents to prepare before applying.

### 6. 💡 "Why Not Eligible?" Breakdown *(Game Changer)*
- Detailed audit for ineligible schemes.
- Pinpoints exact failed criteria (e.g., *Income Cap: ₹2.0 Lakhs vs User Income: ₹4.5 Lakhs — Difference: ₹2.5 Lakhs*).
- Recommends alternative schemes with the closest parameter fit.

### 7. 🔗 Direct Official Source & Verification
- 100% verified links directing citizens back to official portals (`myscheme.gov.in`, `scholarships.gov.in`, state portals).
- Timestamped data updates guaranteeing trustworthy information.

---

## 📐 User Flow & Screenshots

```
+-----------------------------------------------------------------------+
|  User Profile Input  ==>  Live AI Reasoning  ==>  Scored Scheme List  |
|        │                                                │             |
|        ▼                                                ▼             |
|  Document Checklist  <==  Ineligibility Breakdown <== Interactive Tree|
+-----------------------------------------------------------------------+
```

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React.js / Vite, Tailwind CSS, Framer Motion (micro-animations), Lucide Icons, Recharts / D3.js
- **Backend / Engine**: FastAPI (Python) or Node.js
- **AI / Reasoning**: LLM Integration (Gemini / Groq / OpenAI API) + Rule-Based Policy Graph
- **Database**: Firebase / JSON Schema Database
- **OCR (Optional / Stretch)**: Auto-fill profile details from scanned Aadhaar / Income certificates

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/harshalborase202/Sarthi_AI.git
cd Sarthi_AI

# Install dependencies
npm install

# Start the local development server
npm run dev
```

---

## ⏱️ 5-Minute Demo Script for Judges

1. **Minute 1 - Profile Input**: Input profile details (Age: 22, State: Maharashtra, Education: Engineering, Income: ₹4,50,000). Click **"Find My Schemes"**.
2. **Minute 2 - Live Explainability (PS01)**: Show live AI reasoning stream and rule evaluation panel. Highlight *Confidence Score (93%)*.
3. **Minute 3 - Recommendation Cards**: Review sorted schemes with match percentages and official government badges.
4. **Minute 4 - Deep Dive & Decision Tree**: Click into *PM Vidyalaxmi Scheme*. Show interactive decision tree nodes and **Document Readiness Checklist**.
5. **Minute 5 - "Why Not Eligible?" & Live Update**: Switch to an ineligible scheme tab to demonstrate exact failure rule breakdown. Tweak income to ₹1.8L live and demonstrate instant re-evaluation.

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
