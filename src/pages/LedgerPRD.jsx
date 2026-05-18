import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Copy, Download, FileText, Trash2 } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import { useLedger } from '../context/LedgerContext';
import { formatSignedCurrency } from '../lib/formatters';

const makeHash = (id = '') => `LS-${id.toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(8, '0').slice(0, 8)}`;

const LedgerPRD = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransaction, deleteTransaction } = useLedger();
  const [copied, setCopied] = useState(false);
  const tx = getTransaction(id);

  if (!tx) {
    return (
      <div className="page-shell flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
        <FileText className="h-12 w-12 text-muted" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-bold">Transaction not found</h1>
        <p className="mt-2 text-sm text-muted">The entry may have been removed or the link is no longer valid.</p>
        <Link to="/tracker" className="button-primary mt-6">Return to ledger</Link>
      </div>
    );
  }

  const hash = makeHash(tx.id);

  const copyHash = async () => {
    await navigator.clipboard?.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    deleteTransaction(tx.id);
    navigate('/tracker');
  };

  const exportDetail = () => {
    const payload = {
      id: tx.id,
      fingerprint: hash,
      name: tx.name,
      category: tx.category,
      account: tx.account || '',
      date: tx.date,
      time: tx.time,
      amount: tx.amount,
      direction: tx.amount > 0 ? 'Credit' : 'Debit',
      status: tx.status || 'Reconciled',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LedgerSnap_${tx.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-shell max-w-4xl space-y-8">
      <button type="button" className="button-ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <section className="card overflow-hidden">
        <div className={`border-b border-border p-5 ${tx.amount > 0 ? 'bg-success-soft' : 'bg-surface-muted'} sm:p-6`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="section-heading">Transaction detail</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{tx.name}</h1>
              <p className="mt-2 text-sm text-muted">{tx.category} - {tx.account || 'Ledger'} - {tx.date} at {tx.time}</p>
            </div>
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${tx.amount > 0 ? 'bg-success text-white' : 'bg-surface text-muted'}`}>
              <CategoryIcon category={tx.category} className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <article className="rounded-lg border border-border bg-surface p-4">
            <p className="section-heading">Amount</p>
            <p className={`stat-number mt-2 text-3xl font-extrabold ${tx.amount > 0 ? 'text-success' : 'text-foreground'}`}>
              {formatSignedCurrency(tx.amount)}
            </p>
          </article>
          <article className="rounded-lg border border-border bg-surface p-4">
            <p className="section-heading">Status</p>
            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {tx.status || 'Reconciled'}
            </p>
          </article>
          <article className="rounded-lg border border-border bg-surface p-4 sm:col-span-2">
            <p className="section-heading">Ledger fingerprint</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="break-all rounded-md bg-surface-muted px-3 py-2 font-mono text-sm text-foreground">{hash}</code>
              <button type="button" className="button-secondary" onClick={copyHash}>
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <p className="section-heading">Entry narrative</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          This transaction is approved into the local LedgerSnap book as a {tx.amount > 0 ? 'credit' : 'debit'} under {tx.category}.
          Use the ledger view to search it later by merchant, account, or category.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="button-secondary" onClick={exportDetail}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export detail
          </button>
          <button type="button" className="button-ghost text-danger hover:bg-danger-soft hover:text-danger" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete entry
          </button>
        </div>
      </section>
    </div>
  );
};

export default LedgerPRD;
