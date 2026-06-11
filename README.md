# ABS Inventory — Next.js

Real-estate inventory dashboard powered by Google Sheets CSV export.

## Fixes vs old version

| Bug | Old behaviour | Fixed |
|-----|--------------|-------|
| CORS `fetchSheet` | Direct fetch silently failed; proxy branch unreachable | Always uses proxy chain (allorigins → corsproxy.io) |
| `addProject` lost on refresh | Projects stored only in memory | Persisted to **localStorage** — survive refresh |
| `parseCSV` CRLF | Trailing `\r` on last column corrupted status matching | CRLF normalised before split; RFC-4180 quoted-field support |

## Local dev

```bash
npm install
npm run dev          # http://localhost:3000
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or: push to GitHub → import in vercel.com → auto-deploys.

## Google Sheet format

| Column | Content |
|--------|---------|
| A | Floor (e.g. GF, 1ST, 2ND) |
| B | Unit No |
| C | Category (e.g. Shop, Office) |
| D | Area (e.g. 450 sqft) |
| E | Status (Available / Sold / Booked / Not for Sale) |

First row = header (skipped). Sheet must be **publicly shared** and URL must be the CSV export link:
```
https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv&gid=0
```
