import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLedger } from '../context/LedgerContext';
import { motion } from 'framer-motion';

const Tracker = () => {
  const navigate = useNavigate();
  const { transactions, totalInflow, totalOutflow } = useLedger();

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
      className="px-6 py-8 md:py-12 pb-32 max-w-5xl mx-auto space-y-12 md:space-y-16"
    >
      {/* Editorial Header */}
      <motion.header variants={itemVariants} className="flex justify-between items-end">
        <div>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Master Ledger</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface leading-none">Archival Stream</h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-outline">LIVE FEED</p>
          <p className="text-[11px] font-bold text-on-surface-variant mt-2 flex items-center gap-2 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            Sync Active
          </p>
        </div>
      </motion.header>

      {/* Stats Summary: Responsive Stack */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        <div className="card-lowest p-8 md:p-10 border-transparent hover:border-secondary/10 transition-all shadow-sm">
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-secondary opacity-60 block mb-6">Aggregate Inflow</span>
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-on-surface leading-none">₦{totalInflow.toLocaleString()}</h3>
          <p className="text-[11px] font-bold text-outline mt-4 uppercase tracking-[0.2em] opacity-40">Verified Registry</p>
        </div>
        <div className="card-lowest p-8 md:p-10 border-transparent hover:border-error/10 transition-all shadow-sm">
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-error opacity-60 block mb-6">Aggregate Outflow</span>
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-on-surface leading-none">₦{totalOutflow.toLocaleString()}</h3>
          <p className="text-[11px] font-bold text-outline mt-4 uppercase tracking-[0.2em] opacity-40">Verified Registry</p>
        </div>
      </motion.div>

      {/* Search & Filter Architect */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 md:items-center py-4">
        <div className="flex-1 relative group">
          <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            placeholder="Search archival database..."
            className="w-full bg-surface-container-low border border-outline-variant/5 rounded-3xl py-6 pl-16 pr-8 text-[13px] font-bold text-on-surface placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button className="bg-on-surface text-surface px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl whitespace-nowrap">All</button>
          <button className="bg-surface-container px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:bg-surface-container-high transition-all border border-outline-variant/5 whitespace-nowrap">Income</button>
          <button className="bg-surface-container px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:bg-surface-container-high transition-all border border-outline-variant/5 whitespace-nowrap">Expenses</button>
        </div>
      </motion.div>

      {/* Transaction List: Mobile Responsive */}
      <motion.section variants={itemVariants} className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-32 bg-surface-container-low rounded-[4rem] border border-outline-variant/5">
            <span className="material-symbols-outlined text-6xl text-outline/20 mb-6">receipt_long</span>
            <p className="text-[12px] font-black uppercase tracking-[0.5em] text-outline">Vault Empty</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <motion.div 
              key={tx.id} 
              whileHover={{ x: 5, backgroundColor: 'var(--surface-bright)' }}
              onClick={() => navigate(`/transaction/${tx.id}`)}
              className="group flex items-center justify-between p-5 md:p-8 card-lowest border-transparent hover:border-outline-variant/10 cursor-pointer gap-4 overflow-hidden"
            >
              <div className="flex items-center gap-4 md:gap-8 min-w-0 flex-1">
                <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center flex-shrink-0 border border-outline-variant/5 shadow-sm group-hover:scale-110 ${tx.amount > 0 ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-2xl md:text-4xl font-black">{tx.icon || 'receipt_long'}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base md:text-3xl font-black text-on-surface tracking-tighter group-hover:text-primary transition-colors leading-tight truncate">{tx.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5 md:mt-3 overflow-hidden">
                     <p className="text-[9px] md:text-[11px] text-outline font-black uppercase tracking-widest leading-none truncate">{tx.category}</p>
                     <span className="text-outline/30 flex-shrink-0 px-1">•</span>
                     <p className="text-[8px] md:text-[10px] text-outline font-black uppercase tracking-widest leading-none opacity-60 flex-shrink-0">{tx.time}</p>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-auto pl-2">
                <div className={`text-base md:text-4xl font-black tracking-tighter leading-none ${tx.amount > 0 ? 'text-secondary' : 'text-on-surface'}`}>
                  {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-outline-variant mt-2 md:mt-4 opacity-40">Authorized</p>
              </div>
            </motion.div>
          ))
        )}
      </motion.section>

      {/* Verification Status Banner: Responsive */}
      <motion.div 
        variants={itemVariants}
        className="bg-inverse-surface text-inverse-on-surface p-10 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
          <div className="space-y-4">
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] opacity-40">Archival Integrity</span>
            <h4 className="text-xl md:text-4xl font-black tracking-tighter leading-tight">Persistence Layer Active</h4>
          </div>
          <div className="flex flex-col md:text-right gap-1.5 flex-shrink-0">
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] opacity-30">Status: Verified</p>
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] opacity-30">Shard: Nigerian-West-01</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Tracker;
