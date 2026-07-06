import React, { useState } from "react";
import { 
  X, 
  Star, 
  Check, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Calendar, 
  User, 
  Send,
  ShieldAlert,
  ArrowLeftRight,
  History,
  Share2,
  TrendingUp
} from "lucide-react";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AppItem, Review } from "../types";
import { getIconComponent, getEstimatedTimeRemaining } from "./AppCard";

const parseDownloadCount = (countStr: string): number => {
  const clean = countStr.replace(/[^0-9.KkMm+]/g, "");
  if (clean.toUpperCase().includes("M")) {
    return parseFloat(clean) * 1_000_000;
  }
  if (clean.toUpperCase().includes("K")) {
    return parseFloat(clean) * 1_000;
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 5000 : parsed;
};

const generate30DaysData = (appId: string, downloadCountStr: string) => {
  const numericCount = parseDownloadCount(downloadCountStr);
  const baseDaily = Math.max(15, Math.round(numericCount / 1500));
  
  const data = [];
  let hash = 0;
  for (let i = 0; i < appId.length; i++) {
    hash = appId.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const label = `${day} ${month}`;
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const noise = Math.sin(hash + i * 0.7) * 0.25 + Math.cos(hash - i * 0.4) * 0.15;
    const weekendFactor = isWeekend ? 0.75 : 1.15;
    const trendFactor = 1 + (29 - i) * 0.006;
    
    const downloads = Math.max(5, Math.round(baseDaily * weekendFactor * (1 + noise) * trendFactor));
    
    data.push({
      date: label,
      downloads,
    });
  }
  return data;
};

interface AppDetailsModalProps {
  app: AppItem;
  language: "kh" | "en";
  onClose: () => void;
  onDownload: (app: AppItem) => void;
  onUpdate: (app: AppItem) => void;
  reviews: Review[];
  onAddReview: (comment: string, rating: number) => void;
  allApps: AppItem[];
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({
  app,
  language,
  onClose,
  onDownload,
  onUpdate,
  reviews,
  onAddReview,
  allApps
}) => {
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isComparing, setIsComparing] = useState(false);
  const [compareAppId, setCompareAppId] = useState("");
  const [copied, setCopied] = useState(false);

  const compareApp = allApps.find((a) => a.id === compareAppId);

  const trendData = React.useMemo(() => generate30DaysData(app.id, app.downloadCount), [app.id, app.downloadCount]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-3 rounded-xl shadow-md">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
            {payload[0].value.toLocaleString()} {language === "kh" ? "ទាញយក" : "downloads"}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleShare = async () => {
    const shareData = {
      title: `${app.nameKhmer} (${app.name})`,
      text: `ទាញយកកម្មវិធី ${app.nameKhmer} (${app.name}) ពីហាងកម្មវិធីខ្មែរ! (Download ${app.nameKhmer} from Khmer App Store!)`,
      url: `${window.location.origin}${window.location.pathname}?app=${app.id}`,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Web Share failed or cancelled:", err);
        fallbackCopyToClipboard(shareData.url);
      }
    } else {
      fallbackCopyToClipboard(shareData.url);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview(newComment, newRating);
    setNewComment("");
    setNewRating(5);
  };

  return (
    <motion.div 
      id="app-details-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{language === "kh" ? "ព័ត៌មានលម្អិតកម្មវិធី" : "App Details"}</span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">{app.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              id="header-share-btn"
              onClick={handleShare}
              title={language === "kh" ? "ចែករំលែក" : "Share"}
              className={`p-2 rounded-xl transition-all duration-200 active:scale-95 border cursor-pointer ${
                copied 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent"
              }`}
            >
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button 
              id="close-modal-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* App Profile & Hero Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-start sm:items-center gap-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-slate-700/40">
                {getIconComponent(app.iconName, "w-14 h-14")}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-md">
                    {language === "kh" ? app.categoryKhmer : app.category}
                  </span>
                  {app.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {language === "kh" ? "ផ្ទៀងផ្ទាត់រួច (Verified)" : "Verified Publisher"}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">
                  {language === "kh" ? app.nameKhmer : app.name}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mb-2">
                  {language === "kh" ? app.name : app.nameKhmer} • {language === "kh" ? "កំណែ" : "Version"} {app.version}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {language === "kh" ? "អភិវឌ្ឍន៍ដោយ៖ " : "Developer: "}<span className="text-indigo-600 dark:text-indigo-400 font-semibold">{app.developer}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Trigger */}
            <div className="w-full sm:w-auto shrink-0 flex flex-col sm:items-end gap-2.5">
              <div>
                {app.status === "not_installed" && (
                  <button
                    id="modal-install-btn"
                    onClick={() => onDownload(app)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    {language === "kh" ? `ទាញយកកម្មវិធី (${app.size})` : `Install App (${app.size})`}
                  </button>
                )}

                {app.status === "downloading" && (
                  <div className="flex flex-col items-center sm:items-end min-w-[180px]">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1 animate-pulse">
                      {language === "kh" ? `កំពុងទាញយក... ${app.downloadProgress}%` : `Downloading... ${app.downloadProgress}%`}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-medium">
                      {language === "kh" ? "នៅសល់ប្រហែល៖ " : "Time remaining: "}{getEstimatedTimeRemaining(app.downloadProgress || 0, language)}
                    </span>
                    <div className="w-full sm:w-36 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200/50 dark:border-slate-700/30">
                      <div 
                        className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${app.downloadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {app.status === "installed" && (
                  <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl border border-slate-200/40 dark:border-slate-700/50 text-sm">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {language === "kh" ? "បានដំឡើងរួចរាល់" : "Installed Successfully"}
                  </span>
                )}

                {app.status === "update_available" && (
                  <button
                    id="modal-update-btn"
                    onClick={() => onUpdate(app)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-sm animate-pulse"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {language === "kh" ? "ធ្វើបច្ចុប្បន្នភាព" : "Update Now"}
                  </button>
                )}

                {app.status === "updating" && (
                  <div className="flex flex-col items-center sm:items-end min-w-[120px]">
                    <span className="text-xs font-mono font-bold text-amber-500 mb-1 animate-pulse">
                      {language === "kh" ? "កំពុងធ្វើបច្ចុប្បន្នភាព..." : "Updating..."}
                    </span>
                    <div className="w-full sm:w-28 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-2 rounded-full animate-pulse"
                        style={{ width: "65%" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  id="modal-compare-btn"
                  onClick={() => setIsComparing(!isComparing)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 border ${
                    isComparing 
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-400 animate-pulse" 
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent"
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  {isComparing 
                    ? (language === "kh" ? "បិទការប្រៀបធៀប" : "Close Comparison") 
                    : (language === "kh" ? "ប្រៀបធៀបកម្មវិធី" : "Compare Specs")}
                </button>

                <button
                  id="modal-share-btn"
                  onClick={handleShare}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 border ${
                    copied
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-400"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent"
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied 
                    ? (language === "kh" ? "បានចម្លងតំណភ្ជាប់!" : "Copied URL!") 
                    : (language === "kh" ? "ចែករំលែក" : "Share")}
                </button>
              </div>
            </div>
          </div>

          {isComparing && (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-indigo-100 dark:border-slate-800 space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <ArrowLeftRight className="w-4 h-4 text-indigo-500" />
                    {language === "kh" ? "ប្រៀបធៀបកម្មវិធី (Side-by-Side Comparison)" : "Side-by-Side Comparison"}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === "kh" ? "ប្រៀបធៀបកំណែ ទំហំ និងកម្រិតវាយតម្លៃជាលម្អិត" : "Compare version, size, and rating in detail"}
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">
                    {language === "kh" ? "ជ្រើសរើសកម្មវិធីដើម្បីប្រៀបធៀប (Compare with):" : "Compare with:"}
                  </label>
                  <select
                    id="compare-app-select"
                    value={compareAppId}
                    onChange={(e) => setCompareAppId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">{language === "kh" ? "-- ជ្រើសរើសកម្មវិធី --" : "-- Choose App --"}</option>
                    {allApps
                      .filter((a) => a.id !== app.id)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {language === "kh" ? a.nameKhmer : a.name} ({language === "kh" ? a.name : a.nameKhmer})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {compareApp ? (
                <div className="grid grid-cols-3 gap-4 text-xs sm:text-sm">
                  {/* Metric Labels */}
                  <div className="flex flex-col justify-around font-medium text-slate-500 dark:text-slate-400 space-y-6 pt-16">
                    <div className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800/40 pb-2 h-14 flex items-end">
                      {language === "kh" ? "លក្ខណៈ (Metric)" : "Metric"}
                    </div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">{language === "kh" ? "ប្រភេទ" : "Category"}</div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">{language === "kh" ? "កំណែ" : "Version"}</div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">{language === "kh" ? "ទំហំ" : "Size"}</div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">{language === "kh" ? "វាយតម្លៃ" : "Rating"}</div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">{language === "kh" ? "ទាញយក" : "Downloads"}</div>
                    <div className="pb-2">{language === "kh" ? "សុវត្ថិភាព" : "Safety"}</div>
                  </div>

                  {/* Current App Column */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center space-y-6 shadow-xs">
                    <div className="flex flex-col items-center border-b border-slate-100 dark:border-slate-800 pb-2 h-14 justify-end">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 mb-1.5 shrink-0">
                        {getIconComponent(app.iconName, "w-6 h-6")}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white block truncate w-full text-xs">
                        {language === "kh" ? app.nameKhmer : app.name}
                      </span>
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-semibold text-indigo-600 dark:text-indigo-400">
                      {language === "kh" ? app.categoryKhmer : app.category}
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                      v{app.version}
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-semibold text-slate-800 dark:text-slate-200">
                      {app.size}
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {app.rating}
                        <span className="text-[10px] text-slate-400 font-normal">({app.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-semibold text-slate-800 dark:text-slate-200">
                      {app.downloadCount}
                    </div>

                    <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {app.fileSafetyScore}%
                    </div>
                  </div>

                  {/* Compared App Column */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center space-y-6 shadow-xs">
                    <div className="flex flex-col items-center border-b border-slate-100 dark:border-slate-800 pb-2 h-14 justify-end">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 mb-1.5 shrink-0">
                        {getIconComponent(compareApp.iconName, "w-6 h-6")}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white block truncate w-full text-xs">
                        {language === "kh" ? compareApp.nameKhmer : compareApp.name}
                      </span>
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-semibold text-indigo-600 dark:text-indigo-400">
                      {language === "kh" ? compareApp.categoryKhmer : compareApp.category}
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                      v{compareApp.version}
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-semibold text-slate-800 dark:text-slate-200">
                      {compareApp.size}
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {compareApp.rating}
                        <span className="text-[10px] text-slate-400 font-normal">({compareApp.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-semibold text-slate-800 dark:text-slate-200">
                      {compareApp.downloadCount}
                    </div>

                    <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {compareApp.fileSafetyScore}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 dark:text-slate-500 text-xs border-2 border-dashed border-slate-200/50 dark:border-slate-800/80 rounded-xl">
                  {language === "kh" ? "សូមជ្រើសរើសកម្មវិធីមួយពីបញ្ជីខាងលើដើម្បីប្រៀបធៀបព័ត៌មានលម្អិត។" : "Please select an app from the list above to compare specifications side-by-side."}
                </div>
              )}
            </div>
          )}

          {/* Highlights Info Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-xs text-slate-400 block mb-1">
                {language === "kh" ? "ពិន្ទុវាយតម្លៃ" : "Rating Score"}
              </span>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-lg">
                <Star className="w-5 h-5 fill-amber-500" />
                {app.rating}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-xs text-slate-400 block mb-1">
                {language === "kh" ? "ចំនួនទាញយក" : "Downloads"}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                {app.downloadCount}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-xs text-slate-400 block mb-1">
                {language === "kh" ? "ទំហំឯកសារ" : "File Size"}
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                {app.size}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-xs text-slate-400 block mb-1">
                {language === "kh" ? "សុវត្ថិភាពឯកសារ" : "Safety Score"}
              </span>
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                <ShieldCheck className="w-5 h-5" />
                {app.fileSafetyScore}%
              </div>
            </div>
          </div>

          {/* Usage Trends Chart */}
          <div className="bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100/70 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                {language === "kh" ? "និន្នាការទាញយកក្នុងរយៈពេល ៣០ ថ្ងៃចុងក្រោយ" : "Download Trends (Last 30 Days)"}
              </h5>
              <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-md animate-pulse">
                {language === "kh" ? "សកម្ម" : "Live data"}
              </span>
            </div>
            <div className="h-64 w-full" id="usage-trends-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500, fontFamily: 'monospace' }}
                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="downloads" 
                    stroke="#6366f1" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorDownloads)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base mb-2">
                {language === "kh" ? "អំពីកម្មវិធី" : "About this App"}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3 font-medium">
                {language === "kh" ? app.descriptionKhmer : app.description}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed italic">
                {language === "kh" ? app.description : app.descriptionKhmer}
              </p>
            </div>

            {/* Technical Information Section */}
            <div className="bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100/70 dark:border-slate-800/80">
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                {language === "kh" ? "ព័ត៌មានបច្ចេកទេស (Technical Specifications)" : "Technical Specifications"}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                    {language === "kh" ? "កំណែកម្មវិធី (App Version)" : "App Version"}
                  </span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                    v{app.version}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                    {language === "kh" ? "ទំហំឯកសារ (Download Size)" : "Download Size"}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    {app.size}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40 sm:border-none">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                    {language === "kh" ? "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ (Last Updated)" : "Last Updated"}
                  </span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {app.lastUpdated}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 sm:border-none">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                    {language === "kh" ? "អ្នកអភិវឌ្ឍន៍ (Developer)" : "Developer"}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs text-right max-w-[180px] truncate">
                    {app.developer}
                  </span>
                </div>
              </div>
            </div>

            {/* Version History / Changelog Section */}
            <div className="bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100/70 dark:border-slate-800/80 space-y-4">
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" />
                {language === "kh" ? "ប្រវត្តិនៃការអាប់ដេត (Version History)" : "Version History"}
              </h5>

              {app.versionHistory && app.versionHistory.length > 0 ? (
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                  {app.versionHistory.map((release, releaseIdx) => (
                    <div 
                      key={releaseIdx} 
                      className={`pb-4 ${
                        releaseIdx !== (app.versionHistory?.length || 0) - 1 
                          ? "border-b border-slate-100 dark:border-slate-850" 
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-100/40 dark:border-indigo-900/30">
                            v{release.version}
                          </span>
                          {releaseIdx === 0 && (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                              {language === "kh" ? "ចុងក្រោយ (Latest)" : "Latest"}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {release.date}
                        </span>
                      </div>
                      
                      <ul className="space-y-2 list-none text-xs">
                        {release.changesKhmer.map((changeKh, changeKhIdx) => (
                          <li key={changeKhIdx} className="text-slate-700 dark:text-slate-300 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-500 before:font-bold leading-relaxed">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {language === "kh" ? changeKh : (release.changes[changeKhIdx] || changeKh)}
                            </span>
                            {language === "kh" && release.changes[changeKhIdx] && (
                              <span className="block text-slate-400 dark:text-slate-500 text-[10px] italic mt-0.5">
                                {release.changes[changeKhIdx]}
                              </span>
                            )}
                            {language === "en" && release.changes[changeKhIdx] && (
                              <span className="block text-slate-400 dark:text-slate-500 text-[10px] italic mt-0.5">
                                {changeKh}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100 dark:border-slate-800/50">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                      v{app.version}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {app.lastUpdated}
                    </span>
                  </div>
                  <p className="italic text-slate-400 dark:text-slate-500">
                    {language === "kh" ? "ការកែលម្អការអនុវត្ត និងការជួសជុលកំហុសទូទៅ។" : "General performance enhancements and bug fixes."}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {language === "kh" ? "General performance enhancements and bug fixes." : "ការកែលម្អការអនុវត្ត និងការជួសជុលកំហុសទូទៅ។"}
                  </p>
                </div>
              )}
            </div>

            {/* Requested Permissions Section */}
            <div className="bg-indigo-50/30 dark:bg-indigo-950/10 p-5 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/20">
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-500" />
                {language === "kh" ? "សិទ្ធិប្រើប្រាស់ដែលត្រូវការ (Requested Permissions)" : "Requested Permissions"}
              </h5>
              <div className="flex flex-wrap gap-2">
                {app.permissions.map((perm, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg"
                  >
                    • {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ratings & Reviews Section */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              {language === "kh" ? `មតិយោបល់ និងការវាយតម្លៃពិតប្រាកដ (${reviews.length})` : `Ratings & Reviews (${reviews.length})`}
            </h3>

            {/* Form to submit review */}
            <form onSubmit={handleSubmitReview} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === "kh" ? "សូមផ្តល់ពិន្ទុរបស់អ្នក៖" : "Select Your Rating:"}
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-0.5 focus:outline-hidden"
                    >
                      <Star className={`w-6 h-6 ${
                        star <= newRating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  id="review-comment-input"
                  rows={2}
                  placeholder={language === "kh" ? "សរសេរមតិយោបល់របស់អ្នកនៅទីនេះ..." : "Write your review comment here..."}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-750 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  {language === "kh" ? "បញ្ជូនមតិយោបល់" : "Submit Review"}
                </button>
              </div>
            </form>

            {/* Reviews list */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {rev.userName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-755 dark:text-slate-250">
                        {rev.userName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-250 dark:text-slate-700"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-9">
                    {rev.comment}
                  </p>
                  <div className="text-right text-[10px] text-slate-400 font-mono mt-1">
                    {rev.date}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </motion.div>
    </motion.div>
  );
};
