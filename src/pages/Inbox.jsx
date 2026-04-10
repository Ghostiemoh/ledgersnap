import React, { useState } from 'react';
import { useLedger, getCategoryIcon } from '../context/LedgerContext';
import { motion, AnimatePresence } from 'framer-motion';

const Inbox = () => {
  const { inbox, confirmReceipt, discardReceipt, editInboxItem } = useLedger();
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const categories = ['Groceries', 'Technology', 'Lifestyle', 'Transport', 'Invoice', 'Personal', 'Uncategorized'];

  const openEdit = (item) => {
    setEditingItem(item.id);
    setEditForm({
      name: item.name,
      amount: Math.abs(item.amount),
      isPositive: item.amount > 0,
      category: item.category,
    });
  };

  const saveEdit = () => {
    const amount = parseFloat(editForm.amount) || 0;
    if (isNaN(amount)) return;
    
    editInboxItem(editingItem, {
      name: editForm.name,
      amount: editForm.isPositive ? Math.abs(amount) : -Math.abs(amount),
      category: editForm.category,
    });
    setEditingItem(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-6 py-12 pb-32 max-w-5xl mx-auto"
    >
      {/* Header Section */}
      <motion.section variants={itemVariants} className="mb-16">
        <div className="space-y-4">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Inventory Staging</p>
          <h2 className="text-6xl font-black tracking-tighter text-on-surface leading-none">Protocol Inbox</h2>
          <p className="text-[13px] font-medium text-on-surface-variant mt-6 leading-relaxed max-w-xl opacity-70">
            {inbox.length > 0 
              ? `Verification Required: ${inbox.length} pending entries await architectural validation before final archival.`
              : 'Inventory clearance confirmed. All ledger directives have been successfully validated.'}
          </p>
        </div>
      </motion.section>

      {/* Empty State */}
      <AnimatePresence>
        {inbox.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-40 flex flex-col items-center justify-center bg-surface-container rounded-[4rem] border border-outline-variant/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            <div className="w-32 h-32 bg-surface-container-high rounded-[3rem] flex items-center justify-center mb-10 text-primary shadow-2xl relative z-10 transition-transform hover:rotate-12 duration-500">
              <span className="material-symbols-outlined text-6xl font-black">inventory_2</span>
            </div>
            <p className="font-black uppercase tracking-[0.6em] text-on-surface text-[12px] relative z-10">Vault Synchronized</p>
            <p className="text-on-surface-variant text-[11px] mt-6 font-bold uppercase tracking-widest opacity-80 max-w-xs text-center leading-relaxed relative z-10">
              The staged environment is pristine. No pending directives requiring architectural validation.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <AnimatePresence mode="popLayout">
          {inbox.map((item, index) => {
            if (index % 3 === 0) {
              // Large Bento Card (The Hero Directive)
              return (
                <motion.div 
                  layout
                  key={item.id}
                  variants={itemVariants}
                  exit="exit"
                  className="md:col-span-8 card-lowest p-12 transition-all group border-transparent hover:border-outline-variant/10"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="space-y-3">
                      <span className="text-primary text-[10px] font-black tracking-[0.3em] uppercase opacity-60">Source: {item.account || 'Direct Capture'} • {item.date}</span>
                      <h3 className="text-4xl font-black text-on-surface group-hover:text-primary transition-colors leading-tight tracking-tighter">{item.name}</h3>
                    </div>
                    <div className="text-right">
                      <span className={`text-4xl md:text-5xl font-black tracking-tighter ${item.amount > 0 ? 'text-secondary' : 'text-on-surface'}`}>
                        {item.amount > 0 ? '+' : ''}₦{Math.abs(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-12">
                    <div className="bg-surface-container-low px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl">{getCategoryIcon(item.category)}</span> {item.category}
                    </div>
                    <div className="bg-surface-container-low px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-3 border border-primary/20">
                      <span className="material-symbols-outlined text-xl">verified</span> Staged
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => confirmReceipt(item.id)} 
                      className="bg-on-surface text-surface px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 transition-all shadow-2xl"
                    >
                      <span className="material-symbols-outlined text-xl">check_circle</span> Validate
                    </motion.button>
                    <motion.button 
                      whileHover={{ backgroundColor: 'var(--surface-container-highest)' }}
                      onClick={() => openEdit(item)} 
                      className="bg-surface-container-highest text-on-surface px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] border border-outline/10 transition-all"
                    >
                      Amend
                    </motion.button>
                    <button 
                      onClick={() => discardReceipt(item.id)} 
                      className="ml-auto text-error font-black text-[10px] uppercase tracking-[0.2em] px-8 py-5 bg-error/5 hover:bg-error/15 rounded-2xl transition-all"
                    >
                      Discard
                    </button>
                  </div>
                </motion.div>
              );
            } else if (index % 3 === 1) {
              // Small Vertical Card (The Protocol Detail)
              return (
                <motion.div 
                  layout
                  key={item.id}
                  variants={itemVariants}
                  exit="exit"
                  className="md:col-span-4 card-lowest p-10 flex flex-col justify-between group border-transparent hover:border-outline-variant/10 shadow-sm"
                >
                  <div>
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 ${item.amount > 0 ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-3xl font-black">
                        {getCategoryIcon(item.category)}
                      </span>
                    </div>
                    <span className="text-outline text-[10px] font-black tracking-[0.2em] uppercase opacity-40">{item.date}</span>
                    <h3 className="text-2xl font-black text-on-surface mt-3 leading-tight tracking-tighter">{item.name}</h3>
                    <span className={`text-3xl font-black tracking-tighter mt-4 block ${item.amount > 0 ? 'text-secondary' : 'text-on-surface'}`}>
                      {item.amount > 0 ? '+' : ''}₦{Math.abs(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="mt-12 space-y-3">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => confirmReceipt(item.id)} 
                      className="w-full bg-on-surface text-surface py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl"
                    >
                      Validate
                    </motion.button>
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(item)} className="flex-1 bg-surface-container-highest text-on-surface py-4 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-surface-container-high transition-all">Amend</button>
                      <button onClick={() => discardReceipt(item.id)} className="flex-1 bg-error/5 text-error py-4 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-error/10 transition-all">Discard</button>
                    </div>
                  </div>
                </motion.div>
              );
            } else {
              // Row Card (The Ledger Stream)
              return (
                <motion.div 
                  layout
                  key={item.id}
                  variants={itemVariants}
                  exit="exit"
                  className="md:col-span-12 card-lowest p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 border-l-[12px] border-primary group hover:bg-surface-bright transition-all"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-surface-container-high rounded-3xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-inner">
                      <span className="material-symbols-outlined text-3xl font-black">{getCategoryIcon(item.category)}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-on-surface tracking-tighter leading-tight">{item.name}</h3>
                      <p className="text-[10px] font-black text-outline mt-3 uppercase tracking-[0.3em] opacity-40">{item.date} • {item.account || 'Vault Stream'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="text-right">
                      <span className={`text-3xl font-black tracking-tighter leading-none ${item.amount > 0 ? 'text-secondary' : 'text-on-surface'}`}>
                        {item.amount > 0 ? '+' : ''}₦{Math.abs(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-3">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: 'var(--secondary)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => confirmReceipt(item.id)} 
                        className="w-14 h-14 rounded-full bg-secondary/10 text-secondary transition-all flex items-center justify-center border border-secondary/20 shadow-lg shadow-secondary/5"
                      >
                        <span className="material-symbols-outlined font-black">check</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: 'var(--on-surface)', color: 'white' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEdit(item)} 
                        className="w-14 h-14 rounded-full bg-surface-container-high text-on-surface transition-all flex items-center justify-center border border-outline-variant/10"
                      >
                        <span className="material-symbols-outlined font-black text-xl">edit</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: 'var(--error)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => discardReceipt(item.id)} 
                        className="w-14 h-14 rounded-full bg-error/10 text-error transition-all flex items-center justify-center border border-error/20 shadow-lg shadow-error/5 opacity-40 hover:opacity-100"
                      >
                        <span className="material-symbols-outlined font-black">close</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            }
          })}
        </AnimatePresence>
      </div>

      {/* Edit Modal (The Amendment Sheet) */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-2xl z-[200] flex items-end md:items-center justify-center p-6">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-xl bg-surface p-12 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-outline-variant/10"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Protocol Correction</p>
                  <h3 className="text-4xl font-black tracking-tighter text-on-surface">Amend Entry</h3>
                </div>
                <button 
                  onClick={() => setEditingItem(null)} 
                  className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined font-black">close</span>
                </button>
              </div>

              <div className="space-y-8">
                {/* Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-outline ml-4">Merchant / Protocol Label</label>
                  <input
                    className="w-full bg-surface-container-low p-6 rounded-[2rem] font-black text-lg text-on-surface focus:outline-none focus:bg-surface-container-high transition-all border border-transparent focus:border-primary/20 shadow-inner"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                {/* Amount + Direction */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-outline ml-4">Directive Value (₦)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full bg-surface-container-low p-6 rounded-[2rem] font-black text-lg text-on-surface focus:outline-none focus:bg-surface-container-high transition-all border border-transparent focus:border-primary/20 shadow-inner"
                      value={editForm.amount}
                      onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-outline ml-4">Ledger Vector</label>
                    <div className="flex bg-surface-container-low p-2 rounded-[2.5rem] h-[76px] shadow-inner">
                      <button 
                        type="button" 
                        onClick={() => setEditForm({ ...editForm, isPositive: false })} 
                        className={`flex-1 rounded-[2rem] text-[10px] font-black transition-all ${!editForm.isPositive ? 'bg-error text-white shadow-xl' : 'text-outline uppercase opacity-40'}`}
                      >
                        DEBIT
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditForm({ ...editForm, isPositive: true })} 
                        className={`flex-1 rounded-[2rem] text-[10px] font-black transition-all ${editForm.isPositive ? 'bg-secondary text-white shadow-xl' : 'text-outline uppercase opacity-40'}`}
                      >
                        CREDIT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-outline ml-4">Tactical Allocation</label>
                  <div className="flex flex-wrap gap-3">
                    {categories.map(cat => (
                      <button 
                        key={cat} 
                        type="button" 
                        onClick={() => setEditForm({ ...editForm, category: cat })}
                        className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          editForm.category === cat 
                            ? 'bg-on-surface text-surface shadow-xl' 
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveEdit} 
                  className="w-full bg-primary text-white p-7 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/20 transition-all mt-8"
                >
                  Commit Amendment to Ledger
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Inbox;
