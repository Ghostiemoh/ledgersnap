import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Filter, PlusCircle, ReceiptText, Search } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import { useLedger } from '../context/LedgerContext';
import { formatCurrency, formatSignedCurrency } from '../lib/formatters';

const filters = ['All', 'Income', 'Expenses'];

const Tracker = () => {
  const navigate = useNavigate();
  const { transactions, totalInflow, totalOutflow } = useLedger();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredTransactions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return transactions.filter((tx) => {
      const matchesQuery = !normalized || [tx.name, tx.category, tx.account].some((value) => value?.toLowerCase().includes(normalized));
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Income' && tx.amount > 0) ||
        (filter === 'Expenses' && tx.amount < 0);
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, transactions]);

  return (
    <div className="page-shell max-w-6xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-heading">Ledger</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Searchable transaction history.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Every approved receipt and manual entry appears here with category, account, and cash-flow direction.
          </p>
        </div>
        <Link to="/add" className="button-primary">
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          Add entry
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="card p-5">
          <p className="section-heading">Income</p>
          <p className="stat-number mt-2 text-3xl font-extrabold text-success">{formatCurrency(totalInflow)}</p>
        </article>
        <article className="card p-5">
          <p className="section-heading">Expenses</p>
          <p className="stat-number mt-2 text-3xl font-extrabold">{formatCurrency(totalOutflow)}</p>
        </article>
      </section>

      <section className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search ledger</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              className="input pl-10"
              type="search"
              autoComplete="off"
              placeholder="Search merchant, account, or category"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? 'button-primary whitespace-nowrap' : 'button-secondary whitespace-nowrap'}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
          <div>
            <p className="section-heading">Transactions</p>
            <h2 className="mt-1 text-lg font-bold">{filteredTransactions.length} entries shown</h2>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <ReceiptText className="h-10 w-10 text-muted" aria-hidden="true" />
            <h3 className="mt-4 font-semibold">No matching entries</h3>
            <p className="mt-1 max-w-sm text-sm text-muted">Try a different search, clear the filter, or add a new transaction.</p>
            <button type="button" className="button-secondary mt-5" onClick={() => { setQuery(''); setFilter('All'); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTransactions.map((tx) => (
              <button
                type="button"
                key={tx.id}
                onClick={() => navigate(`/transaction/${tx.id}`)}
                className="grid w-full gap-3 p-4 text-left hover:bg-surface-muted sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${tx.amount > 0 ? 'bg-success-soft text-success' : 'bg-surface-muted text-muted'}`}>
                    <CategoryIcon category={tx.category} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{tx.name}</span>
                    <span className="block truncate text-sm text-muted">{tx.category} - {tx.account || 'Ledger'} - {tx.date} at {tx.time}</span>
                  </span>
                </span>
                <span className={`stat-number text-left text-base font-extrabold sm:text-right ${tx.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                  {formatSignedCurrency(tx.amount)}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Tracker;
