# LedgerSnap

**Receipt capture, review, and cash-flow tracking for small business operators.**

LedgerSnap turns receipts and manual transactions into a clean local ledger. It is built for Nigerian operators and small teams who need a fast way to capture records, review extracted details, track money in and out, and export ledger data without setting up a heavy accounting system.

[Live App](https://ledgersnap-one.vercel.app) · [Repository](https://github.com/Ghostiemoh/ledgersnap)

## Overview

LedgerSnap is designed around a simple accounting workflow:

1. Capture a receipt image or add a manual transaction.
2. Review extracted receipt details before they affect the ledger.
3. Approve clean records into the transaction history.
4. Search, filter, inspect, and export reconciled entries.
5. Use insights to understand income, expenses, net position, and category mix.

Fresh workspaces start at zero records. No sample transactions are shipped into the ledger.

## Features

- **Receipt capture:** Upload receipt images and run in-browser OCR with Tesseract.js.
- **Review inbox:** Keep scanned entries out of the ledger until they are corrected and approved.
- **Manual entries:** Add credit or debit transactions when there is no receipt image.
- **Searchable ledger:** Search and filter transactions by merchant, account, category, or direction.
- **Cash-flow dashboard:** See net position, cash in, cash out, review queue, and recent activity.
- **Insights:** Track expense mix, top spending category, income, expenses, burn rate, and net position.
- **Exports:** Download the full ledger as CSV or export an individual transaction as JSON.
- **Local-first storage:** Store data in browser local storage for immediate use without a backend.
- **Zero-state migration:** Older browser sessions with legacy bundled sample rows are cleaned while preserving user-created entries.
- **Responsive UI:** Works across mobile, tablet, and desktop layouts.

## Live Link

Production deployment:

```text
https://ledgersnap-one.vercel.app
```

## Tech Stack

- **Framework:** React 19
- **Build tool:** Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **OCR:** Tesseract.js
- **Storage:** Browser local storage
- **Deployment:** Vercel

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Ghostiemoh/ledgersnap.git
cd ledgersnap
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Quality Checks

Before shipping changes, run:

```bash
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Data Model

LedgerSnap stores two primary record groups:

- **Inbox entries:** scanned or uploaded receipt data waiting for review.
- **Ledger transactions:** approved records that count toward balances and insights.

Each transaction includes:

- Merchant or payer name
- Amount
- Direction: credit or debit
- Category
- Account/source
- Date and time
- Reconciliation status

## Storage and Privacy

LedgerSnap currently stores data in the browser's local storage. This makes the app immediately usable and private on a single device, but it also means clearing browser data removes the ledger.

Export the CSV before clearing a workspace or switching devices.

## Product Notes

LedgerSnap is intentionally local-first in this version. It is ready to use as a single-device ledger workspace, with a clear path for future backend features such as authentication, cloud sync, team workspaces, and bank integrations.

## Deployment

The app is deployed on Vercel. Any production deployment should use:

```bash
npm run build
```

Build output is generated in:

```text
dist/
```

## License

Private project. All rights reserved unless a license is added.
