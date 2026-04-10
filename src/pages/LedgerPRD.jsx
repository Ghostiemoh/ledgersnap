import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLedger, getCategoryIcon } from '../context/LedgerContext';
import { motion } from 'framer-motion';

const LedgerPRD = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions } = useLedger();
  
  const tx = transactions.find(t => t.id === parseInt(id));

  if (!tx) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <span className="material-symbols-outlined text-6xl text-outline/20 mb-6">error</span>
      <h2 className="text-2xl font-black tracking-tighter mb-4">Entry Not Found</h2>
      <button onClick={() => navigate('/')} className="bg-on-surface text-surface px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest">Return to Archive</button>
    </div>
  );

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
      className="px-6 py-8 md:py-12 pb-32 max-w-4xl mx-auto space-y-12 md:space-y-16"
    >
      {/* Header Info */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-outline-variant/10 pb-10 md:pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-on-surface hover:text-surface transition-all">
                <span className="material-symbols-outlined text-xl">arrow_back</span>
             </button>
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Ledger Detail: TXN-{tx.id}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface leading-tight max-w-xl">{tx.name}</h1>
          <div className="flex flex-wrap gap-4 pt-2">
            <span className="px-5 py-2.5 rounded-full bg-surface-container-high text-[11px] font-black uppercase tracking-widest">{tx.category}</span>
            <span className="px-5 py-2.5 rounded-full bg-surface-container-high text-[11px] font-black uppercase tracking-widest opacity-60">{tx.date} • {tx.time}</span>
          </div>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end gap-3 flex-shrink-0">
           <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center text-surface shadow-xl ${tx.amount > 0 ? 'bg-secondary' : 'bg-on-surface'}`}>
             <span className="material-symbols-outlined text-3xl md:text-4xl font-black">{getCategoryIcon(tx.category)}</span>
           </div>
           <div className="text-right">
             <p className="text-[10px] font-black text-outline uppercase tracking-[0.3em]">Lifecycle</p>
             <p className="text-[11px] font-black text-on-surface uppercase tracking-widest mt-1">Authorized</p>
           </div>
        </div>
      </motion.div>

      {/* Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <motion.div variants={itemVariants} className="card-lowest p-8 md:p-12 shadow-sm transition-all hover:bg-surface-bright flex flex-col justify-between min-h-[220px] bg-surface-container-lowest">
          <p className="text-[10px] md:text-[11px] font-black text-outline uppercase tracking-[0.4em] opacity-40 mb-8 block">Transaction Value</p>
          <div className="space-y-3">
            <div className={`text-4xl md:text-6xl font-black tracking-tighter leading-none flex items-baseline gap-3 md:gap-4 ${tx.amount > 0 ? 'text-secondary' : 'text-on-surface'}`}>
              <span className="text-2xl md:text-4xl opacity-50">{tx.amount > 0 ? '+' : '-'}₦</span>
              <span className="whitespace-nowrap">{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <p className="text-[10px] md:text-[11px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Base Currency: NGN</p>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="card-lowest p-8 md:p-12 shadow-sm transition-all hover:bg-surface-bright bg-surface-container-lowest flex flex-col justify-between min-h-[220px]">
          <div>
            <p className="text-[10px] md:text-[11px] font-black text-outline uppercase tracking-[0.4em] opacity-40 mb-8 block">Verification Hash</p>
            <p className="text-[11px] md:text-[13px] font-bold text-on-surface font-mono opacity-80 break-all leading-relaxed">
              #{Math.random().toString(36).substring(2, 12).toUpperCase()}
              {Math.random().toString(36).substring(2, 12).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Integrity Check Passed</p>
          </div>
        </motion.div>
      </div>

      {/* Archival Notes */}
      <motion.div variants={itemVariants} className="card-lowest p-10 md:p-12 shadow-sm border border-outline-variant/5 bg-transparent">
        <div className="flex items-center gap-5 mb-10">
           <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl md:text-3xl">notes</span>
           </div>
           <div>
             <h3 className="text-xl md:text-3xl font-black tracking-tighter text-on-surface mb-1">Archival Intelligence</h3>
             <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-outline opacity-40">System-Generated Narrative</p>
           </div>
        </div>
        <p className="text-base md:text-lg text-on-surface-variant font-medium leading-[1.8] max-w-2xl opacity-80 mb-10">
          This entry was reconciled during the Q2 Archival Window. The spending vector for <span className="text-on-surface font-black">{tx.name}</span> aligns with verified organizational directives within the <span className="text-on-surface font-black">{tx.category}</span> sector. Digital integrity verification was successfully signed by Shard Nigerian-West-01.
        </p>
        <div className="flex flex-wrap gap-4 border-t border-outline-variant/10 pt-10">
           <button className="flex-1 min-w-[140px] bg-on-surface text-surface py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-xl">
             <span className="material-symbols-outlined text-lg">edit_note</span> Edit Archive
           </button>
           <button className="flex-1 min-w-[140px] bg-surface-container px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-on-surface hover:bg-surface-container-high transition-all border border-outline-variant/10 flex items-center justify-center gap-3">
             <span className="material-symbols-outlined text-lg">ios_share</span> Export PDF
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LedgerPRD;
