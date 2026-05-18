import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Camera, CheckCircle2, Clock3, Inbox, ReceiptText } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import { useLedger } from '../context/LedgerContext';
import { formatCurrency, formatSignedCurrency, getTodayLabel } from '../lib/formatters';

const Home = () => {
  const navigate = useNavigate();
  const { transactions, balance, totalInflow, totalOutflow, inboxCount, transactionCount } = useLedger();
  const latestTransactions = transactions.slice(0, 5);

  return (
    <div className="page-shell space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="card bg-surface-strong p-5 text-white dark:text-background sm:p-6 lg:p-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <p className="section-heading text-white/65 dark:text-background/70">Business balance</p>
              <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Your receipts, transfers, and cash flow in one clean ledger.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/72 dark:text-background/75">
                Capture a receipt, review the extracted details, and approve it into a searchable Nigerian business ledger.
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 text-sm">
              <p className="text-white/65 dark:text-background/70">Today</p>
              <p className="mt-1 font-semibold">{getTodayLabel()}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-sm font-medium text-white/65 dark:text-background/70">Net position</p>
              <p className="stat-number mt-2 text-4xl font-extrabold tracking-tight sm:text-6xl">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/add" className="button-primary bg-white text-surface-strong hover:bg-white/90">
                <Camera className="h-4 w-4" aria-hidden="true" />
                Capture receipt
              </Link>
              <Link to="/tracker" className="button-secondary border-white/20 bg-white/10 text-white hover:bg-white/15 dark:text-background">
                Open ledger
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-heading">Cash in</p>
                <p className="stat-number mt-3 text-2xl font-extrabold">{formatCurrency(totalInflow)}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-success-soft text-success">
                <ArrowDownRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </article>
          <article className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-heading">Cash out</p>
                <p className="stat-number mt-3 text-2xl font-extrabold">{formatCurrency(totalOutflow)}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-danger-soft text-danger">
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </article>
          <article className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-heading">Review queue</p>
                <p className="mt-3 text-2xl font-extrabold">{inboxCount} pending</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-warning-soft text-warning">
                <Inbox className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </article>
        </div>
      </section>

      {inboxCount > 0 && (
        <section className="card border-warning bg-warning-soft p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 text-warning" aria-hidden="true" />
              <div>
                <h2 className="font-semibold text-foreground">{inboxCount} receipt entries need review</h2>
                <p className="mt-1 text-sm text-muted">Approve, edit, or discard scan results before they affect your ledger.</p>
              </div>
            </div>
            <Link to="/inbox" className="button-secondary bg-surface">
              Review inbox
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-border p-4 sm:p-5">
            <div>
              <p className="section-heading">Recent ledger</p>
              <h2 className="mt-1 text-xl font-bold">Latest reconciled activity</h2>
            </div>
            <Link to="/tracker" className="button-ghost">
              View all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {latestTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <ReceiptText className="h-10 w-10 text-muted" aria-hidden="true" />
              <h3 className="mt-4 font-semibold">No transactions yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted">Capture a receipt or add a manual entry to start your ledger.</p>
              <Link to="/add" className="button-primary mt-5">Add first entry</Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {latestTransactions.map((tx) => (
                <button
                  type="button"
                  key={tx.id}
                  onClick={() => navigate(`/transaction/${tx.id}`)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-surface-muted sm:p-5"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-muted text-muted">
                      <CategoryIcon category={tx.category} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{tx.name}</span>
                      <span className="block truncate text-sm text-muted">{tx.category} - {tx.date} at {tx.time}</span>
                    </span>
                  </span>
                  <span className={`stat-number shrink-0 text-sm font-bold ${tx.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                    {formatSignedCurrency(tx.amount)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="card p-5">
          <p className="section-heading">This workspace</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Reconciled entries</span>
              <span className="font-bold">{transactionCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Pending review</span>
              <span className="font-bold">{inboxCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Data storage</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Local
              </span>
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-info-soft p-4">
            <p className="text-sm font-semibold text-foreground">What LedgerSnap is for</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              A fast daily cockpit for small teams that need receipt capture, review control, and simple cash-flow visibility without a heavy accounting suite.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Home;
