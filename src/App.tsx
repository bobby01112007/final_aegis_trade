import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  FileDown,
  ArrowRight, 
  Upload, 
  Globe, 
  Cpu, 
  Sparkles, 
  Lock, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Mail,
  Building,
  User,
  Info,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  Check,
  History,
  X,
  ArrowLeftRight,
  Eye,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import AegisOracleChat from './components/AegisOracleChat';
import { StaggeredContainer, StaggerItem, RevealText, TypewriterText, ScrambleText, WordFadeIn, GradualSpacing } from './components/AnimatedText';
import { AmbientAudioPlayer } from './components/AmbientAudioPlayer';
import { exportValidationReportToPDF } from './components/pdfGenerator';
import RegulatoryDatabase from './components/RegulatoryDatabase';
import { APP_TRANSLATIONS } from './translations';

// Interfaces for types used
interface ComplianceIssue {
  severity: 'low' | 'medium' | 'high';
  field: string;
  message: string;
  resolution: string;
}

interface ValidationReport {
  documentName: string;
  documentType: string;
  timestamp: string;
  complianceRatio: number;
  hsCodeConfidence: string;
  hsCodeSuggested: string;
  destinationFit: boolean;
  issues: ComplianceIssue[];
  rawTextSimulated: string;
  signatureAnalysis?: {
    detected: boolean;
    signerName?: string;
    confidence: string;
    locationBox: string;
  };
}

