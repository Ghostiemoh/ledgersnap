import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Camera, CheckCircle2, Loader2, PencilLine, ShieldCheck, X } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { CATEGORIES, useLedger } from '../context/LedgerContext';
import { formatCurrency } from '../lib/formatters';

const defaultForm = {
  name: '',
  amount: '',
  category: 'Lifestyle',
  isPositive: false,
  account: '',
};

const parseReceiptText = (text, fileName) => {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const name =
    text.match(/(?:beneficiary|merchant|payee|name)\s*[:-]\s*([A-Za-z0-9 &.'-]{2,60})/i)?.[1]?.trim() ||
    lines.find((line) => /[A-Za-z]{3}/.test(line)) ||
    fileName.replace(/\.[^.]+$/, '');

  const amountMatch = text.match(/(?:NGN|N)?\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)/i);
  const amount = amountMatch ? Number(amountMatch[1].replaceAll(',', '')) : 0;
  const isCredit = /credit|received|deposit|paid\s+in|inflow/i.test(text);

  return {
    name,
    amount: isCredit ? Math.abs(amount) : -Math.abs(amount || 0),
    category: 'Uncategorized',
    status: amount ? 'AI extracted' : 'Needs amount review',
    account: 'Receipt scan',
  };
};

const AddReceipt = () => {
  const navigate = useNavigate();
  const { addToInbox, addTransaction, settings } = useLedger();
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showManualForm, setShowManualForm] = useState(false);
  const [successMode, setSuccessMode] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (!showManualForm) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') setShowManualForm(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showManualForm]);

  const finish = (mode) => {
    setSuccessMode(mode);
    setTimeout(() => navigate(mode === 'manual' ? '/tracker' : '/inbox'), 900);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccessMode(null);
    setIsProcessing(true);
    setProgress(8);

    try {
      if (!settings.autoExtract) {
        addToInbox({
          name: file.name.replace(/\.[^.]+$/, ''),
          amount: 0,
          category: 'Uncategorized',
          status: 'Ready for manual review',
          account: 'Receipt image',
        });
        finish('scan');
        return;
      }

      const worker = await createWorker('eng', 1, {
        logger: (message) => {
          if (message.status === 'recognizing text') {
            setProgress(Math.max(8, Math.floor(message.progress * 100)));
          }
        },
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      addToInbox(parseReceiptText(data.text, file.name));
      finish('scan');
    } catch {
      setError('We could not read that image. Try a clearer receipt photo or add the entry manually.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      event.target.value = '';
    }
  };

  const handleManualSubmit = (event) => {
    event.preventDefault();
    const amount = Number(formData.amount);

    if (!formData.name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError('Add a merchant name and an amount greater than zero.');
      return;
    }

    addTransaction({
      name: formData.name.trim(),
      amount: formData.isPositive ? Math.abs(amount) : -Math.abs(amount),
      category: formData.category,
      account: formData.account.trim() || 'Manual entry',
      status: 'Manual entry',
    });

    setFormData(defaultForm);
    setShowManualForm(false);
    finish('manual');
  };

  return (
    <div className="page-shell max-w-5xl space-y-8">
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
      />

      <header className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="section-heading">Capture</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Turn a receipt into a ledger entry.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Scan an image for review, or add a clean manual transaction when you already know the details.
          </p>
        </div>
        <div className="card-muted p-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-success" aria-hidden="true" />
            <p className="text-sm text-muted">
              {settings.autoExtract
                ? 'OCR runs in your browser. Extracted entries stay in the review inbox until you approve them.'
                : 'Auto extraction is off. Uploaded receipts go straight to review for manual correction.'}
            </p>
          </div>
        </div>
      </header>

      {error && (
        <section className="card border-danger bg-danger-soft p-4" role="alert">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-danger" aria-hidden="true" />
              <div>
                <h2 className="font-semibold">Capture needs attention</h2>
                <p className="mt-1 text-sm text-muted">{error}</p>
              </div>
            </div>
            <button type="button" className="button-secondary bg-surface" onClick={() => setError('')}>
              Dismiss
            </button>
          </div>
        </section>
      )}

      {successMode && (
        <section className="card border-success bg-success-soft p-4" role="status">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">{successMode === 'manual' ? 'Entry saved' : 'Scan sent to review'}</h2>
              <p className="mt-1 text-sm text-muted">
                {successMode === 'manual'
                  ? 'Opening the ledger with your new transaction.'
                  : 'Opening the inbox so you can confirm the extracted details.'}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          aria-busy={isProcessing}
          className="card flex min-h-[18rem] flex-col items-start justify-between p-6 text-left hover:-translate-y-0.5 hover:bg-surface-muted sm:p-8"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Camera className="h-5 w-5" aria-hidden="true" />}
          </span>
          <span>
            <span className="block text-2xl font-extrabold tracking-tight">Scan receipt image</span>
            <span className="mt-2 block max-w-sm text-sm leading-6 text-muted">
              Upload a receipt screenshot or photo. LedgerSnap {settings.autoExtract ? 'extracts the likely merchant, amount, and direction.' : 'keeps it in review until you enter the details.'}
            </span>
            {isProcessing && (
              <span className="mt-5 block">
                <span className="mb-2 flex items-center justify-between text-sm font-semibold">
                  Reading image
                  <span>{progress}%</span>
                </span>
                <span className="block h-2 overflow-hidden rounded-full bg-surface-muted">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                </span>
              </span>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowManualForm(true)}
          className="card flex min-h-[18rem] flex-col items-start justify-between p-6 text-left hover:-translate-y-0.5 hover:bg-surface-muted sm:p-8"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <PencilLine className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-2xl font-extrabold tracking-tight">Add manual entry</span>
            <span className="mt-2 block max-w-sm text-sm leading-6 text-muted">
              Log transfers, cash payments, or scan failures directly into the ledger with the right category.
            </span>
          </span>
        </button>
      </section>

      <section className="card p-5">
        <p className="section-heading">Capture flow</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ['Upload', 'Choose a receipt image from camera roll or files.'],
            ['Review', 'Correct the extracted name, amount, and category.'],
            ['Approve', 'Move the entry into your permanent ledger.'],
          ].map(([title, description], index) => (
            <div key={title} className="rounded-lg border border-border bg-surface-muted p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface font-bold">{index + 1}</span>
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {showManualForm && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/40 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="manual-entry-title">
          <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-surface p-5 shadow-xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-heading">Manual entry</p>
                <h2 id="manual-entry-title" className="mt-1 text-2xl font-bold tracking-tight">Add transaction details</h2>
              </div>
              <button type="button" className="button-ghost h-10 w-10 p-0" onClick={() => setShowManualForm(false)} aria-label="Close manual entry form">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="label" htmlFor="merchant">Merchant or payer</label>
                  <input
                    id="merchant"
                    className="input"
                    type="text"
                    autoComplete="organization"
                    placeholder="e.g. Shoprite Ikeja"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="label" htmlFor="amount">Amount</label>
                  <input
                    id="amount"
                    className="input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="label" htmlFor="account">Account</label>
                  <input
                    id="account"
                    className="input"
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. GTBank"
                    value={formData.account}
                    onChange={(event) => setFormData({ ...formData, account: event.target.value })}
                  />
                </div>

                <fieldset className="space-y-2">
                  <legend className="label">Direction</legend>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={!formData.isPositive ? 'button-primary bg-danger text-white' : 'button-secondary'}
                      onClick={() => setFormData({ ...formData, isPositive: false })}
                    >
                      Debit
                    </button>
                    <button
                      type="button"
                      className={formData.isPositive ? 'button-primary bg-success text-white' : 'button-secondary'}
                      onClick={() => setFormData({ ...formData, isPositive: true })}
                    >
                      Credit
                    </button>
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <label className="label" htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="input"
                    value={formData.category}
                    onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-lg bg-surface-muted p-4 text-sm text-muted">
                This will save {formData.amount ? formatCurrency(Number(formData.amount)) : 'the amount'} as a {formData.isPositive ? 'credit' : 'debit'}.
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" className="button-secondary" onClick={() => setShowManualForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  Save entry
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReceipt;
