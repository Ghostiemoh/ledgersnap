import React, { useEffect, useState } from 'react';
import { AlertTriangle, Download, Lock, RefreshCcw, ShieldCheck, Sparkles, Trash2, X } from 'lucide-react';
import { useLedger } from '../context/LedgerContext';

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative h-7 w-12 rounded-full border ${checked ? 'border-primary bg-primary' : 'border-border bg-surface-muted'}`}
  >
    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
  </button>
);

const Settings = () => {
  const { settings, updateSetting, resetAllData, exportLedger, transactionCount, inboxCount } = useLedger();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    if (!showResetConfirm) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') setShowResetConfirm(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showResetConfirm]);

  const handleExport = () => {
    exportLedger();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2400);
  };

  const settingsRows = [
    {
      id: 'autoExtract',
      title: 'Auto extraction',
      description: 'Use in-browser OCR to suggest merchant, amount, and category from receipt images.',
      icon: Sparkles,
      enabled: settings.autoExtract,
    },
  ];

  return (
    <div className="page-shell max-w-4xl space-y-8">
      <header>
        <p className="section-heading">Settings</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Control the ledger workspace.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Manage local storage, receipt extraction, exports, and workspace cleanup without leaving the product.
        </p>
      </header>

      {exportSuccess && (
        <section className="card border-success bg-success-soft p-4" role="status">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-success" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">Ledger exported</h2>
              <p className="mt-1 text-sm text-muted">Your CSV download has started.</p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="card p-5">
          <p className="section-heading">Entries</p>
          <p className="mt-2 text-3xl font-extrabold">{transactionCount}</p>
        </article>
        <article className="card p-5">
          <p className="section-heading">Pending</p>
          <p className="mt-2 text-3xl font-extrabold">{inboxCount}</p>
        </article>
        <article className="card p-5">
          <p className="section-heading">Storage</p>
          <p className="mt-2 text-3xl font-extrabold">Local</p>
        </article>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-border p-4 sm:p-5">
          <p className="section-heading">Preferences</p>
          <h2 className="mt-1 text-lg font-bold">Receipt automation</h2>
        </div>
        <div className="divide-y divide-border">
          {settingsRows.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-muted text-muted">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
                  </div>
                </div>
                <Toggle checked={Boolean(item.enabled)} label={item.title} onChange={() => updateSetting(item.id, !item.enabled)} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-border p-4 sm:p-5">
          <p className="section-heading">Data</p>
          <h2 className="mt-1 text-lg font-bold">Export and clear</h2>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <button type="button" className="button-secondary justify-start p-4 text-left" onClick={handleExport}>
            <Download className="h-5 w-5" aria-hidden="true" />
            <span>
              <span className="block font-semibold">Export CSV</span>
              <span className="block text-sm font-normal text-muted">Download reconciled entries.</span>
            </span>
          </button>
          <button type="button" className="button-secondary justify-start p-4 text-left text-danger hover:bg-danger-soft hover:text-danger" onClick={() => setShowResetConfirm(true)}>
            <Trash2 className="h-5 w-5" aria-hidden="true" />
            <span>
              <span className="block font-semibold">Clear workspace</span>
              <span className="block text-sm font-normal text-muted">Remove local transactions and pending scans.</span>
            </span>
          </button>
        </div>
      </section>

      <section className="card-muted p-4">
        <div className="flex gap-3">
          <Lock className="mt-0.5 h-5 w-5 text-muted" aria-hidden="true" />
          <p className="text-sm leading-6 text-muted">
            LedgerSnap currently stores data in this browser's local storage. Clearing browser data will remove the ledger.
          </p>
        </div>
      </section>

      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-danger-soft text-danger">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="reset-title" className="text-xl font-bold">Clear local workspace?</h2>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    This removes local transactions, pending scans, and saved preferences from this browser.
                  </p>
                </div>
              </div>
              <button type="button" className="button-ghost h-10 w-10 p-0" onClick={() => setShowResetConfirm(false)} aria-label="Close reset confirmation">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" className="button-secondary" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button
                type="button"
                className="button-primary bg-danger text-white"
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
              >
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                Clear workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
