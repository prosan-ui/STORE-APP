import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  Users, 
  Bot, 
  Send, 
  Smartphone, 
  Activity, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  Settings, 
  Database, 
  SlidersHorizontal,
  Star,
  Download,
  LayoutGrid,
  RefreshCw,
  Info
} from "lucide-react";
import { AppItem, Review, AppCategory, CATEGORIES, Message } from "../types";
import { getIconComponent } from "./AppCard";

interface AdminTabProps {
  apps: AppItem[];
  setApps: React.Dispatch<React.SetStateAction<AppItem[]>>;
  supportMessages: Message[];
  setSupportMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  apps,
  setApps,
  supportMessages,
  setSupportMessages
}) => {
  // Authorization State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [authError, setAuthError] = useState("");

  // CRUD State
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  
  // App Form States
  const [appName, setAppName] = useState("");
  const [appNameKhmer, setAppNameKhmer] = useState("");
  const [appCategory, setAppCategory] = useState<AppCategory>("Utility");
  const [appDeveloper, setAppDeveloper] = useState("");
  const [appSize, setAppSize] = useState("25 MB");
  const [appVersion, setAppVersion] = useState("1.0.0");
  const [appDescription, setAppDescription] = useState("");
  const [appDescriptionKhmer, setAppDescriptionKhmer] = useState("");
  const [appIconName, setAppIconName] = useState("BookOpen");
  const [appIsVerified, setAppIsVerified] = useState(true);
  const [appSafetyScore, setAppSafetyScore] = useState(100);
  const [appPermissions, setAppPermissions] = useState<string>("Internet Connection, Storage Access");
  const [appDownloadCount, setAppDownloadCount] = useState("10K+");

  // Operator Chat State
  const [operatorReply, setOperatorReply] = useState("");

  // Tab View within Admin Dashboard
  const [adminSubTab, setAdminSubTab] = useState<"apps" | "chat" | "stats">("apps");

  // Available Lucide Icons for selection
  const iconOptions = [
    { name: "BookOpen", label: "វចនានុក្រម / សៀវភៅ (BookOpen)" },
    { name: "Wallet", label: "កាបូបប្រាក់ / ហិរញ្ញវត្ថុ (Wallet)" },
    { name: "FileText", label: "កត់ត្រា / ឯកសារ (FileText)" },
    { name: "ShieldAlert", label: "ការពារ / សុវត្ថិភាព (ShieldAlert)" },
    { name: "Gamepad2", label: "ហ្គេម / កម្សាន្ត (Gamepad2)" },
    { name: "Map", label: "ផែនទី / ធ្វើដំណើរ (Map)" },
    { name: "Music", label: "តន្ត្រី / ភ្លេង (Music)" },
    { name: "Compass", label: "រុករក (Compass)" },
    { name: "ShoppingBag", label: "ទិញទំនិញ / ផ្សារ (ShoppingBag)" }
  ];

  // PIN validation handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === "1234" || pinCode.toLowerCase() === "admin") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("លេខកូដមិនត្រឹមត្រូវទេ! សូមសាកល្បងម្តងទៀត។ (PIN is incorrect!)");
    }
  };

  // Pre-fill form for editing
  const startEdit = (app: AppItem) => {
    setIsEditing(true);
    setEditingAppId(app.id);
    setAppName(app.name);
    setAppNameKhmer(app.nameKhmer);
    setAppCategory(app.category);
    setAppDeveloper(app.developer);
    setAppSize(app.size);
    setAppVersion(app.version);
    setAppDescription(app.description);
    setAppDescriptionKhmer(app.descriptionKhmer);
    setAppIconName(app.iconName);
    setAppIsVerified(app.isVerified);
    setAppSafetyScore(app.fileSafetyScore);
    setAppPermissions(app.permissions.join(", "));
    setAppDownloadCount(app.downloadCount);
  };

  const clearForm = () => {
    setIsEditing(false);
    setEditingAppId(null);
    setAppName("");
    setAppNameKhmer("");
    setAppCategory("Utility");
    setAppDeveloper("");
    setAppSize("25 MB");
    setAppVersion("1.0.0");
    setAppDescription("");
    setAppDescriptionKhmer("");
    setAppIconName("BookOpen");
    setAppIsVerified(true);
    setAppSafetyScore(100);
    setAppPermissions("Internet Connection, Storage Access");
    setAppDownloadCount("10K+");
  };

  // Add / Edit submission handler
  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !appNameKhmer.trim() || !appDeveloper.trim()) {
      alert("សូមបំពេញឈ្មោះកម្មវិធី និងអ្នកអភិវឌ្ឍន៍ឱ្យបានគ្រប់គ្រាន់។");
      return;
    }

    const permissionList = appPermissions
      .split(",")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const getKhmerCategoryName = (cat: AppCategory): string => {
      switch (cat) {
        case "Fintech": return "ហិរញ្ញវត្ថុទំនើប";
        case "Education": return "ការអប់រំ";
        case "Utility": return "ឧបករណ៍ប្រើប្រាស់";
        case "E-commerce": return "ពាណិជ្ជកម្មអេឡិចត្រូនិច";
        case "Games": return "ហ្គេម";
        case "Productivity": return "ផលិតភាព";
        default: return "ឧបករណ៍ប្រើប្រាស់";
      }
    };

    if (isEditing && editingAppId) {
      // Update App
      setApps(prev => prev.map(app => {
        if (app.id === editingAppId) {
          return {
            ...app,
            name: appName,
            nameKhmer: appNameKhmer,
            category: appCategory,
            categoryKhmer: getKhmerCategoryName(appCategory),
            developer: appDeveloper,
            size: appSize,
            version: appVersion,
            description: appDescription,
            descriptionKhmer: appDescriptionKhmer,
            iconName: appIconName,
            isVerified: appIsVerified,
            fileSafetyScore: appSafetyScore,
            permissions: permissionList,
            downloadCount: appDownloadCount,
            lastUpdated: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          };
        }
        return app;
      }));
      clearForm();
    } else {
      // Create App
      const newAppId = "custom-" + Math.random().toString(36).substr(2, 9);
      const newApp: AppItem = {
        id: newAppId,
        name: appName,
        nameKhmer: appNameKhmer,
        category: appCategory,
        categoryKhmer: getKhmerCategoryName(appCategory),
        rating: 5.0,
        reviewsCount: 1,
        developer: appDeveloper,
        size: appSize,
        version: appVersion,
        description: appDescription || `Elegant new tool: ${appName}`,
        descriptionKhmer: appDescriptionKhmer || `កម្មវិធីថ្មីទំនើប៖ ${appNameKhmer}`,
        iconName: appIconName,
        isVerified: appIsVerified,
        downloadCount: appDownloadCount,
        lastUpdated: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        status: "not_installed",
        downloadProgress: 0,
        fileSafetyScore: appSafetyScore,
        permissions: permissionList,
        versionHistory: [
          {
            version: appVersion,
            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            changes: ["Initial stable release on Khmer App Store"],
            changesKhmer: ["ការចេញផ្សាយកំណែដំបូងបង្អស់លើហាងកម្មវិធីខ្មែរ"]
          }
        ]
      };

      setApps(prev => [newApp, ...prev]);
      clearForm();
    }
  };

  // Delete handler
  const handleDeleteApp = (id: string, nameKh: string) => {
    if (confirm(`តើអ្នកពិតជាចង់លុបកម្មវិធី "${nameKh}" នេះមែនទេ?`)) {
      setApps(prev => prev.filter(app => app.id !== id));
      if (editingAppId === id) {
        clearForm();
      }
    }
  };

  // Quick Verification Switch
  const toggleVerification = (id: string) => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, isVerified: !app.isVerified } : app
    ));
  };

  // Quick Status change simulation
  const triggerUpdateAvailable = (id: string) => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, status: "update_available", version: "New Update!" } : app
    ));
  };

  // Support response submitter
  const handleSendOperatorReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorReply.trim()) return;

    const replyMsg: Message = {
      id: Math.random().toString(),
      sender: "support",
      text: operatorReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSupportMessages(prev => [...prev, replyMsg]);
    setOperatorReply("");
  };

  // Compute stats
  const totalApps = apps.length;
  const verifiedApps = apps.filter(a => a.isVerified).length;
  const avgSafetyScore = Math.round(apps.reduce((sum, a) => sum + a.fileSafetyScore, 0) / (totalApps || 1));
  const totalReviews = apps.reduce((sum, a) => sum + a.reviewsCount, 0);

  // Lock panel
  const handleLock = () => {
    setIsAuthenticated(false);
    setPinCode("");
    clearForm();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center" id="admin-login-card">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
          <Lock className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
          ផ្ទាំងគ្រប់គ្រងអ្នកបច្ចេកទេស (Admin Portal)
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 leading-relaxed">
          សូមបញ្ជាក់លេខកូដ PIN របស់អ្នកដើម្បីចូលទៅកាន់ផ្ទាំងគ្រប់គ្រងកម្មវិធី ពិនិត្យមេរោគ និងឆ្លើយតបការជជែកផ្ទាល់។
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-left text-[11px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 mb-1.5">
              លេខកូដសម្ងាត់ (Admin PIN)
            </label>
            <input
              id="admin-pin-input"
              type="password"
              placeholder="••••"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full text-center text-lg tracking-widest bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-850 dark:text-white"
              maxLength={10}
              autoFocus
            />
          </div>

          {authError && (
            <p className="text-xs text-rose-500 font-semibold" id="admin-auth-error">
              {authError}
            </p>
          )}

          <div className="bg-indigo-50/50 dark:bg-indigo-950/10 p-3.5 rounded-xl border border-indigo-100/30 dark:border-indigo-900/10 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
            <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-left leading-relaxed">
              <span className="font-bold text-slate-700 dark:text-slate-300">លេខកូដសាកល្បងលំនាំដើម៖</span> <code className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 py-0.5 rounded-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">1234</code> ឬ <code className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 py-0.5 rounded-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">admin</code>
            </div>
          </div>

          <button
            type="submit"
            id="admin-login-submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm"
          >
            ផ្ទៀងផ្ទាត់ និងចូល (Unlock Admin)
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn" id="admin-console-tab">
      
      {/* Top Welcome Control Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/40">
            <Unlock className="w-5.5 h-5.5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                ផ្ទាំងអ្នកគ្រប់គ្រង Khmer App Store
              </h3>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                System Active
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              សួស្តី Admin! អ្នកអាចគ្រប់គ្រងកម្មវិធី ស្ថានភាពសុវត្ថិភាព និងជជែកជាមួយអ្នកប្រើប្រាស់បាន។
            </p>
          </div>
        </div>

        <button
          onClick={handleLock}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-350 text-xs font-bold rounded-xl transition-all active:scale-95 border border-transparent dark:border-slate-700"
        >
          <Lock className="w-4 h-4" />
          ចាកចេញ (Lock Admin)
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-indigo-100 dark:hover:border-slate-700 transition-all">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">ចំនួនកម្មវិធីសរុប</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalApps}</span>
            <span className="text-xs text-slate-400 font-medium">កម្មវិធី</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
            <span>កាតាឡុកសរុប (All Categories)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-indigo-100 dark:hover:border-slate-700 transition-all">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">ផ្ទៀងផ្ទាត់រួច (Verified)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{verifiedApps}</span>
            <span className="text-xs text-slate-400 font-medium">/{totalApps}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600/80 mt-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>មានសុវត្ថិភាព ១០០% (Fully Signed)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-indigo-100 dark:hover:border-slate-700 transition-all">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">ពិន្ទុសុវត្ថិភាពមធ្យម</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{avgSafetyScore}%</span>
            <span className="text-xs text-slate-400 font-medium">Score</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-indigo-500 mt-2 font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>ស្កេនដោយ AI Antivirus Engine</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-indigo-100 dark:hover:border-slate-700 transition-all">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">សារជជែកគាំទ្រ</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-500">{supportMessages.length}</span>
            <span className="text-xs text-slate-400 font-medium">សារសរុប</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-amber-500 mt-2 font-medium">
            <Bot className="w-3.5 h-3.5" />
            <span>ជំនួយការបច្ចេកទេស និង Operator</span>
          </div>
        </div>
      </div>

      {/* Nav Sub Tabs inside Dashboard */}
      <div className="flex border-b border-slate-100 dark:border-slate-850 gap-6">
        <button
          onClick={() => setAdminSubTab("apps")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            adminSubTab === "apps"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
          }`}
        >
          <Database className="w-4 h-4" />
          គ្រប់គ្រងកម្មវិធី ({apps.length})
        </button>
        <button
          onClick={() => setAdminSubTab("chat")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            adminSubTab === "chat"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
          }`}
        >
          <Users className="w-4 h-4" />
          ប្រព័ន្ធឆ្លើយតបអតិថិជន ({supportMessages.filter(m => m.sender === "user").length} Enquiries)
        </button>
      </div>

      {/* ADMIN SUB TAB: APPS MANAGER */}
      {adminSubTab === "apps" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* App Submission / Edit Form (Left 5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-6">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <PlusCircle className="w-4.5 h-4.5 text-indigo-500" />
                {isEditing ? "កែសម្រួលព័ត៌មានកម្មវិធី (Edit App)" : "បញ្ចូលកម្មវិធីថ្មី (Add Verified App)"}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                បំពេញទម្រង់បែបបទខាងក្រោម ដើម្បីធ្វើបច្ចុប្បន្នភាព ឬបញ្ចូលកម្មវិធីទៅក្នុងហាង។
              </p>
            </div>

            <form onSubmit={handleSaveApp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">ឈ្មោះកម្មវិធី (English)</label>
                  <input
                    type="text"
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                    placeholder="e.g. ABA Mobile"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">ឈ្មោះខ្មែរ (Khmer Name)</label>
                  <input
                    type="text"
                    required
                    value={appNameKhmer}
                    onChange={(e) => setAppNameKhmer(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                    placeholder="e.g. ធនាគារ អេប៊ីអេ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">ប្រភេទ (Category)</label>
                  <select
                    value={appCategory}
                    onChange={(e) => setAppCategory(e.target.value as AppCategory)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">អ្នកអភិវឌ្ឍន៍ (Developer)</label>
                  <input
                    type="text"
                    required
                    value={appDeveloper}
                    onChange={(e) => setAppDeveloper(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                    placeholder="e.g. ABA Bank"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">ទំហំឯកសារ (Size)</label>
                  <input
                    type="text"
                    value={appSize}
                    onChange={(e) => setAppSize(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                    placeholder="e.g. 35 MB"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">កំណែកម្មវិធី (Ver.)</label>
                  <input
                    type="text"
                    value={appVersion}
                    onChange={(e) => setAppVersion(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                    placeholder="e.g. 1.0.2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">ទាញយក (Downloads)</label>
                  <input
                    type="text"
                    value={appDownloadCount}
                    onChange={(e) => setAppDownloadCount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                    placeholder="e.g. 100K+"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">ជ្រើសរើសរូបតំណាង (App Icon)</label>
                <select
                  value={appIconName}
                  onChange={(e) => setAppIconName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                >
                  {iconOptions.map(opt => (
                    <option key={opt.name} value={opt.name}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">សិទ្ធិស្នើសុំ (Permissions, Comma separated)</label>
                <input
                  type="text"
                  value={appPermissions}
                  onChange={(e) => setAppPermissions(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                  placeholder="Internet Connection, Storage, Geolocation"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">ការពិពណ៌នាជាខ្មែរ (Khmer Description)</label>
                <textarea
                  rows={2}
                  value={appDescriptionKhmer}
                  onChange={(e) => setAppDescriptionKhmer(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                  placeholder="ពិពណ៌នាពីមុខងារជាភាសាខ្មែរ..."
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 mb-1">English Description</label>
                <textarea
                  rows={1}
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-150"
                  placeholder="Describe in English..."
                />
              </div>

              {/* Verified and Safety score row */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">ផ្ទៀងផ្ទាត់ហត្ថលេខា (Cryptographic Signature Verification)</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">សម្គាល់ជាកម្មវិធីដែលផ្ទៀងផ្ទាត់រួច និងមានការចុះហត្ថលេខាត្រឹមត្រូវ</span>
                  </div>
                  <input
                    type="checkbox"
                    id="is-verified-checkbox"
                    checked={appIsVerified}
                    onChange={(e) => setAppIsVerified(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded-sm focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-800 dark:text-slate-200">ពិន្ទុសុវត្ថិភាពមេរោគ (Malware Score):</span>
                    <span className={`font-mono ${appSafetyScore >= 90 ? "text-emerald-500" : appSafetyScore >= 70 ? "text-amber-500" : "text-rose-500"}`}>{appSafetyScore}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={appSafetyScore}
                    onChange={(e) => setAppSafetyScore(parseInt(e.target.value))}
                    className="w-full accent-indigo-650"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  id="save-app-btn"
                  className="flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors"
                >
                  {isEditing ? "រក្សាការកែសម្រួល (Save Changes)" : "បញ្ចូលទៅក្នុងហាង (Submit New App)"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    បោះបង់
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List of Apps and Direct Actions (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                បញ្ជីកម្មវិធីទាំងអស់ (App Store Directory)
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                បញ្ជីសរុប៖ {apps.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[660px] overflow-y-auto pr-1">
              {apps.map(app => (
                <div 
                  key={app.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl flex items-center justify-between gap-4 shadow-2xs hover:border-indigo-100 dark:hover:border-slate-800"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl text-indigo-600 dark:text-indigo-400">
                      {getIconComponent(app.iconName, "w-6 h-6")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {app.nameKhmer}
                        </span>
                        {app.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Verified App" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {app.name} • v{app.version} • {app.size}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] bg-indigo-50/50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-sm">
                          {app.categoryKhmer}
                        </span>
                        <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-sm ${
                          app.fileSafetyScore >= 95 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "bg-amber-500/10 text-amber-600"
                        }`}>
                          Safety: {app.fileSafetyScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleVerification(app.id)}
                      title={app.isVerified ? "Unverify app signature" : "Verify app signature"}
                      className={`p-2 rounded-lg border transition-colors ${
                        app.isVerified
                          ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => triggerUpdateAvailable(app.id)}
                      title="Simulate new update release"
                      className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => startEdit(app)}
                      title="Edit app details"
                      className="p-2 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteApp(app.id, app.nameKhmer)}
                      title="Delete app from catalog"
                      className="p-2 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-rose-600 dark:text-slate-550 dark:hover:text-rose-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SUB TAB: OPERATOR CHAT PORTAL */}
      {adminSubTab === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
          {/* Instructions Left (4 cols) */}
          <div className="lg:col-span-4 space-y-4 pr-0 lg:pr-4 border-r-0 lg:border-r border-slate-100 dark:border-slate-850">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-indigo-500" />
                ប្រព័ន្ធជំនួយការជជែកផ្ទាល់
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                បច្ចុប្បន្ន ម៉ាស៊ីន AI ជាអ្នកឆ្លើយតបអតិថិជន។ ប៉ុន្តែក្នុងនាមជា Admin អ្នកអាចឆ្លើយតបសារផ្ទាល់ខ្លួនជំនួស AI បាន។
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-350 leading-relaxed">
              <span className="font-bold text-slate-800 dark:text-white">របៀបប្រើប្រាស់៖</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>សាររបស់អ្នកប្រើប្រាស់ចុងក្រោយបង្អស់នឹងបង្ហាញនៅខាងស្តាំ</li>
                <li>នៅពេលអ្នកវាយសារឆ្លើយតប សារនោះនឹងបង្ហាញភ្លាមៗនៅក្នុងអេក្រង់របស់សួរចម្លើយរបស់អ្នកប្រើប្រាស់</li>
                <li>ការឆ្លើយតបនឹងបង្ហាញជា "ជំនួយការបច្ចេកទេស" (Signed as Support)</li>
              </ul>
            </div>
          </div>

          {/* Interactive Chat Console Right (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[480px]">
            {/* Operator Header */}
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase text-indigo-500">
                  រង្វង់ត្រួតពិនិត្យការជជែក (Live Console Feed)
                </h5>
                <p className="text-[11px] text-slate-400">
                  អ្នកកំពុងសម្លឹងមើលប្រវត្តិសន្ទនារបស់អ្នកប្រើប្រាស់ជាមួយប្រព័ន្ធ AI ស្វ័យប្រវត្ត។
                </p>
              </div>
              <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-emerald-100/30">
                Connected
              </span>
            </div>

            {/* Conversation History */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2 scrollbar-thin">
              {supportMessages.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  មិនទាន់មានការសន្ទនាណាមួយឡើយ។
                </div>
              ) : (
                supportMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      msg.sender === "user" ? "mr-auto" : "ml-auto flex-row-reverse"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                      msg.sender === "user" 
                        ? "bg-indigo-650 text-white" 
                        : "bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}>
                      {msg.sender === "user" ? "U" : "A"}
                    </div>
                    <div>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-slate-200 rounded-tl-none"
                          : "bg-indigo-650 text-white rounded-tr-none"
                      }`}>
                        {msg.text}
                      </div>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                        {msg.sender === "user" ? "User" : "Admin Operator"} • {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Operator Reply Input Form */}
            <form onSubmit={handleSendOperatorReply} className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex gap-2">
              <input
                type="text"
                placeholder="វាយសារឆ្លើយតបរបស់អ្នកក្នុងនាមជា Admin / Helpdesk Support..."
                value={operatorReply}
                onChange={(e) => setOperatorReply(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 text-slate-850 dark:text-white"
              />
              <button
                type="submit"
                disabled={!operatorReply.trim()}
                className="bg-indigo-650 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                ឆ្លើយតប (Reply)
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
