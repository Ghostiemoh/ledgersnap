# LedgerSnap

LedgerSnap is a receipt-to-ledger workspace for Nigerian operators and small teams. It helps you capture receipt images, review extracted fields, approve clean transactions, search the ledger, understand cash flow, and export records as CSV.

## What It Does

- Capture receipt images and run in-browser OCR with Tesseract.js.
- Keep scans in a review inbox until they are corrected and approved.
- Add manual credit or debit entries when there is no receipt image.
- Search and filter reconciled transactions.
- View cash-in, cash-out, net position, expense mix, and top spending category.
- Export the full ledger as CSV and export individual transaction details as JSON.
- Store data locally in the browser so the app is usable without a backend.

## Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React
- Tesseract.js

## Quick Start

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run lint
npm run build
npm run preview
```

## Data Storage

LedgerSnap currently stores ledger data in browser local storage. This makes the app immediately usable and private on a single device, but clearing browser data removes the ledger. Use the CSV export before clearing a workspace.
