/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const LedgerContext = createContext();

export const CATEGORIES = [
  'Groceries',
  'Technology',
  'Lifestyle',
  'Transport',
  'Invoice',
  'Personal',
  'Uncategorized',
];

export const CATEGORY_ICONS = {
  Groceries: 'shopping-bag',
  Technology: 'laptop',
  Lifestyle: 'coffee',
  Transport: 'car',
  Invoice: 'file-text',
  Personal: 'user',
  Uncategorized: 'receipt',
};

export const getCategoryIcon = (category) => CATEGORY_ICONS[category] || CATEGORY_ICONS.Uncategorized;

const initialTransactions = [];
const initialInbox = [];
const defaultSettings = {
  autoExtract: true,
};
const storageVersion = '2';

const legacySeedTransactions = new Map([
  ['tx1', 'Shoprite Ikeja'],
  ['tx2', 'Client deposit - Project Omega'],
  ['tx3', 'Cafe Neo Victoria Island'],
]);

const legacySeedInbox = new Map([
  ['rb1', 'MTN airtime'],
  ['rb2', 'Freelance payment - Adesola'],
]);

const safeRead = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const removeLegacySeeds = (items, legacySeeds) => {
  if (localStorage.getItem('ls_schema_version') === storageVersion) return items;
  if (!Array.isArray(items)) return [];

  return items.filter((item) => legacySeeds.get(item.id) !== item.name);
};

const readSettings = () => {
  const saved = safeRead('ls_settings', defaultSettings);

  return {
    ...defaultSettings,
    autoExtract: saved.autoExtract ?? defaultSettings.autoExtract,
  };
};

export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
};

export const LedgerProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() =>
    removeLegacySeeds(safeRead('ls_transactions', initialTransactions), legacySeedTransactions),
  );
  const [inbox, setInbox] = useState(() =>
    removeLegacySeeds(safeRead('ls_inbox', initialInbox), legacySeedInbox),
  );
  const [settings, setSettings] = useState(readSettings);

  useEffect(() => {
    localStorage.setItem('ls_schema_version', storageVersion);
  }, []);

  useEffect(() => {
    localStorage.setItem('ls_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ls_inbox', JSON.stringify(inbox));
  }, [inbox]);

  useEffect(() => {
    localStorage.setItem('ls_settings', JSON.stringify(settings));
  }, [settings]);

  const balance = useMemo(() => transactions.reduce((acc, tx) => acc + tx.amount, 0), [transactions]);
  const totalInflow = useMemo(
    () => transactions.filter((tx) => tx.amount > 0).reduce((acc, tx) => acc + tx.amount, 0),
    [transactions],
  );
  const totalOutflow = useMemo(
    () => Math.abs(transactions.filter((tx) => tx.amount < 0).reduce((acc, tx) => acc + tx.amount, 0)),
    [transactions],
  );

  const addToInbox = useCallback((item) => {
    setInbox((prev) => [
      {
        id: `rb-${Date.now()}`,
        date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }),
        account: 'Receipt scan',
        status: 'Needs review',
        ...item,
      },
      ...prev,
    ]);
  }, []);

  const addTransaction = useCallback((item) => {
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }),
        account: 'Manual entry',
        status: 'Reconciled',
        ...item,
      },
      ...prev,
    ]);
  }, []);

  const confirmReceipt = useCallback((id) => {
    setInbox((prev) => {
      const item = prev.find((entry) => entry.id === id);
      if (item) {
        addTransaction({
          ...item,
          status: 'Reconciled',
        });
      }
      return prev.filter((entry) => entry.id !== id);
    });
  }, [addTransaction]);

  const discardReceipt = useCallback((id) => {
    setInbox((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const editInboxItem = useCallback((id, updates) => {
    setInbox((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)));
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const getTransaction = useCallback((id) => transactions.find((tx) => tx.id === id), [transactions]);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const resetAllData = useCallback(() => {
    setTransactions(initialTransactions);
    setInbox(initialInbox);
    setSettings(defaultSettings);
    localStorage.removeItem('ls_transactions');
    localStorage.removeItem('ls_inbox');
    localStorage.removeItem('ls_settings');
  }, []);

  const exportLedger = useCallback(() => {
    if (transactions.length === 0) return false;

    const csv = [
      ['Date', 'Time', 'Name', 'Category', 'Account', 'Amount (NGN)', 'Direction'].join(','),
      ...transactions.map((tx) =>
        [
          tx.date,
          tx.time,
          `"${tx.name.replaceAll('"', '""')}"`,
          tx.category,
          tx.account || '',
          Math.abs(tx.amount).toFixed(2),
          tx.amount > 0 ? 'Credit' : 'Debit',
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LedgerSnap_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  }, [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      inbox,
      settings,
      balance,
      totalInflow,
      totalOutflow,
      transactionCount: transactions.length,
      inboxCount: inbox.length,
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
    }),
    [
      transactions,
      inbox,
      settings,
      balance,
      totalInflow,
      totalOutflow,
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
    ],
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
};
