import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import { useLedger } from '../context/LedgerContext';
import { formatCurrency, getPercent } from '../lib/formatters';

const Insights = () => {
  const { transactions, totalInflow, totalOutflow } = useLedger();

  const categoryRows = useMemo(() => {
    const totals = transactions.reduce((acc, tx) => {
      if (tx.amount < 0) {
        acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      }
      return acc;
    }, {});

    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount, percent: getPercent(amount, totalOutflow) }))
      .sort((a, b) => b.amount - a.amount);
  }, [totalOutflow, transactions]);

  const hasEntries = transactions.length > 0;
  const net = totalInflow - totalOutflow;
  const burnRate = totalInflow ? Math.round((totalOutflow / totalInflow) * 100) : 0;
  const topCategory = categoryRows[0];

  return (
    <div className="page-shell max-w-6xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-heading">Insights</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Cash-flow signals you can act on.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            LedgerSnap turns approved entries into a quick read on income, expenses, and spending concentration.
          </p>
        </div>
        <Link to="/tracker" className="button-secondary">
          Open ledger
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="card bg-surface-strong p-6 text-white dark:text-background">
          <p className="section-heading text-white/65 dark:text-background/70">Liquidity read</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight">
            {!hasEntries
              ? 'Start with one receipt or manual entry to unlock cash-flow insights.'
              : net >= 0
                ? 'Cash is ahead of spending for the current ledger.'
                : 'Expenses are running ahead of income.'}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-sm text-white/65 dark:text-background/70">Net</p>
              <p className="stat-number mt-2 text-2xl font-extrabold">{formatCurrency(net)}</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-sm text-white/65 dark:text-background/70">Burn rate</p>
              <p className="stat-number mt-2 text-2xl font-extrabold">{burnRate}%</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-sm text-white/65 dark:text-background/70">Entries</p>
              <p className="stat-number mt-2 text-2xl font-extrabold">{transactions.length}</p>
            </div>
          </div>
        </article>

        <article className="card p-6">
          <p className="section-heading">Top expense</p>
          {topCategory ? (
            <div className="mt-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-surface-muted text-muted">
                <CategoryIcon category={topCategory.category} className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold">{topCategory.category}</h2>
              <p className="stat-number mt-2 text-xl font-bold">{formatCurrency(topCategory.amount)}</p>
              <p className="mt-2 text-sm text-muted">{topCategory.percent}% of all expenses.</p>
            </div>
          ) : (
            <div className="mt-5 rounded-lg bg-surface-muted p-4">
              <p className="font-semibold">No expenses yet</p>
              <p className="mt-1 text-sm text-muted">Approve expense receipts to see category concentration.</p>
            </div>
          )}
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-heading">Income</p>
              <p className="stat-number mt-2 text-3xl font-extrabold text-success">{formatCurrency(totalInflow)}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-success-soft text-success">
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </article>
        <article className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-heading">Expenses</p>
              <p className="stat-number mt-2 text-3xl font-extrabold">{formatCurrency(totalOutflow)}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-danger-soft text-danger">
              <TrendingDown className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </article>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-heading">Expense mix</p>
            <h2 className="mt-1 text-xl font-bold">Where money is leaving</h2>
          </div>
          <BarChart3 className="h-5 w-5 text-muted" aria-hidden="true" />
        </div>

        {categoryRows.length === 0 ? (
          <div className="mt-6 rounded-lg bg-surface-muted p-6 text-center">
            <p className="font-semibold">No category data yet</p>
            <p className="mt-1 text-sm text-muted">Expense categories will appear after you approve receipt scans.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {categoryRows.map((row) => (
              <div key={row.category}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="flex min-w-0 items-center gap-2 font-semibold">
                    <CategoryIcon category={row.category} />
                    {row.category}
                  </span>
                  <span className="stat-number text-muted">{formatCurrency(row.amount)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${row.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Insights;
