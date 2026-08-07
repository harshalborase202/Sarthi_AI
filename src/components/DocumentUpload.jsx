import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Upload, Camera, FileCheck, ShieldCheck, AlertCircle, Loader2, CheckCircle2, Lock, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { translations } from '../data/translations';

export default function DocumentUpload({ language, profile, setProfile }) {
  const t = translations[language] || translations.EN;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const docIdParam = searchParams.get('doc');
  const [selectedDocType, setSelectedDocType] = useState(docIdParam || 'Aadhaar Card');
  
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [consentChoice, setConsentChoice] = useState(null);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [appliedToProfileNotice, setAppliedToProfileNotice] = useState(false);

  useEffect(() => {
    if (docIdParam) {
      const docNameMap = {
        aadhaar: 'Aadhaar Card',
        income_cert: 'Family Income Certificate',
        domicile: 'Domicile Certificate',
        admission_proof: 'College Admission Letter',
        marksheet: '10th / 12th Marksheet',
        caste_cert: 'Caste Certificate'
      };
      if (docNameMap[docIdParam]) {
        setSelectedDocType(docNameMap[docIdParam]);
      }
    }
  }, [docIdParam]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMessage(null);
    setExtractedData(null);
    setConsentChoice(null);
    setSavedSuccessNotice(null);
    setAppliedToProfileNotice(false);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Perform Gemini OCR Scan
  const handlePerformOCR = async () => {
    if (!base64Image) {
      setErrorMessage("Please select or capture a document image first.");
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ocr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          documentType: selectedDocType,
          mimeType: base64Image.split(';')[0].replace('data:', '') || 'image/jpeg'
        })
      });

      const result = await res.json();
      if (result.success && result.extractedData) {
        setExtractedData(result.extractedData);
      } else {
        setErrorMessage(result.error || "Failed to process document OCR scan.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error connecting to Gemini OCR server endpoint.");
    } finally {
      setIsScanning(false);
    }
  };

  // Apply extracted fields directly to user profile
  const handleApplyToProfile = () => {
    if (!extractedData) return;

    const updatedProfile = { ...(profile || {}) };
    if (extractedData.fullName) updatedProfile.fullName = extractedData.fullName;
    if (extractedData.address) {
      const stateMatch = extractedData.address.match(/(Maharashtra|Delhi|Gujarat|Karnataka|Tamil Nadu|Uttar Pradesh|Punjab|Rajasthan|West Bengal|Bihar|Kerala|Madhya Pradesh)/i);
      if (stateMatch) updatedProfile.state = stateMatch[1];
    }
    if (extractedData.income) {
      const incomeNum = extractedData.income.replace(/[^0-9]/g, '');
      if (incomeNum) updatedProfile.income = incomeNum;
    }
    updatedProfile.verifiedDoc = extractedData.docType || selectedDocType;
    updatedProfile.verifiedAt = new Date().toISOString();

    if (setProfile) {
      setProfile(updatedProfile);
    }
    localStorage.setItem('sarthi_profile', JSON.stringify(updatedProfile));
    setAppliedToProfileNotice(true);
  };

  // Handle Consent Prompt selection
  const handleConsentChoice = (choiceKey) => {
    setConsentChoice(choiceKey);

    const textDataToSave = {
      docType: extractedData?.docType || selectedDocType,
      fullName: extractedData?.fullName,
      identifierNumber: extractedData?.identifierNumber,
      issueDate: extractedData?.issueDate,
      authority: extractedData?.authority,
      address: extractedData?.address,
      savedAt: new Date().toISOString()
    };

    // Also sync to Memory Center cards
    let status = 'until_delete';
    let badgeText = '✓ Remembered until you delete it';
    let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';

    if (choiceKey === 'remember_verification') {
      const existing = JSON.parse(localStorage.getItem('sarthi_verified_docs') || '[]');
      existing.push({ ...textDataToSave, retention: 'Remember Until Verification' });
      localStorage.setItem('sarthi_verified_docs', JSON.stringify(existing));
      setSavedSuccessNotice("Extracted text attributes saved locally in storage until verification completes.");
    } else if (choiceKey === 'delete_session') {
      status = 'session_only';
      badgeText = '💬 Session only — deleted on tab close';
      badgeStyle = 'bg-slate-100 text-slate-600 border-slate-300 opacity-80';
      const existing = JSON.parse(sessionStorage.getItem('sarthi_session_docs') || '[]');
      existing.push({ ...textDataToSave, retention: 'Delete After Session' });
      sessionStorage.setItem('sarthi_session_docs', JSON.stringify(existing));
      setSavedSuccessNotice("Extracted text attributes stored temporarily for this browser session only.");
    } else if (choiceKey === 'use_once') {
      status = 'session_only';
      badgeText = '⚡ Applied once';
      badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300';
      setSavedSuccessNotice("Verified fields applied once. No data saved to storage.");
    } else if (choiceKey === 'never_store') {
      status = 'never_stored';
      badgeText = '🔒 Never stored — discarded';
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
      setSavedSuccessNotice("Verification discarded. Zero data stored.");
    }

    // Push new card into sarthi_memory_center_cards
    try {
      const existingCards = JSON.parse(localStorage.getItem('sarthi_memory_center_cards') || '[]');
      const newCard = {
        id: `doc_${Date.now()}`,
        title: extractedData?.docType || selectedDocType,
        iconName: 'fileText',
        speechBubble: `Verified document for ${extractedData?.fullName || 'User'}. ID: ${extractedData?.identifierNumber || 'Verified'}`,
        status,
        expiryDate: null,
        badgeText,
        badgeStyle
      };
      const updatedCards = [newCard, ...existingCards.filter(c => c.title !== (extractedData?.docType || selectedDocType))];
      localStorage.setItem('sarthi_memory_center_cards', JSON.stringify(updatedCards));
    } catch (e) {}

    // Automatically apply to profile when user confirms consent
    handleApplyToProfile();
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 pb-24 px-4 space-y-6">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-saffron text-primary font-bold text-xs px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Gemini 2.5 OCR Verification
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Document OCR Scan & Verification
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Upload Aadhaar, Income Certificate, Domicile, or Marksheets. Our Explainable AI extracts verification metadata server-side with strict privacy consent controls.
          </p>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
        
        {/* Document Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
            Select Document Type to Verify
          </label>
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
          >
            <option value="Aadhaar Card">Aadhaar Card (Identity & Address)</option>
            <option value="Family Income Certificate">Family Income Certificate (Tehsildar / Form 16)</option>
            <option value="Domicile Certificate">State Domicile Certificate</option>
            <option value="College Admission Letter">College Admission Letter / Bonafide</option>
            <option value="10th / 12th Marksheet">10th / 12th Board Marksheet</option>
            <option value="Caste Certificate">Caste Certificate & Validity</option>
          </select>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl p-6 text-center space-y-4 bg-surface transition-all">
          {imagePreview ? (
            <div className="space-y-3">
              <img
                src={imagePreview}
                alt="Document preview"
                className="max-h-56 mx-auto rounded-xl shadow-sm border border-outline-variant/60 object-contain"
              />
              <div className="flex justify-center gap-3">
                <label className="py-2 px-4 bg-surface-container-high hover:bg-surface-container text-xs font-bold rounded-xl cursor-pointer transition-all">
                  Change Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Click to upload document or take a photo</p>
                <p className="text-xs text-on-surface-variant mt-1">Supports JPG, PNG, WEBP (Max 10MB)</p>
              </div>
              <label className="inline-flex items-center gap-2 py-3 px-6 bg-primary text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-primary-container shadow-md transition-all">
                <Camera className="w-4 h-4" />
                <span>Select File / Capture</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          )}
        </div>

        {/* Trigger OCR Scan Button */}
        {imagePreview && !extractedData && (
          <button
            onClick={handlePerformOCR}
            disabled={isScanning}
            className="w-full py-4 bg-primary hover:bg-primary-container text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 text-saffron animate-spin" />
                <span>Scanning document with Gemini 2.5 OCR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-saffron" />
                <span>Extract Metadata with Gemini OCR</span>
              </>
            )}
          </button>
        )}

        {/* Error message display */}
        {errorMessage && (
          <div className="p-4 bg-error-container/60 border border-error/30 text-error rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Extracted Fields Checklist Display */}
        {extractedData && (
          <div className="bg-surface border border-outline-variant/60 rounded-2xl p-5 md:p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-on-surface">Extracted Structured Verification Fields</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                Confidence: {Math.round((extractedData.confidenceScore || 0.95) * 100)}%
              </span>
            </div>

            {extractedData.notice && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-semibold text-amber-800">
                💡 {extractedData.notice}
              </div>
            )}

            {/* Extracted fields list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                <span className="text-outline uppercase text-[10px] font-bold block">Document Type</span>
                <span className="font-bold text-on-surface text-sm">{extractedData.docType || selectedDocType}</span>
              </div>

              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                <span className="text-outline uppercase text-[10px] font-bold block">Full Name on Document</span>
                <span className="font-bold text-on-surface text-sm">{extractedData.fullName || 'N/A'}</span>
              </div>

              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                <span className="text-outline uppercase text-[10px] font-bold block">Identifier Number</span>
                <span className="font-mono font-bold text-primary text-sm">{extractedData.identifierNumber || 'N/A'}</span>
              </div>

              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                <span className="text-outline uppercase text-[10px] font-bold block">Issue Date</span>
                <span className="font-semibold text-on-surface">{extractedData.issueDate || 'N/A'}</span>
              </div>

              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40 sm:col-span-2">
                <span className="text-outline uppercase text-[10px] font-bold block">Issuing Authority</span>
                <span className="font-semibold text-on-surface">{extractedData.authority || 'N/A'}</span>
              </div>
            </div>

            {/* Privacy Consent Prompt with 4 Buttons */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-4 pt-5">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Lock className="w-4 h-4 text-saffron" />
                <span>Privacy & Data Storage Consent</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Choose how BharatAI should retain the extracted text data. Note: Document images are never stored.
              </p>

              {/* 4 Choice Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleConsentChoice('use_once')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex items-start gap-2 ${
                    consentChoice === 'use_once'
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/60 hover:border-primary text-on-surface'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-saffron" />
                  <div>
                    <span className="block font-extrabold">Use Once</span>
                    <span className="text-[10px] opacity-80 block">Apply now without saving data.</span>
                  </div>
                </button>

                <button
                  onClick={() => handleConsentChoice('remember_verification')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex items-start gap-2 ${
                    consentChoice === 'remember_verification'
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/60 hover:border-primary text-on-surface'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <span className="block font-extrabold">Remember Until Verification</span>
                    <span className="text-[10px] opacity-80 block">Save text fields in localStorage.</span>
                  </div>
                </button>

                <button
                  onClick={() => handleConsentChoice('never_store')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex items-start gap-2 ${
                    consentChoice === 'never_store'
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/60 hover:border-primary text-on-surface'
                  }`}
                >
                  <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="block font-extrabold">Never Store</span>
                    <span className="text-[10px] opacity-80 block">Discard text data completely.</span>
                  </div>
                </button>

                <button
                  onClick={() => handleConsentChoice('delete_session')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex items-start gap-2 ${
                    consentChoice === 'delete_session'
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/60 hover:border-primary text-on-surface'
                  }`}
                >
                  <Trash2 className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <span className="block font-extrabold">Delete After Session</span>
                    <span className="text-[10px] opacity-80 block">Clear automatically on tab close.</span>
                  </div>
                </button>
              </div>

              {savedSuccessNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between gap-2">
                  <span>{savedSuccessNotice}</span>
                  <button
                    onClick={() => navigate('/services')}
                    className="py-1.5 px-3 bg-emerald-700 text-white rounded-lg text-[11px] font-extrabold flex items-center gap-1 hover:bg-emerald-800"
                  >
                    Go to Schemes <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
