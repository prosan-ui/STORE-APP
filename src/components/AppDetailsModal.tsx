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
  Share2
} from "lucide-react";
import { motion } from "motion/react";
import { AppItem, Review } from "../types";
import { getIconComponent, getEstimatedTimeRemaining } from "./AppCard";

interface AppDetailsModalProps {
  app: AppItem;
  onClose: () => void;
  onDownload: (app: AppItem) => void;
  onUpdate: (app: AppItem) => void;
  reviews: Review[];
  onAddReview: (comment: string, rating: number) => void;
  allApps: AppItem[];
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({
  app,
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
            <span>ព័ត៌មានលម្អិតកម្មវិធី</span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">{app.name}</span>
          </div>
          <button 
            id="close-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
                    {app.categoryKhmer}
                  </span>
                  {app.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ផ្ទៀងផ្ទាត់រួច (Verified)
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">
                  {app.nameKhmer}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mb-2">
                  {app.name} • Version {app.version}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  អភិវឌ្ឍន៍ដោយ៖ <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{app.developer}</span>
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
                    ទាញយកកម្មវិធី ({app.size})
                  </button>
                )}

                {app.status === "downloading" && (
                  <div className="flex flex-col items-center sm:items-end min-w-[180px]">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1 animate-pulse">
                      កំពុងទាញយក... {app.downloadProgress}%
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-medium">
                      នៅសល់ប្រហែល៖ {getEstimatedTimeRemaining(app.downloadProgress || 0)}
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
                    បានដំឡើងរួចរាល់
                  </span>
                )}

                {app.status === "update_available" && (
                  <button
                    id="modal-update-btn"
                    onClick={() => onUpdate(app)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-sm animate-pulse"
                  >
                    <RefreshCw className="w-4 h-4" />
                    ធ្វើបច្ចុប្បន្នភាព
                  </button>
                )}

                {app.status === "updating" && (
                  <div className="flex flex-col items-center sm:items-end min-w-[120px]">
                    <span className="text-xs font-mono font-bold text-amber-500 mb-1 animate-pulse">
                      កំពុងធ្វើបច្ចុប្បន្នភាព...
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
                  {isComparing ? "បិទការប្រៀបធៀប (Close Compare)" : "ប្រៀបធៀបកម្មវិធី (Compare)"}
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
                  {copied ? "បានចម្លងតំណភ្ជាប់! (Copied!)" : "ចែករំលែក (Share)"}
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
                    ប្រៀបធៀបកម្មវិធី (Side-by-Side Comparison)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ប្រៀបធៀបកំណែ ទំហំ និងកម្រិតវាយតម្លៃជាលម្អិត</p>
                </div>
                <div className="w-full sm:w-64">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">ជ្រើសរើសកម្មវិធីដើម្បីប្រៀបធៀប (Compare with):</label>
                  <select
                    id="compare-app-select"
                    value={compareAppId}
                    onChange={(e) => setCompareAppId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- ជ្រើសរើសកម្មវិធី (Choose App) --</option>
                    {allApps
                      .filter((a) => a.id !== app.id)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nameKhmer} ({a.name})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {compareApp ? (
                <div className="grid grid-cols-3 gap-4 text-xs sm:text-sm">
                  {/* Metric Labels */}
                  <div className="flex flex-col justify-around font-medium text-slate-500 dark:text-slate-400 space-y-6 pt-16">
                    <div className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800/40 pb-2 h-14 flex items-end">លក្ខណៈ (Metric)</div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">ប្រភេទ (Category)</div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">កំណែ (Version)</div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">ទំហំ (Size)</div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">វាយតម្លៃ (Rating)</div>
                    <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2">ទាញយក (Downloads)</div>
                    <div className="pb-2">សុវត្ថិភាព (Safety)</div>
                  </div>

                  {/* Current App Column */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center space-y-6 shadow-xs">
                    <div className="flex flex-col items-center border-b border-slate-100 dark:border-slate-800 pb-2 h-14 justify-end">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 mb-1.5 shrink-0">
                        {getIconComponent(app.iconName, "w-6 h-6")}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white block truncate w-full text-xs">
                        {app.nameKhmer}
                      </span>
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-semibold text-indigo-600 dark:text-indigo-400">
                      {app.categoryKhmer}
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
                        {compareApp.nameKhmer}
                      </span>
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 font-semibold text-indigo-600 dark:text-indigo-400">
                      {compareApp.categoryKhmer}
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
                  សូមជ្រើសរើសកម្មវិធីមួយពីបញ្ជីខាងលើដើម្បីប្រៀបធៀបព័ត៌មានលម្អិត។
                  <br />
                  (Please select an app from the dropdown to compare side-by-side)
                </div>
              )}
            </div>
          )}

          {/* Highlights Info Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-xs text-slate-400 block mb-1">ពិន្ទុវាយតម្លៃ</span>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-lg">
                <Star className="w-5 h-5 fill-amber-500" />
                {app.rating}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-xs text-slate-400 block mb-1">ចំនួនទាញយក</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                {app.downloadCount}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-xs text-slate-400 block mb-1">ទំហំឯកសារ</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                {app.size}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-xs text-slate-400 block mb-1">សុវត្ថិភាពឯកសារ</span>
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                <ShieldCheck className="w-5 h-5" />
                {app.fileSafetyScore}%
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base mb-2">
                អំពីកម្មវិធី (About this App)
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                {app.descriptionKhmer}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed italic">
                {app.description}
              </p>
            </div>

            {/* Technical Information Section */}
            <div className="bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100/70 dark:border-slate-800/80">
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                ព័ត៌មានបច្ចេកទេស (Technical Specifications)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">កំណែកម្មវិធី (App Version)</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                    v{app.version}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">ទំហំឯកសារ (Download Size)</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    {app.size}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40 sm:border-none">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ (Last Updated)</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {app.lastUpdated}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 sm:border-none">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">អ្នកអភិវឌ្ឍន៍ (Developer)</span>
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
                ប្រវត្តិនៃការអាប់ដេត (Version History)
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
                              ចុងក្រោយ (Latest)
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
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{changeKh}</span>
                            {release.changes[changeKhIdx] && (
                              <span className="block text-slate-400 dark:text-slate-500 text-[10px] italic mt-0.5">
                                {release.changes[changeKhIdx]}
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
                    ការកែលម្អការអនុវត្ត និងការជួសជុលកំហុសទូទៅ។
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    General performance enhancements and bug fixes.
                  </p>
                </div>
              )}
            </div>

            {/* Requested Permissions Section */}
            <div className="bg-indigo-50/30 dark:bg-indigo-950/10 p-5 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/20">
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-500" />
                សិទ្ធិប្រើប្រាស់ដែលត្រូវការ (Requested Permissions)
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
              មតិយោបល់ និងការវាយតម្លៃពិតប្រាកដ ({reviews.length})
            </h3>

            {/* Form to submit review */}
            <form onSubmit={handleSubmitReview} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  សូមផ្តល់ពិន្ទុរបស់អ្នក៖
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
                  placeholder="សរសេរមតិយោបល់របស់អ្នកនៅទីនេះ..."
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
                  បញ្ជូនមតិយោបល់
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
