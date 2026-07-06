import React, { useState } from "react";
import { 
  CloudLightning, 
  Database, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Check, 
  RefreshCw, 
  Lock, 
  Trash2, 
  Download, 
  CheckCircle,
  AlertCircle,
  Clock,
  Key
} from "lucide-react";

interface BackupItem {
  id: string;
  name: string;
  date: string;
  size: string;
  device: string;
  encryptionKey: string;
  appCount: number;
}

export const BackupTab: React.FC = () => {
  const [backups, setBackups] = useState<BackupItem[]>(() => {
    const saved = localStorage.getItem("khmer_appstore_backups");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "backup-1",
        name: "Cloud Automatic Backup (ស្ថេរភាព)",
        date: "2026-06-28 14:22:05",
        size: "14.2 MB",
        device: "MacBook Pro M3",
        encryptionKey: "SHA256:d5f2a1...99ef",
        appCount: 4
      },
      {
        id: "backup-2",
        name: "Weekly Secure Backup",
        date: "2026-06-21 02:11:45",
        size: "12.8 MB",
        device: "iPhone 15 Pro",
        encryptionKey: "SHA256:f12a88...c10b",
        appCount: 3
      }
    ];
  });

  const [syncDevices, setSyncDevices] = useState(() => {
    const saved = localStorage.getItem("khmer_appstore_sync_devices");
    if (saved) return JSON.parse(saved);
    return [
      { id: "mac", name: "MacBook Pro M3", type: "laptop", isSyncActive: true, lastSync: "២ នាទីមុន" },
      { id: "iphone", name: "iPhone 15 Pro", type: "mobile", isSyncActive: true, lastSync: "៥ នាទីមុន" },
      { id: "ipad", name: "iPad Pro 11", type: "tablet", isSyncActive: true, lastSync: "១ ម៉ោងមុន" },
      { id: "galaxy", name: "Android Galaxy Tab", type: "tablet", isSyncActive: false, lastSync: "២ ថ្ងៃមុន" }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem("khmer_appstore_backups", JSON.stringify(backups));
  }, [backups]);

  React.useEffect(() => {
    localStorage.setItem("khmer_appstore_sync_devices", JSON.stringify(syncDevices));
  }, [syncDevices]);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupLog, setBackupLog] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  const handleDeviceSyncToggle = (id: string) => {
    setSyncDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { ...device, isSyncActive: !device.isSyncActive, lastSync: "ទើបតែធ្វើបច្ចុប្បន្នភាព" } 
          : device
      )
    );
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    setSuccessMsg("");
    
    const logs = [
      "ចាប់ផ្តើមដំណើរការបម្រុងទុកទិន្នន័យ (Initializing secure connection...)",
      "ផ្ទៀងផ្ទាត់ហត្ថលេខាឌីជីថល (Verifying digital developer signatures...)",
      "កូដនីយកម្មទិន្នន័យ AES-256 (Applying end-to-end encryption AES-256...)",
      "បង្ហោះឯកសារទម្រង់សុវត្ថិភាពខ្ពស់ (Uploading package states to Khmer Cloud Secure Hub...)",
      "ការបម្រុងទុកត្រូវបានបញ្ចប់ទាំងស្រុង (Data Backup successfully stored!)"
    ];

    for (let i = 0; i < logs.length; i++) {
      setBackupLog(prev => [...prev, logs[i]]);
      setBackupProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const randomId = Math.random().toString(36).substr(2, 9);
    const newBackup: BackupItem = {
      id: randomId,
      name: "Manual Secure Backup (ថ្មីបំផុត)",
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      size: "15.4 MB",
      device: "Web Simulator Cloud",
      encryptionKey: `SHA256:${Math.random().toString(16).substr(2, 6)}...${Math.random().toString(16).substr(2, 4)}`,
      appCount: 5
    };

    setBackups(prev => [newBackup, ...prev]);
    setIsBackingUp(false);
    setSuccessMsg("ទិន្នន័យត្រូវបានបម្រុងទុកដោយជោគជ័យ និងមានសុវត្ថិភាពខ្ពស់! (Backup generated and encrypted successfully!)");
    setBackupLog([]);
  };

  const handleDeleteBackup = (id: string) => {
    setBackups(prev => prev.filter(b => b.id !== id));
  };

  const getDeviceIcon = (type: string, className = "w-5 h-5") => {
    switch (type) {
      case "laptop": return <Laptop className={className} />;
      case "mobile": return <Smartphone className={className} />;
      case "tablet": return <Tablet className={className} />;
      default: return <Smartphone className={className} />;
    }
  };

  return (
    <div id="backup-container" className="space-y-6">
      {/* Header Panel */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-950 p-6 rounded-2xl border border-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-300 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5" />
            ប្រព័ន្ធបម្រុងទុកទិន្នន័យកូដនីយកម្មខ្ពស់ (E2EE Backup & Sync)
          </div>
          <h2 className="text-2xl font-bold mb-1 tracking-tight">បម្រុងទុក និងធ្វើសមកាលកម្មឧបករណ៍ (Backup & Sync)</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            រក្សាទិន្នន័យកម្មវិធី ប្រវត្តិនៃការប្រើប្រាស់ និងពិន្ទុវាយតម្លៃរបស់អ្នកឱ្យមានសុវត្ថិភាពខ្ពស់លើ Khmer Cloud។ អាចធ្វើសមកាលកម្មទិន្នន័យលើឧបករណ៍ទាំងអស់របស់អ្នកភ្លាមៗ និងគ្រប់ពេលវេលា។
          </p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={isBackingUp}
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          <Database className="w-4.5 h-4.5" />
          បម្រុងទុកឥឡូវនេះ (Backup Now)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sync Devices Area */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 pb-3 border-b border-slate-50 dark:border-slate-800/60 flex items-center gap-2">
            <RefreshCw className="w-4.5 h-4.5 text-indigo-500 animate-spin" />
            សមកាលកម្មគ្រប់ឧបករណ៍ (Cross-Device Sync)
          </h3>

          <div className="space-y-4">
            {syncDevices.map((device) => (
              <div 
                key={device.id}
                className="bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border ${
                    device.isSyncActive 
                      ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                  }`}>
                    {getDeviceIcon(device.type, "w-6 h-6")}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-850 dark:text-slate-200 text-sm">
                      {device.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      សមកាលកម្ម៖ {device.lastSync}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => handleDeviceSyncToggle(device.id)}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-hidden relative ${
                    device.isSyncActive ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span 
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                      device.isSyncActive ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Backups List and Actions */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 pb-3 border-b border-slate-50 dark:border-slate-800/60 flex items-center gap-2">
            <CloudLightning className="w-4.5 h-4.5 text-indigo-500" />
            ឯកសារបម្រុងទុកប្រព័ន្ធទិន្នន័យ (Encrypted Cloud Archives)
          </h3>

          {/* Backup Action in progress */}
          {isBackingUp && (
            <div className="bg-slate-50 dark:bg-slate-850 border border-indigo-100 dark:border-indigo-950 rounded-xl p-5 mb-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                  កំពុងដំណើការបម្រុងទុក និងកូដនីយកម្ម... {backupProgress}%
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Securing...
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-650 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${backupProgress}%` }}
                />
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1 h-24 overflow-y-auto">
                {backupLog.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-indigo-500 font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Notification */}
          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 text-emerald-700 dark:text-emerald-400 px-4 py-3.5 rounded-xl text-xs flex gap-2.5 mb-5 animate-fadeIn">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Backup Archives */}
          <div className="space-y-4">
            {backups.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-2 animate-pulse" />
                មិនមានទិន្នន័យបម្រុងទុកទេ (No backups found).
              </div>
            ) : (
              backups.map((backup) => (
                <div 
                  key={backup.id}
                  className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-3.5 hover:border-indigo-100 dark:hover:border-indigo-950 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-850 dark:text-slate-200 text-sm">
                        {backup.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        បម្រុងទុកនៅ៖ {backup.date}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700/50">
                      {backup.size}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-850/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">ឧបករណ៍</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{backup.device}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">កូនសោកូដនីយកម្ម</span>
                      <span className="font-mono text-slate-600 dark:text-slate-450 flex items-center gap-1">
                        <Key className="w-3 h-3 text-indigo-400 shrink-0" />
                        {backup.encryptionKey}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/40">
                    <span className="text-[11px] text-slate-500 font-medium">
                      រួមបញ្ចូលកម្មវិធីចំនួន៖ <strong className="text-slate-700 dark:text-slate-300 font-bold">{backup.appCount}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          alert(`បានស្ដារឡើងវិញដោយជោគជ័យពី៖ ${backup.name}`);
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-950/20 px-3 py-1.5 rounded-lg border border-indigo-100/30 dark:border-indigo-900/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        ស្ដារឡើងវិញ
                      </button>
                      <button 
                        onClick={() => handleDeleteBackup(backup.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Delete backup"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
