import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Upload, Camera, AlertTriangle, ExternalLink, Loader2, Sparkles, Eye, ArrowRight, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { translations } from '../data/translations';

export default function AdPamphletScanner({ language }) {
  const t = translations[language] || translations.EN;
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showExtractedText, setShowExtractedText] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side file size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5MB limit. Please select a smaller image.");
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage("Only image files (JPEG, PNG, WEBP) are supported.");
      return;
    }

    setErrorMessage(null);
    setScanResult(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit image to backend scan endpoint
  const handleScanAd = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select or capture an image of an ad or pamphlet first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Call Express Node backend scan endpoint (or fallback proxy)
      let res;
      try {
        res = await fetch('http://localhost:4000/api/scan/yojana-ad', {
          method: 'POST',
          body: formData,
        });
      } catch {
        // Fallback to relative endpoint
        res = await fetch('/api/scan/yojana-ad', {
          method: 'POST',
          body: formData,
        });
      }

      const data = await res.json();

      if (res.ok && data) {
        setScanResult(data);
      } else {
        setErrorMessage(data.error || "Failed to analyze ad image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error connecting to Sarthi AI Scam Detector backend.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset scanner
  const handleResetScan = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setScanResult(null);
    setErrorMessage(null);
    setShowExtractedText(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 pb-28 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-saffron text-primary font-black text-xs px-3 py-1 rounded-full shadow-sm">
          <ShieldAlert className="w-4 h-4" /> AI Yojana Scam Detector
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          Scan Ad or Pamphlet
        </h1>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-xl">
          Upload a screenshot of a social media ad or a photo of a printed pamphlet — our AI Vision instantly identifies the real government scheme and flags scam red flags.
        </p>
      </div>

      {/* Main Scanner Container */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
        
        {/* Upload Dropzone */}
        {!scanResult && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl p-6 text-center space-y-4 bg-surface transition-all">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Ad preview"
                    className="max-h-64 mx-auto rounded-2xl shadow-sm border border-outline-variant/60 object-contain"
                  />
                  <div className="flex justify-center gap-3">
                    <label className="py-2 px-4 bg-surface-container-high hover:bg-surface-container text-xs font-bold text-on-surface rounded-xl cursor-pointer transition-all">
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
                    <p className="text-sm font-bold text-on-surface">Upload ad screenshot or photo of pamphlet</p>
                    <p className="text-xs text-on-surface-variant mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <label className="inline-flex items-center gap-2 py-3 px-5 bg-primary text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-primary-container shadow-md transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Select Image File</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>

                    <label className="inline-flex items-center gap-2 py-3 px-5 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs rounded-xl cursor-pointer border border-outline-variant transition-all">
                      <Camera className="w-4 h-4 text-primary" />
                      <span>Capture Photo</span>
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-on-surface-variant text-center italic">
              "Upload a screenshot of the ad or a photo of the pamphlet — we'll find the real scheme it's talking about."
            </p>

            {/* Error Display */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Trigger Button */}
            {imagePreview && (
              <button
                type="button"
                onClick={handleScanAd}
                disabled={isAnalyzing}
                className="w-full py-4 bg-primary hover:bg-primary-container text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 text-saffron animate-spin" />
                    <span>Analyzing ad with Gemini Vision AI & matching database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-saffron" />
                    <span>Analyze Ad & Check Official Yojana</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Scan Results Screen */}
        {scanResult && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Match Status Header Card */}
            <div className={`p-6 rounded-2xl border ${
              scanResult.matchFound
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {scanResult.matchFound ? (
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-6 h-6 text-amber-600" />
                    )}
                    <span className="text-xs font-black uppercase tracking-wider">
                      {scanResult.matchFound ? 'Official Scheme Identified' : 'Unverified Ad Alert'}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-on-surface mt-1">
                    {scanResult.matchFound
                      ? scanResult.matchedScheme?.name
                      : 'No Matching Official Government Scheme Found'}
                  </h2>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
                  scanResult.confidence === 'high'
                    ? 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                    : scanResult.confidence === 'medium'
                    ? 'bg-amber-200 text-amber-900 border border-amber-400'
                    : 'bg-rose-200 text-rose-900 border border-rose-400'
                }`}>
                  {scanResult.confidence.toUpperCase()} CONFIDENCE
                </span>
              </div>

              {scanResult.matchFound && scanResult.matchedScheme && (
                <p className="text-xs text-emerald-900/90 mt-3 leading-relaxed">
                  {scanResult.matchedScheme.shortDescription}
                </p>
              )}

              {!scanResult.matchFound && (
                <p className="text-xs text-amber-900/90 mt-3 leading-relaxed">
                  This advertisement does not match any officially recognized central or state government scheme in our database. Do not share personal details, bank OTPs, or transfer money.
                </p>
              )}
            </div>

            {/* Red Flags Warning Block */}
            {scanResult.redFlags && scanResult.redFlags.length > 0 && (
              <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Detected Scam / Fraud Indicators ({scanResult.redFlags.length})</span>
                </div>
                <ul className="space-y-2">
                  {scanResult.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-rose-900 font-semibold flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-rose-200">
                      <span className="text-rose-600 font-bold shrink-0">✖</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions & Recommendation Link */}
            <div className="flex flex-wrap gap-3 pt-2">
              {scanResult.matchFound && scanResult.matchedScheme?.officialUrl && (
                <a
                  href={scanResult.matchedScheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Official Portal</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => navigate('/get-started')}
                className="py-3 px-5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-saffron" />
                <span>Check My Eligibility for This Scheme</span>
              </button>

              <button
                type="button"
                onClick={handleResetScan}
                className="py-3 px-4 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs rounded-xl border border-outline-variant inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-on-surface-variant" />
                <span>Scan Another Ad</span>
              </button>
            </div>

            {/* Collapsible Extracted OCR Text Box */}
            <div className="border border-outline-variant/60 rounded-2xl overflow-hidden bg-surface">
              <button
                type="button"
                onClick={() => setShowExtractedText(!showExtractedText)}
                className="w-full p-4 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-surface-container-low transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>View Extracted Ad Text (OCR Transparency)</span>
                </span>
                <Eye className="w-4 h-4 text-on-surface-variant" />
              </button>

              {showExtractedText && (
                <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/40 text-xs text-on-surface-variant font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {scanResult.extractedText || "No text extracted."}
                </div>
              )}
            </div>

            {/* Official Disclaimer */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-300 dark:border-slate-700">
              ℹ️ <strong>Disclaimer:</strong> {scanResult.disclaimer}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
