import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  ShieldCheck, 
  HelpCircle, 
  Database, 
  LayoutGrid, 
  Sparkles, 
  CheckCircle, 
  Star, 
  Activity, 
  Smartphone, 
  Settings, 
  SlidersHorizontal,
  Bot,
  RefreshCw,
  Sun,
  Moon,
  Info,
  ShieldAlert,
  Compass,
  Pin,
  Bell,
  BellOff,
  Download,
  Check,
  BookOpen,
  Wallet,
  FileText,
  Gamepad2,
  Map,
  Music,
  ShoppingBag,
  Camera,
  Heart,
  Flag,
  X
} from "lucide-react";
import { initialApps } from "./initialApps";
import { AppItem, Review, CATEGORIES, Message } from "./types";
import { AppCard } from "./components/AppCard";
import { AppDetailsModal } from "./components/AppDetailsModal";
import { ScannerTab } from "./components/ScannerTab";
import { SupportTab } from "./components/SupportTab";
import { BackupTab } from "./components/BackupTab";
import { AdminTab } from "./components/AdminTab";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [apps, setApps] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem("khmer_appstore_apps");
    return saved ? JSON.parse(saved) : initialApps;
  });
  const [language, setLanguage] = useState<"kh" | "en">(() => {
    const saved = localStorage.getItem("khmer_appstore_language");
    return (saved === "en" || saved === "kh") ? saved : "kh";
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>(""); // starts empty
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  
  // App-specific reviews dictionary
  const [appReviews, setAppReviews] = useState<Record<string, Review[]>>(() => {
    const saved = localStorage.getItem("khmer_appstore_reviews");
    if (saved) return JSON.parse(saved);
    return {
      "khmer-dict": [
        { id: "r1", userName: "សុខ ជា", rating: 5, comment: "ល្អខ្លាំងណាស់! ងាយស្រួលរកពាក្យខ្មែរបុរាណ និងអក្ខរាវិរុទ្ធបានត្រឹមត្រូវ។", date: "2026-06-25" },
        { id: "r2", userName: "ស្រីនី", rating: 4, comment: "វចនានុក្រមល្អ តែចង់ឱ្យមានសម្លេងអានពាក្យបន្ថែមទៀត។", date: "2026-06-20" }
      ],
      "bakong-link": [
        { id: "r3", userName: "គង់ វណ្ណៈ", rating: 5, comment: "ប្រព័ន្ធលឿន និងមានសុវត្ថិភាពខ្ពស់ក្នុងការផ្ទេរប្រាក់ប្រចាំថ្ងៃ។", date: "2026-06-27" }
      ],
      "krama-notes": [
        { id: "r4", userName: "ចាន់ សុភ័ក្ត្រ", rating: 5, comment: "បម្រុងទុកទិន្នន័យបានល្អ និងឯកជនភាពខ្ពស់ខ្លាំង។", date: "2026-06-18" }
      ],
      "angkor-antivirus": [
        { id: "r5", userName: "ម៉េង ហួរ", rating: 5, comment: "ស្កែនរកឃើញមេរោគលឿន និងមិនស៊ីថ្មទូរស័ព្ទទេ។", date: "2026-06-29" }
      ]
    };
  });

  const [activeTab, setActiveTab] = useState<"store" | "security" | "support" | "backup" | "admin">("store");
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState<boolean>(false);

  useEffect(() => {
    setIsMac(navigator.userAgent.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        
        // Force the active tab to "store" to expose the search input
        if (activeTab !== "store") {
          setActiveTab("store");
          setTimeout(() => {
            searchInputRef.current?.focus();
            searchInputRef.current?.select();
          }, 80);
        } else {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTab]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("khmer_appstore_dark_mode");
    return saved ? JSON.parse(saved) : false;
  });
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("khmer_appstore_auto_update");
    return saved ? JSON.parse(saved) : true;
  });

  // Shared chat support messages state to sync between client support and admin console
  const [supportMessages, setSupportMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("khmer_appstore_support_messages");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "welcome",
        sender: "support",
        text: "សួស្តី! ខ្ញុំជាភ្នាក់ងារជំនួយការបច្ចេកទេស ២៤/៧ របស់ Khmer App Store។ តើខ្ញុំអាចជួយលោកអ្នកអំពីអ្វីខ្លះថ្ងៃនេះ? ខ្ញុំអាចជួយដោះស្រាយបញ្ហាទាញយក ការពិនិត្យមេរោគ និងការធ្វើសមកាលកម្មទិន្នន័យ។",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    app: AppItem;
  } | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "error" | "info" } | null>(null);

  // Auto-dismiss toast notification after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Close context menu on window click
  useEffect(() => {
    const handleCloseMenu = () => setContextMenu(null);
    window.addEventListener("click", handleCloseMenu);
    return () => {
      window.removeEventListener("click", handleCloseMenu);
    };
  }, []);

  const handleContextMenu = (app: AppItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Safety margin positioning to keep the menu inside the viewport
    const menuWidth = 240;
    const menuHeight = 260;
    let x = e.clientX;
    let y = e.clientY;
    
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }
    
    // Ensure coordinates are not negative
    x = Math.max(10, x);
    y = Math.max(10, y);

    setContextMenu({
      x,
      y,
      app
    });
  };

  const handleTogglePin = (appId: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, isPinned: !a.isPinned } : a));
    setContextMenu(null);
  };

  const handleToggleNotifications = (appId: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, notificationsEnabled: !a.notificationsEnabled } : a));
    setContextMenu(null);
  };

  const handleReportApp = (app: AppItem) => {
    setToast({
      message: language === "kh" 
        ? `កម្មវិធី "${app.nameKhmer}" ត្រូវបានរាយការណ៍សម្រាប់បញ្ហាសុវត្ថិភាព។ ក្រុមការងារយើងខ្ញុំនឹងពិនិត្យមើលក្នុងពេលឆាប់ៗនេះ។`
        : `App "${app.name}" has been flagged for suspicious activity. Our security team will review it shortly.`,
      type: "warning"
    });
    setContextMenu(null);
  };

  // Persist State Updates inside LocalStorage
  useEffect(() => {
    localStorage.setItem("khmer_appstore_apps", JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem("khmer_appstore_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("khmer_appstore_reviews", JSON.stringify(appReviews));
  }, [appReviews]);

  useEffect(() => {
    localStorage.setItem("khmer_appstore_dark_mode", JSON.stringify(isDarkMode));
    // Set theme classes correctly on root HTML element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("khmer_appstore_auto_update", JSON.stringify(autoUpdateEnabled));
  }, [autoUpdateEnabled]);

  useEffect(() => {
    localStorage.setItem("khmer_appstore_support_messages", JSON.stringify(supportMessages));
  }, [supportMessages]);
  
  // Clean search query state
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
  };

  // Get categories from types definition
  const categories = ["All", ...CATEGORIES];

  const categoryKhmerMap: Record<string, string> = {
    All: "ទាំងអស់",
    Fintech: "ហិរញ្ញវត្ថុទំនើប",
    Education: "ការអប់រំ",
    Utility: "ឧបករណ៍ប្រើប្រាស់",
    "E-commerce": "ពាណិជ្ជកម្មអេឡិចត្រូនិច",
    Games: "ហ្គេម",
    Productivity: "ផលិតភាព",
    Photography: "រូបថត",
    Health: "សុខភាព"
  };

  // Auto update trigger simulation
  useEffect(() => {
    if (!autoUpdateEnabled) return;
    
    // Periodically check if any app is in 'update_available' and update it automatically
    const interval = setInterval(() => {
      setApps(prevApps => {
        const updateable = prevApps.find(app => app.status === "update_available");
        if (updateable) {
          // Trigger automatic update simulation
          setTimeout(() => {
            setApps(currentApps => 
              currentApps.map(a => 
                a.id === updateable.id ? { ...a, status: "updating" } : a
              )
            );
            
            // complete the update
            setTimeout(() => {
              setApps(currentApps => 
                currentApps.map(a => 
                  a.id === updateable.id ? { ...a, status: "installed", version: "Latest" } : a
                )
              );
            }, 3000);

          }, 500);
        }
        return prevApps;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [autoUpdateEnabled]);

  // Handle manual download/install simulation
  const handleDownload = (app: AppItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setApps((prev) => 
      prev.map((a) => (a.id === app.id ? { ...a, status: "downloading", downloadProgress: 0 } : a))
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setApps((prev) => 
        prev.map((a) => {
          if (a.id === app.id) {
            if (progress >= 100) {
              clearInterval(interval);
              return { ...a, status: "installed", downloadProgress: 100 };
            }
            return { ...a, downloadProgress: progress };
          }
          return a;
        })
      );
    }, 300);
  };

  // Handle manual update simulation
  const handleUpdate = (app: AppItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setApps((prev) => 
      prev.map((a) => (a.id === app.id ? { ...a, status: "updating" } : a))
    );

    setTimeout(() => {
      setApps((prev) => 
        prev.map((a) => (a.id === app.id ? { ...a, status: "installed", version: "Latest" } : a))
      );
    }, 2500);
  };

  // Add a new review/rating to an app
  const handleAddReview = (comment: string, rating: number) => {
    if (!selectedApp) return;
    const newRev: Review = {
      id: Math.random().toString(),
      userName: "អ្នកប្រើប្រាស់ពិតប្រាកដ",
      rating,
      comment,
      date: new Date().toISOString().substring(0, 10)
    };

    const currentReviews = appReviews[selectedApp.id] || [];
    const updatedReviews = [newRev, ...currentReviews];
    
    setAppReviews({
      ...appReviews,
      [selectedApp.id]: updatedReviews
    });

    // Calculate new average rating for the app
    const sumRatings = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((sumRatings / updatedReviews.length).toFixed(1));

    setApps(prev => 
      prev.map(a => 
        a.id === selectedApp.id 
          ? { ...a, rating: avgRating, reviewsCount: updatedReviews.length } 
          : a
      )
    );
  };

  // Filter apps
  const cleanQuery = searchQuery.trim().toLowerCase();
  const filteredApps = apps.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(cleanQuery) ||
      app.nameKhmer.toLowerCase().includes(cleanQuery) ||
      app.developer.toLowerCase().includes(cleanQuery) ||
      app.category.toLowerCase().includes(cleanQuery) ||
      app.categoryKhmer.toLowerCase().includes(cleanQuery);
    
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Sort pinned items to the very top
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      
      {/* Top Professional Header Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-indigo-600 to-indigo-850 dark:from-indigo-500 dark:to-indigo-700 p-2.5 rounded-2xl text-white shadow-md shadow-indigo-500/15 flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 leading-none">
                KHMER APP STORE
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold font-mono tracking-wider">
                SECURE & VERIFIED PLAFORM
              </p>
            </div>
          </div>

          {/* Center Main Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/30 dark:border-slate-700/40">
            <button
              onClick={() => setActiveTab("store")}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                activeTab === "store"
                  ? "bg-white dark:bg-slate-750 text-indigo-600 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4" />
                ទំព័រដើម (Store)
              </span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                activeTab === "security"
                  ? "bg-white dark:bg-slate-750 text-indigo-600 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                ស្កេនមេរោគ (AI Security)
              </span>
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                activeTab === "support"
                  ? "bg-white dark:bg-slate-750 text-indigo-600 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                ជជែកផ្ទាល់ (24/7 Live Chat)
              </span>
            </button>
            <button
              onClick={() => setActiveTab("backup")}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                activeTab === "backup"
                  ? "bg-white dark:bg-slate-750 text-indigo-600 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                បម្រុងទុក (Backup & Sync)
              </span>
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                activeTab === "admin"
                  ? "bg-white dark:bg-slate-750 text-indigo-600 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-amber-500" />
                អ្នកគ្រប់គ្រង (Admin)
              </span>
            </button>
          </nav>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            
            {/* Auto update toggle badge status */}
            <button
              onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
              title={autoUpdateEnabled ? "Auto update is Enabled" : "Auto update is Disabled"}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                autoUpdateEnabled 
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700"
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${autoUpdateEnabled ? "animate-spin" : ""}`} />
              <span>Auto Update: {autoUpdateEnabled ? "ON" : "OFF"}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(l => l === "kh" ? "en" : "kh")}
              id="language-toggle-btn"
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs rounded-xl border border-indigo-100/30 dark:border-indigo-900/20 transition-all flex items-center gap-1.5 cursor-pointer"
              aria-label="Switch Language"
            >
              <span className="text-xs">🌐</span>
              <span className="font-mono uppercase text-[10px] tracking-wider">{language === "kh" ? "EN" : "KH"}</span>
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-350 rounded-xl transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Tab Navigation bottom-bar / top banner */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-2 grid grid-cols-5 gap-1 sticky top-18 z-35 shadow-xs">
        <button
          onClick={() => setActiveTab("store")}
          className={`py-2 text-center rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 ${
            activeTab === "store" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "text-slate-400"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          ហាងកម្មវិធី
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`py-2 text-center rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 ${
            activeTab === "security" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "text-slate-400"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          ពិនិត្យមេរោគ
        </button>
        <button
          onClick={() => setActiveTab("support")}
          className={`py-2 text-center rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 ${
            activeTab === "support" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "text-slate-400"
          }`}
        >
          <Bot className="w-4 h-4" />
          ជជែកផ្ទាល់
        </button>
        <button
          onClick={() => setActiveTab("backup")}
          className={`py-2 text-center rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 ${
            activeTab === "backup" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "text-slate-400"
          }`}
        >
          <Database className="w-4 h-4" />
          បម្រុងទុក
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`py-2 text-center rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 ${
            activeTab === "admin" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "text-slate-400"
          }`}
        >
          <Settings className="w-4 h-4 text-amber-500" />
          គ្រប់គ្រង
        </button>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Render Tabs conditionally */}
        {activeTab === "store" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Visual Prompts / Banner */}
            <div className="bg-linear-to-r from-indigo-650 via-indigo-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg border border-indigo-700/30">
              {/* Abs decoration vectors */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 opacity-15 pointer-events-none hidden md:block">
                <Compass className="w-72 h-72 text-indigo-300 animate-spin" style={{ animationDuration: "120s" }} />
              </div>

              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-200 text-xs font-bold border border-indigo-500/30">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  ប្រព័ន្ធផ្ទៀងផ្ទាត់ និងស្កេនមេរោគឆ្លាតវៃ
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  ស្វែងរក និងទាញយកកម្មវិធីខ្មែរ <br />
                  ប្រកបដោយទំនុកចិត្ត និងសុវត្ថិភាពខ្ពស់បំផុត
                </h2>
                <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed font-medium">
                  គ្រប់កម្មវិធីទាំងអស់ត្រូវបានឆ្លងកាត់ការត្រួតពិនិត្យ និងស្កេនស្វែងរកមេរោគ (Antivirus Scan) ដោយស្វ័យប្រវត្ត ដើម្បីធានាគ្មានការលួចទិន្នន័យ គ្មានសារធាតុចារកម្ម ឬហានិភ័យឯកជនភាពផ្សេងៗឡើយ។
                </p>
                
                {/* Highlights banner */}
                <div className="pt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-indigo-200">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>ផ្ទៀងផ្ទាត់ហត្ថលេខាត្រឹមត្រូវ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>ពិនិត្យមេរោគស្វ័យប្រវត្ត (AI Scanner)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>បម្រុងទុកសុវត្ថិភាពខ្ពស់</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter, Search & Options bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
              
              {/* Search bar inputs */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  id="app-search-input"
                  type="text"
                  placeholder={language === "kh" ? "ស្វែងរកកម្មវិធី អ្នកបង្កើត ឬប្រភេទទិន្នន័យ..." : "Search apps, developers, or categories..."}
                  value={searchQuery === " " ? "" : searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-18 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 focus:outline-hidden"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded-md font-sans text-[10px] font-bold select-none pointer-events-none shadow-2xs">
                  <span className="text-[9px] font-medium mr-0.5">{isMac ? "⌘" : "Ctrl"}</span>
                  <span>K</span>
                </div>
              </div>

              {/* Category tabs filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-650 text-white shadow-xs"
                        : "bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {categoryKhmerMap[cat] || cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Grid display apps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedCategory === "All" ? "កម្មវិធីណែនាំពិសេស" : (categoryKhmerMap[selectedCategory] || selectedCategory)} ({filteredApps.length})
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  Verified Catalog
                </span>
              </div>

              {filteredApps.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1 text-sm">
                    រកមិនឃើញកម្មវិធីដែលអ្នកស្វែងរកទេ
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    សូមសាកល្បងវាយឈ្មោះ ឬប្រើពាក្យគន្លឹះផ្សេងទៀត ដើម្បីស្វែងរកកម្មវិធីដែលត្រឹមត្រូវ។
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredApps.map((app) => (
                    <AppCard 
                      key={app.id}
                      app={app}
                      language={language}
                      onSelect={(app) => setSelectedApp(app)}
                      onDownload={handleDownload}
                      onUpdate={handleUpdate}
                      onContextMenu={handleContextMenu}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === "security" && (
          <div className="animate-fadeIn">
            <ScannerTab apps={apps} />
          </div>
        )}

        {activeTab === "support" && (
          <div className="animate-fadeIn">
            <SupportTab messages={supportMessages} setMessages={setSupportMessages} />
          </div>
        )}

        {activeTab === "backup" && (
          <div className="animate-fadeIn">
            <BackupTab />
          </div>
        )}

        {activeTab === "admin" && (
          <div className="animate-fadeIn">
            <AdminTab 
              apps={apps} 
              setApps={setApps} 
              supportMessages={supportMessages} 
              setSupportMessages={setSupportMessages} 
            />
          </div>
        )}

      </main>

      {/* App Details Modal Overlay */}
      <AnimatePresence>
        {selectedApp && (() => {
          const liveApp = apps.find((a) => a.id === selectedApp.id) || selectedApp;
          return (
            <AppDetailsModal 
              app={liveApp}
              language={language}
              onClose={() => setSelectedApp(null)}
              onDownload={(app, e) => handleDownload(app, e)}
              onUpdate={(app, e) => handleUpdate(app, e)}
              reviews={appReviews[liveApp.id] || []}
              onAddReview={handleAddReview}
              allApps={apps}
            />
          );
        })()}
      </AnimatePresence>

      {/* Professional Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-850 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              KHMER SECURE APPLICATION ECOSYSTEM V1.0.4
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Khmer App Store គឺជាហាងចែកចាយកម្មវិធីប្រកបដោយទំនុកចិត្ត សុវត្ថិភាពខ្ពស់ និងរចនាឡើងយ៉ាងពិសេសសម្រាប់ប្រជាជនកម្ពុជា។ រក្សាសិទ្ធិគ្រប់យ៉ាង ២០២៦។
          </p>
        </div>
      </footer>

      {/* Context Menu Shortcut Menu */}
      <AnimatePresence>
        {contextMenu && (
          <div 
            id="shortcut-context-menu"
            className="fixed z-50 w-60 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-2 animate-fadeIn"
            style={{ 
              left: `${contextMenu.x}px`, 
              top: `${contextMenu.y}px` 
            }}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Header section with App info */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1 flex items-center gap-2.5">
              <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400">
                {/* Dynamically get icon component */}
                {(() => {
                  const name = contextMenu.app.iconName;
                  switch (name) {
                    case "BookOpen": return <BookOpen className="w-4.5 h-4.5" />;
                    case "Wallet": return <Wallet className="w-4.5 h-4.5" />;
                    case "FileText": return <FileText className="w-4.5 h-4.5" />;
                    case "ShieldAlert": return <ShieldAlert className="w-4.5 h-4.5" />;
                    case "Gamepad2": return <Gamepad2 className="w-4.5 h-4.5" />;
                    case "Map": return <Map className="w-4.5 h-4.5" />;
                    case "Music": return <Music className="w-4.5 h-4.5" />;
                    case "Compass": return <Compass className="w-4.5 h-4.5" />;
                    case "ShoppingBag": return <ShoppingBag className="w-4.5 h-4.5" />;
                    case "Camera": return <Camera className="w-4.5 h-4.5" />;
                    case "Heart": return <Heart className="w-4.5 h-4.5" />;
                    default: return <BookOpen className="w-4.5 h-4.5" />;
                  }
                })()}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate leading-snug">
                  {contextMenu.app.nameKhmer}
                </h4>
                <p className="text-[9px] text-slate-400 font-mono truncate">
                  {contextMenu.app.name}
                </p>
              </div>
            </div>

            {/* Actions list */}
            <div className="space-y-0.5">
              {/* Quick Install/Update Option */}
              {contextMenu.app.status === "not_installed" && (
                <button
                  id={`context-install-${contextMenu.app.id}`}
                  onClick={() => {
                    handleDownload(contextMenu.app);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  ទាញយកភ្លាមៗ (Quick Install)
                </button>
              )}

              {contextMenu.app.status === "update_available" && (
                <button
                  id={`context-update-${contextMenu.app.id}`}
                  onClick={() => {
                    handleUpdate(contextMenu.app);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 animate-pulse cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  បច្ចុប្បន្នភាពភ្លាមៗ (Quick Update)
                </button>
              )}

              {contextMenu.app.status === "installed" && (
                <div className="w-full px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 rounded-xl flex items-center gap-2 select-none">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  តំឡើងរួចរាល់ (Installed)
                </div>
              )}

              {(contextMenu.app.status === "downloading" || contextMenu.app.status === "updating") && (
                <div className="w-full px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 rounded-xl flex items-center gap-2 select-none">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  កំពុងដំណើរការ (Processing...)
                </div>
              )}

              {/* Pin/Unpin option */}
              <button
                id={`context-pin-${contextMenu.app.id}`}
                onClick={() => handleTogglePin(contextMenu.app.id)}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Pin className={`w-3.5 h-3.5 ${contextMenu.app.isPinned ? "fill-amber-500 text-amber-550 dark:text-amber-400" : ""}`} />
                  <span>{contextMenu.app.isPinned ? "ដកការខ្ទាស់ (Unpin App)" : "ខ្ទាស់ទៅខាងលើ (Pin to Top)"}</span>
                </div>
                {contextMenu.app.isPinned && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </button>

              {/* Toggle Notifications option */}
              <button
                id={`context-notify-${contextMenu.app.id}`}
                onClick={() => handleToggleNotifications(contextMenu.app.id)}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {contextMenu.app.notificationsEnabled ? (
                    <BellOff className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <Bell className="w-3.5 h-3.5" />
                  )}
                  <span>{contextMenu.app.notificationsEnabled ? "បិទការជូនដំណឹង (Mute)" : "បើកការជូនដំណឹង (Notify)"}</span>
                </div>
                {contextMenu.app.notificationsEnabled && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />

              {/* View Details option */}
              <button
                id={`context-details-${contextMenu.app.id}`}
                onClick={() => {
                  setSelectedApp(contextMenu.app);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <img src={null as any} className="hidden" onError={(e) => {}} referrerPolicy="no-referrer" />
                <Info className="w-3.5 h-3.5" />
                មើលព័ត៌មាន (View Details)
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />

              {/* Report App option */}
              <button
                id={`context-report-${contextMenu.app.id}`}
                onClick={() => handleReportApp(contextMenu.app)}
                className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-red-500" />
                {language === "kh" ? "រាយការណ៍កម្មវិធី (Report App)" : "Report Suspicious App"}
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Confirmation Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            id="report-confirmation-toast"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 dark:bg-slate-800/95 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 dark:border-slate-700/60 max-w-sm backdrop-blur-md"
          >
            <div className="p-2 bg-red-500/10 text-red-500 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 pr-2">
              <p className="text-xs font-bold font-sans">
                {language === "kh" ? "បានរាយការណ៍ជោគជ័យ" : "Report Submitted"}
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5 font-medium leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss Toast"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