export default function App() {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const t = APP_TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'Platform' | 'Solutions' | 'Insights' | 'Regulations' | 'Manifesto' | 'Contact'>('Platform');
  const [isValidationWorkspace, setIsValidationWorkspace] = useState(false);
  
  // States for Validation Workspace
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [presetSelected, setPresetSelected] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfParseError, setPdfParseError] = useState<string | null>(null);
  const [signatureSetting, setSignatureSetting] = useState<'filled' | 'empty'>('filled');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Recent Scans drawer & conflict detection
  const [recentScans, setRecentScans] = useState<ValidationReport[]>([
    {
      documentName: 'Dak Lak Robusta Invoice #29402.pdf',
      documentType: 'Sovereign PDF Customs manifest',
      timestamp: '2026-05-27 16:35:10 UTC',
      complianceRatio: 100,
      hsCodeConfidence: '100% FDA Match',
      hsCodeSuggested: '0901.11.00',
      destinationFit: true,
      issues: [],
      rawTextSimulated: 'Invoice #29402 Dak Lak Robusta Coffee Coop to US Port of Seattle. Moisture: 12.5%. VietGAP: VN-94827-DL.'
    },
    {
      documentName: 'Binh Thuan DragonFruit Manifest.csv',
      documentType: 'Raw Ingestion',
      timestamp: '2026-05-27 15:42:01 UTC',
      complianceRatio: 95,
      hsCodeConfidence: '99% GACC Match',
      hsCodeSuggested: '0810.90.92',
      destinationFit: true,
      issues: [
        {
          severity: 'low',
          field: 'COLD_CHAIN_LOG',
          message: 'Cold chain temperature logs contain a brief 15-minute gap of telemetry data during loading at Port of Cat Lai.',
          resolution: 'Validate and append secondary physical sensory sticker logs to verify uninterrupted cooling before final destination submit.'
        }
      ],
      rawTextSimulated: 'Fruit Batch: Binh Thuan Bio-Farm DragonFruit to GACC China Customs. Port: Cat Lai. GAP code: BT-8592-GAC.'
    }
  ]);
  const [isRecentScansOpen, setIsRecentScansOpen] = useState(false);
  const [conflictComparisonReport, setConflictComparisonReport] = useState<ValidationReport | null>(null);
  const [isComparingConflicts, setIsComparingConflicts] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);

  // States for Emailing Report Certificate
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSendSuccess, setEmailSendSuccess] = useState(false);

  // States for Contact form
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', org: '', note: '' });

  // Interactive Live Validation Experience States
  const [liveInvoiceType, setLiveInvoiceType] = useState<'A' | 'B'>('A');
  const [liveScanStatus, setLiveScanStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [liveHighlightField, setLiveHighlightField] = useState<string | null>(null);
  const [liveScore, setLiveScore] = useState(100);
  const [liveIssuesList, setLiveIssuesList] = useState<any[]>([]);
  const [liveScanStepMsg, setLiveScanStepMsg] = useState('');
  const [hoveredMapNode, setHoveredMapNode] = useState<string | null>(null);

  const startLiveSimulation = () => {
    setLiveScanStatus('scanning');
    setLiveScore(100);
    setLiveIssuesList([]);
    setLiveHighlightField(null);
    setLiveScanStepMsg('Initializing real-time OCR and GACC/FDA parsing rules...');
    
    const steps = [
      { field: 'exporter', msg: 'Validating exporter agricultural register identities and organic credentials...', score: 100, issue: null },
      { 
        field: 'items', 
        msg: 'Decoding HS-Harmonized categories & phytosanitary treatment certifications...', 
        score: liveInvoiceType === 'A' ? 95 : 100, 
        issue: liveInvoiceType === 'A' ? {
          type: 'warning',
          title: 'Cold Chain telemetry gap detected',
          desc: 'Brief telemetry loss (15 mins) identified in refrigerated container logs during final loading at Port of Cat Lai.'
        } : null
      },
      { 
        field: 'details', 
        msg: 'Checking bilateral trade agreement (ACFTA / EVFTA / VJEPA) compliance...', 
        score: liveInvoiceType === 'A' ? 95 : 100, 
        issue: null
      },
      { field: 'done', msg: 'Autonomous scan and agricultural border compliance checks complete.', score: liveInvoiceType === 'A' ? 95 : 100, issue: null }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const s = steps[currentStep];
        setLiveHighlightField(s.field);
        setLiveScanStepMsg(s.msg);
        setLiveScore(s.score);
        if (s.issue) {
          setLiveIssuesList(prev => [...prev, s.issue]);
        }
        currentStep++;
      } else {
        clearInterval(interval);
        setLiveScanStatus('done');
        setLiveHighlightField(null);
      }
    }, 1200);
  };

  // Preset trade document files for beautiful simulation
  const documentPresets = [
    {
      id: 'dragon-fruit',
      name: 'Binh Thuan Dragon Fruit GACC Manifest.txt',
      type: 'China GACC Phytosanitary Declaration',
      rawText: 'ORIGIN: Binh Thuan, Vietnam | DESTINATION: Pingxiang Border Point, China | DECLARED: Fresh Red Dragon Fruit (Hylocereus polyrhizus) | GACC REGISTRATION NO: VN-GACC-772183 | PHYTOSANITARY NO: VN-12209-PT | WEIGHT: 18,500 KG | PACKING: Vent boxes | TEMPERATURE COLD CHAIN: 5.5°C | PESTICIDE RESIDUE: MRL limits check - Non-detected (Acrinathrin 0.01 mg/kg limit matched).'
    },
    {
      id: 'coffee-usa',
      name: 'Dak Lak Robusta Coffee Bill of Lading.txt',
      type: 'US FDA Food Safety Audit Certificate',
      rawText: 'SHIPPER: Central Highlands Agro-Export JSC, Buon Ma Thuot, VN | CONSIGNEE: Pacific Roasted Co, Seattle, USA | CARRIER: Vietnam Ocean Shipper | PORT_OF_LOADING: Port of Cat Lai, VN | PORT_OF_DISCHARGE: Port of Seattle, USA | FDA REG_NO: 19820492193 | ITEM_DECLARATION: Green Robusta Coffee Beans (Premium Grade 1) | WEIGHT: 38,000 KG | MOISTURE CONTENT: 12.1% (Standard FDA guideline ceiling 13.0% OK) | FSMA SUPPLIER VERIFICATION: Active.'
    },
    {
      id: 'mango-japan',
      name: 'Cao Lanh Mango Quarantine Treaty.txt',
      type: 'Japan Customs Pesticide Residue Manifest',
      rawText: 'PRODUCER: Cao Lanh Cooperative, Dong Thap, VN | IMPORTER: Kansai Fruits Importers, Osaka, JP | COMMODITY: Fresh Cat Chu Mangoes (Mangifera indica) | QUARANTINE METHOD: Vapor Heat Treatment (VHT) at 47°C for 20 mins | RESIDUE TEST: Chlorpyrifos <0.01 ppm (Japan MRL limit 0.05 ppm OK) | INSPECTING BODY: Plant Protection Department (PPD) VN.'
    }
  ];

  // Simulated validation step text
  const validationSteps = t.workspace.complianceSteps;



  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = async (file: File) => {
    setUploadedFile(file);
    setPresetSelected(null);
    setPdfParseError(null);

    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (isPDF) {
      setIsParsingPdf(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/compliance/parse-pdf", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error ${response.status} from parser model.`);
        }

        const data = await response.json();
        setIsParsingPdf(false);
        
        // Pass the extracted PDF text to the compliance scanning engine
        triggerScan(file.name, "Sovereign PDF Customs manifest", data.text || "");
      } catch (error: any) {
        console.error("PDF parsing error:", error);
        setIsParsingPdf(false);
        setPdfParseError(error.message);
        triggerScan(
          file.name, 
          "Failed PDF compliance scan", 
          `[ERROR: Parser returned communication exception: ${error.message}]. Please check if server-side PDF parser is fully initialized.`
        );
      }
    } else {
      // Raw text/JSON/CSV file parsed client-side using native FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileText = e.target?.result as string || "";
        triggerScan(file.name, file.type || "Document Ingestion", fileText);
      };
      reader.onerror = () => {
        triggerScan(file.name, file.type || "Document Ingestion", `Raw uploaded character buffers: Size=${file.size} bytes. User loaded file record: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  const selectPreset = (presetId: string) => {
    const preset = documentPresets.find(p => p.id === presetId);
    if (!preset) return;
    setPresetSelected(presetId);
    setUploadedFile(null);
    triggerScan(preset.name, preset.type, preset.rawText);
  };

  const triggerScan = (name: string, type: string, rawText: string) => {
    setIsScanning(true);
    setScanStep(0);
    setReport(null);

    // Dynamic cinematic interval updates for steps
    const intervalTime = 700;
    const progressTimer = setInterval(() => {
      setScanStep(prev => {
        if (prev >= validationSteps.length - 1) {
          clearInterval(progressTimer);
          // High-grade simulation of data structured based on inputs
          setTimeout(() => {
            generateComplianceReport(name, type, rawText);
            setIsScanning(false);
          }, 400);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);
  };

  const generateComplianceReport = (name: string, type: string, rawText: string) => {
    // Generate intelligent-looking compliance issues based on text content
    const isDragonFruit = name.toLowerCase().includes('dragon') || rawText.includes('GACC') || rawText.includes('Binh Thuan');
    const isCoffee = name.toLowerCase().includes('coffee') || rawText.includes('FDA') || rawText.includes('Dak Lak') || rawText.includes('Robusta');
    const isMango = name.toLowerCase().includes('mango') || rawText.includes('Cao Lanh') || rawText.includes('Japan');

    let complianceRatio = 98;
    let hsCodeSuggested = "0810.90.92";
    let hsCodeConfidence = "94%";
    let issues: ComplianceIssue[] = [];

    if (isCoffee) {
      hsCodeSuggested = "0901.11.00";
      hsCodeConfidence = "100% FDA Match";
      complianceRatio = 100;
      issues = []; // Pristine compliance!
    } else if (isDragonFruit) {
      hsCodeSuggested = "0810.90.92";
      hsCodeConfidence = "99% GACC Match";
      complianceRatio = 95;
      issues = [
        {
          severity: 'low',
          field: 'COLD_CHAIN_LOG',
          message: 'Cold chain temperature logs contain a brief 15-minute gap of telemetry data during loading at Port of Cat Lai.',
          resolution: 'Validate and append secondary physical sensory sticker logs to verify uninterrupted cooling before final destination submit.'
        }
      ];
    } else if (isMango) {
      hsCodeSuggested = "0804.50.00";
      hsCodeConfidence = "95% MRL Match";
      complianceRatio = 88;
      issues = [
        {
          severity: 'medium',
          field: 'VHT_CERTIFICATION_SIGNATURE',
          message: 'Quarantine Certificate indicates Vapor Heat Treatment (VHT) at 47°C but lacks the signed seal of the registered VN Plant Protection Department observer.',
          resolution: 'Request the dispatch office of the Cao Lanh hot water treatment cooperative to sign and seal page 2 of the digital quarantine record.'
        }
      ];
    } else {
      // Custom uploaded file simulation
      complianceRatio = 96;
      hsCodeSuggested = "0810.90.00";
      hsCodeConfidence = "88% Statistical Match";
      issues = [
        {
          severity: 'low',
          field: 'METADATA_EVALUATION',
          message: 'Uploaded file contains incomplete VietGAP / GlobalGAP registry indicators.',
          resolution: 'Provide VietGAP license identifier in invoice attributes to bypass priority border inspections.'
        }
      ];
    }

    // AI vision check for signature presence / empty box
    const signatureFilled = signatureSetting === 'filled';
    if (!signatureFilled) {
      complianceRatio = Math.max(50, complianceRatio - 15);
      issues.unshift({
        severity: 'high',
        field: 'AI_SIGNATURE_VALIDATION',
        message: 'The official signature column for the exporter representative is completely empty. Vision Model analysis detected 0% handwritten ink signature density in the target box.',
        resolution: 'Apply physical ink or authenticated digital signature to the observer/exporter clearance column before final custom pipeline submit.'
      });
    }

    const newReport: ValidationReport = {
      documentName: name,
      documentType: type,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      complianceRatio,
      hsCodeConfidence,
      hsCodeSuggested,
      destinationFit: complianceRatio >= 90,
      issues,
      rawTextSimulated: rawText,
      signatureAnalysis: {
        detected: signatureFilled,
        signerName: signatureFilled ? 'Nguyen Van Luc' : undefined,
        confidence: signatureFilled ? '99.8% Vision Match' : '100% Signature Absence Detected',
        locationBox: 'Box 12-B (Authorized Exporter Signature)'
      }
    };

    setReport(newReport);
    setRecentScans(prev => {
      const filtered = prev.filter(r => r.documentName !== name);
      return [newReport, ...filtered].slice(0, 5);
    });
  };



  const resetAllValidation = () => {
    setPresetSelected(null);
    setUploadedFile(null);
    setReport(null);
    setIsScanning(false);
  };

  return (
    <div className={`relative min-h-screen text-foreground selection:bg-white/10 selection:text-white flex flex-col justify-between ${language === 'vi' ? 'lang-vi' : ''}`} style={{ fontFamily: "var(--font-body)" }}>
      {/* Background Fullscreen Video & Blur overlays */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        />
        {/* Subtle vignette and cinematic dark overlay */}
        <div className="absolute inset-0 bg-black/45 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001420]/90 via-transparent to-[#001420]/30 z-[2]" />
      </div>

      {/* Glassmorphic Navigation Bar */}
      <header className="relative z-10 py-6 border-b border-white/[0.04] bg-white/[0.005] backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto px-8 flex flex-row justify-between items-center">
          <button 
            id="nav-logo"
            onClick={() => { setActiveTab('Platform'); setIsValidationWorkspace(false); }} 
            className="flex items-center gap-2 group cursor-pointer transition-transform duration-300"
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center p-[0.14rem] transition-all group-hover:bg-white/20">
              <div className="w-full h-full rounded-full border border-white/40 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 2v20" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                  <path d="M5 11c2.5 1.25 5.5 1.25 8 0" strokeWidth="0.8" />
                </svg>
              </div>
            </div>
            <span 
              className="text-2xl tracking-tight text-white flex items-center gap-1.5" 
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="italic font-normal">Aegis</span>
              <span className="font-light text-white/70">Trade</span>
              <span className="text-[9px] font-mono tracking-widest text-[#d4af37]/80 font-semibold uppercase ml-1">SYSTEM</span>
            </span>
          </button>

          {/* Nav Links (hidden on mobile) */}
          <nav className="hidden md:flex flex-row items-center gap-8">
            {(['Platform', 'Solutions', 'Insights', 'Regulations', 'Manifesto', 'Contact'] as const).map((tab) => (
              <button
                id={`nav-${tab.toLowerCase()}`}
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsValidationWorkspace(false);
                }}
                className={`text-sm tracking-wide transition-all duration-300 cursor-pointer relative py-1 ${
                  activeTab === tab 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'Platform' ? t.nav.platform : tab === 'Solutions' ? t.nav.solutions : tab === 'Insights' ? t.nav.insights : tab === 'Regulations' ? t.nav.regulations : tab === 'Manifesto' ? t.nav.manifesto : t.nav.contact}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                    transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Language Switcher and Nav CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(lang => lang === 'vi' ? 'en' : 'vi')}
              className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 text-white transition-all cursor-pointer flex items-center gap-1 font-mono hover:scale-105"
            >
              <span>{t.nav.changeLanguageBtn}</span>
            </button>

            <button
              id="nav-cta-launch"
              onClick={() => {
                setActiveTab('Platform');
                setIsValidationWorkspace(true);
              }}
              className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-all duration-300 cursor-pointer text-center font-medium shadow-lg"
            >
              {t.nav.launchCta}
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area Container */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-6">
        <AnimatePresence mode="wait">
          {/* PLATFORM - Normal State View */}
          {activeTab === 'Platform' && !isValidationWorkspace && (
            <div className="w-full flex flex-col items-center">
              {/* HERO SECTION - RESTRUCTURED FOR VN AGRI COOP */}
              <motion.section 
                id="platform-home"
                key="platform-home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center pt-28 pb-20 w-full max-w-5xl"
              >
                <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full text-[10px] font-mono text-[#d4af37] tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <ScrambleText text={t.hero.badge} delay={0.2} duration={1.2} />
                </div>
                
                <StaggeredContainer 
                  className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-5xl font-normal text-white text-center select-none"
                  delay={0.1}
                >
                  <h1 id="main-heading" style={{ fontFamily: "var(--font-display)" }}>
                    <StaggerItem>{t.hero.title1}</StaggerItem>{' '}
                    <StaggerItem className="text-[#d4af37]/90 italic">{t.hero.title2}</StaggerItem>{' '}
                    <StaggerItem>{t.hero.title3}</StaggerItem>{' '}
                    <StaggerItem className="text-white/40 italic">{t.hero.title4}</StaggerItem>
                  </h1>
                </StaggeredContainer>
                
                <RevealText 
                  delay={0.5}
                  className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-8 leading-relaxed font-normal"
                >
                  <WordFadeIn delay={0.6} className="text-muted-foreground text-sm sm:text-base max-w-2xl text-center leading-relaxed font-normal">
                    {t.hero.subtitle}
                  </WordFadeIn>
                </RevealText>

                <div className="animate-fade-rise-delay-2 flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <button
                    id="platform-cta-begin"
                    onClick={() => setIsValidationWorkspace(true)}
                    className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 hover:scale-[1.03] cursor-pointer transition-all duration-300 font-medium tracking-wide shadow-2xl flex items-center gap-2 group"
                  >
                    {t.hero.triggerBtn}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 opacity-70" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveTab('Solutions');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-10 py-5 text-base text-white mt-12 cursor-pointer transition-all duration-300 font-medium"
                  >
                    {t.hero.plansBtn}
                  </button>
                </div>

                {/* Minimal Trust Indicator - Ultra clean & luxury */}
                <div className="mt-20 pt-8 border-t border-white/[0.04] w-full max-w-2xl text-center flex flex-row justify-around text-[9px] tracking-[0.2em] font-mono text-muted-foreground/60 uppercase">
                  <span>{t.hero.badge1}</span>
                  <span>•</span>
                  <span>{t.hero.badge2}</span>
                  <span>•</span>
                  <span>{t.hero.badge3}</span>
                </div>
              </motion.section>

              {/* OVERVIEW SECTION: THE PROBLEM */}
              <section className="w-full py-24 border-t border-white/[0.03] border-b border-white/[0.03] bg-black/10 text-left">
                <div className="max-w-5xl mx-auto px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-4">
                      <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-400 uppercase">{t.problem.tag}</span>
                      <h2 className="text-4xl text-white font-normal leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                        {t.problem.title}
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {t.problem.desc1}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {t.problem.desc2}
                      </p>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-white/[0.01] border border-white/[0.05] space-y-2">
                        <div className="w-8 h-8 rounded bg-rose-500/10 flex items-center justify-center font-mono text-xs text-rose-400 font-bold border border-rose-500/20">🔴</div>
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                          {language === 'vi' ? 'Giấy tờ rời rạc' : 'Inconsistent Paperwork'}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {language === 'vi'
                            ? 'Sai lệch chính tả nhỏ, bất nhất khối lượng hoặc số lượng giữa packing list, chứng thư kiểm dịch thực vật và hóa đơn gây hủy toàn bộ lô hàng.'
                            : 'Minor typographical mistakes, mismatched weights or counts between packing lists, phytosanitary sheets, and invoices spark full batch rejections.'}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-white/[0.01] border border-white/[0.05] space-y-2">
                        <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center font-mono text-xs text-amber-400 font-bold border border-amber-500/20">🟡</div>
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                          {language === 'vi' ? 'Quy định rời rạc' : 'Scattered Regulations'}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {language === 'vi'
                            ? 'Luật đăng ký, quy chế kiểm dịch rải rác trên hàng chục website nhà nước, buộc Forwarder và doanh nghiệp nông nghiệp khai báo mù quáng.'
                            : 'Rules are scattered across dozens of foreign government sites in varying languages, forcing exporters to interpret requirements blindly.'}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-white/[0.01] border border-white/[0.05] space-y-2">
                        <div className="w-8 h-8 rounded bg-rose-500/10 flex items-center justify-center font-mono text-xs text-rose-400 font-bold border border-rose-500/20">⚡</div>
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                          {language === 'vi' ? 'Nông sản mau hỏng' : 'Deteriorating Perishables'}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {language === 'vi'
                            ? 'Nông sản, trái cây dễ hỏng khi kẹt bãi biên giới mất phẩm cấp tươi ngon hoặc hư thối thâm hụt tài chính nặng cho hợp tác xã nông nghiệp.'
                            : 'Perishable agricultural cargo loses physical grading quality or spoils entirely, leading to massive financial losses for local cooperatives.'}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-white/[0.01] border border-[#d4af37]/15 space-y-2">
                        <div className="w-8 h-8 rounded bg-[#d4af37]/10 flex items-center justify-center font-mono text-xs text-[#d4af37] font-bold border border-[#d4af37]/20">🔒</div>
                        <h4 className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-mono">
                          {language === 'vi' ? 'SMEs Bị Kìm Hãm' : 'Bridges Locked For SMEs'}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {language === 'vi'
                            ? 'Hợp tác xã vừa và nhỏ khó vươn ra xa do thiếu dòng kinh phí thuê mướn các đơn vị kiểm toán rủi ro và pháp lý thương mại quốc tế.'
                            : 'Small and medium exporters (SMEs) struggle with complex market entry clearances without access to expensive legal consultants.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SOLUTION INTRODUCTION */}
              <section className="w-full py-24 text-left">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                  <div className="lg:col-span-3 space-y-6">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
                      {language === 'vi' ? 'ĐỘNG CƠ GIẢI QUYẾT TOÀN DIỆN' : 'THE AEGIS COGNITIVE SOLVER'}
                    </span>
                    <h2 className="text-4xl text-white font-normal mt-0" style={{ fontFamily: "var(--font-display)" }}>
                      {language === 'vi' ? 'Số Hóa Đối Soát Xuất Khẩu Bằng AI' : 'AI-Powered Export Compliance'}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {language === 'vi'
                        ? 'Chúng tôi kiến tạo giải pháp phần mềm chuyên biệt hóa phục vụ riêng cho các hợp tác xã nông nghiệp Việt Nam. Với sự kết hợp giữa số hóa ký thuyết OCR, tổng hợp thông minh LLM và rà soát song diện quy tắc thuế quan, chúng tôi hỗ trợ hoàn thiện hồ sơ chỉ dưới 3 phút.'
                        : 'We are building a smart, localized SaaS platform tailored specifically to Vietnamese agricultural shippers. By combining OCR document digitization, LLM regulation synthesis, and automated bilateral cross-checking, we resolve export documentation in under 3 minutes.'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[10px] text-white/80">
                      <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                        <p className="text-muted-foreground uppercase text-[8.5px]">
                          {language === 'vi' ? 'QUY TRÌNH KIỂM THỦ CÔNG' : 'MANUAL SHIPMENT AUDIT'}
                        </p>
                        <p className="text-sm font-semibold text-rose-400 mt-1">
                          {language === 'vi' ? '~45 phút' : '~45 minutes'}
                        </p>
                      </div>
                      <div className="p-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-lg">
                        <p className="text-[#d4af37] uppercase text-[8.5px]">
                          {language === 'vi' ? 'ĐỐI SOÁT QUA AEGIS' : 'AEGIS PLATFORM AUDIT'}
                        </p>
                        <p className="text-sm font-semibold text-[#d4af37] mt-1">
                          {language === 'vi' ? '< 3 phút' : '< 3 minutes'}
                        </p>
                      </div>
                      <div className="p-3 bg-white/[0.02] border border-emerald-500/20 rounded-lg">
                        <p className="text-emerald-400 uppercase text-[8.5px]">
                          {language === 'vi' ? 'TỔNG TỐC ĐỘ CHUẨN XÁC' : 'ACCURACY ACCELERATOR'}
                        </p>
                        <p className="text-sm font-semibold text-emerald-400 mt-1">
                          {language === 'vi' ? 'Tương đương 99.87%' : '99.87% Parity'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] space-y-4">
                    <h4 className="text-xs font-mono font-semibold text-[#d4af37] uppercase tracking-widest">
                      {language === 'vi' ? 'Bộ Phận Cơ Bản Hệ Thống' : 'Sovereign Components'}
                    </h4>
                    <ul className="space-y-3.5 text-xs text-muted-foreground font-sans">
                      <li className="flex items-start gap-2">
                        <span className="text-[#d4af37] mt-0.5">•</span>
                        <span>
                          <strong>OCR Digitizer</strong>: {language === 'vi' ? 'Trích xuất chính xác cấu trúc ký tự từ chứng từ y tế nông sản phức tạp và vận đơn.' : 'Structural character capture of complex phytosanitary forms and bill manifests.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#d4af37] mt-0.5">•</span>
                        <span>
                          <strong>Generative AI (GenAI)</strong>: {language === 'vi' ? 'Sử dụng mô hình ngôn ngữ lớn xử lý tinh gọn biểu lệnh FDA Mỹ và mã GACC Trung Quốc dưới dạng song ngữ.' : 'Localized multi-lingual models parsing GACC and US FDA directives in bilingual formats.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#d4af37] mt-0.5">•</span>
                        <span>
                          <strong>Regulatory Knowledge Net</strong>: {language === 'vi' ? 'Mạng lưới lưu trữ thông tin kiểm dịch liên biên giới, chỉ số tồn dư MRL hóa chất nông nghiệp.' : 'Active cache of quarantine restrictions, MRL residue caps, and customs gates.'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* CORE FEATURES DIRECTORY & DYNAMIC SANDBOX */}
              <section className="w-full py-24 border-t border-white/[0.03] bg-[#001420]/15 text-left">
                <div className="max-w-5xl mx-auto px-6">
                  <div className="text-center mb-16 space-y-2">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase">
                      {language === 'vi' ? 'HỆ SINH THÁI TUÂN THỦ TOÀN DIỆN' : 'COMPLIANCE ECOSYSTEM IN FOCUS'}
                    </span>
                    <h2 className="text-4xl text-white font-normal" style={{ fontFamily: "var(--font-display)" }}>
                      {language === 'vi' ? 'Ba Trụ Cột Đảm Bảo Xuất Khẩu' : 'Three Pillars of Agrarian Parity'}
                    </h2>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {language === 'vi'
                        ? 'Các phân hệ thuật toán thông minh được thế kế chuyên biệt nhằm triệt tiêu sai lầm chứng từ cửa khẩu và đẩy nhanh tốc độ thông quan hải quan.'
                        : 'Sovereign code modules designed directly to eradicate customs errors and accelerate border authority clearance.'}
                    </p>
                  </div>

                  {/* Asymmetric Core Feature Outline */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-[#d4af37]/30 transition-all">
                      <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-4">
                        <Globe className="w-5 h-5 text-[#d4af37]" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-2">
                        {language === 'vi' ? '1. Trung Tâm Quy Chuẩn' : '1. Regulation Hub'}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                        {language === 'vi'
                          ? 'Dữ liệu hải quan tập hợp trực tiếp các chính sách kiểm dịch vệ sinh động thực vật thực tế từ các thị trường nhập khẩu lớn: Mỹ (FDA), Trung Quốc (GACC 248), Nhật Bản, Hàn Quốc...'
                          : 'Centralized compliance directory aggregating official customs policies from major import economies: USA (FDA / FSMA), China (GACC Code 248), Japan, and South Korea, all structured inside a simplified, searchable interface.'}
                      </p>
                      <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-white/50">FDA / GACC PORTAL</span>
                    </div>

                    <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-[#d4af37]/30 transition-all">
                      <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-4">
                        <FileText className="w-5 h-5 text-[#d4af37]" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-2">
                        {language === 'vi' ? '2. Số Hóa OCR & GenAI' : '2. OCR + GenAI Extraction'}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                        {language === 'vi'
                          ? 'Sổ số hóa tự động hóa đơn, Packing List, chứng từ hải quan đường biển C/O và chứng thư y tế thực vật. Sửa lỗi chính tả song ngữ ngay lập tức.'
                          : 'Autonomous parsing of commercial invoices, packing lists, bill of lading sheets, Certificates of Origin (C/O), and phytosanitary treatment certificates. Corrects language errors and extracts nested line-level commodities instantly.'}
                      </p>
                      <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-white/50">MULTI-LANGUAGE OCR</span>
                    </div>

                    <div className="p-6 bg-white/[0.01] border border-[#d4af37]/15 rounded-xl hover:border-[#d4af37]/50 transition-all">
                      <div className="w-10 h-10 rounded-full bg-[#d4af37]/25 flex items-center justify-center mb-4">
                        <ShieldAlert className="w-5 h-5 text-[#d4af37]" />
                      </div>
                      <h4 className="text-sm font-semibold text-[#d4af37] mb-2">
                        {language === 'vi' ? '3. Kiểm Chéo & Rủi Ro' : '3. Cross-Checking & Risk'}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                        {language === 'vi'
                          ? 'Chạy so sánh đối chéo toàn bộ tập hồ sơ đính kèm. Định vị rủi ro sai lệch số lượng, quá đát kiểm dịch hoặc thiếu mộc dấu chứng thực đỏ hải quan.'
                          : 'Runs comprehensive algorithmic comparisons across all sheets. Highlights quantity mismatches, pesticide residue caps, and missing quarantine stamps. Renders clean validation alerts with: 🔴 Critical, 🟡 Warning, 🟢 Ready.'}
                      </p>
                      <span className="text-[9px] font-mono bg-[#d4af37]/20 px-2 py-0.5 rounded text-[#d4af37]">DISCREPANCY DETECTOR</span>
                    </div>
                  </div>

                  {/* Sandbox Interface */}
                  <div className="mt-8 border-t border-white/[0.05] pt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                      <div className="lg:col-span-2 space-y-4">
                        <span className="text-[9px] font-mono tracking-widest text-[#d4af37] uppercase">
                          {language === 'vi' ? 'Sân Chơi Thực Nghiệm Đối Soát' : 'Interactive Sandbox Playground'}
                        </span>
                        <h3 className="text-2xl text-white font-normal" style={{ fontFamily: "var(--font-display)" }}>
                          {language === 'vi' ? 'Trải Nghiệm Chu Kỳ Thẩm Định AI' : 'Experience the AI Audit Lifecycle'}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {language === 'vi'
                            ? 'Chạy thử hệ thống kiểm tác nông sản tự động. Chọn một hành lang corridor xuất khẩu Việt Nam mẫu bên dưới và nhấn khởi tạo đối soát để xem Aegis định vị con dấu và quét rủi ro thời gian thực.'
                            : 'Test the automated agricultural checking engine. Select an active Vietnamese harvest import corridor and run a compliance test to watch Aegis inspect, cross-check, and grade in real time.'}
                        </p>

                        <div className="flex flex-row gap-2">
                          <button
                            onClick={() => { setLiveInvoiceType('A'); setLiveScanStatus('idle'); setLiveIssuesList([]); }}
                            className={`flex-1 rounded-full py-2.5 text-xs font-mono border transition-all cursor-pointer ${
                              liveInvoiceType === 'A' 
                                ? 'bg-white/10 border-[#d4af37]/40 text-[#d4af37]' 
                                : 'bg-transparent border-white/[0.06] text-muted-foreground hover:text-white'
                            }`}
                          >
                            {language === 'vi' ? 'Thanh Long Đi Trung Quốc' : 'Dragon Fruits to China'}
                          </button>
                          <button
                            onClick={() => { setLiveInvoiceType('B'); setLiveScanStatus('idle'); setLiveIssuesList([]); }}
                            className={`flex-1 rounded-full py-2.5 text-xs font-mono border transition-all cursor-pointer ${
                              liveInvoiceType === 'B' 
                                ? 'bg-white/10 border-[#d4af37]/40 text-[#d4af37]' 
                                : 'bg-transparent border-white/[0.06] text-muted-foreground hover:text-white'
                            }`}
                          >
                            {language === 'vi' ? 'Cà Phê Đi Hoa Kỳ' : 'Robusta Coffee to USA'}
                          </button>
                        </div>

                        <button
                          onClick={startLiveSimulation}
                          disabled={liveScanStatus === 'scanning'}
                          className="w-full liquid-glass rounded-full py-4.5 text-xs font-semibold text-white tracking-wide hover:scale-[1.02] cursor-pointer transition-transform flex items-center justify-center gap-2"
                        >
                          {liveScanStatus === 'scanning' ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              <span>{language === 'vi' ? 'Đang Chạy Kiểm Định Thực Vật...' : 'Running Phytosanitary Checks...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{language === 'vi' ? 'Khởi Tạo Đối Soát Sandbox Tự Động' : 'Initiate Automated Sandbox Process'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Interactive Document Panel (Right Side of Sandbox) */}
                      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Simulated Invoice */}
                        <div className="bg-white/[0.015] border border-white/[0.06] rounded-xl p-5 text-left font-mono text-[10px] space-y-3 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-2 right-2 px-1.5 rounded bg-white/5 text-[8px] text-[#d4af37]/90 font-mono">EXPORT_HARVEST_RECORD</div>
                          
                          <div className="border-b border-white/[0.06] pb-2">
                            <p className="text-[8px] text-muted-foreground/50">{language === 'vi' ? 'SỐ_HIỆU_CHỨNG_THƯ_MẠNG_LƯỚI' : 'COGNITIVE_TRADE_PASSPORT'}</p>
                            <p className="text-white font-bold">{liveInvoiceType === 'A' ? 'VN-GACC-DF-2026' : 'VN-FDA-RC-2026'}</p>
                          </div>

                          <div className={`p-2 rounded transition-all ${liveHighlightField === 'exporter' ? 'bg-[#d4af37]/10 border border-[#d4af37]/20' : 'bg-transparent border border-transparent'}`}>
                            <p className="text-muted-foreground/50 text-[8.5px]">{language === 'vi' ? 'DOANH NGHIỆP ỦY THÁC CHỦ HÀNG' : 'REGISTERED SHIPPERS UNIT'}</p>
                            <p className="text-white mt-0.5">{liveInvoiceType === 'A' ? (language === 'vi' ? 'Công ty CP Trái Cây Tươi Bình Thuận, VN' : 'Binh Thuan Fresh Fruits JSC, VN') : (language === 'vi' ? 'Tập đoàn Xuất Nhập khẩu Nông sản Đắk Lắk, VN' : 'Dak Lak Agro-Export Corp, VN')}</p>
                          </div>

                          <div className={`p-2 rounded transition-all ${liveHighlightField === 'items' ? 'bg-[#d4af37]/10 border border-[#d4af37]/20' : 'bg-transparent border border-transparent'}`}>
                            <p className="text-muted-foreground/50 text-[8.5px]">{language === 'vi' ? 'DÒNG SẢN PHẨM KHAI BÁO CHUYÊN BIỆT' : 'DECLARED COMMODITY LINE'}</p>
                            <p className="text-white mt-0.5">{liveInvoiceType === 'A' ? (language === 'vi' ? 'Thanh Long Ruột Đỏ Tươi (Hạng A)' : 'Fresh Red Dragon Fruit (Grade A)') : (language === 'vi' ? 'Hạt Cà Phê Robusta Sấy Khô (Cao Cấp)' : 'Green Robusta Coffee Beans (Premium)')}</p>
                            <p className="text-muted-foreground/70 mt-1">{liveInvoiceType === 'A' ? (language === 'vi' ? 'Khối lượng: 18,500 KG / Nhiệt bảo quản: 5.5°C' : 'Qty: 18,500 KG / Temp: 5.5°C') : (language === 'vi' ? 'Khối lượng: 38,000 KG / Độ ẩm: 12.1%' : 'Qty: 38,000 KG / Moisture: 12.1%')}</p>
                          </div>

                          <div className={`p-2 rounded transition-all ${liveHighlightField === 'details' ? 'bg-[#d4af37]/10 border border-[#d4af37]/20' : 'bg-transparent border border-transparent'}`}>
                            <p className="text-muted-foreground/50 text-[8.5px]">{language === 'vi' ? 'LỘ TRÌNH VÀ SỐ HIỆU CONTAINER' : 'ROUTING & CONTAINER LOAD LINES'}</p>
                            <p className="text-white mt-0.5">{liveInvoiceType === 'A' ? (language === 'vi' ? 'Bình Thuận VN → Cửa Khẩu Hữu Nghị, Lạng Sơn → Bằng Tường, TQ' : 'Binh Thuan VN → Pingxiang Border Gate, CN') : (language === 'vi' ? 'Cảng Cát Lái, VN → Cảng Seattle, Mỹ' : 'Cat Lai Port, VN → Port of Seattle, USA')}</p>
                          </div>
                        </div>

                        {/* Sandbox Console scan feedback */}
                        <div className="bg-black/40 border border-white/[0.06] rounded-xl p-5 flex flex-col justify-between text-left relative min-h-[220px]">
                          {liveScanStatus === 'idle' && (
                            <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                              <Cpu className="w-5 h-5 text-muted-foreground/55 animate-pulse mb-2" />
                              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{language === 'vi' ? 'Hệ thống đang chờ' : 'Console Standby'}</p>
                              <p className="text-[9px] text-muted-foreground/45 mt-1 max-w-[150px]">{language === 'vi' ? 'Chọn corridor mẫu bên trái và nhấn nút khởi chạy' : 'Choose sample template & trigger check above'}</p>
                            </div>
                          )}

                          {liveScanStatus === 'scanning' && (
                            <div className="flex-grow flex flex-col justify-between">
                              <div className="space-y-3">
                                <p className="text-[9px] font-mono tracking-wider text-[#d4af37] animate-pulse">
                                  {language === 'vi' ? '● THẨM ĐỊNH AI ĐANG HOẠT ĐỘNG' : '● COGNITIVE AUDITOR EXECUTING'}
                                </p>
                                <p className="text-[10px] font-mono text-white/90 leading-normal">
                                  {language === 'vi' ? (
                                    liveScanStepMsg.includes('Initializing real-time') ? 'Đang khởi tạo quy trình số hóa ký tự OCR và luật phân tích GACC/FDA thực tế...' :
                                    liveScanStepMsg.includes('Validating exporter agricultural') ? 'Kiểm định danh tính hợp tác xã xuất khẩu và chứng nhận nông nghiệp hữu cơ...' :
                                    liveScanStepMsg.includes('Decoding HS-Harmonized') ? 'Giải mã phân loại mã hàng hóa HS và kiểm dịch thực vật bảo vệ thực vật...' :
                                    liveScanStepMsg.includes('Checking bilateral trade agreement') ? 'Rà soát tính tương thích của hiệp định đối tác thương mại song diện (ACFTA / EVFTA)...' :
                                    liveScanStepMsg.includes('Autonomous scan and agricultural') ? 'Thẩm duyệt tự động hoàn tất. Đã lập báo cáo đối chuẩn biên giới nông sản.' : liveScanStepMsg
                                  ) : liveScanStepMsg}
                                </p>
                              </div>
                              <div className="pt-4 border-t border-white/[0.04]">
                                <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                                  <span className="text-muted-foreground">{language === 'vi' ? 'PHẦN TRĂM HOÀN THÀNH:' : 'PARITY EVALUATION:'}</span>
                                  <span className="text-white font-semibold">{liveScore}%</span>
                                </div>
                                <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#d4af37] transition-all duration-300" style={{ width: `${liveScore}%` }} />
                                </div>
                              </div>
                            </div>
                          )}

                          {liveScanStatus === 'done' && (
                            <div className="flex-grow flex flex-col justify-between">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                                  <p className="text-[9px] font-mono tracking-wider text-emerald-400 font-bold">{language === 'vi' ? '● QUY TRÌNH HOÀN TẤT' : '● PARITY LOG COMPLETED'}</p>
                                  <div className="text-[9px] font-mono font-bold text-[#d4af37] bg-white/5 px-2 py-0.5 rounded">
                                    {liveScore}% {language === 'vi' ? 'HỢP QUY' : 'COMPLIANCE'}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  {liveIssuesList.length === 0 ? (
                                    <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/20 text-[9px] text-[#d4af37]">
                                      {language === 'vi' ? '🟢 Đã thông qua. Sẵn sàng nộp hải quan. Không có sai lệch.' : '🟢 Approved & ready for customs submission. Zero discrepancies found.'}
                                    </div>
                                  ) : (
                                    liveIssuesList.map((issue, index) => (
                                      <div key={index} className="p-2 rounded bg-white/[0.01] border border-white/[0.06] text-[9.5px]">
                                        <div className="flex items-center gap-1.5 text-white font-semibold font-mono">
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                          {language === 'vi' ? (
                                            issue.title.includes('telemetry gap') || issue.title.includes('telemetry') ? 'Phát hiện gián đoạn cảm ứng bãi lạnh' : issue.title
                                          ) : issue.title}
                                        </div>
                                        <p className="text-muted-foreground mt-1 leading-normal font-sans text-[9px]">
                                          {language === 'vi' ? (
                                            issue.desc.includes('telemetry loss') ? 'Ghi nhận khoảng trống dữ liệu viễn thám bãi lạnh (15 phút) trong nhật ký container tại cảng Cát Lái.' : issue.desc
                                          ) : issue.desc}
                                        </p>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-white/[0.04]">
                                <p className="text-[8px] font-mono text-muted-foreground/60 uppercase">
                                  {language === 'vi' ? 'Phù hợp hoàn toàn với Hải quan Điện tử Việt Nam và mẫu thông quan GACC/FDA.' : 'Compatible with Vietnam Electric Customs and GACC/FDA protocols.'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* COMPETITIVE ADVANTAGE GRID */}
              <section className="w-full py-24 text-left">
                <div className="max-w-5xl mx-auto px-6">
                  <div className="text-center mb-16 space-y-2">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase">
                      {language === 'vi' ? 'ĐẶC QUYỀN VƯỢT TRỘI CỦA AEGIS' : 'THE AEGIS EDGE REPRESENTATION'}
                    </span>
                    <h2 className="text-4xl text-white font-normal" style={{ fontFamily: "var(--font-display)" }}>
                      {language === 'vi' ? 'Lợi Thế Cạnh Tranh' : 'Competitive Advantage'}
                    </h2>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      {language === 'vi'
                        ? 'Các đặc tính kỹ thuật đột phá được cấu trúc riêng để gỡ bỏ hoàn toàn điểm nghẽn giấy tờ lưu bãi.'
                        : 'Custom structural advantages built specifically to clear blockages in high-volume export operations.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(language === 'vi' ? [
                      {
                        title: "Mô hình AI Siêu Bản địa hóa",
                        desc: "Được thiết kế riêng biệt cho các loại hóa đơn nông sản Việt Nam, danh mục kiểm định VietGAP, và biểu mẫu bảo vệ thực vật nội địa (Form C/O Form E / Form B). Mô hình được huấn luyện chuyên sâu theo trực giác giao diện Hải quan Việt Nam.",
                        tag: "ĐÀO TẠO ĐỊA PHƯƠNG"
                      },
                      {
                        title: "Bối cảnh Trí tuệ Hợp quy",
                        desc: "Khác với các công cụ OCR đa năng thông dụng, luồng xử lý của chúng tôi thấu hiểu sâu sắc các quy chuẩn kiểm dịch thực vật và quy tắc An toàn thực phẩm. Nhận diện chuẩn xác ppm dư lượng hóa chất, xử lý dung môi trong cả tiếng Anh và tiếng Việt.",
                        tag: "NHẬN THỨC SONG NGỮ"
                      },
                      {
                        title: "Cổng Thông tin Quy chuẩn Tập trung",
                        desc: "Không còn phải vất vả tra cứu trên hàng chục Cổng thông tin Chính phủ rời rạc hay dịch tay các tài liệu PDF thô. Doanh nghiệp xuất khẩu sở hữu điểm truy cập duy nhất cho các quy chuẩn FSMA Hoa Kỳ mới nhất, nghị định kiểm dịch GACC Trung Quốc.",
                        tag: "TẬP TRUNG QUY CHUẨN"
                      },
                      {
                        title: "Tốc độ Thông quan Vượt trội",
                        desc: "Cắt giảm thời gian rà soát thông tin chứng từ thủ công từ trung bình 45 phút đầy rủi ro cho mỗi lô container xuống dưới 3 phút xử lý tự động tuyệt đối tin cậy qua luồng AI thế hệ mới.",
                        tag: "TỐC ĐỘ VẬN HÀNH"
                      }
                    ] : [
                      {
                        title: "Hyper-Localized AI Models",
                        desc: "Engineered specifically for Vietnamese agricultural packing invoices, VietGAP catalogs, and domestic plant protection forms (C/O Form E / Form B). Models are natively trained in Vietnamese customs layout semantics.",
                        tag: "GEO-SPECIFIC TRAINING"
                      },
                      {
                        title: "Smart Compliance Intelligence Context",
                        desc: "Unlike standard multi-purpose OCR tools, our pipeline understands phytosanitary and food Safety contextual rules. It captures residue ppm tolerances, chemical treatments, and complex shipping metrics in both English and Vietnamese.",
                        tag: "BILINGUAL COGNITION"
                      },
                      {
                        title: "Centralized Global Portal",
                        desc: "No more scavenging through dozens of disconnected government sites or translating raw PDFs. Shippers gain single-point entry to up-to-date FSMA requirements, Chinese quarantine decrees, and Japanese residual guidelines.",
                        tag: "regulatory aggregation"
                      },
                      {
                        title: "Expedited Processing Durations",
                        desc: "Shrinks manual document cross-checking workflows from a laborious 45-minute average per container packet down to less than 3 minutes of automated, bullet-proof processing.",
                        tag: "Operational velocity"
                      }
                    ]).map((item, i) => (
                      <div key={i} className="p-8 rounded-xl bg-white/[0.01] border border-white/[0.05] flex flex-col justify-between min-h-[200px] hover:border-[#d4af37]/30 transition-all">
                        <div className="space-y-3">
                          <span className="text-[8.5px] font-mono tracking-widest text-[#d4af37] uppercase">{item.tag}</span>
                          <h4 className="text-lg font-normal text-white" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* MARKET OPPORTUNITY & EXPECTED IMPACT */}
              <section className="w-full py-24 border-t border-b border-white/[0.03] bg-black/10 text-left">
                <div className="max-w-5xl mx-auto px-6">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-400 block uppercase mb-2">
                    {language === 'vi' ? 'Động Phục Vĩ Mô Việt Nam' : 'Vietnam Macro Dynamics'}
                  </span>
                  <h2 className="text-4xl text-white font-normal mb-8" style={{ fontFamily: "var(--font-display)" }}>
                    {language === 'vi' ? 'Cơ Hội Thị Trường & Tác Động Dự Kiến' : 'Market Opportunity & Expected Impact'}
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="p-6 bg-white/[0.005] border border-white/[0.04] rounded-xl space-y-4">
                      <p className="text-xs font-mono text-muted-foreground">{language === 'vi' ? '01 / MẬT ĐỘ THỊ TRƯỜNG' : '01 / MARKET DENSITY'}</p>
                      <h4 className="text-2xl font-normal text-[#d4af37]" style={{ fontFamily: "var(--font-display)" }}>
                        {language === 'vi' ? 'Ngành Xuất Khẩu 7.2 Tỷ USD' : '$7.2 Billion Industry'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {language === 'vi'
                          ? 'Xuất khẩu rau quả Việt Nam thiết lập kỷ lục mọi thời đại đạt mức 7.2 tỷ USD năm 2024. Hơn 99% đơn vị sử dụng thông quan điện tử, tạo điều kiện thuận lợi tuyệt đối ứng dụng AI.'
                          : 'Vietnam’s fruit and vegetable exports hit an all-time record of USD 7.2 billion in 2024. Over 99% of registered exporters now utilize electronic customs platforms, establishing a high-readiness target audience for AI integration.'}
                      </p>
                    </div>

                    <div className="p-6 bg-white/[0.005] border border-white/[0.04] rounded-xl space-y-4">
                      <p className="text-xs font-mono text-muted-foreground">{language === 'vi' ? '02 / ỔN ĐỊNH BÃI LƯU KHO' : '02 / ECONOMIC STABILITY'}</p>
                      <h4 className="text-2xl font-normal text-emerald-400" style={{ fontFamily: "var(--font-display)" }}>
                        {language === 'vi' ? 'Tác Động Kinh Tế' : 'Economic Impact'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {language === 'vi'
                          ? 'Triệt tiêu tình trạng ùn ứ giấy tờ thông quan vùng biên. Khâu tiền kiểm chứng thực loại bỏ sai sót tờ khai gốc, ngăn ngừa rủi ro bị trả container và tối ưu chi phí bãi.'
                          : 'Substantially limits border delays and warehouse demurrage costs. Pre-checks remove document filing errors, avoiding expensive cargo rejection, and optimizing domestic logistics velocities.'}
                      </p>
                    </div>

                    <div className="p-6 bg-[#001420]/30 border border-white/[0.04] rounded-xl space-y-4">
                      <p className="text-xs font-mono text-[#d4af37]">{language === 'vi' ? '03 / KHAI SÁNG PHÁP LÝ' : '03 / SOCIAL EMPOWERMENT'}</p>
                      <h4 className="text-2xl font-normal text-white" style={{ fontFamily: "var(--font-display)" }}>
                        {language === 'vi' ? 'Tác Động Xã Hội' : 'Social Impact'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {language === 'vi'
                          ? 'Bình đẳng hóa quyền thương mại quốc tế. Các hợp tác xã nhỏ lẻ có thể tự tin xuất khẩu nông sản ra toàn cầu mà không phải đối mặt với phí dịch vụ pháp lý đắt đỏ.'
                          : 'Democratizes international trade access. Local family farm cooperatives and SMEs can confidently export globally without heavy overhead consultant expenses, enriching farming communities.'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* B2B SAAS BUSINESS MODEL / PRICING & LOCAL SETTLEMENTS */}
              <section className="w-full py-24 text-left">
                <div className="max-w-5xl mx-auto px-6">
                  <div className="text-center mb-16 space-y-2">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase block font-semibold">{language === 'vi' ? 'MÔ HÌNH THÀNH VIÊN SAAS' : 'B2B SAAS SUBSCRIPTION'}</span>
                    <h2 className="text-4xl text-white font-normal" style={{ fontFamily: "var(--font-display)" }}>
                      {language === 'vi' ? 'Bói Giá & Hình Thức Thanh Toán' : 'Pricing Plans & Payment Methods'}
                    </h2>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      {language === 'vi'
                        ? 'Các sự lựa chọn được tối ưu cho nông dân cá thể, hợp tác xã, doanh nghiệp vận tải quy mô đa dạng.'
                        : 'Sleek tiers built for farmers, cooperatives, logistics operators, and enterprises of all shapes and scales.'}
                    </p>
                  </div>

                  {/* Pricing grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {(language === 'vi' ? [
                      {
                        name: "Gói Miễn Phí",
                        price: "0 VND",
                        duration: "Vĩnh Viễn",
                        desc: "Tra cứu cơ bản và kiểm thử quy định ban đầu phù hợp cho hộ nông dân nhỏ.",
                        features: ["Giới hạn 5 lượt tải / ngày", "Truy cập Regulation Hub", "Tra cứu mã HS thủ công", "Tra cứu song ngữ"],
                        selectText: "Chọn Gói miễn phí"
                      },
                      {
                        name: "Gói Tuần",
                        price: "250.000 VND",
                        duration: "/ Tuần",
                        desc: "Phù hợp lý tưởng cho từng vụ thu hoạch thời vụ đột biến hoặc xuất khẩu đột xuất.",
                        features: ["50 lượt tải / tuần", "Phân tích OCR GenAI đầy đủ", "Kiểm tra mã GACC xuất Trung", "Xuất file báo cáo song ngữ"],
                        selectText: "Kích Hoạt Gói Tuần"
                      },
                      {
                        name: "Gói Tháng",
                        price: "400.000 VND",
                        duration: "/ Tháng",
                        desc: "Thích hợp cho các đại lý phân phối độc lập hoạt động xuất khẩu liên tục vững vàng.",
                        features: ["Không giới hạn tải lên", "Tốc độ phân tích AI ưu tiên", "Kiểm định sai lệch FDA/FSMA", "Đối soát liên thông chứng thư"],
                        selectText: "Đăng Ký Gói Tháng"
                      },
                      {
                        name: "Gói Năm",
                        price: "2.160.000 VND",
                        duration: "/ Năm",
                        desc: "Tối ưu hóa ngân sách cho các đơn vị vận tải lớn & hệ thống doanh nghiệp nông sản.",
                        features: ["Không giới hạn tải lên", "Hàng đợi xử lý chuyên biệt", "Tiết kiệm nhất (~180k/tháng)", "Báo động hợp quy qua Email", "Tích hợp API trực tiếp"],
                        badge: "Tiết Kiệm Nhất",
                        selectText: "Đại Diện Doanh Nghiệp"
                      }
                    ] : [
                      {
                        name: "Free Tier",
                        price: "0 VND",
                        duration: "Forever",
                        desc: "Essential search and baseline regulatory lookups for small farms.",
                        features: ["5 uploads / day limit", "Regulation Hub access", "Manual HS matching", "Bilingual lookup"],
                        selectText: "Select Plan"
                      },
                      {
                        name: "Weekly Plan",
                        price: "250,000 VND",
                        duration: "/ Week",
                        desc: "Perfect for single seasonal harvests and high-volume surge shipping.",
                        features: ["50 uploads / week", "Full GenAI OCR parser", "China GACC Code checks", "Bilingual export files"],
                        selectText: "Select Plan"
                      },
                      {
                        name: "Monthly Plan",
                        price: "400,000 VND",
                        duration: "/ Month",
                        desc: "Ideal for active independent agricultural distributors and shipping agents.",
                        features: ["Unlimited uploads", "Prioritized GenAI speed", "FDA/FSMA discrepancy audit", "Full certificate cross-matching"],
                        selectText: "Select Plan"
                      },
                      {
                        name: "Yearly Plan",
                        price: "2,160,000 VND",
                        duration: "/ Year",
                        desc: "Designed for high-scale enterprise operations and corporate forwarders.",
                        features: ["Unlimited uploads", "Dedicated workspace queue", "Best Value rate (~180k/mo)", "Email compliance alerts", "Priority direct API integration"],
                        badge: "Best Value",
                        selectText: "Select Plan"
                      }
                    ]).map((plan, idx) => (
                      <div 
                        key={idx} 
                        className={`p-6 rounded-xl flex flex-col justify-between min-h-[380px] transition-all relative ${
                          plan.badge 
                            ? 'bg-[#d4af37]/5 border-2 border-[#d4af37]' 
                            : 'bg-white/[0.015] border border-white/[0.05] hover:border-white/10'
                        }`}
                      >
                        {plan.badge && (
                          <span className="absolute -top-3 right-6 px-2 py-0.5 rounded bg-[#d4af37] text-black text-[9px] font-bold uppercase tracking-wider">
                            {plan.badge}
                          </span>
                        )}
                        <div>
                          <p className="text-xs font-mono font-semibold text-white/90">{plan.name}</p>
                          <div className="mt-4 flex items-baseline">
                            <span className="text-2xl font-bold text-white font-sans">{plan.price}</span>
                            <span className="text-[10px] text-muted-foreground/80 ml-1">{plan.duration}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-relaxed mt-3">{plan.desc}</p>
                          <hr className="border-white/[0.04] my-4" />
                          <ul className="space-y-2 text-[10px] text-muted-foreground/90">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-1.5 leading-snug">
                                <span className="text-emerald-400 shrink-0">✓</span>
                                <span className="truncate">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button 
                          onClick={() => setIsValidationWorkspace(true)}
                          className={`w-full text-center py-2.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all mt-6 ${
                            plan.badge 
                              ? 'bg-[#d4af37] text-black hover:scale-[1.01]' 
                              : 'bg-white/5 hover:bg-white/10 text-white'
                          }`}
                        >
                          {plan.selectText}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Payment integrations representation */}
                  <div className="p-6 rounded-xl bg-white/[0.01] border border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px]">
                    <span className="text-muted-foreground uppercase tracking-widest">
                      {language === 'vi' ? 'HỖ TRỢ PHƯƠNG THỨC THANH TOÁN VIỆT NAM:' : 'SUPPORTED VIETNAMESE PAYMENT METHODS:'}
                    </span>
                    <div className="flex flex-row flex-wrap gap-2.5">
                      <span className="px-3 py-1 bg-[#122c42] border border-[#d4af37]/30 text-[#d4af37] rounded-full uppercase tracking-wider font-semibold">QR Banking / VietQR</span>
                      <span className="px-3 py-1 bg-[#a50064]/20 border border-[#a50064]/40 text-[#ff4c9a] rounded-full uppercase tracking-wider font-semibold">MoMo</span>
                      <span className="px-3 py-1 bg-[#0068ff]/20 border border-[#0068ff]/40 text-[#4cb5ff] rounded-full uppercase tracking-wider font-semibold">ZaloPay</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* PLATFORM VISION STATEMENT */}
              <section className="w-full py-28 relative overflow-hidden text-center bg-black/15">
                <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white opacity-10 blur-[140px]" />
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
                    {language === 'vi' ? 'TẦM NHÌN TOÀN DIỆN CỦA CHÚNG TÔI' : 'OUR COMPREHENSIVE VISION'}
                  </span>
                  <h2 
                    className="text-4xl sm:text-6xl md:text-7xl leading-tight font-normal text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {language === 'vi' ? 'Hệ Sinh Thái Thông Tin Logistics Nông Sản Thông Minh' : 'The Smart Logistics Information Ecosystem'}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
                    {language === 'vi'
                      ? 'Chúng tôi nỗ lực xây dựng một Hệ Sinh Thái Thông Tin Logistics Nông Sản Thông Minh đột phá, trao quyền cho các doanh nghiệp xuất khẩu Việt Nam số hóa văn bản siêu tốc, rũ bỏ hoàn toàn rủi ro sai lệch bãi kiểm dịch, nhẹ nhàng chinh phục rào cản quốc tế và khai phóng vạn cơ hội mới thông qua tự động hóa thông minh.'
                      : 'Our goal is to build a Smart Logistics Information Ecosystem that helps Vietnamese agricultural exporters process documents faster, reduce compliance risks, navigate international regulations more easily, and expand global trade opportunities through AI-powered automation and compliance intelligence.'}
                  </p>

                  <div className="pt-6">
                    <button
                      onClick={() => setIsValidationWorkspace(true)}
                      className="liquid-glass rounded-full px-12 py-5 text-sm text-foreground hover:scale-[1.03] cursor-pointer transition-all duration-300 font-medium tracking-wide shadow-2xl flex items-center gap-2.5 mx-auto group text-white font-mono"
                    >
                      {language === 'vi' ? 'Khởi Động Phiên Làm Việc Workspace' : 'Begin Workspace Session'}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 opacity-70" />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Validation Suite Workspace App */}
          {activeTab === 'Platform' && isValidationWorkspace && (
            <motion.section 
              id="ai-validation-workspace"
              key="workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-5xl py-12 flex flex-col"
            >
              <div className="flex flex-row justify-between items-center mb-8 pb-4 border-b border-white/[0.05]">
                <div>
                  <StaggeredContainer delay={0.05} className="text-3xl text-foreground font-normal select-none">
                    <h2 style={{ fontFamily: "var(--font-display)" }}>
                      <StaggerItem>Aegis</StaggerItem>{' '}
                      <StaggerItem className="italic text-[#d4af37]/90">{language === 'vi' ? 'Hệ thống xác minh' : 'Validation Suite'}</StaggerItem>
                    </h2>
                  </StaggeredContainer>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {t.workspace.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsRecentScansOpen(true)} 
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground bg-white/[0.02] border border-white/[0.06] rounded-full px-4 py-2 transition-all relative cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{t.workspace.recentHistory}</span>
                    {recentScans.length > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af37] text-[9px] font-mono text-black font-bold">
                        {recentScans.length}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={resetAllValidation} 
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground bg-white/[0.02] border border-white/[0.06] rounded-full px-4 py-2 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t.workspace.resetSystem}
                  </button>
                </div>
              </div>

              {/* Main Workspace Frame */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* File Upload Panel */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="bg-white/[0.01] border border-white/[0.06] backdrop-blur-md rounded-2xl p-6 relative">
                    <p className="text-xs tracking-widest text-[#d4af37] uppercase font-mono mb-4">
                      {language === 'vi' ? 'CHỌN CHỨNG TỪ NGUỒN' : 'Source Document Select'}
                    </p>

                    {/* Pre-packaged regulatory test documents */}
                    <p className="text-xs text-muted-foreground mb-3">{t.workspace.chooseSample}</p>
                    <div className="flex flex-col gap-2 mb-6">
                      {documentPresets.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => selectPreset(p.id)}
                          className={`text-left p-3 rounded-lg text-xs border transition-all cursor-pointer ${
                            presetSelected === p.id 
                              ? 'bg-white/5 border-white/25 text-white' 
                              : 'bg-white/[0.01] border-white/[0.04] text-muted-foreground hover:text-foreground hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className="font-semibold flex items-center justify-between mb-0.5">
                            <span className="truncate">
                              {p.id === 'dragon-fruit' ? t.workspace.sampleDocs.dragon : p.id === 'coffee-usa' ? t.workspace.sampleDocs.coffee : p.id === 'mango-japan' ? t.workspace.sampleDocs.mango : p.name}
                            </span>
                            <span className="text-[10px] opacity-75 uppercase px-1.5 py-0.5 bg-white/5 rounded font-mono">{language === 'vi' ? 'Mẫu Sẵn' : 'Preset'}</span>
                          </div>
                          <div className="opacity-60 text-[10px] truncate">
                            {p.id === 'dragon-fruit' 
                              ? (language === 'vi' ? 'Khai báo Kiểm dịch Thực vật GACC Trung Quốc' : 'China GACC Phytosanitary Declaration')
                              : p.id === 'coffee-usa'
                                ? (language === 'vi' ? 'Chứng nhận Kiểm toán An toàn Thực phẩm FDA Mỹ' : 'US FDA Food Safety Audit Certificate')
                                : p.id === 'mango-japan'
                                  ? (language === 'vi' ? 'Bản khai Dư lượng Thuốc trừ sâu Hải quan Nhật Bản' : 'Japan Customs Pesticide Residue Manifest')
                                  : p.type
                            }
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="relative flex items-center justify-center my-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]"></div></div>
                      <span className="relative px-3 bg-[#0e2130] text-[10px] font-mono tracking-wider text-muted-foreground uppercase">{language === 'vi' ? 'HOẶC TẢI LÊN FILE SÁNG GIÁ' : 'OR UPLOAD DEMO'}</span>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div 
                      className={`relative border border-dashed rounded-xl p-8 text-center transition-all ${
                        dragActive 
                          ? 'border-white/50 bg-white/5' 
                          : 'border-white/[0.08] hover:border-white/20 bg-white/[0.005]'
                      }`}
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        name="trade-document"
                        id="trade-document-input"
                        onChange={handleFileInput}
                        className="hidden" 
                        accept=".txt,.pdf,.csv,.json"
                      />
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-3 opacity-60" />
                      <p className="text-xs text-foreground font-medium">
                        {language === 'vi' ? 'Kéo & thả chứng từ xuất khẩu vào đây, hoặc' : 'Drag & drop export document or'}
                      </p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-white underline mt-1 opacity-80 hover:opacity-100 cursor-pointer"
                      >
                        {language === 'vi' ? 'Duyệt hệ thống tệp tin' : 'Browse file system'}
                      </button>
                      <p className="text-[9px] text-muted-foreground/60 mt-2 font-mono">
                        {language === 'vi' ? 'HỖ TRỢ FILE .TXT, .PDF, .CSV (TỐI ĐA 8MB)' : 'SUPPORTS .TXT, .PDF, .CSV (MAX 8MB)'}
                      </p>
                    </div>

                    {/* Uploaded Indicator */}
                    {uploadedFile && (
                      <div className="mt-4 space-y-2">
                        <div className={`p-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                          isParsingPdf 
                            ? 'bg-[#d4af37]/5 border border-[#d4af37]/35 animate-pulse'
                            : pdfParseError 
                              ? 'bg-red-500/5 border border-red-500/20'
                              : 'bg-emerald-500/5 border border-emerald-500/20'
                        }`}>
                          <FileText className={`w-5 h-5 ${
                            isParsingPdf 
                              ? 'text-[#d4af37]' 
                              : pdfParseError 
                                ? 'text-red-400' 
                                : 'text-emerald-400'
                          }`} />
                          <div className="overflow-hidden flex-1">
                            <p className={`text-xs font-mono truncate ${
                              isParsingPdf 
                                ? 'text-[#eac44c]' 
                                : pdfParseError 
                                  ? 'text-red-300' 
                                  : 'text-emerald-300'
                            }`}>{uploadedFile.name}</p>
                            <p className="text-[10px] text-white/50 font-mono">
                              {(uploadedFile.size / 1024).toFixed(1)} KB • {isParsingPdf ? (language === 'vi' ? 'Hệ thống đang trích xuất PDF...' : 'Server PDF Parsing...') : (language === 'vi' ? 'Chữ ký tải lên thành công' : 'Custom Loaded')}
                            </p>
                          </div>
                        </div>

                        {pdfParseError && (
                          <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-[10px] text-red-300 font-mono leading-relaxed">
                            ⚠️ {language === 'vi' ? 'LỖI PHÂN TÍCH TỆP:' : 'PARSE ERROR:'} {pdfParseError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive AI signature control panel */}
                    <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] font-bold">
                          {t.workspace.signatureOption}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded font-semibold">
                          {language === 'vi' ? 'MÔ PHỎNG' : 'SIMULATOR'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSignatureSetting('filled')}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center gap-1.5 cursor-pointer transition-all ${
                            signatureSetting === 'filled'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                          }`}
                        >
                          <CheckCircle2 className={`w-4 h-4 ${signatureSetting === 'filled' ? 'text-emerald-400' : 'opacity-40'}`} />
                          <div className="text-center">
                            <span className="text-[10px] font-bold block leading-none font-mono">
                              {language === 'vi' ? 'ĐẦY ĐỦ CHỮ KÝ' : 'SIGNED (OK)'}
                            </span>
                            <span className="text-[8px] opacity-75 mt-1 block leading-none font-sans">
                              {language === 'vi' ? 'Hợp chuẩn đóng dấu' : 'Active stamp detected'}
                            </span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSignatureSetting('empty')}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center gap-1.5 cursor-pointer transition-all ${
                            signatureSetting === 'empty'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_12px_rgba(225,29,72,0.1)]'
                              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                          }`}
                        >
                          <ShieldAlert className={`w-4 h-4 ${signatureSetting === 'empty' ? 'text-rose-400' : 'opacity-40'}`} />
                          <div className="text-center">
                            <span className="text-[10px] font-bold block leading-none font-mono">
                              {language === 'vi' ? 'LỖI CHỮ KÝ/VẮNG' : 'EMPTY (VOID)'}
                            </span>
                            <span className="text-[8px] opacity-75 mt-1 block leading-none font-sans">
                              {language === 'vi' ? 'Không có con dấu' : 'No signatures found'}
                            </span>
                          </div>
                        </button>
                      </div>

                      <p className="text-[10px] text-muted-foreground leading-normal">
                        {language === 'vi' 
                          ? 'Tùy chỉnh cấu hình xem chứng từ xuất khẩu có chứa bộ mộc đỏ thẩm định của cơ quan nhà nước hay chưa. Hệ thống AI Vision định vị mật độ nét mực để phê duyệt đạt chuẩn.'
                          : 'Configure whether the document contains official observer stamps. Vision pattern analysis evaluates handwritten ink density within authorized sign boundaries.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Computational / Report Panel */}
                <div className="lg:col-span-3 flex flex-col min-h-[460px]">
                  <div className="flex-grow bg-black/30 border border-white/[0.06] backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative">
                    
                    {/* State A: Ready */}
                    {!isScanning && !report && (
                      <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                        <div className="w-12 h-12 rounded-full border border-white/[0.08] flex items-center justify-center mb-4 opacity-50">
                          <Cpu className="w-5 h-5 text-white/50 animate-pulse" />
                        </div>
                        <h4 className="text-lg font-normal text-white" style={{ fontFamily: "var(--font-display)" }}>
                          {language === 'vi' ? 'Nhân Phân Tích Thông Minh Đang Chờ' : 'Intelligence Engine Idle'}
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-sm mt-2">
                          {language === 'vi' 
                            ? 'Sử dụng một mẫu hồ sơ sẵn có ở cột bên trái hoặc tải lên chứng từ của bạn để bắt đầu quét đối soát tự động.'
                            : 'Select a regulatory document sample on the left, or upload your own to begin automated compliance auditing.'
                          }
                        </p>
                      </div>
                    )}

                    {/* State B: In scanning / analysis progress */}
                    {isScanning && (
                      <div className="flex-grow flex flex-col justify-center py-8">
                        {/* Dynamic loading ticker */}
                        <div className="max-w-md mx-auto w-full">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-white/80">{language === 'vi' ? 'Lõi Aegis Đang Phân Tích...' : 'Aegis Core Analyzing...'}</span>
                            <span className="text-xs font-mono text-white/60">{Math.round(((scanStep + 1) / validationSteps.length) * 100)}%</span>
                          </div>
                          
                          {/* Sleek dynamic load bar */}
                          <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden mb-6">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-white/30 via-white to-white/30"
                              initial={{ width: "0%" }}
                              animate={{ width: `${((scanStep + 1) / validationSteps.length) * 100}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>

                          {/* Steps Checklist */}
                          <div className="flex flex-col gap-3">
                            {validationSteps.map((step, idx) => (
                              <div 
                                key={idx} 
                                className={`flex items-start gap-3 text-xs transition-opacity duration-300 ${
                                  idx < scanStep 
                                    ? 'text-emerald-400 opacity-100' 
                                    : idx === scanStep 
                                      ? 'text-white opacity-100 font-medium' 
                                      : 'text-muted-foreground/30 opacity-40'
                                }`}
                              >
                                {idx < scanStep ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                ) : idx === scanStep ? (
                                  <span className="relative flex h-2 w-2 mt-2 ml-1 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                  </span>
                                ) : (
                                  <div className="w-2 h-2 rounded-full border border-white/10 mt-2 ml-1" />
                                )}
                                <div className="flex-grow flex flex-col gap-1">
                                  <span className={idx === scanStep ? 'pl-2' : ''}>
                                    {idx === scanStep ? (
                                      <TypewriterText text={step} speed={22} />
                                    ) : (
                                      step
                                    )}
                                  </span>
                                  
                                  {/* Signature scan details container */}
                                  {idx === scanStep && idx === 3 && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className="mt-2 ml-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5 text-left"
                                    >
                                      <div className="flex items-center justify-between text-[9px] font-mono">
                                        <span className="text-white/40 uppercase">{language === 'vi' ? 'VÙNG CON DẤU MỤC TIÊU:' : 'Vision Model Target:'}</span>
                                        <span className="text-[#d4af37] font-semibold">BOX-12B (AUTHORILE_SIG)</span>
                                      </div>
                                      
                                      <div className="relative h-14 border border-white/[0.08] rounded-lg bg-black/40 overflow-hidden flex items-center justify-center">
                                        {/* Laser sweep line animation */}
                                        <motion.div 
                                          animate={{ y: [-28, 28] }}
                                          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                                          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_8px_rgba(212,175,55,0.7)]"
                                        />
                                        
                                        {signatureSetting === 'filled' ? (
                                          <div className="flex flex-col items-center">
                                            <span className="font-serif italic text-sm text-emerald-400/70 tracking-widest select-none">{language === 'vi' ? 'Nguyễn Văn Lực' : 'Nguyen Van Luc'}</span>
                                            <span className="text-[7px] text-emerald-500/60 font-mono tracking-widest leading-none mt-1">{language === 'vi' ? '▲ CÓ CHỮ KÝ & CON DẤU' : '▲ STAMP PRESENT'}</span>
                                          </div>
                                        ) : (
                                          <div className="flex flex-col items-center gap-0.5">
                                            <span className="text-[10px] font-mono text-rose-500/80 uppercase tracking-widest font-bold animate-pulse">{language === 'vi' ? '⚠️ THIẾU CHỮ KÝ' : '⚠️ ABSENT INK'}</span>
                                            <span className="text-[7px] text-rose-500/50 font-mono tracking-wider leading-none">{language === 'vi' ? 'MẬT ĐỘ SAI BIỆT TRỐNG' : 'NO DENSITY OVER BOX'}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex justify-between items-center text-[8px] font-mono text-white/30">
                                        <span>{language === 'vi' ? 'TÁI LẬP GRID BẢN ĐỒ: 1024 LỚP' : 'EST. GRID RE-EVAL: 1024 LAYER'}</span>
                                        <span>{language === 'vi' ? 'ĐỘ PHÂN GIẢI SAI BIỆT: 82%' : 'DELTA RES: 82%'}</span>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* State C: Report Complete */}
                    {report && (
                      <div className="flex-grow flex flex-col justify-between">
                        {/* Header metadata */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/[0.04] text-[10px] font-mono tracking-wider uppercase text-muted-foreground/80">
                            <div>
                              <p className="text-[9px] text-muted-foreground/50">{language === 'vi' ? 'CHỨNG TỬ ĐÃ TRÍCH XUẤT' : 'PARSED CERTIFICATE'}</p>
                              <p className="text-white truncate mt-0.5">{report.documentName}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-muted-foreground/50">{language === 'vi' ? 'MÃ XÁC THỰC LƯỢT QUÉT' : 'VERIFICATION MATRIX'}</p>
                              <p className="text-white mt-0.5">{report.timestamp}</p>
                            </div>
                          </div>

                          {/* Dynamic visual metric */}
                          <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                            <div>
                              <h3 className="text-3xl font-normal leading-none" style={{ fontFamily: "var(--font-display)" }}>
                                {report.complianceRatio}% {language === 'vi' ? 'Hợp quy' : 'Compliance'}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">{language === 'vi' ? 'Chỉ số bảo chứng an toàn tự động Aegis' : 'Aegis Automated Safety Assurance Metric'}</p>
                            </div>
                            <div className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase ${
                              report.destinationFit 
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                            }`}>
                              {report.destinationFit 
                                ? (language === 'vi' ? 'HỢP CHUẨN THÔNG QUAN' : 'CLEAR FOR DEPARTURE') 
                                : (language === 'vi' ? 'CẢNH BÁO SAI BIỆT' : 'ADVISORY FLAG')}
                            </div>
                          </div>

                          {/* Visual Compliance Document Overlay Trigger */}
                          <button
                            onClick={() => { setPreviewZoom(1.0); setIsPreviewModalOpen(true); }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#d4af37]/10 hover:bg-[#d4af37]/15 border border-[#d4af37]/20 rounded-xl text-xs text-[#d4af37] font-semibold transition-all cursor-pointer hover:scale-[1.01]"
                          >
                            <Eye className="w-4 h-4" />
                            {language === 'vi' ? 'Xem lớp phủ đối soát thị giác thông minh' : 'Open Visual Document Overlay Preview'}
                          </button>

                          {/* Detailed Classifications & Audits */}
                          <div className="space-y-3">
                            {/* AI-BASED SIGNATURE AUDIT DIAGNOSTICS */}
                            {report.signatureAnalysis && (
                              <div className="p-3 bg-white/[0.015] border border-white/[0.06] rounded-xl flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#d4af37] font-bold">
                                    <Cpu className="w-3.5 h-3.5" />
                                    <span>{language === 'vi' ? 'MÔ HÌNH NHẬN DIỆN CHỮ KÝ & CON DẤU AI' : 'AI VISION SIGNATURE ANALYZER'}</span>
                                  </div>
                                  <span className="text-[9px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded">
                                    {report.signatureAnalysis.confidence}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/[0.03]">
                                  <div className="text-left text-xs min-w-0 flex-1 pr-2">
                                    <span className="text-[#a1a1aa] text-[8px] uppercase font-mono block tracking-wider">{language === 'vi' ? 'Khu vực quét' : 'Scanned Area'}</span>
                                    <span className="text-white font-mono text-[10px] font-medium truncate block">
                                      {report.signatureAnalysis.locationBox}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {report.signatureAnalysis.detected ? (
                                      <div className="flex flex-col items-end">
                                        <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center gap-1">
                                          <Check className="w-3.5 h-3.5" /> {language === 'vi' ? 'CÓ KÝ/ĐÓNG DẤU' : 'SIGNED'}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground italic font-serif leading-none mt-1">
                                          {language === 'vi' ? 'Nguyễn Văn Lực' : 'Nguyen Van Luc'}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-end">
                                        <span className="text-[10px] uppercase font-mono text-rose-400 font-bold flex items-center gap-1 animate-pulse">
                                          <X className="w-3.5 h-3.5" /> {language === 'vi' ? 'TRỐNG / KHÔNG CÓ KÝ' : 'EMPTY / VOID'}
                                        </span>
                                        <span className="text-[8px] text-rose-300 font-mono uppercase bg-rose-500/10 px-1.5 py-0.5 rounded mt-0.5">
                                          {language === 'vi' ? 'Không phát hiện mộc đỏ' : 'No Stamp Density'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            <p className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground/75">
                              {language === 'vi' ? 'Cơ cấu kiểm tra & sai sót phát hiện' : 'Regulatory Audits & Anomalies'} ({report.issues.length})
                            </p>
                            
                            {report.issues.length === 0 ? (
                              <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-emerald-300">{t.workspace.noIssues}</span>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {report.issues.map((issue, index) => (
                                  <div 
                                    key={index} 
                                    className={`p-3 rounded-lg border flex flex-col gap-1.5 ${
                                      issue.severity === 'high' 
                                        ? 'bg-rose-950/10 border-rose-500/20' 
                                        : issue.severity === 'medium'
                                          ? 'bg-amber-950/10 border-amber-500/20'
                                          : 'bg-white/[0.01] border-white/[0.08]'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        <AlertTriangle className={`w-3.5 h-3.5 ${
                                          issue.severity === 'high' ? 'text-rose-400' : issue.severity === 'medium' ? 'text-amber-400' : 'text-muted-foreground'
                                        }`} />
                                        <span className={issue.severity === 'high' ? 'text-rose-300' : issue.severity === 'medium' ? 'text-amber-300' : 'text-gray-300'}>
                                          {language === 'vi' ? (
                                            issue.field.includes('Signature') ? 'Chữ kỹ / Bản mộc' :
                                            issue.field.includes('Pesticide') ? 'Dư lượng thuốc bảo vệ thực vật' :
                                            issue.field.includes('Phytosanitary') ? 'Kiểm dịch thực vật GACC' :
                                            issue.field.includes('Temperature') ? 'Nhiệt độ chuỗi cung ứng lạnh' :
                                            issue.field.includes('Moisture') ? 'Độ ẩm hạt cà phê' :
                                            issue.field.includes('FDA') ? 'Đăng ký FDA Hoa Kỳ' : issue.field
                                          ) : issue.field}
                                        </span>
                                      </div>
                                      <span className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded uppercase ${
                                        issue.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : issue.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white/70'
                                      }`}>
                                        {issue.severity === 'high' ? (language === 'vi' ? 'Ưu tiên Cao' : 'high priority') : issue.severity === 'medium' ? (language === 'vi' ? 'Cảnh báo' : 'medium priority') : (language === 'vi' ? 'Cần Lưu Ý' : 'low priority')}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {language === 'vi' ? (
                                        issue.message.includes('not detected') || issue.message.includes('missing') || issue.message.includes('empty') ? 'Phát hiện sai sót: Chứng từ chưa được ký nháy chính thức bởi người đại diện theo pháp luật hoặc thiếu hình đóng dấu bộ mộc đỏ thẩm duyệt.' :
                                        issue.message.includes('Vapor Heat Treatment') || issue.message.includes('vapor heat treatment') || issue.message.includes('VHT') ? 'Bản khai kiểm dịch chỉ rõ quy phạm sấy hơi nước VHT tại 47°C nhưng thiếu bộ con dấu chính mộc phê chuẩn từ kiểm dịch viên Cục Bảo vệ thực vật (VN PPD).' :
                                        issue.message.includes('pesticide residues') ? 'Kiểm dịch phát hiện dư lượng hoạt chất chlorpyrifos vượt chỉ lệnh tiêu chuẩn bến cảng.' :
                                        issue.message.includes('cold chain temperature') || issue.message.includes('Cold chain temperature') ? 'Nhật ký hành trình chuỗi cung ứng lạnh tạm thời xuất hiện khoảng trống dữ liệu viễn thám 15 phút tại cảng Cát Lái.' :
                                        issue.message.includes('VietGAP') || issue.message.includes('GlobalGAP') ? 'Tệp tải lên chưa hoàn thiện thông tin định dạng đăng ký theo mã chỉ định VietGAP / GlobalGAP.' : issue.message
                                      ) : issue.message}
                                    </p>
                                    <p className="text-[11px] font-medium text-white/90">
                                      <span className="text-muted-foreground font-normal">{language === 'vi' ? 'Hướng kiểm soát sửa chữa:' : 'Resolution Step:'}</span> {
                                        language === 'vi' ? (
                                          issue.resolution.includes('stamp indicator') || issue.resolution.includes('physical ink') ? 'Nộp bổ sung chữ ký số hợp chuẩn hoặc ký tươi bổ sung con dấu kiểm nghị đỏ trước khi đệ trình hải quan bến cảng.' :
                                          issue.resolution.includes('pesticide lab certificates') || issue.resolution.includes('pesticide') ? 'Kiểm định lại mẫu và đính kèm giấy chứng nhận lab đạt chuẩn kiểm tra dư lượng.' :
                                          issue.resolution.includes('SPS certificate') || issue.resolution.includes('quarantine') ? 'Yêu cầu trạm điều phối hợp tác xã Cao Lãnh thực hiện ký đóng con dấu chính chính ngạch lên trang 2 hồ sơ cách ly kiểm dịch.' :
                                          issue.resolution.includes('thermal logs') || issue.resolution.includes('sensory') ? 'Đồng bộ đối soát và cập nhật tập tin nhật ký cảm biến nhiệt thứ cấp để bảo chứng dòng cung ứng lạnh ổn định.' : 
                                          issue.resolution.includes('VietGAP') ? 'Cung cấp mã số đăng ký VietGAP hợp quy trong danh mục phụ lục để được hưởng luồng xanh ưu tiên rà soát biên giới.' : issue.resolution
                                        ) : issue.resolution
                                      }
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                             {/* Suggested HS Classification */}
                             <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg flex items-center justify-between">
                               <span className="text-xs text-muted-foreground">{language === 'vi' ? 'Đề xuất Mã số HS:' : 'Classified HS Code:'}</span>
                               <div className="text-right">
                                 <span className="font-mono text-xs font-semibold text-white">{report.hsCodeSuggested}</span>
                                 <span className="text-[10px] text-muted-foreground/75 ml-2">({report.hsCodeConfidence})</span>
                               </div>
                             </div>
                          </div>
                        </div>

                        {/* Interactive action buttons */}
                        <div className="pt-4 border-t border-white/[0.04] mt-6 flex flex-col sm:flex-row gap-2.5">
                          <button 
                            className="flex-1 liquid-glass rounded-xl px-4 py-2.5 text-xs text-white hover:scale-[1.01] transition-transform text-center font-medium cursor-pointer flex items-center justify-center gap-2"
                            onClick={() => exportValidationReportToPDF(report)}
                            id="download-pdf-cert-btn"
                          >
                            <FileDown className="w-4 h-4 text-[#d4af37]" />
                            <span>{language === 'vi' ? 'Tải Hộ Chiếu Xuất Khẩu Aegis' : 'Download AegisTrade Certificate'}</span>
                          </button>
                          
                          <button 
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white hover:scale-[1.01] transition-transform text-center font-medium cursor-pointer flex items-center justify-center gap-2"
                            onClick={() => {
                              setEmailAddress('vietnam.customs@gov.vn');
                              setEmailSubject(language === 'vi' ? `Xác minh An toàn AegisTrade • Chứng thư Thông quan • ${report.documentName}` : `AegisTrade Secure Verification • Compliance Certificate • ${report.documentName}`);
                              setEmailBody(language === 'vi' ? `Kính gửi Cơ quan Hải quan và Quản lý Biên giới,

Tôi xin gửi đính kèm Chứng thư Tuân thủ Xuất khẩu AegisTrade để chứng minh mức độ hợp chuẩn quy định song phương đối với lô hàng nông sản trong tài liệu đã quét.

--- DỮ LIỆU ĐỐI SOÁT BẢO AN ---
Nguồn chứng từ: ${report.documentName}
Cơ quan thẩm định: AEGIS TRADE PARITY CORE v4.1
Điểm hợp chuẩn tính toán: ${report.complianceRatio}%
Trạng thái luồng sản phẩm: ${report.destinationFit ? "HỢP CHUẨN THÔNG QUAN XANH" : "CẦN LƯU Ý / ĐIỀU CHỈNH"}
Đề xuất mã số HS: ${report.hsCodeSuggested}

Nhật ký mã băm an toàn số đã được lưu trữ vào hệ thống máy chủ đám mây phi tập trung quốc gia.

Trân trọng,
Sĩ quan Phê duyệt Tự động AegisTrade` : `Dear Customs Clearance and Border Control Authority,

Please find attached the formal AegisTrade Export Compliance Certificate verifying bilateral regulatory parity for the scanned document manifest.

--- REGULATORY ASSURANCE DATA ---
Document Source: ${report.documentName}
Certificate Authority: AEGIS TRADE PARITY CORE v4.1
Calculated Audit Rating: ${report.complianceRatio}%
Clearance Destination Fit: ${report.destinationFit ? "SUFFICIENT / PARITY SECURED" : "ADVISORY REQUIRED"}
Suggested HS Classification: ${report.hsCodeSuggested}

Secure digital hash registers have been committed to the sovereign state cloud ledger under transaction identifier.

Best regards,
AegisTrade Autonomous Auditing Officer`);
                              setEmailSendSuccess(false);
                              setIsEmailModalOpen(true);
                            }}
                            id="email-pdf-cert-btn"
                          >
                            <Mail className="w-4 h-4 text-[#d4af37]" />
                            <span>{language === 'vi' ? 'Gửi báo cáo qua Email' : 'Email Report Certificate'}</span>
                          </button>

                          <button 
                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/70 transition-all cursor-pointer font-mono text-center"
                            onClick={() => {
                              alert((language === 'vi' ? `Dữ liệu mô phỏng chứng thư kiểm dịch: \n` : `Simulated regulatory certificate payload: \n`) + report.rawTextSimulated);
                            }}
                            id="inspect-raw-metadata-btn"
                          >
                            {language === 'vi' ? 'Nguồn' : 'Raw'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Scans Drawer Overlay */}
              <AnimatePresence>
                {isRecentScansOpen && (
                  <>
                    {/* Backdrop overlay */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setIsRecentScansOpen(false);
                        setConflictComparisonReport(null);
                        setIsComparingConflicts(false);
                      }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] cursor-pointer"
                    />

                    {/* Sliding Drawer Container */}
                    <motion.div 
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0c1a25] border-l border-white/10 shadow-2xl z-[10000] flex flex-col p-6 overflow-y-auto"
                    >
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                        <div className="flex items-center gap-2">
                          <History className="w-5 h-5 text-[#d4af37]" />
                          <div className="text-left">
                            <h3 className="text-lg font-semibold text-white">
                              {language === 'vi' ? 'Nhật Ký Quét Hợp Quy Gần Đây' : 'Recent Compliance Scans'}
                            </h3>
                            <p className="text-[10px] text-white/50 font-mono uppercase tracking-wider">
                              {language === 'vi' ? 'LỌC DÒNG KIỂM ĐỊNH LỊCH SỬ (TỐI ĐA 5)' : 'Historical Audit Stream (Max 5)'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setIsRecentScansOpen(false);
                            setConflictComparisonReport(null);
                            setIsComparingConflicts(false);
                          }}
                          className="p-1.5 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Drawer Content */}
                      <div className="flex-grow flex flex-col gap-4">
                        {recentScans.length === 0 ? (
                          <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                            <History className="w-8 h-8 text-white/20 mb-3 animate-pulse" />
                            <p className="text-xs">
                              {language === 'vi' ? 'Chưa có bản ghi chứng từ nào trong phiên làm việc hiện tại.' : 'No records present in current workspace cycle.'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase font-bold text-left">
                              {language === 'vi' ? 'CHỌN BẢN QUÉT ĐỂ NẠP HOẶC ĐỐI CHIẾU' : 'Select Scan to Load or Compare'}
                            </p>
                            
                            <div className="flex flex-col gap-2.5">
                              {recentScans.map((r, i) => {
                                const isCurrentlyLoaded = report && report.documentName === r.documentName;
                                return (
                                  <div 
                                    key={i}
                                    className={`p-4 rounded-xl border text-left transition-all ${
                                      isCurrentlyLoaded 
                                        ? 'bg-[#d4af37]/5 border-[#d4af37]/45' 
                                        : 'bg-white/[0.01] border-white/[0.06] hover:border-white/20'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="overflow-hidden flex-1">
                                        <h4 className="text-xs font-mono font-bold text-white truncate">{r.documentName}</h4>
                                        <p className="text-[10px] text-white/40 mt-0.5">{r.timestamp}</p>
                                      </div>
                                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider shrink-0 ${
                                        r.complianceRatio >= 95 
                                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                      }`}>
                                        {r.complianceRatio}% OK
                                      </span>
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                      <button
                                        onClick={() => {
                                          setReport(r);
                                          setPresetSelected(null);
                                          setUploadedFile({ name: r.documentName, size: 24000, type: r.documentType } as File);
                                          setIsRecentScansOpen(false);
                                        }}
                                        className="flex-1 bg-white/[0.04] hover:bg-white/[0.1] text-[10px] font-mono py-1.5 text-center text-white border border-white/[0.08] rounded transition-all cursor-pointer"
                                      >
                                        {language === 'vi' ? 'Xem lại báo cáo' : 'Re-open Report'}
                                      </button>
                                      
                                      {report && !isCurrentlyLoaded && (
                                        <button
                                          onClick={() => {
                                            setConflictComparisonReport(r);
                                            setIsComparingConflicts(true);
                                          }}
                                          className="flex-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[10px] font-mono py-1.5 text-center text-[#d4af37] border border-[#d4af37]/25 rounded transition-all cursor-pointer inline-flex items-center justify-center gap-1"
                                        >
                                          <ArrowLeftRight className="w-3 h-3" />
                                          {language === 'vi' ? 'Đối chiếu' : 'Conflict'}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Conflict Comparison Section */}
                        {isComparingConflicts && conflictComparisonReport && report && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 border-t border-white/[0.08] pt-4 space-y-3 text-left"
                          >
                            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                              <span className="text-[10px] font-mono text-[#d4af37] font-bold">{language === 'vi' ? 'BỘ PHÒNG NGỪA XUNG ĐỘT' : 'CONFLICT DETECTOR'}</span>
                              <button 
                                onClick={() => {
                                  setConflictComparisonReport(null);
                                  setIsComparingConflicts(false);
                                }}
                                className="text-[9px] text-white/50 hover:text-white font-mono underline cursor-pointer"
                              >
                                {language === 'vi' ? 'Dọn dẹp so sánh' : 'Clear Compare'}
                              </button>
                            </div>

                            <div className="space-y-2">
                              {/* Item 1 */}
                              <div className="bg-white/[0.01] border border-white/[0.05] p-3 rounded-lg text-xs space-y-2">
                                <span className="text-[9px] font-mono text-white/50 uppercase">{language === 'vi' ? 'Hồ sơ đang nạp' : 'Active Document'}</span>
                                <div className="font-semibold text-white truncate font-mono">{report.documentName}</div>
                                <div className="text-[10px] text-muted-foreground">
                                  HS Code: <span className="text-white font-mono font-bold">{report.hsCodeSuggested}</span>
                                </div>
                              </div>

                              {/* Item 2 */}
                              <div className="bg-white/[0.02] border border-[#d4af37]/25 p-3 rounded-lg text-xs space-y-2">
                                <span className="text-[9px] font-mono text-[#d4af37] uppercase">{language === 'vi' ? 'Hồ sơ lịch sử đối chiếu' : 'Compared Historical Document'}</span>
                                <div className="font-semibold text-white truncate font-mono">{conflictComparisonReport.documentName}</div>
                                <div className="text-[10px] text-muted-foreground">
                                  HS Code: <span className="text-white font-mono font-bold">{conflictComparisonReport.hsCodeSuggested}</span>
                                </div>
                              </div>
                            </div>

                            {/* Conflict Auditor Logic Output */}
                            <div className="p-3.5 rounded-lg border bg-rose-950/10 border-rose-500/30 text-xs text-rose-300 space-y-1.5">
                              <div className="font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                <span>{language === 'vi' ? 'Sai lệch đối chiếu phát hiện' : 'Manifest Discrepancies Detected'}</span>
                              </div>
                              
                              {report.hsCodeSuggested !== conflictComparisonReport.hsCodeSuggested ? (
                                <p className="text-[11px] leading-relaxed">
                                  ⚠️ <strong className="font-semibold">{language === 'vi' ? 'Sai lệch Mã số HS:' : 'HS Code Misalignment:'}</strong> {
                                    language === 'vi' 
                                      ? `Khai báo hiện hành đề xuất HS ${report.hsCodeSuggested} (${report.documentName}) nhưng chứng từ đối chiếu gợi ý HS ${conflictComparisonReport.hsCodeSuggested} (${conflictComparisonReport.documentName}). Việc không khớp mã HS giữa các tờ khai kiểm dịch có thể làm chậm thông quan tại cảng nhập khẩu.`
                                      : `Current filing suggests HS ${report.hsCodeSuggested} (${report.documentName}) but compared historical document suggests HS ${conflictComparisonReport.hsCodeSuggested} (${conflictComparisonReport.documentName}). Consolidating mixed manifest codes can trigger port quarantine inspection.`
                                  }
                                </p>
                              ) : (
                                <p className="text-[11px] leading-relaxed">
                                  ✅ <strong className="font-semibold">{language === 'vi' ? 'Đồng bộ biểu phí HS:' : 'Tariff Schedule Alignment:'}</strong> {
                                    language === 'vi'
                                      ? `Cả hai chứng từ đều quy chiếu chính xác về mã số HS ${report.hsCodeSuggested}. Không phát hiện bất kì xung đột hay sai lệch mã số biểu thuế hải quan nào.`
                                      : `Both documents refer correctly to HS ${report.hsCodeSuggested}. No direct trade tariff schedule conflict was identified.`
                                  }
                                </p>
                              )}

                              <p className="text-[10px] text-white/60 italic leading-relaxed">
                                {language === 'vi' 
                                  ? 'Khuyến nghị Aegis: Xin lưu ý khớp thông tin trọng lượng tịnh xe hàng, chỉ tiêu kiểm dịch kiểm thực và chữ ký số định danh để việc đối soát hai đầu đạt độ đồng thuận thông suốt.'
                                  : 'System advice: ensure weight details, phytosanitary indicators, and GACC identifiers are synchronized perfectly across all records to prevent clearance stalls.'
                                }
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Compliance Preview Modal */}
              <AnimatePresence>
                {isPreviewModalOpen && report && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsPreviewModalOpen(false)}
                      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10001]"
                    />

                    {/* Modal Window Container */}
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0, y: 30 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.95, opacity: 0, y: 30 }}
                      transition={{ type: "spring", damping: 25, stiffness: 220 }}
                      className="fixed inset-4 md:inset-10 bg-[#070e14] border border-white/10 rounded-2xl shadow-2xl z-[10002] flex flex-col overflow-hidden max-w-5xl mx-auto"
                    >
                      {/* Interactive Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-[#d4af37]" />
                          <div className="text-left">
                            <h3 className="text-base font-medium text-white">
                              {language === 'vi' ? 'Lớp Phủ Đối Soát Trực Quan Chứng Từ' : 'Visual Compliance Document Overlay'}
                            </h3>
                            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                              {language === 'vi' ? 'Số Hóa OCR & Bản Đồ Xác Minh Thời Gian Thực' : 'Real-Time OCR Mapping & Validation Layers'} • {report.documentName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono bg-white/[0.05] text-white/70 border border-white/10 px-2.5 py-1 rounded">
                            {language === 'vi' ? 'Độ tin cậy OCR: 99.4%' : 'OCR Confidence: 99.4%'}
                          </span>
                          <button
                            onClick={() => setIsPreviewModalOpen(false)}
                            className="p-1.5 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Split View Content */}
                      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-black/20">
                        {/* Left Side: Discrepancy Control Center */}
                        <div className="w-full md:w-80 border-r border-white/[0.08] flex flex-col bg-[#0b141c] overflow-y-auto p-5 text-left">
                          <div className="mb-4">
                            <span className="text-[9px] font-mono text-[#d4af37] tracking-widest uppercase">
                              {language === 'vi' ? 'BẢNG ĐIỀU KIỂN KIỂM TOÁN' : 'AUDIT CONSOLE'}
                            </span>
                            <h4 className="text-sm font-semibold text-white mt-0.5 font-sans">
                              {language === 'vi' ? 'Điểm Nóng Sai Sót' : 'Discrepancy Hotspots'}
                            </h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                              {language === 'vi' 
                                ? 'Rà soát các bản tịnh vị toạ độ khoanh chụp được phân tích bằng mô hình thị giác AI.' 
                                : 'Review visual highlight coordinates mapped onto the scanned manifest data frames.'
                              }
                            </p>
                          </div>

                          {/* Issues Interactive List */}
                          <div className="space-y-3 flex-grow">
                            {report.issues.length === 0 ? (
                              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                                <span className="text-xs font-semibold text-emerald-400">
                                  {language === 'vi' ? 'Hồ Sơ Toàn Vẹn Đã Khớp' : 'Pristine Manifest Cleared'}
                                </span>
                                <p className="text-[11px] text-emerald-400/80 leading-relaxed">
                                  {language === 'vi' 
                                    ? 'Không phát hiện thấy bất kỳ mâu thuẫn thương mại song phương hoặc sự cố vệ sinh thực phẩm SPS nào trên tài liệu này.' 
                                    : 'No bilateral trade or sanitary compliance issues were identified on this record.'
                                  }
                                </p>
                              </div>
                            ) : (
                              report.issues.map((iss, index) => {
                                return (
                                  <div
                                    key={index}
                                    className={`p-3.5 rounded-xl border text-left cursor-help transition-all duration-300 ${
                                      iss.severity === 'high'
                                        ? 'bg-rose-950/10 hover:bg-rose-950/20 border-rose-500/20 hover:border-rose-500/40 text-rose-300'
                                        : 'bg-amber-950/10 hover:bg-amber-950/20 border-amber-500/20 hover:border-amber-500/40 text-amber-300'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-[9px] font-mono uppercase bg-white/5 rounded px-1 text-white/80">
                                        ID: 0{index + 1}
                                      </span>
                                      <span className={`text-[8px] font-mono tracking-widest uppercase font-bold px-1.5 py-0.5 rounded ${
                                        iss.severity === 'high' ? 'bg-rose-500/20' : 'bg-amber-500/20'
                                      }`}>
                                        {iss.severity === 'high' ? (language === 'vi' ? 'NGUY CƠ CAO' : 'HIGH RISK') : (language === 'vi' ? 'CẦN LƯU Ý' : 'MEDIUM RISK')}
                                      </span>
                                    </div>
                                    <div className="text-[11px] font-mono font-bold tracking-tight mb-1 truncate text-white">
                                      {language === 'vi' ? (
                                         iss.field.includes('Signature') || iss.field.includes('SIGNATURE') ? 'Chữ Ký / Bản Mộc Khai Báo' :
                                         iss.field.includes('Pesticide') || iss.field.includes('PESTICIDE') ? 'Dư Lượng Thuốc BVTV' :
                                         iss.field.includes('Phytosanitary') ? 'Kiểm Dịch Thực Vật GACC' :
                                         iss.field.includes('Temperature') || iss.field.includes('COLD_CHAIN') ? 'Chuỗi Cung Ứng Lạnh' :
                                         iss.field.includes('Moisture') ? 'Độ Ẩm Thực Tế Hạt' :
                                         iss.field.includes('FDA') ? 'Đăng Ký Cơ Sở FDA' :
                                         iss.field.includes('METADATA') ? 'Đăng Ký VietGAP' : iss.field
                                       ) : iss.field}
                                    </div>
                                    <p className="text-[11px] text-white/70 leading-relaxed mb-2">
                                      {language === 'vi' ? (
                                         iss.message.includes('not detected') || iss.message.includes('empty') ? 'Phát hiện mục chữ ký đại diện doanh nghiệp xuất khẩu trống hoàn toàn. Mô hình thị giác AI kiểm tra không thấy có vết mực viết tay tại vùng đóng chữ ký.' :
                                         iss.message.includes('Vapor Heat') || iss.message.includes('VHT') ? 'Chứng nhận kiểm dịch kiểm thực biểu thị việc sưởi hơi nước nóng (VHT) kiểm mầm bệnh đạt chuẩn, nhưng thiếu chữ ký dấu phê duyệt thủ trưởng.' :
                                         iss.message.includes('Cold chain') || iss.message.includes('telemetry') ? 'Hải quan hệ thống viễn thám chuỗi cung ứng lạnh ghi nhận một khoảng trống 15 phút không truyền tải dữ liệu nhiệt độ container tại Cảng Cát Lái.' :
                                         iss.message.includes('VietGAP') || iss.message.includes('GlobalGAP') ? 'Chứng thư tải lên thiếu thông tin định danh VietGAP vùng trồng hoặc GlobalGAP chính ngạch đã đăng kiểm.' : iss.message
                                       ) : iss.message}
                                    </p>
                                    <div className="border-t border-white/[0.04] pt-2 text-[10px] text-white/50 bg-[#04080c]/30 p-1.5 rounded">
                                      <strong className="text-[#d4af37] font-semibold">{language === 'vi' ? 'Biện pháp khắc phục:' : 'Action:'}</strong> {language === 'vi' ? (
                                         iss.resolution.includes('physical ink') || iss.resolution.includes('Apply physical') ? 'Áp dụng chữ ký bút mực tươi trực tiếp hoặc ký số HSM điện tử ủy quyền trước khi tái đệ trình.' :
                                         iss.resolution.includes('Cao Lanh') ? 'Sử dụng bản mộc số ban kiểm hóa Cao Lãnh đóng dấu hợp quy bổ sung vào trang phụ lục kiểm dịch.' :
                                         iss.resolution.includes('VietGAP') ? 'Đăng chỉ danh vùng kiểm VietGAP vào hoá đơn giao thương vận hành liên cảng.' :
                                         iss.resolution.includes('sensory') || iss.resolution.includes('uninterrupted') ? 'Chêm nhật trình cảm biến vật lý sơ cua của container lạnh để đắp dải trống dữ liệu khi bốc dỡ.' : iss.resolution
                                       ) : iss.resolution}
                                    </div>
                                  </div>
                                );
                              })
                            )}

                            {/* Supplementary Metadata */}
                            <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-3.5 space-y-2">
                              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                                {language === 'vi' ? 'BẢN MỘC HẢI QUAN CHỮ KÝ SỐ' : 'DIGITAL STAMPS'}
                              </span>
                              <div className="space-y-1.5 text-[10px] font-mono">
                                <div className="flex justify-between">
                                  <span className="text-white/40">{language === 'vi' ? 'Khớp Bộ Ngoại giao:' : 'Sovereign Match:'}</span>
                                  <span className="text-emerald-400 font-bold">{language === 'vi' ? 'HOÀN TOÀN KHỚP' : 'MATCH'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/40">{language === 'vi' ? 'Trạng thái đăng ký GACC/FDA:' : 'GACC/FDA status:'}</span>
                                  <span className={report.destinationFit ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                                    {report.destinationFit ? (language === 'vi' ? 'ĐỒNG Ý/ ĐÃ HOÀN TẤT' : 'COMPLIANT') : (language === 'vi' ? 'CẦN CHỈNH SỬA' : 'ADVISORY')}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/40">{language === 'vi' ? 'Mã băm Bảo mật:' : 'Security Hash:'}</span>
                                  <span className="text-white/60 truncate max-w-[120px]">SH3-d9a2ffb38102</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/[0.06] mt-4">
                            <button
                              onClick={() => setIsPreviewModalOpen(false)}
                              className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-mono transition-all text-center cursor-pointer"
                            >
                              {language === 'vi' ? 'Quay lại Bảng điều khiển' : 'Return to Dashboard'}
                            </button>
                          </div>
                        </div>

                        {/* Right Side: Virtualized Document Mock with Real-Time Highlights overlay */}
                        <div className="flex-1 overflow-auto p-8 md:p-24 flex items-center justify-center bg-zinc-950/65 relative">
                          {/* Floating Zoom Controls Option */}
                          <div className="absolute top-4 right-4 z-[10005] flex items-center gap-1.5 bg-black/90 backdrop-blur border border-white/10 rounded-full p-1.5 shadow-xl">
                            <button
                              onClick={() => setPreviewZoom(prev => Math.max(0.4, prev - 0.15))}
                              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                              title="Zoom Out"
                            >
                              <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-mono font-bold text-white px-1.5 min-w-[45px] text-center">
                              {Math.round(previewZoom * 100)}%
                            </span>
                            <button
                              onClick={() => setPreviewZoom(prev => Math.min(2.5, prev + 0.15))}
                              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                              title="Zoom In"
                            >
                              <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-[1px] h-4 bg-white/20 mx-1" />
                            <button
                              onClick={() => setPreviewZoom(1.0)}
                              className="text-[10px] font-mono text-[#d4af37] font-bold px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                            >
                              {language === 'vi' ? 'Đặt lại' : 'Reset'}
                            </button>
                          </div>

                          <motion.div 
                            animate={{ scale: previewZoom }}
                            transition={{
                              type: "spring",
                              stiffness: 280,
                              damping: 22
                            }}
                            style={{ 
                              transformOrigin: 'center center',
                              padding: '120px 0'
                            }}
                            className="shrink-0 flex items-center justify-center"
                          >
                            {/* Beautiful Interactive Document Simulation Sheet */}
                            <div className="w-[600px] shrink-0 min-h-[780px] bg-white border border-stone-300 shadow-2xl relative p-8 text-slate-800 font-sans flex flex-col justify-between selection:bg-amber-100 overflow-hidden rounded-sm select-none">
                            {/* Watermark Logo Backing */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
                              <div className="w-80 h-80 rounded-full border-8 border-slate-900 flex items-center justify-center p-6 text-center text-xl font-bold font-serif leading-tight">
                                COOPERATIVE EXPORT ALLIANCE OF VIETNAM
                              </div>
                            </div>

                            {/* Document Top Framing */}
                            <div className="border-b-4 border-slate-800 pb-4 text-left">
                              <div className="flex justify-between items-start">
                                <div className="text-left">
                                  <p className="text-[10px] font-bold tracking-widest text-[#a8821d] uppercase">VIETNAM AGRICULTURAL BOARD</p>
                                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                                    COM-MANIFEST & CERTIFICATION OF ORIGIN
                                  </h1>
                                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">MINISTRY OF INDUSTRY & TRADE • SOCIALIST REPUBLIC OF VIETNAM</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                  <div className="border border-slate-400 p-1 text-[8px] font-mono bg-slate-50 max-w-[140px]">
                                    FORM EUR.1 / GACC / FDA
                                  </div>
                                  <span className="text-[9px] font-mono text-slate-500 mt-1">Serial: AEG-2026-X834</span>
                                </div>
                              </div>
                            </div>

                            {/* Document Identity Blocks */}
                            <div className="grid grid-cols-2 gap-4 text-xs mt-4">
                              <div className="border border-slate-300 p-3 rounded text-left">
                                <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1">1. EXPORTER / CONSIGNOR</span>
                                <p className="font-bold text-slate-900">
                                  {report.documentName.toLowerCase().includes('coffee') || report.documentName.toLowerCase().includes('dak lak') || report.documentName.toLowerCase().includes('robusta')
                                    ? 'Dak Lak Specialty Robusta Cooperative'
                                    : report.documentName.toLowerCase().includes('dragon') || report.documentName.toLowerCase().includes('binh thuan') || report.documentName.toLowerCase().includes('fruit')
                                      ? 'Binh Thuan Regional Bio-Farm Consortium'
                                      : report.documentName.toLowerCase().includes('mango') || report.documentName.toLowerCase().includes('dong thap') || report.documentName.toLowerCase().includes('cao lanh')
                                        ? 'Cao Lanh Premium Mango Cooperative'
                                        : 'Vietnamese Agricultural Exporting Corp'}
                                </p>
                                <p className="text-[10px] text-slate-500 leading-normal mt-1">
                                  {report.documentName.toLowerCase().includes('coffee') || report.documentName.toLowerCase().includes('dak lak') || report.documentName.toLowerCase().includes('robusta')
                                    ? '48 Nguyen Chi Thanh, Buon Ma Thuot City, Dak Lak Province, VN'
                                    : report.documentName.toLowerCase().includes('dragon') || report.documentName.toLowerCase().includes('binh thuan') || report.documentName.toLowerCase().includes('fruit')
                                      ? 'National Highway 1A, Phan Thiet City, Binh Thuan Province, VN'
                                      : report.documentName.toLowerCase().includes('mango') || report.documentName.toLowerCase().includes('dong thap') || report.documentName.toLowerCase().includes('cao lanh')
                                        ? '12 Le Loi Street, Cao Lanh City, Dong Thap Province, VN'
                                        : 'Vietnam Agri Export Hub Facility, Tan Binh Dist, Ho Chi Minh, VN'}
                                </p>
                              </div>

                              <div className="border border-slate-300 p-3 rounded text-left">
                                <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1">2. IMPORTER / CONSIGNEE</span>
                                <p className="font-bold text-slate-900">
                                  {report.documentName.toLowerCase().includes('coffee') || report.documentName.toLowerCase().includes('dak lak') || report.documentName.toLowerCase().includes('robusta')
                                    ? 'West Coast Beverage Ingestion Corp'
                                    : report.documentName.toLowerCase().includes('dragon') || report.documentName.toLowerCase().includes('binh thuan') || report.documentName.toLowerCase().includes('fruit')
                                      ? 'GACC Border Quarantine Importation Bay'
                                      : report.documentName.toLowerCase().includes('mango') || report.documentName.toLowerCase().includes('dong thap') || report.documentName.toLowerCase().includes('cao lanh')
                                        ? 'Tokyo Agricultural Distribution Authority'
                                        : 'Global Premium Consignment Hub'}
                                </p>
                                <p className="text-[10px] text-slate-500 leading-normal mt-1">
                                  {report.documentName.toLowerCase().includes('coffee') || report.documentName.toLowerCase().includes('dak lak') || report.documentName.toLowerCase().includes('robusta')
                                    ? 'Port of Seattle Logistics Terminals, WA, USA'
                                    : report.documentName.toLowerCase().includes('dragon') || report.documentName.toLowerCase().includes('binh thuan') || report.documentName.toLowerCase().includes('fruit')
                                      ? 'Pingxiang Customs Inspection Zone, Guangxi, China'
                                      : report.documentName.toLowerCase().includes('mango') || report.documentName.toLowerCase().includes('dong thap') || report.documentName.toLowerCase().includes('cao lanh')
                                        ? 'Narita Port of Quarantine Terminals, Chiba, Tokyo, JP'
                                        : 'Bilateral Port Ingestion Facilities'}
                                </p>
                              </div>
                            </div>

                            {/* Manifest Table Spec */}
                            <div className="mt-4 border border-slate-300 rounded overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-100 font-bold border-b border-slate-300 text-[10px] text-slate-500 font-mono text-left">
                                  <tr>
                                    <th className="p-2 border-r border-slate-300">HS CODE PREG</th>
                                    <th className="p-2 border-r border-slate-300">COMMODITY & CARGO SPECIFICATION</th>
                                    <th className="p-2 border-r border-slate-300">QUANTITY</th>
                                    <th className="p-2">COMPLIANCE STAT</th>
                                  </tr>
                                </thead>
                                <tbody className="text-[11px] divide-y divide-slate-200 text-left">
                                  <tr>
                                    <td className="p-2.5 border-r border-slate-300 font-mono font-bold text-slate-900">
                                      {report.hsCodeSuggested || '0810.90'}
                                    </td>
                                    <td className="p-2.5 border-r border-slate-300 text-slate-800 leading-normal">
                                      <p className="font-bold">
                                        {report.documentName.toLowerCase().includes('coffee') || report.documentName.toLowerCase().includes('dak lak') || report.documentName.toLowerCase().includes('robusta')
                                          ? 'Vietnam Green Robusta Coffee Coffee beans'
                                          : report.documentName.toLowerCase().includes('dragon') || report.documentName.toLowerCase().includes('binh thuan') || report.documentName.toLowerCase().includes('fruit')
                                            ? 'Fresh Red Flesh Pitahaya (Hylocereus polyrhizus)'
                                            : report.documentName.toLowerCase().includes('mango') || report.documentName.toLowerCase().includes('dong thap') || report.documentName.toLowerCase().includes('cao lanh')
                                              ? 'Fresh Cat Chu Mangoes (Irradiated / VHT Observers)'
                                              : 'Sovereign Agricultural Foodstuff Consignment'}
                                      </p>
                                      <p className="text-[9px] text-slate-500 mt-0.5">
                                        {report.documentName.toLowerCase().includes('coffee') || report.documentName.toLowerCase().includes('dak lak') || report.documentName.toLowerCase().includes('robusta')
                                          ? 'Grade 1, Screen 18, Moisture: 12.5%'
                                          : report.documentName.toLowerCase().includes('dragon') || report.documentName.toLowerCase().includes('binh thuan') || report.documentName.toLowerCase().includes('fruit')
                                            ? 'Phytosanitary certification: Certified clean'
                                            : report.documentName.toLowerCase().includes('mango') || report.documentName.toLowerCase().includes('dong thap') || report.documentName.toLowerCase().includes('cao lanh')
                                              ? 'Organic Certified, Max residue < 0.01ppm'
                                              : 'Export trade regulations applied'}
                                      </p>
                                    </td>
                                    <td className="p-2.5 border-r border-slate-300 font-mono text-slate-700">
                                      {report.documentName.toLowerCase().includes('coffee') || report.documentName.toLowerCase().includes('dak lak') || report.documentName.toLowerCase().includes('robusta') ? '16,000 KG' : report.documentName.toLowerCase().includes('dragon') ? '22,000 KG' : '8,500 KG'}
                                    </td>
                                    <td className="p-2.5 font-bold text-slate-900">
                                      {report.complianceRatio}% Aegis
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Technical Param Panels (VHT / COLD CHAIN STAGES) */}
                            <div className="grid grid-cols-2 gap-4 mt-4 text-left">
                              <div className="border border-slate-300 p-3 rounded text-left relative" id="doc-sec-telemetry">
                                <span className="text-[8px] font-bold text-slate-400 block mb-1">3. COLD-CHAIN & LOGISTICS LOGGER</span>
                                <div className="space-y-1 font-mono text-[10px]">
                                  <div className="flex justify-between">
                                    <span>Transit Temp:</span>
                                    <span className="font-bold">4.2°C (Vessel)</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Phyto Cert ID:</span>
                                    <span className="font-bold text-blue-700">VN-SPS-2941-K4</span>
                                  </div>
                                  <div className="text-[9px] text-slate-500 leading-normal mt-1 border-t border-slate-100 pt-1">
                                    {report.documentName.toLowerCase().includes('dragon') 
                                      ? 'Port telemetry sequence: Gap is marked below. Pre-cooling is reported but sensor log shows interrupt.' 
                                      : 'Container pre-loading temperature logged continuously. Humidity range stable.'}
                                  </div>
                                </div>

                                {/* Drag-Fruit Telemetry Gap Hotspot Overlay */}
                                {report.documentName.toLowerCase().includes('dragon') && (
                                  <motion.div 
                                    animate={{ opacity: [0.35, 0.75, 0.35] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-amber-500/20 border-2 border-amber-600 rounded flex flex-col items-center justify-center p-2 text-center"
                                  >
                                    <div className="bg-amber-100 border border-amber-400 p-1 rounded shadow-md pointer-events-auto">
                                      <p className="text-[8px] font-extrabold text-amber-800 font-mono">FIELD: COLD_CHAIN_LOG</p>
                                      <p className="text-[10px] text-amber-950 font-sans tracking-tight leading-none mt-0.5">⚠️ 15-Min Telemetry Gap at Cat Lai</p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>

                              <div className="border border-slate-300 p-3 rounded text-left relative" id="doc-sec-treatment">
                                <span className="text-[8px] font-bold text-slate-400 block mb-1">4. PHYTOSANITARY DISINFESTATION</span>
                                <div className="space-y-1 font-mono text-[10px]">
                                  <div className="flex justify-between">
                                    <span>Vapor Heat (VHT):</span>
                                    <span className="font-bold">
                                      {report.documentName.toLowerCase().includes('mango') || report.documentName.toLowerCase().includes('dong thap') || report.documentName.toLowerCase().includes('cao lanh')
                                        ? '47°C, 20 Min'
                                        : 'Not required'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Chemical Residues:</span>
                                    <span className="font-bold text-emerald-700">
                                      {report.documentName.toLowerCase().includes('coffee') ? 'Clean / VietGAP <13%' : 'Chlorpyrifos <0.01'}
                                    </span>
                                  </div>
                                  <div className="text-[9px] text-slate-500 leading-normal mt-1 border-t border-slate-100 pt-1">
                                    Approved treatment observational protocol is logged in cooperative dispatch data stream.
                                  </div>
                                </div>

                                {/* Mango Treatment Missing Seal Indicator Overlay */}
                                {(report.documentName.toLowerCase().includes('mango') || report.documentName.toLowerCase().includes('dong thap') || report.documentName.toLowerCase().includes('cao lanh')) && (
                                  <motion.div 
                                    animate={{ opacity: [0.35, 0.75, 0.35] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-rose-500/20 border-2 border-rose-600 rounded flex flex-col items-center justify-center p-2 text-center"
                                  >
                                    <div className="bg-rose-100 border border-rose-400 p-1 rounded shadow-md pointer-events-auto">
                                      <p className="text-[8px] font-extrabold text-rose-800 font-mono">FIELD: VHT_SIGNATURE</p>
                                      <p className="text-[10px] text-rose-950 font-sans tracking-tight leading-none mt-0.5">❌ Missing observer PPD official signed seal</p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            {/* Generic Custom Document License Code Overlay */}
                            {!report.documentName.toLowerCase().includes('coffee') && 
                             !report.documentName.toLowerCase().includes('dak lak') && 
                             !report.documentName.toLowerCase().includes('robusta') && 
                             !report.documentName.toLowerCase().includes('dragon') && 
                             !report.documentName.toLowerCase().includes('binh thuan') && 
                             !report.documentName.toLowerCase().includes('fruit') && 
                             !report.documentName.toLowerCase().includes('mango') && 
                             !report.documentName.toLowerCase().includes('dong thap') && 
                             !report.documentName.toLowerCase().includes('cao lanh') && (
                              <div className="border border-slate-300 bg-stone-50 p-3.5 rounded text-left mt-4 text-[11px] relative">
                                <span className="text-[8px] tracking-wider text-slate-400 block font-bold">5. SYSTEM DATA ATTRIBUTES / CERTIFICATIONS</span>
                                <p className="font-mono mt-0.5">Primary registration code: <span className="font-bold text-slate-900">MISSING_METADATA</span></p>
                                
                                <motion.div 
                                  animate={{ opacity: [0.35, 0.75, 0.35] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  className="absolute inset-0 bg-amber-500/20 border-2 border-amber-600 rounded flex flex-col items-center justify-center p-1 text-center"
                                >
                                  <div className="bg-amber-100 border border-amber-400 p-1 rounded shadow-inner">
                                    <p className="text-[8px] font-extrabold text-amber-800 font-mono">FIELD: METADATA_EVALUATION</p>
                                    <p className="text-[10px] text-amber-950 font-sans tracking-tight mt-0.5">⚠️ Incomplete GlobalGAP indicator</p>
                                  </div>
                                </motion.div>
                              </div>
                            )}

                            {/* Pristine Document Highlights (for Coffee) */}
                            {(report.documentName.toLowerCase().includes('coffee') || report.documentName.toLowerCase().includes('dak lak') || report.documentName.toLowerCase().includes('robusta')) && (
                              <div className="border border-emerald-200 bg-emerald-50/40 p-3 rounded text-left font-mono text-[10px] mt-4 relative">
                                <p className="text-emerald-800 font-bold block text-[8px] uppercase">Aegis Phyto-Auditor Certificate Status</p>
                                <p className="text-emerald-700 mt-0.5">✓ Moisture Checked: 12.5% (Max 13.0%)</p>
                                <p className="text-emerald-700">✓ US FDA Bio-Security: Verified (ID #194827)</p>
                                
                                <div className="absolute top-2 right-2 border-2 border-dashed border-emerald-500/60 rounded px-2 py-0.5 text-emerald-600 text-[10px] font-extrabold rotate-12 bg-white/50">
                                  PASSED SPS
                                </div>
                              </div>
                            )}

                            {/* Signatures and Seals Area at the bottom */}
                            <div className="mt-8 border-t border-slate-300 pt-4 grid grid-cols-2 gap-8 text-[10px]">
                              <div className="text-left w-full">
                                <p className="font-mono text-slate-500">EXPORTER SEAL STATEMENT</p>
                                <div className="h-12 bg-slate-50 mt-1 border border-dotted border-slate-400 rounded flex items-center justify-center relative overflow-hidden">
                                  <span className="text-[9px] text-slate-400 z-10">Electronic Coop Stamp</span>
                                  {/* Red transparent seal effect */}
                                  <div className="absolute w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center p-0.5 text-[6px] text-red-500/40 font-bold uppercase rotate-6 left-2 font-serif">
                                    VERIFIED
                                  </div>
                                </div>
                              </div>

                              <div className="text-left w-full">
                                <p className="font-mono text-slate-500">STATE INSPECTOR ISSUING ENDORSEMENT</p>
                                <div className="h-12 bg-slate-50 mt-1 border border-dotted border-slate-400 rounded flex items-center justify-center relative overflow-hidden">
                                  {report.documentName.toLowerCase().includes('mango') || report.documentName.toLowerCase().includes('dong thap') || report.documentName.toLowerCase().includes('cao lanh') ? (
                                    <span className="text-[9px] text-rose-500 font-bold uppercase">MISSING OFFICIAL ENDORSEMENT</span>
                                  ) : (
                                    <>
                                      <span className="text-[9px] text-slate-400 z-10">PPD Inspector Signature</span>
                                      <div className="absolute w-10 h-10 rounded-full border border-blue-500/30 flex items-center justify-center p-0.5 text-[6px] text-blue-500/45 font-bold uppercase -rotate-12 right-2 font-serif">
                                        PPD APPR
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Security Barcode & Tracking identifier */}
                            <div className="mt-6 flex justify-between items-center text-[8px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                              <span>AGRI-PORT INTEGRITY SCHEME • POWERED BY AEGIS ORACLE</span>
                              <span>Doc ID: M3-H39-F947-J29</span>
                            </div>
                          </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.section>
          )}



          {/* SOLUTIONS - Interactive compliance pipeline overview */}
          {activeTab === 'Solutions' && (
            <motion.section 
              id="solutions-grid"
              key="solutions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-5xl py-20 flex flex-col items-center text-left"
            >
              <div className="text-center mb-16 space-y-2">
                <span className="text-xs font-mono tracking-[0.25em] text-[#d4af37] uppercase font-semibold block">
                  <GradualSpacing delay={0.15}>{t.solutions.tag}</GradualSpacing>
                </span>
                <StaggeredContainer delay={0.1} className="text-4xl sm:text-5xl text-white font-normal mt-2 select-none">
                  <h2 style={{ fontFamily: "var(--font-display)" }}>
                    <StaggerItem>{t.solutions.title1}</StaggerItem>{' '}
                    <StaggerItem className="italic text-[#d4af37]/90">{t.solutions.title2}</StaggerItem>
                  </h2>
                </StaggeredContainer>
                <WordFadeIn delay={0.4} className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-3 mx-auto leading-relaxed text-center">
                  {t.solutions.subtitle}
                </WordFadeIn>
              </div>

              {/* Exquisite minimal luxury cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {[
                  { icon: Globe, ...t.solutions.items[0] },
                  { icon: FileText, ...t.solutions.items[1] },
                  { icon: ShieldAlert, ...t.solutions.items[2] },
                  { icon: Sparkles, ...t.solutions.items[3] }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="p-8 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex flex-col justify-between group hover:border-[#d4af37]/35 transition-all duration-350 min-h-[320px]"
                  >
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-full border border-white/[0.06] bg-white/[0.005] flex items-center justify-center p-2 group-hover:bg-[#d4af37]/10 transition-all">
                        <item.icon className="w-5 h-5 text-[#d4af37]" />
                      </div>
                      <p className="text-[9px] font-mono tracking-widest text-muted-foreground/80 uppercase">{item.tag}</p>
                      <h4 className="text-xl font-normal text-white" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-normal">{item.desc}</p>
                    </div>
                    <div 
                      onClick={() => {
                        setIsValidationWorkspace(true);
                        setActiveTab('Platform');
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="pt-6 flex items-center gap-1.5 text-xs text-[#d4af37]/60 group-hover:text-[#d4af37] cursor-pointer transition-all"
                    >
                      <span>{t.solutions.triggerWorkflow}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* INSIGHTS - Regulatory alerts list */}
          {activeTab === 'Insights' && (
            <motion.section 
              id="insights-feed"
              key="insights"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-4xl py-20"
            >
              <div className="text-center mb-16">
                <span className="text-xs font-mono tracking-[0.25em] text-muted-foreground uppercase">{t.insights.tag}</span>
                <StaggeredContainer delay={0.1} className="text-4xl text-white font-normal mt-2 select-none">
                  <h2 style={{ fontFamily: "var(--font-display)" }}>
                    <StaggerItem>{t.insights.title1}</StaggerItem>{' '}
                    <StaggerItem className="italic text-[#d4af37]/90">{t.insights.title2}</StaggerItem>
                  </h2>
                </StaggeredContainer>
                <p className="text-xs text-muted-foreground/80 max-w-lg mt-2 mx-auto">
                  {t.insights.subtitle}
                </p>
              </div>

              {/* Feed elements */}
              <div className="space-y-4">
                {t.insights.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 rounded-xl bg-white/[0.015] border border-white/[0.05] flex flex-col md:flex-row justify-between gap-6 hover:bg-white/[0.025] transition-all"
                  >
                    <div className="space-y-2 flex-grow max-w-2xl text-left">
                      <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="text-white/80">{item.source}</span>
                      </div>
                      <h4 className="text-lg font-normal text-white" style={{ fontFamily: "var(--font-display)" }}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {item.body}
                      </p>
                    </div>

                    <div className="flex md:flex-col items-start md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      <span className="text-[9px] font-mono bg-white/5 border border-white/10 rounded px-2 py-0.5 text-white/90 uppercase tracking-wider">
                        {item.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 md:mt-2 font-semibold">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* REGULATIONS - Official Import Laws Database */}
          {activeTab === 'Regulations' && (
            <motion.section
              id="regulations-database-section"
              key="regulations"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex justify-center"
            >
              <RegulatoryDatabase language={language} setLanguage={setLanguage} />
            </motion.section>
          )}

          {/* MANIFESTO - Full visual Vision & Manifesto page */}
          {activeTab === 'Manifesto' && (
            <motion.section 
              id="manifesto-section"
              key="manifesto"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="w-full max-w-4xl py-16"
            >
              <div className="text-center mb-16 space-y-4">
                <span className="text-xs font-mono tracking-[0.25em] text-[#d4af37] uppercase font-semibold flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <GradualSpacing delay={0.15}>{t.manifesto.tag}</GradualSpacing>
                </span>
                <StaggeredContainer delay={0.1} className="text-5xl sm:text-6xl text-white font-normal mt-2 leading-none select-none">
                  <h2 style={{ fontFamily: "var(--font-display)" }}>
                    <StaggerItem>{t.manifesto.title1}</StaggerItem>{' '}
                    <StaggerItem className="italic text-[#d4af37]/90">{t.manifesto.title2}</StaggerItem>
                  </h2>
                </StaggeredContainer>
                <WordFadeIn delay={0.4} className="text-xs sm:text-sm text-muted-foreground/80 max-w-xl mx-auto leading-relaxed text-center">
                  {t.manifesto.subtitle}
                </WordFadeIn>
              </div>

              {/* Main Manifesto Board */}
              <div className="bg-white/[0.01] border border-white/[0.06] backdrop-blur-md rounded-2xl p-8 sm:p-12 text-left shadow-2xl relative overflow-hidden space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl text-white font-normal" style={{ fontFamily: "var(--font-display)" }}>
                    {t.manifesto.problemTitle}
                  </h3>
                  <div className="space-y-4 text-muted-foreground text-xs sm:text-sm leading-relaxed font-normal">
                    <p>
                      {t.manifesto.problemDesc1}
                    </p>
                    <p>
                      {t.manifesto.problemDesc2}
                    </p>
                  </div>
                </div>

                <hr className="border-white/[0.04]" />

                {/* The Philosophical Core */}
                <div className="p-8 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/20 relative">
                  <h3 className="text-xl text-white font-normal mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                    <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    {t.manifesto.philosophyTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal font-light">
                    {t.manifesto.philosophyDesc}
                  </p>
                </div>

                <hr className="border-white/[0.04]" />

                {/* Core System Pillars of Our Vision */}
                <div className="space-y-8">
                  <h3 className="text-2xl text-white font-normal" style={{ fontFamily: "var(--font-display)" }}>
                    {t.manifesto.pillarsTitle}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl bg-white/[0.005] border border-white/[0.04] space-y-3">
                      <span className="text-[10px] font-mono tracking-widest text-[#d4af37] font-semibold block">{t.manifesto.pillar1Tag}</span>
                      <h4 className="text-base text-white font-medium">{t.manifesto.pillar1Title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-normal font-light">
                        {t.manifesto.pillar1Desc}
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-white/[0.005] border border-white/[0.04] space-y-3">
                      <span className="text-[10px] font-mono tracking-widest text-[#d4af37] font-semibold block">{t.manifesto.pillar2Tag}</span>
                      <h4 className="text-base text-white font-medium">{t.manifesto.pillar2Title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-normal font-light">
                        {t.manifesto.pillar2Desc}
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-[#001420]/30 border border-white/[0.04] space-y-3">
                      <span className="text-[10px] font-mono tracking-widest text-[#d4af37] font-semibold block font-sans">{t.manifesto.pillar3Tag}</span>
                      <h4 className="text-base text-white font-medium">{t.manifesto.pillar3Title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-normal font-sans font-light">
                        {t.manifesto.pillar3Desc}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-white/[0.04]" />

                {/* Interactive signature/commitment element */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-left space-y-1">
                    <p className="text-xs text-white font-semibold">{t.manifesto.joinTitle}</p>
                    <p className="text-[11px] text-muted-foreground font-light">{t.manifesto.joinDesc}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('Contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="liquid-glass rounded-full px-8 py-3.5 text-xs text-white hover:scale-[1.02] transition-transform font-semibold text-center cursor-pointer"
                  >
                    {t.manifesto.partnerBtn}
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* CONTACT - Elegant inquiry form */}
          {activeTab === 'Contact' && (
            <motion.section 
              id="contact-form"
              key="contact"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-xl py-16"
            >
              <div className="bg-white/[0.01] border border-white/[0.06] backdrop-blur-md rounded-2xl p-8 relative shadow-2xl">
                
                {!contactSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <span className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground uppercase">{t.contact.tag}</span>
                      <h3 className="text-3xl font-normal text-white mt-2" style={{ fontFamily: "var(--font-display)" }}>
                        {t.contact.title}
                      </h3>
                      <p className="text-xs text-muted-foreground/80 mt-1.5 px-4 leading-relaxed">
                        {t.contact.subtitle}
                      </p>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setContactSubmitted(true);
                      }} 
                      className="space-y-4"
                    >
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 opacity-60" /> {t.contact.fieldName}
                        </label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder={t.contact.fieldNamePl}
                          className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-white/25 rounded-lg py-2.5 px-3.5 text-xs text-white outline-none placeholder:text-muted-foreground/30 transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 opacity-60" /> {t.contact.fieldEmail}
                        </label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder={t.contact.fieldEmailPl}
                          className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-white/25 rounded-lg py-2.5 px-3.5 text-xs text-white outline-none placeholder:text-muted-foreground/30 transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 opacity-60" /> {t.contact.fieldOrg}
                        </label>
                        <input 
                          type="text" 
                          required
                          value={formData.org}
                          onChange={(e) => setFormData({...formData, org: e.target.value})}
                          placeholder={t.contact.fieldOrgPl}
                          className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-white/25 rounded-lg py-2.5 px-3.5 text-xs text-white outline-none placeholder:text-muted-foreground/30 transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 opacity-60" /> {t.contact.fieldNote}
                        </label>
                        <textarea 
                          rows={3}
                          value={formData.note}
                          onChange={(e) => setFormData({...formData, note: e.target.value})}
                          placeholder={t.contact.fieldNotePl}
                          className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-white/25 rounded-lg py-2.5 px-3.5 text-xs text-white outline-none placeholder:text-muted-foreground/30 transition-all resize-none leading-relaxed font-sans"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full mt-4 liquid-glass rounded-xl py-3.5 text-xs text-white font-semibold hover:scale-[1.01] transition-transform cursor-pointer"
                      >
                        {t.contact.submitBtn}
                      </button>
                    </form>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <Lock className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl text-white font-normal" style={{ fontFamily: "var(--font-display)" }}>
                      {t.contact.successTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground/80 mt-2 px-8 leading-relaxed font-mono">
                      {t.contact.requestId} AEG-REG-2026-{Math.floor(Math.random() * 90000 + 10000)}
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-4 px-8 leading-relaxed font-light">
                      {t.contact.successDesc.replace('{name}', formData.name).replace('{org}', formData.org)}
                    </p>
                    <button 
                      onClick={() => {
                        setContactSubmitted(false);
                        setFormData({ name: '', email: '', org: '', note: '' });
                      }}
                      className="mt-8 text-xs text-white/50 hover:text-white underline font-mono cursor-pointer"
                    >
                      {t.contact.retryBtn}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - Cinematic Minimal Luxury */}
      <footer className="relative z-10 py-8 border-t border-white/[0.03] bg-black/10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground/60 tracking-wider">
          <p>{language === 'vi' ? '© 2026 Tập đoàn Công nghệ AegisTrade. Hệ thống thông quan xuất khẩu có chủ quyền.' : '© 2026 AegisTrade Technologies Corp. Sovereign export clearance systems.'}</p>
          <div className="flex flex-row items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer uppercase">{language === 'vi' ? 'Điều khoản tương đương' : 'Terms of Parity'}</span>
            <span className="hover:text-white transition-colors cursor-pointer uppercase">{language === 'vi' ? 'Thông số Sàng lọc ECCN' : 'ECCN Screening Specs'}</span>
            <span className="hover:text-white transition-colors cursor-pointer uppercase flex items-center gap-1">
              {language === 'vi' ? 'Đăng ký WT-O' : 'WT-O Registry'} <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </footer>

      {/* Email Report Modal Dialog */}
      <AnimatePresence>
        {isEmailModalOpen && report && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSendingEmail) setIsEmailModalOpen(false);
              }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[10003]"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-4 max-w-lg h-fit max-h-[95vh] my-auto mx-auto bg-[#070e14] border border-white/10 rounded-2xl shadow-2xl z-[10004] flex flex-col overflow-hidden text-left"
            >
              {/* Gold Accented Custom Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] relative">
                {/* Horizontal Top Gold Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#d4af37]" />
                
                <div className="flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-[#d4af37]" />
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-wide">Aegis Sovereign Clearance Gateway</h3>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Secure PDF Transmission Node</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  disabled={isSendingEmail}
                  className="p-1.5 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!emailSendSuccess ? (
                <div className="p-6 space-y-4 overflow-y-auto">
                  <p className="text-xs text-muted-foreground">
                    Transmit authentication-pinned compliance transcripts over secured governmental pipelines to customs regulatory registries.
                  </p>

                  {/* Recipient Input with Quick Selector chips */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-mono text-white/50 block">Recipient Customs Registry</label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      disabled={isSendingEmail}
                      placeholder="customs.office@gov.vn"
                      className="w-full bg-black/40 border border-white/10 focus:border-[#d4af37]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none placeholder:text-muted-foreground/50 transition-colors font-mono"
                    />
                    
                    {/* Quick Preset Contacts Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEmailAddress('vietnam.customs@gov.vn')}
                        disabled={isSendingEmail}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#d4af37]/30 transition-all cursor-pointer"
                      >
                        Vietnam Customs (vietnam.customs@gov.vn)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailAddress('customs.clearance@aegis-trade.gov')}
                        disabled={isSendingEmail}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#d4af37]/30 transition-all cursor-pointer"
                      >
                        Aegis Authority (customs.clearance@aegis-trade.gov)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailAddress('us.cbp.entry@dhs.gov')}
                        disabled={isSendingEmail}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#d4af37]/30 transition-all cursor-pointer"
                      >
                        US CBP Port Entry (us.cbp.entry@dhs.gov)
                      </button>
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-mono text-white/50 block">Transmission Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      disabled={isSendingEmail}
                      placeholder="Subject Line"
                      className="w-full bg-black/40 border border-white/10 focus:border-[#d4af37]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none placeholder:text-muted-foreground/50 transition-colors"
                    />
                  </div>

                  {/* Body Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-mono text-white/50 block">Message Transcript</label>
                    <textarea
                      rows={4}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      disabled={isSendingEmail}
                      placeholder="Body copy..."
                      className="w-full bg-black/40 border border-white/10 focus:border-[#d4af37]/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none placeholder:text-muted-foreground/50 transition-colors font-sans leading-relaxed"
                    />
                  </div>

                  {/* Attachment Indicator Panel */}
                  <div className="p-3 bg-white/[0.02] border border-dashed border-white/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#d4af37]/10 text-[#d4af37]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-mono uppercase text-[#d4af37] block font-semibold">Active Vault Certificate</span>
                        <span className="text-xs text-white/80 font-mono font-medium max-w-[240px] truncate block">
                          AegisTrade_Certificate_{report.documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-[#d4af37]/20 border border-[#d4af37]/35 text-[#d4af37] px-2 py-0.5 rounded font-bold uppercase">
                      SECURED & VERIFIED
                    </span>
                  </div>

                  {/* Sending Simulator Progress Bar */}
                  {isSendingEmail && (
                    <div className="space-y-2 pt-2 animate-pulse font-mono">
                      <div className="flex justify-between items-center text-[10px] text-white/70">
                        <span className="flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
                          Hatching Cryptographic Signatures...
                        </span>
                        <span>SMTP Pinned Pipeline</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-[#d4af37]"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.2, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Row */}
                  <div className="pt-4 border-t border-white/[0.04] flex gap-3">
                    <button
                      type="button"
                      disabled={isSendingEmail}
                      onClick={() => setIsEmailModalOpen(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs py-2.5 rounded-xl cursor-pointer transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSendingEmail || !emailAddress.trim()}
                      onClick={() => {
                        setIsSendingEmail(true);
                        setTimeout(() => {
                          setIsSendingEmail(false);
                          setEmailSendSuccess(true);
                        }, 2500); // 2.5s clean simulated network delay
                      }}
                      className="flex-1 liquid-glass rounded-xl text-white font-medium text-xs py-2.5 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Mail className="w-4 h-4 text-[#d4af37]" />
                      <span>Transmit Secure Crypt</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Success View */
                <div className="p-8 text-center space-y-5">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-base font-medium text-white">Transmission Authenticated Successfully</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Formally calculated PDF compliance certificate has been emailed with embedded cryptographic telemetry. Securing regulatory trust registries...
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-left space-y-1.5 font-mono max-w-sm mx-auto">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">RECIPIENT PORT</span>
                      <span className="text-white/80">{emailAddress}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">SECURE TRANSACT ID</span>
                      <span className="text-white/80">AE-ID-{Math.floor(1000000 + Math.random() * 9000000)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">TIMESTAMP REGISTER</span>
                      <span className="text-[#d4af37] font-semibold">SUCCESS (200 OK)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEmailModalOpen(false)}
                    className="w-full max-w-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs py-3 rounded-xl cursor-pointer transition-colors"
                  >
                    Return to Authority Suite
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

       <AegisOracleChat language={language} />
      <div className="fixed bottom-6 left-6 z-[9999] pointer-events-none">
        <AmbientAudioPlayer language={language} />
      </div>
    </div>
  );
}
