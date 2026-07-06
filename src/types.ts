export const CATEGORIES = ["Fintech", "Education", "Utility", "E-commerce", "Games", "Productivity", "Photography", "Health"] as const;
export type AppCategory = typeof CATEGORIES[number];

export interface VersionRelease {
  version: string;
  date: string;
  changes: string[];
  changesKhmer: string[];
}

export interface AppItem {
  id: string;
  name: string;
  nameKhmer: string;
  category: AppCategory;
  categoryKhmer: string;
  rating: number;
  reviewsCount: number;
  developer: string;
  size: string;
  version: string;
  description: string;
  descriptionKhmer: string;
  iconName: string; // Lucide icon identifier
  isVerified: boolean;
  downloadCount: string;
  lastUpdated: string;
  status: "not_installed" | "downloading" | "installed" | "update_available" | "updating";
  downloadProgress: number;
  fileSafetyScore: number;
  permissions: string[];
  versionHistory?: VersionRelease[];
  isPinned?: boolean;
  notificationsEnabled?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Message {
  id: string;
  sender: "user" | "support";
  text: string;
  timestamp: string;
}

export interface ScanResult {
  appName: string;
  safetyStatus: "Clean" | "Low Risk" | "Medium Risk" | "High Risk" | "";
  safetyScore: number;
  findings: Array<{
    type: string;
    status: "Passed" | "Warning" | "Failed";
    details: string;
  }>;
  verdict: string;
  isMock?: boolean;
}
