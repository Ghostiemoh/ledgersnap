import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { settings, updateSetting, resetAllData, exportLedger, transactionCount, inboxCount } = useLedger();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    exportLedger();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
  };

  const sections = [
    {
      title: 'Security & Access',
      items: [
        { 
          id: 'faceId',
          label: 'Biometric Access', 
          desc: 'Use FaceID or fingerprint to unlock the ledger.', 
          icon: 'fingerprint', 
          type: 'toggle',
          state: settings.faceId
        },
        { 
          label: 'Private Data Pin', 
          desc: 'Secondary PIN protection for high-value transactions.', 
          icon: 'lock', 
          type: 'link' 
        },
      ]
    },
    {
      title: 'AI Preferences',
      items: [
        { 
          id: 'autoExtract',
          label: 'Auto-Extraction', 
          desc: 'Automatically identify categories from scanned receipts.', 
          icon: 'auto_awesome', 
          type: 'toggle',
          state: settings.autoExtract
        },
        { 
          label: 'Smart Notifications', 
          desc: 'Get insights based on your spending patterns.', 
          icon: 'notifications_active', 
          type: 'link' 
        },
      ]
    },
    {
      title: 'Data Management',
      items: [
        { 
          label: 'Export Ledger (CSV)', 
          desc: `Compress ${transactionCount} transactions into verified archive.`, 
          icon: 'download', 
          type: 'action',
          action: handleExport
        },
        { 
          label: 'Reset All Data', 
          desc: 'Permanently purge all merchant patterns and archives.', 
          icon: 'delete_forever', 
          type: 'action',
          action: () => setShowResetConfirm(true),
          critical: true 
        },
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-6 pt-12 pb-32 max-w-2xl mx-auto space-y-16"
    >
      {/* Profile Header */}
      <motion.header variants={itemVariants} className="flex flex-col items-center text-center space-y-6">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-32 h-32 bg-on-surface p-1 rounded-[3rem] shadow-2xl relative"
        >
          <div className="w-full h-full bg-surface rounded-[2.8rem] flex items-center justify-center overflow-hidden border border-on-surface/5">
             <span className="material-symbols-outlined text-on-surface text-6xl font-black">architecture</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary w-10 h-10 rounded-full border-4 border-surface flex items-center justify-center text-white">
             <span className="material-symbols-outlined text-xl font-black">verified</span>
          </div>
        </motion.div>
        
        <div className="space-y-2">
           <h2 className="text-4xl font-black tracking-tighter text-on-surface leading-none">System Architect</h2>
           <p className="text-secondary text-[11px] font-black uppercase tracking-[0.4em]">{transactionCount} VERIFIED DEPLOYMENTS</p>
        </div>
      </motion.header>

      {/* Settings Sections */}
      <div className="space-y-16">
        {sections.map((section) => (
          <motion.div variants={itemVariants} key={section.title} className="space-y-6">
            <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.6em] ml-2">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.01, x: 5 }}
                  whileTap={{ scale: 0.99 }}
                  className="card-lowest p-6 flex items-center justify-between border-transparent hover:border-primary/10 transition-all cursor-pointer group shadow-sm"
                  onClick={() => {
                    if (item.type === 'toggle') updateSetting(item.id, !item.state);
                    if (item.type === 'action' && item.action) item.action();
                  }}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${
                      item.critical 
                        ? 'bg-error/10 text-error group-hover:bg-error group-hover:text-white' 
                        : 'bg-surface-container-high text-on-surface-variant group-hover:bg-primary group-hover:text-white'
                    }`}>
                      <span className="material-symbols-outlined text-2xl font-black">{item.icon}</span>
                    </div>
                    <div className="space-y-1">
                      <p className={`font-black text-lg tracking-tight leading-none ${item.critical ? 'text-error' : 'text-on-surface'}`}>{item.label}</p>
                      <p className="text-[11px] text-on-surface-variant font-medium opacity-60 max-w-[240px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  
                  {item.type === 'toggle' ? (
                    <div className={`w-14 h-8 rounded-full relative transition-all duration-500 shrink-0 shadow-inner ${item.state ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                      <motion.div 
                        initial={false}
                        animate={{ x: item.state ? 24 : 4 }}
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-outline-variant font-black opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all">north_east</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Version Footer */}
      <motion.div variants={itemVariants} className="pt-12 text-center border-t border-outline-variant/5">
        <p className="text-[11px] font-black text-outline uppercase tracking-[0.5em] opacity-30">
          LEDGERSNAP v2.0.0 · ARCHITECTURAL PROTOCOL
        </p>
      </motion.div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-2xl z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface p-12 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] max-w-md w-full border border-outline-variant/10 text-center space-y-10"
            >
              <div className="space-y-6">
                <div className="w-24 h-24 bg-error/10 rounded-[2rem] mx-auto flex items-center justify-center border border-error/10">
                  <span className="material-symbols-outlined text-error text-5xl font-black">warning</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-on-surface tracking-tighter leading-none">Purge Data?</h3>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-60">
                    This irreversible directive will permanently delete all {transactionCount} entries and reset archival protocols.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleReset} 
                  className="w-full bg-error text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-error/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  DESTRUCTIVE PURGE
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)} 
                  className="w-full bg-surface-container-low text-on-surface py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest border border-outline-variant/5 hover:bg-surface-container-high transition-colors"
                >
                  ABORT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Success Toast */}
      <AnimatePresence>
        {exportSuccess && (
          <motion.div 
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 32, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className="fixed top-0 left-1/2 bg-on-surface text-surface px-10 py-5 rounded-[2.5rem] shadow-2xl z-[102] flex items-center gap-6 border border-white/10"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl font-black">verified</span>
            </div>
            <div>
              <p className="font-black uppercase tracking-[0.3em] text-[10px] text-white">Export Finalized</p>
              <p className="text-[11px] text-white/40 font-bold">Ledger archive available locally.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Settings;
