import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLedger, getCategoryIcon } from '../context/LedgerContext';
import { createWorker } from 'tesseract.js';
import { motion, AnimatePresence } from 'framer-motion';

const AddReceipt = () => {
  const navigate = useNavigate();
  const { addToInbox, addTransaction } = useLedger();
  const fileInputRef = useRef(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showManualForm, setShowManualForm] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Lifestyle',
    isPositive: false
  });

  const categories = ['Groceries', 'Technology', 'Lifestyle', 'Transport', 'Invoice', 'Personal'];

  const finalizeAction = (item, isManual = false) => {
    if (isManual) {
      addTransaction(item);
    } else {
      addToInbox(item);
    }
    setIsProcessing(false);
    setSuccess(true);
    setTimeout(() => navigate(isManual ? '/tracker' : '/inbox'), 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.floor(m.progress * 100));
          }
        }
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const raw = text;
      const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 1);

      // (OCR logic remains same for extraction quality)
      let beneficiary = null;
      const namePatterns = [/beneficiary\s*[:\-]\s*([A-Za-z][^\n\r]{2,50})/i, /payee\s*[:\-]\s*([A-Za-z][^\n\r]{2,50})/i, /name\s*[:\-]\s*([A-Za-z][^\n\r]{2,50})/i];
      for (const pat of namePatterns) {
        const m = raw.match(pat);
        if (m?.[1]) { beneficiary = m[1].replace(/[^\w\s]/g, '').trim(); break; }
      }
      if (!beneficiary) beneficiary = lines[0] || file.name.split('.')[0];

      let isCredit = /credit|received|inflow|deposit/i.test(raw);
      let amount = 0;
      const amountMatch = raw.match(/(?:NGN|₦|N)?\s*([\d,]+(?:\.\d{1,2})?)/i);
      if (amountMatch) amount = parseFloat(amountMatch[1].replace(/,/g, ''));

      finalizeAction({
        name: beneficiary,
        amount: isCredit ? amount : -amount,
        category: 'Uncategorized',
        status: isCredit ? 'Credit · AI Captured' : 'Debit · AI Captured',
        account: 'Receipt Scan',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });

    } catch (err) {
      finalizeAction({
        name: file.name.split('.')[0],
        amount: -100.00,
        category: 'Uncategorized',
        status: 'Scan Failed – Manual Intervention Required',
        account: 'Manual Review'
      });
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum)) return;
    
    finalizeAction({
      name: formData.name || 'Manual Entry',
      amount: formData.isPositive ? Math.abs(amountNum) : -Math.abs(amountNum),
      category: formData.category,
      status: 'Manual Archival Verified'
    }, true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto px-6 pt-12 pb-32 space-y-16"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,application/pdf"
        onChange={handleFileUpload}
      />

      {/* Extraction Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-on-surface/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-12 overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
              <span className="text-[25vw] font-black tracking-tighter text-white whitespace-nowrap">ARCHITECTING</span>
            </div>
            
            <div className="w-full max-w-md space-y-16 text-center relative z-10">
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-white/5 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                  <motion.circle 
                    className="text-primary stroke-current" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress / 100 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 60 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-white text-4xl tracking-tighter">
                  {progress}%
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-5xl font-black tracking-tighter text-white leading-none">Extraction Sequence</h2>
                <div className="flex flex-col items-center gap-3">
                  <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  </div>
                  <p className="text-primary text-[11px] font-black uppercase tracking-[0.4em]">
                    {progress < 40 ? 'Analyzing Pixel Grid' : progress < 80 ? 'Deconstructing Metadata' : 'Finalizing Sums'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-secondary z-[102] flex flex-col items-center justify-center p-12"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-center space-y-12"
            >
              <div className="w-48 h-48 bg-white/10 rounded-[3rem] flex items-center justify-center mx-auto border-4 border-white/20 shadow-2xl">
                <span className="material-symbols-outlined text-white text-[120px] font-black">verified</span>
              </div>
              <div className="space-y-6">
                <h2 className="text-7xl font-black tracking-tighter text-white leading-none">Vault Secured</h2>
                <p className="text-white/60 font-black uppercase tracking-[0.5em] text-[11px]">Directive committed to local archive</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section variants={itemVariants} className="space-y-6">
        <p className="text-primary text-[11px] font-black uppercase tracking-[0.6em] ml-2">Protocol Capture</p>
        <h2 className="text-7xl font-black tracking-tighter text-on-surface leading-none">Input Directive</h2>
      </motion.section>

      {/* Primary Action: Camera Scan */}
      <motion.section 
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="group relative cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        <div className="w-full aspect-[16/20] md:aspect-[16/10] rounded-[4rem] overflow-hidden relative shadow-2xl bg-on-surface border border-white/10">
           {/* Dynamic Background Pattern */}
           <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-color),0.5)_0%,transparent_70%)]"></div>
           </div>
           
           <div className="absolute inset-0 p-16 flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/20 text-white shadow-2xl">
                <span className="material-symbols-outlined text-5xl font-black">photo_camera</span>
              </div>
              <div className="bg-primary/20 backdrop-blur-3xl px-8 py-4 rounded-2xl border border-primary/20">
                <p className="text-white text-[11px] font-black uppercase tracking-[0.3em]">AI ARCHITECT ENGINE v3</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-6xl font-black text-white tracking-tighter leading-none">Instant Archival</h3>
              <p className="text-white/50 text-xl font-medium leading-relaxed max-w-sm">Capture physical merchant metadata with millisecond-grade precision.</p>
              <div className="pt-4 flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full bg-white/10 border-2 border-on-surface backdrop-blur-sm"></div>
                    ))}
                 </div>
                 <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">50k+ Protocol Captures</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Manual Entry Modal Overlay */}
      <AnimatePresence>
        {showManualForm && (
          <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-2xl z-[101] flex items-end md:items-center justify-center p-6">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-xl bg-surface p-12 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-outline-variant/10"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Staging Platform</p>
                  <h3 className="text-4xl font-black tracking-tighter text-on-surface leading-none">Manual Protocol</h3>
                </div>
                <button 
                  onClick={() => setShowManualForm(false)} 
                  className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:text-error transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined font-black text-xl">close</span>
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-outline ml-4">Merchant Descriptor</label>
                  <input 
                    required
                    className="w-full bg-surface-container-low p-6 rounded-[2rem] font-black text-lg text-on-surface focus:outline-none focus:bg-surface-container-high transition-all border border-transparent focus:border-primary/20 shadow-inner" 
                    placeholder="Identify Beneficiary"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-outline ml-4">Capital Value (₦)</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      className="w-full bg-surface-container-low p-6 rounded-[2rem] font-black text-lg text-on-surface focus:outline-none focus:bg-surface-container-high transition-all border border-transparent focus:border-primary/20 shadow-inner" 
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-outline ml-4">Ledger Vector</label>
                    <div className="flex bg-surface-container-low p-2 rounded-[2.5rem] h-[76px] shadow-inner">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, isPositive: false})}
                        className={`flex-1 rounded-[2.2rem] text-[10px] font-black transition-all ${!formData.isPositive ? 'bg-error text-white shadow-xl' : 'text-outline uppercase opacity-40'}`}
                      >DEBIT</button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, isPositive: true})}
                        className={`flex-1 rounded-[2.2rem] text-[10px] font-black transition-all ${formData.isPositive ? 'bg-secondary text-white shadow-xl' : 'text-outline uppercase opacity-40'}`}
                      >CREDIT</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-outline ml-4">Tactical Allocation</label>
                  <div className="flex flex-wrap gap-3">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat})}
                        className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.category === cat 
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
                  type="submit" 
                  className="w-full bg-primary text-white p-7 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs mt-10 shadow-2xl shadow-primary/20 transition-all"
                >
                  Publish Directive to Ledger
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alternative Methods Split */}
      <motion.section variants={itemVariants} className="grid grid-cols-2 gap-8">
        <motion.button 
          whileHover={{ y: -5 }}
          onClick={() => fileInputRef.current.click()}
          className="card-lowest p-10 flex flex-col items-start gap-8 border-transparent hover:border-primary/10 transition-all group shadow-sm bg-surface-container-lowest"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
            <span className="material-symbols-outlined text-3xl font-black">file_present</span>
          </div>
          <div className="text-left space-y-2">
            <p className="text-on-surface text-2xl font-black tracking-tight leading-none">Digital Import</p>
            <p className="text-[10px] text-outline font-black uppercase tracking-[0.2em] opacity-40">Remote PDF Stream</p>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ y: -5 }}
          onClick={() => setShowManualForm(true)}
          className="card-lowest p-10 flex flex-col items-start gap-8 border-transparent hover:border-primary/10 transition-all group shadow-sm bg-surface-container-lowest"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
            <span className="material-symbols-outlined text-3xl font-black">edit_square</span>
          </div>
          <div className="text-left space-y-2">
            <p className="text-on-surface text-2xl font-black tracking-tight leading-none">Manual Dial</p>
            <p className="text-[10px] text-outline font-black uppercase tracking-[0.2em] opacity-40">Override Protocol</p>
          </div>
        </motion.button>
      </motion.section>

      {/* Trust Footer */}
      <motion.footer 
        variants={itemVariants} 
        className="p-10 rounded-[3.5rem] bg-surface-container-low flex items-start gap-8 border border-outline-variant/10 shadow-inner"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
          <span className="material-symbols-outlined text-4xl font-black">security_update_good</span>
        </div>
        <div className="space-y-3">
          <h4 className="text-[11px] font-black text-on-surface uppercase tracking-[0.4em] opacity-80">Encryption Enclave Active</h4>
          <p className="text-[12px] text-on-surface-variant font-medium leading-relaxed max-w-lg opacity-60">
            All analytical extractions are processed within your local architectural environment. Your financial patterns are never exposed to external telemetry.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default AddReceipt;
