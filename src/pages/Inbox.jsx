import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Edit3, Inbox as InboxIcon, PlusCircle, Trash2, X } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import { CATEGORIES, useLedger } from '../context/LedgerContext';
import { formatSignedCurrency } from '../lib/formatters';

const Inbox = () => {
  const { inbox, confirmReceipt, discardReceipt, editInboxItem } = useLedger();
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!editingItem) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') setEditingItem(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [editingItem]);

  const openEdit = (item) => {
    setEditingItem(item.id);
    setEditForm({
      name: item.name,
      amount: Math.abs(item.amount),
      isPositive: item.amount > 0,
      category: item.category,
      account: item.account || '',
    });
  };

  const saveEdit = () => {
    const amount = Number(editForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    editInboxItem(editingItem, {
      name: editForm.name.trim() || 'Untitled receipt',
      amount: editForm.isPositive ? Math.abs(amount) : -Math.abs(amount),
      category: editForm.category,
      account: editForm.account.trim() || 'Receipt scan',
      status: 'Edited',
    });
    setEditingItem(null);
  };

  return (
    <div className="page-shell max-w-6xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-heading">Review inbox</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Approve only what belongs in the books.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Scans land here first so messy OCR never pollutes your final ledger.
          </p>
        </div>
        <Link to="/add" className="button-primary">
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          Capture more
        </Link>
      </header>

      {inbox.length === 0 ? (
        <section className="card flex flex-col items-center justify-center px-4 py-20 text-center">
          <InboxIcon className="h-12 w-12 text-muted" aria-hidden="true" />
          <h2 className="mt-5 text-xl font-bold">Inbox clear</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            Every scan has been approved or discarded. New receipt captures will appear here for review.
          </p>
          <Link to="/add" className="button-primary mt-6">Capture a receipt</Link>
        </section>
      ) : (
        <section className="grid gap-4">
          {inbox.map((item) => (
            <article key={item.id} className="card p-4 sm:p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex min-w-0 gap-4">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${item.amount > 0 ? 'bg-success-soft text-success' : 'bg-surface-muted text-muted'}`}>
                    <CategoryIcon category={item.category} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-bold">{item.name}</h2>
                      <span className="rounded-md bg-warning-soft px-2 py-1 text-xs font-semibold text-warning">{item.status || 'Needs review'}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {item.category} - {item.account || 'Receipt scan'} - {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <p className={`stat-number text-left text-xl font-extrabold sm:min-w-40 sm:text-right ${item.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                    {formatSignedCurrency(item.amount)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="button-primary" onClick={() => confirmReceipt(item.id)}>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Approve
                    </button>
                    <button type="button" className="button-secondary" onClick={() => openEdit(item)}>
                      <Edit3 className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </button>
                    <button type="button" className="button-ghost text-danger hover:bg-danger-soft hover:text-danger" onClick={() => discardReceipt(item.id)}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/40 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="edit-entry-title">
          <div className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-lg border border-border bg-surface p-5 shadow-xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-heading">Correct scan</p>
                <h2 id="edit-entry-title" className="mt-1 text-2xl font-bold tracking-tight">Review extracted fields</h2>
              </div>
              <button type="button" className="button-ghost h-10 w-10 p-0" onClick={() => setEditingItem(null)} aria-label="Close edit dialog">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="label" htmlFor="edit-name">Merchant or payer</label>
                <input id="edit-name" className="input" value={editForm.name || ''} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="label" htmlFor="edit-amount">Amount</label>
                <input id="edit-amount" className="input" type="number" inputMode="decimal" min="0" step="0.01" value={editForm.amount || ''} onChange={(event) => setEditForm({ ...editForm, amount: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="label" htmlFor="edit-account">Account</label>
                <input id="edit-account" className="input" value={editForm.account || ''} onChange={(event) => setEditForm({ ...editForm, account: event.target.value })} />
              </div>
              <fieldset className="space-y-2">
                <legend className="label">Direction</legend>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className={!editForm.isPositive ? 'button-primary bg-danger text-white' : 'button-secondary'} onClick={() => setEditForm({ ...editForm, isPositive: false })}>Debit</button>
                  <button type="button" className={editForm.isPositive ? 'button-primary bg-success text-white' : 'button-secondary'} onClick={() => setEditForm({ ...editForm, isPositive: true })}>Credit</button>
                </div>
              </fieldset>
              <div className="space-y-2">
                <label className="label" htmlFor="edit-category">Category</label>
                <select id="edit-category" className="input" value={editForm.category || 'Uncategorized'} onChange={(event) => setEditForm({ ...editForm, category: event.target.value })}>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" className="button-secondary" onClick={() => setEditingItem(null)}>Cancel</button>
              <button type="button" className="button-primary" onClick={saveEdit}>Save corrections</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
