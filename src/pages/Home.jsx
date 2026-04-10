import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLedger } from '../context/LedgerContext';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { transactions, balance, totalInflow, totalOutflow, inboxCount } = useLedger();

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
      className="px-6 py-8 pb-32 max-w-5xl mx-auto space-y-12"
    >
      {/* Editorial Header */}
      <motion.header variants={itemVariants} className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-3">Ledger Archive</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-none">Snapshot Overview</h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-outline">Protocol v3.0</p>
          <p className="text-[11px] font-bold text-on-surface-variant mt-1.5 flex items-center justify-end gap-2">
            Lagos <span className="opacity-100">🇳🇬</span>
          </p>
        </div>
      </motion.header>

      {/* Hero Section: The Balance Architect */}
      <motion.section variants={itemVariants} className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Net Balance Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="lg:col-span-8 bg-on-surface p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] text-white overflow-hidden relative shadow-2xl group"
          >
            {/* Ambient Glow */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-1000"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shadow-[0_0_12px_rgba(var(--secondary-color),0.8)]"></span>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">Verified Net Capital</span>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none flex items-baseline gap-2 md:gap-4 flex-wrap"
                >
                  <span className="text-2xl md:text-4xl lg:text-5xl opacity-40">₦</span>
                  <span>{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </motion.div>

                <div className="flex flex-wrap gap-3 md:gap-4 pt-4">
                  <div className="bg-white/5 backdrop-blur-2xl px-5 md:px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Sync Efficiency</p>
                    <p className="text-sm md:text-base font-bold">99.8%</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-2xl px-5 md:px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Directives</p>
                    <p className="text-sm md:text-base font-bold">{inboxCount} Pending</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 md:mt-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-white text-xl md:text-2xl">fingerprint</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Secure Token</p>
                    <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest mt-0.5">Ghostie Protocol</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'var(--surface)', color: 'var(--on-surface)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/insights')}
                  className="bg-white/10 backdrop-blur-xl text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] border border-white/20 shadow-xl"
                >
                  Deep Intel
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Inflow/Outflow Stack */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="card-lowest p-6 md:p-8 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-[11px] font-black text-secondary uppercase tracking-[0.4em] block mb-3">Inflow total</span>
                <div className="text-3xl md:text-4xl font-black tracking-tighter text-on-surface leading-none">
                  ₦{totalInflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-[1.5rem] md:rounded-3xl bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                  <span className="material-symbols-outlined text-2xl md:text-3xl font-black">south_east</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="card-lowest p-6 md:p-8 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-[11px] font-black text-error uppercase tracking-[0.4em] block mb-3">Outflow total</span>
                <div className="text-3xl md:text-4xl font-black tracking-tighter text-on-surface leading-none">
                  ₦{totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-[1.5rem] md:rounded-3xl bg-error/5 flex items-center justify-center text-error border border-error/10 group-hover:bg-error group-hover:text-white transition-all duration-500">
                  <span className="material-symbols-outlined text-2xl md:text-3xl font-black">north_east</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Inbox Alert Banner */}
      {inboxCount > 0 && (
        <motion.section 
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-primary/10 border border-primary/20 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] flex items-center justify-between cursor-pointer hover:bg-primary/20 transition-all shadow-xl shadow-primary/5"
          onClick={() => navigate('/inbox')}
        >
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 flex-shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-4xl font-black">inventory_2</span>
            </div>
            <div>
              <h3 className="text-base md:text-xl font-black text-on-surface tracking-tight">Verification Required</h3>
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-primary mt-1 opacity-80">{inboxCount} entries await validation</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-2xl md:text-3xl font-black">chevron_right</span>
        </motion.section>
      )}

      {/* Transaction Timeline */}
      <motion.section variants={itemVariants} className="space-y-6 md:space-y-8 pb-12">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-outline opacity-60">Recent Archive</h2>
          <button 
            onClick={() => navigate('/tracker')}
            className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:text-on-surface transition-colors flex items-center gap-2"
          >
            Full Ledger <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low rounded-[3rem] border border-outline-variant/5">
              <span className="material-symbols-outlined text-4xl text-outline/20 mb-4">folder_off</span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-outline">Empty Protocol</p>
            </div>
          ) : (
            transactions.slice(0, 6).map((tx) => (
              <motion.div 
                key={tx.id} 
                whileHover={{ x: 5, backgroundColor: 'var(--surface-bright)' }}
                onClick={() => navigate(`/transaction/${tx.id}`)}
                className="group flex items-center justify-between p-5 md:p-8 card-lowest border-transparent hover:border-outline-variant/10 cursor-pointer gap-4 overflow-hidden"
              >
                <div className="flex items-center gap-4 md:gap-6 min-w-0 flex-1">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm ${tx.amount > 0 ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-2xl md:text-3xl font-black">{tx.icon || 'receipt_long'}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-2xl font-black text-on-surface tracking-tighter group-hover:text-primary transition-colors leading-tight truncate">{tx.name}</h3>
                    <div className="flex items-center gap-2 mt-1 md:mt-2 overflow-hidden">
                       <p className="text-[9px] md:text-[11px] text-outline font-black uppercase tracking-widest leading-none truncate">{tx.category}</p>
                       <span className="text-outline/30 flex-shrink-0 px-1">•</span>
                       <p className="text-[9px] md:text-[10px] text-outline font-black uppercase tracking-widest leading-none opacity-60 flex-shrink-0">{tx.time}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-auto pl-2">
                  <div className={`text-base md:text-3xl font-black tracking-tighter leading-none ${tx.amount > 0 ? 'text-secondary' : 'text-on-surface'}`}>
                    {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-outline-variant mt-2 opacity-40">Verified</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      {/* FAB: Mobile Repositioned */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/add')}
        className="fixed bottom-32 md:bottom-36 right-6 md:right-8 w-16 h-16 md:w-24 md:h-24 rounded-[2rem] md:rounded-[3rem] bg-on-surface flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 group border border-white/10"
      >
        <span className="material-symbols-outlined text-3xl md:text-4xl">photo_camera</span>
      </motion.button>
    </motion.div>
  );
};

export default Home;
