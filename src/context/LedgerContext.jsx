import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const LedgerContext = createContext();

export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
};

// ── Category icon mapping ────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  Groceries: 'shopping_cart',
  Technology: 'laptop_mac',
  Lifestyle: 'local_cafe',
  Transport: 'directions_car',
  Invoice: 'payments',
  Personal: 'person',
  Uncategorized: 'receipt_long',
};

export const getCategoryIcon = (category) => CATEGORY_ICONS[category] || 'receipt_long';

export const LedgerProvider = ({ children }) => {
  // ── Initial seed data (Nigerian context) ──────────────────────────────────
  const initialTransactions = [
    {
      id: 'tx1',
      name: 'Shoprite Ikeja',
      category: 'Groceries',
      amount: -15450.00,
      time: '10:24 AM',
      date: 'Apr 7',
      icon: 'shopping_cart',
    },
    {
      id: 'tx2',
      name: 'Client Deposit: Project Omega',
      category: 'Invoice',
      amount: 350000.00,
      time: '09:15 AM',
      date: 'Apr 7',
      icon: 'payments',
    },
    {
      id: 'tx3',
      name: 'Cafe Neo Victoria Island',
      category: 'Lifestyle',
      amount: -4750.00,
      time: '08:30 AM',
      date: 'Apr 7',
      icon: 'local_cafe',
    },
  ];

  const initialInbox = [
    {
      id: 'rb1',
      name: 'MTN Airtime',
      category: 'Technology',
      amount: -5000.00,
      date: 'Apr 6',
      account: 'OPay',
      status: 'High Accuracy Scan',
    },
    {
      id: 'rb2',
      name: 'Freelance Payment — Adesola',
      category: 'Invoice',
      amount: 75000.00,
      date: 'Apr 6',
      account: 'GTBank',
      status: 'Credit · AI Extracted',
    },
  ];

  // ── State with localStorage persistence ───────────────────────────────────
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('ls_transactions');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch { return initialTransactions; }
  });

  const [inbox, setInbox] = useState(() => {
    try {
      const saved = localStorage.getItem('ls_inbox');
      return saved ? JSON.parse(saved) : initialInbox;
    } catch { return initialInbox; }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ls_settings');
      return saved ? JSON.parse(saved) : { faceId: true, autoExtract: true };
    } catch { return { faceId: true, autoExtract: true }; }
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('ls_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('ls_inbox', JSON.stringify(inbox)); }, [inbox]);
  useEffect(() => { localStorage.setItem('ls_settings', JSON.stringify(settings)); }, [settings]);

  // ── Derived values (memoised) ─────────────────────────────────────────────
  const balance = useMemo(() => transactions.reduce((acc, tx) => acc + tx.amount, 0), [transactions]);
  const totalInflow = useMemo(() => transactions.filter(t => t.amount > 0).reduce((acc, tx) => acc + tx.amount, 0), [transactions]);
  const totalOutflow = useMemo(() => Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, tx) => acc + tx.amount, 0)), [transactions]);
  const transactionCount = transactions.length;
  const inboxCount = inbox.length;

  // ── Actions ───────────────────────────────────────────────────────────────
  const addToInbox = useCallback((item) => {
    setInbox(prev => [
      {
        id: `rb-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        ...item
      },
      ...prev
    ]);
  }, []);

  const confirmReceipt = useCallback((id) => {
    setInbox(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        setTransactions(txPrev => [
          {
            ...item,
            id: `tx-${Date.now()}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            icon: item.amount > 0 ? 'payments' : getCategoryIcon(item.category),
          },
          ...txPrev
        ]);
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const discardReceipt = useCallback((id) => {
    setInbox(prev => prev.filter(i => i.id !== id));
  }, []);

  const editInboxItem = useCallback((id, updates) => {
    setInbox(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const getTransaction = useCallback((id) => transactions.find(t => t.id === id), [transactions]);

  const addTransaction = useCallback((item) => {
    setTransactions(prev => [
      {
        ...item,
        id: `tx-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        icon: item.amount > 0 ? 'payments' : getCategoryIcon(item.category),
      },
      ...prev
    ]);
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const resetAllData = useCallback(() => {
    setTransactions(initialTransactions);
    setInbox(initialInbox);
    setSettings({ faceId: true, autoExtract: true });
    localStorage.removeItem('ls_transactions');
    localStorage.removeItem('ls_inbox');
    localStorage.removeItem('ls_settings');
  }, []);

  const exportLedger = useCallback(() => {
    const csv = [
      ['Date', 'Time', 'Name', 'Category', 'Amount (₦)', 'Direction'].join(','),
      ...transactions.map(tx =>
        [tx.date, tx.time, `"${tx.name}"`, tx.category, Math.abs(tx.amount).toFixed(2), tx.amount > 0 ? 'Credit' : 'Debit'].join(',')
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LedgerSnap_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [transactions]);

  // ── Provider value ────────────────────────────────────────────────────────
  const value = useMemo(() => ({
    transactions,
    inbox,
    settings,
    balance,
    totalInflow,
    totalOutflow,
    transactionCount,
    inboxCount,
    addToInbox,
    confirmReceipt,
    discardReceipt,
    editInboxItem,
    updateSetting,
    getTransaction,
    addTransaction,
    deleteTransaction,
    resetAllData,
    exportLedger,
  }), [transactions, inbox, settings, balance, totalInflow, totalOutflow, transactionCount, inboxCount,
       addToInbox, confirmReceipt, discardReceipt, editInboxItem, updateSetting, getTransaction, addTransaction, deleteTransaction, resetAllData, exportLedger]);

  return (
    <LedgerContext.Provider value={value}>
      {children}
    </LedgerContext.Provider>
  );
};
