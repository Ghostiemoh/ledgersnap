import React from 'react';
import { useLedger, getCategoryIcon } from '../context/LedgerContext';
import { motion } from 'framer-motion';

const Insights = () => {
  const { transactions, totalInflow, totalOutflow } = useLedger();

  // Dynamic Logic: Top Category
  const categoryTotals = transactions.reduce((acc, tx) => {
    if (tx.amount < 0) {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
    }
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const [topCategoryName, topCategoryValue] = sortedCategories[0] || ['None', 0];

  const chartData = [
    { day: 'MON', inc: 65, exp: 40 },
    { day: 'TUE', inc: 85, exp: 20 },
    { day: 'WED', inc: 45, exp: 60 },
    { day: 'THU', inc: 95, exp: 30, active: true },
    { day: 'FRI', inc: 55, exp: 80 },
    { day: 'SAT', inc: 30, exp: 10 },
    { day: 'SUN', inc: 20, exp: 5 },
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
      className="px-6 py-8 md:py-12 pb-32 max-w-5xl mx-auto space-y-12 md:space-y-16"
    >
      {/* Editorial Header */}
      <motion.header variants={itemVariants} className="flex justify-between items-end px-1">
        <div>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Intel Analysis</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface leading-none">Financial Narratives</h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-outline">Q2 ARCHIVE</p>
          <p className="text-[11px] font-bold text-on-surface-variant mt-2">Lagos Standard</p>
        </div>
      </motion.header>

      {/* Bento Grid Insights */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        
        {/* Liquidity Health: Large Bento Cell */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="md:col-span-8 bg-inverse-surface p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] text-inverse-on-surface relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[340px] md:min-h-[400px]"
        >
           <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
           <div className="relative z-10 space-y-6 md:space-y-8">
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] opacity-40 block">Liquidity Index</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight max-w-lg">
                {totalInflow > totalOutflow ? "Capital position remains optimized for scaling." : "Expenditure velocity is exceeding archival benchmarks."}
              </h2>
              <div className="flex flex-wrap gap-4 md:gap-6 mt-8 md:mt-10">
                 <div className="bg-inverse-on-surface/10 backdrop-blur-3xl px-6 md:px-8 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] border border-inverse-on-surface/10 shadow-inner flex-1 min-w-[140px]">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 whitespace-nowrap text-inverse-on-surface">Net Yield</p>
                    <p className="text-2xl md:text-3xl font-black tracking-tighter text-inverse-on-surface whitespace-nowrap">₦{(totalInflow - totalOutflow).toLocaleString()}</p>
                 </div>
                 <div className="bg-inverse-on-surface/10 backdrop-blur-3xl px-6 md:px-8 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] border border-inverse-on-surface/10 shadow-inner flex-1 min-w-[140px]">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 whitespace-nowrap text-inverse-on-surface">Health</p>
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${totalInflow > totalOutflow ? 'bg-secondary' : 'bg-error'} animate-pulse`}></div>
                       <p className="text-2xl md:text-3xl font-black tracking-tighter text-inverse-on-surface">{totalInflow > totalOutflow ? 'OPT' : 'VOL'}</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="relative z-10 flex justify-between items-end mt-12 md:mt-16 pt-6 md:pt-8 border-t border-inverse-on-surface/5">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Verified Intel</p>
              <div className="flex gap-1 h-10 w-24 items-end px-1">
                 {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: 4 }}
                      animate={{ height: `${h*100}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                      className="flex-1 bg-inverse-on-surface/20 rounded-full"
                    ></motion.div>
                 ))}
              </div>
           </div>
        </motion.div>

        {/* Top category: High Contrast Cell */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="md:col-span-4 bg-primary p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] text-on-primary flex flex-col justify-between shadow-2xl shadow-primary/20"
        >
           <div>
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] opacity-40 mb-8 md:mb-10 block">Primary Allocation</span>
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-16 h-16 md:w-20 md:h-20 bg-on-primary/10 backdrop-blur-xl rounded-[1.5rem] md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 border border-on-primary/20 text-on-primary shadow-xl"
              >
                <span className="material-symbols-outlined text-3xl md:text-4xl font-black">{getCategoryIcon(topCategoryName)}</span>
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight truncate">{topCategoryName}</h3>
           </div>
           <div className="space-y-3 mt-8">
              <p className="text-[9px] md:text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">Operational Density</p>
              <span className="text-3xl md:text-4xl font-black tracking-tighter block whitespace-nowrap">₦{topCategoryValue.toLocaleString()}</span>
              <div className="w-full bg-on-primary/10 h-1 rounded-full mt-4 overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: topCategoryValue > 0 ? '75%' : '0%' }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="h-full bg-on-primary"
                 ></motion.div>
              </div>
           </div>
        </motion.div>

        {/* Weekly Narrative: Stacked Flow Cards */}
        <motion.div variants={itemVariants} className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
           <motion.div 
             whileHover={{ x: 5 }}
             className="card-lowest p-8 md:p-10 flex flex-col justify-between min-h-[220px] md:min-h-[260px] border-transparent hover:border-secondary/10 group shadow-sm transition-all"
           >
              <div className="space-y-4">
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-secondary opacity-80 block">Inflow Volume</span>
                <p className="text-on-surface-variant font-medium text-[12px] md:text-[13px] leading-relaxed max-w-xs opacity-80">Total liquidated capital across the archival window.</p>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface group-hover:text-secondary transition-colors">₦{totalInflow.toLocaleString()}</h3>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                   <span className="material-symbols-outlined text-2xl md:text-3xl font-black">south_east</span>
                </div>
              </div>
           </motion.div>
           
           <motion.div 
             whileHover={{ x: -5 }}
             className="card-lowest p-8 md:p-10 flex flex-col justify-between min-h-[220px] md:min-h-[260px] border-transparent hover:border-error/10 group shadow-sm transition-all"
           >
              <div className="space-y-4">
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-error opacity-80 block">Outflow Velocity</span>
                <p className="text-on-surface-variant font-medium text-[12px] md:text-[13px] leading-relaxed max-w-xs opacity-80">Expenditure narrative detected within transactional patterns.</p>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface group-hover:text-error transition-colors">₦{totalOutflow.toLocaleString()}</h3>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-error/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-error group-hover:bg-error group-hover:text-white transition-all">
                   <span className="material-symbols-outlined text-2xl md:text-3xl font-black">north_east</span>
                </div>
              </div>
           </motion.div>
        </motion.div>

        {/* Graphical Performance: Visual Archive */}
        <motion.div variants={itemVariants} className="md:col-span-12 card-lowest p-8 md:p-12 shadow-sm border border-outline-variant/5 space-y-12 md:space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-10">
            <div className="space-y-3">
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-primary opacity-80 block">Visual Archive</span>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-on-surface leading-none">Flow Trajectory</h3>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-10 bg-surface-container-low px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/20"></div>
                <span className="text-[9px] md:text-[10px] font-black text-outline uppercase tracking-[0.3em]">Inflow</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-error shadow-lg shadow-error/20"></div>
                <span className="text-[9px] md:text-[10px] font-black text-outline uppercase tracking-[0.3em]">Outflow</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-64 md:h-96 w-full flex items-end justify-between gap-3 md:gap-10 px-2 md:px-6">
            <div className="absolute inset-0 border-b border-outline-variant/10 pointer-events-none opacity-20"></div>
            {chartData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col justify-end gap-4 md:gap-6 group h-full min-w-0">
                <div className="flex items-baseline justify-center gap-1 md:gap-2.5 h-4/5">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${d.inc}%` }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full max-w-[12px] md:max-w-[24px] rounded-full transition-all duration-500 ${d.active ? 'bg-primary shadow-lg shadow-primary/40' : 'bg-primary/20 group-hover:bg-primary/40'}`} 
                  ></motion.div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${d.exp}%` }}
                    transition={{ delay: 1.0 + i * 0.05, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full max-w-[12px] md:max-w-[24px] rounded-full transition-all duration-500 ${d.active ? 'bg-error shadow-lg shadow-error/40' : 'bg-error/20 group-hover:bg-error/40'}`} 
                  ></motion.div>
                </div>
                <span className={`text-[8px] md:text-[11px] font-black text-center uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all truncate ${d.active ? 'text-primary' : 'text-outline opacity-60'}`}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Insights;
