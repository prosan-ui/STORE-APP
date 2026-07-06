import React from "react";
import { 
  BookOpen, 
  Wallet, 
  FileText, 
  ShieldAlert, 
  Gamepad2, 
  Map, 
  Music, 
  Compass, 
  Star, 
  Download, 
  Check, 
  RefreshCw, 
  ShieldCheck,
  ShoppingBag,
  Share2
} from "lucide-react";
import { AppItem } from "../types";

interface AppCardProps {
  app: AppItem;
  onSelect: (app: AppItem) => void;
  onDownload: (app: AppItem, e: React.MouseEvent) => void;
  onUpdate: (app: AppItem, e: React.MouseEvent) => void;
}

export const getIconComponent = (name: string, className = "w-6 h-6") => {
  switch (name) {
    case "BookOpen": return <BookOpen className={className} />;
    case "Wallet": return <Wallet className={className} />;
    case "FileText": return <FileText className={className} />;
    case "ShieldAlert": return <ShieldAlert className={className} />;
    case "Gamepad2": return <Gamepad2 className={className} />;
    case "Map": return <Map className={className} />;
    case "Music": return <Music className={className} />;
    case "Compass": return <Compass className={className} />;
    case "ShoppingBag": return <ShoppingBag className={className} />;
    default: return <BookOpen className={className} />;
  }
};

export const getEstimatedTimeRemaining = (progress: number): string => {
  if (progress >= 100) return "០ស (0s)";
  const remainingPercent = 100 - progress;
  const remainingMs = remainingPercent * 30;
  const remainingSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
  
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  const khmerSeconds = remainingSeconds
    .toString()
    .split("")
    .map(char => {
      const num = parseInt(char, 10);
      return isNaN(num) ? char : khmerDigits[num];
    })
    .join("");

  return `${khmerSeconds}ស (${remainingSeconds}s)`;
};

export const AppCard: React.FC<AppCardProps> = ({ app, onSelect, onDownload, onUpdate }) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div 
      id={`app-card-${app.id}`}
      onClick={() => onSelect(app)}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-300">
            {getIconComponent(app.iconName, "w-8 h-8")}
          </div>
          
          {/* Security & Verification Badges */}
          <div className="flex flex-col items-end gap-1">
            {app.isVerified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                <ShieldCheck className="w-3 h-3" />
                ផ្ទៀងផ្ទាត់រួច
              </span>
            )}
            <span className="text-[9px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-100 dark:border-slate-700/50">
              Safety: {app.fileSafetyScore}%
            </span>
          </div>
        </div>

        {/* App Meta Info */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-medium tracking-wide uppercase text-indigo-500 dark:text-indigo-400">
              {app.categoryKhmer}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">{app.size}</span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1 leading-snug">
            {app.nameKhmer}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mb-2 font-mono">
            {app.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 h-10 leading-relaxed">
            {app.descriptionKhmer}
          </p>
        </div>
      </div>

      {/* Footer Details / CTA */}
      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between gap-2">
        {/* Rating and Downloads */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {app.rating}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              ({app.reviewsCount})
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            {app.downloadCount} downloads
          </span>
        </div>

        {/* Call to Action Button */}
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
          {/* Share Button */}
          <button
            id={`share-btn-${app.id}`}
            onClick={handleShare}
            title="ចែករំលែក (Share)"
            className={`p-2 rounded-xl transition-all duration-200 active:scale-95 border ${
              copied 
                ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400" 
                : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          {app.status === "not_installed" && (
            <button
              id={`install-btn-${app.id}`}
              onClick={(e) => onDownload(app, e)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors duration-200 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              ទាញយក
            </button>
          )}

          {app.status === "downloading" && (
            <div className="flex flex-col items-end gap-1">
              <button
                id={`install-btn-${app.id}`}
                className="relative overflow-hidden flex items-center justify-center gap-1.5 min-w-[130px] px-4 py-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-xl border border-indigo-100/40 dark:border-indigo-900/30 transition-all duration-200"
              >
                {/* Active Progress Background Layer */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-indigo-650/15 dark:bg-indigo-400/20 transition-all duration-300"
                  style={{ width: `${app.downloadProgress}%` }}
                />
                <span className="relative flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-650 dark:text-indigo-400" />
                  កំពុងទាញយក {app.downloadProgress}%
                </span>
              </button>
              <span className="text-[9px] font-sans font-medium text-slate-400 dark:text-slate-500 mr-1">
                នៅសល់ {getEstimatedTimeRemaining(app.downloadProgress || 0)}
              </span>
            </div>
          )}

          {app.status === "installed" && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200/40 dark:border-slate-700/50">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              តំឡើងរួច
            </span>
          )}

          {app.status === "update_available" && (
            <button
              id={`update-btn-${app.id}`}
              onClick={(e) => onUpdate(app, e)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors duration-200 active:scale-95 animate-pulse"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ធ្វើបច្ចុប្បន្នភាព
            </button>
          )}

          {app.status === "updating" && (
            <div className="flex flex-col items-end min-w-[75px]">
              <span className="text-[10px] font-mono font-bold text-amber-500 mb-1 animate-pulse">
                Updating...
              </span>
              <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-1.5 rounded-full animate-pulse"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
