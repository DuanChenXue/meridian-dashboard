# Meridian — B2B SaaS Revenue Analytics Dashboard

A production-style analytics dashboard built as a portfolio demo: **Next.js App Router · TypeScript · Tailwind CSS · shadcn/ui · Recharts**.

Not a static mockup — the dashboard exercises a real data layer with mock Route Handlers, server-rendered initial data, client-side interactivity, and every important UI state (loading / empty / error) wired end to end.

---

## Highlights

| Area | What's implemented |
| --- | --- |
| **Architecture** | Server Component fetches initial data from mock Route Handlers; all interactive views are Client Components |
| **Data layer** | `GET /api/metrics`, `GET /api/trend`, `GET /api/subscriptions` — deterministic mock data, no external services |
| **UI states** | Loading skeletons, empty states, and error panels with retry — toggled live from the UI or via URL |
| **Charts** | MRR trend: stacked new/expansion/churned bars + total MRR line (Recharts + shadcn chart) |
| **KPI cards** | MRR, ARR, active subscriptions, net revenue retention — with deltas and sparklines |
| **Table** | Search, plan/status filters, column sorting, pagination, CSV export, status & health badges |
| **UX** | Date-range selector (7d / 30d / 12m), light/dark theme, responsive layout, accessible markup |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Demo states (the point of this demo)

The **API State Simulator** bar under the top bar switches the whole dashboard between:

- **Live** — normal data
- **Loading** — endpoints respond after a simulated 1.6 s latency → skeletons
- **Empty** — endpoints return empty payloads → empty states
- **Error** — endpoints return `503` → error panels with retry

You can also deep-link a state (great for sharing):

```
https://your-deployment.vercel.app/?scenario=error
https://your-deployment.vercel.app/?scenario=empty&range=30d
```

Valid values: `scenario=live|loading|empty|error`, `range=7d|30d|12m`.

## Deploy to Vercel

No environment variables or external services are required.

### Option A — GitHub + Vercel dashboard (recommended)

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

1. Go to https://vercel.com/new
2. Import the repository — Vercel auto-detects Next.js
3. Click **Deploy** (all defaults work)
4. Share the generated `*.vercel.app` URL

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── metrics/route.ts        # KPI cards endpoint
│   │   ├── trend/route.ts          # chart series endpoint
│   │   └── subscriptions/route.ts  # table data endpoint
│   ├── layout.tsx                  # fonts, theme provider, toaster
│   ├── page.tsx                    # Server Component: fetches initial data
│   ├── error.tsx                   # route-level error boundary
│   └── icon.svg
├── components/
│   ├── app-sidebar.tsx             # navigation + user card
│   ├── app-topbar.tsx              # search, range selector, refresh, theme
│   ├── theme-provider.tsx          # next-themes wrapper
│   ├── theme-toggle.tsx            # light/dark switch
│   ├── dashboard/
│   │   ├── dashboard-shell.tsx     # Client orchestrator: state + layout
│   │   ├── demo-controls.tsx       # API state simulator (live/loading/empty/error)
│   │   ├── metric-cards.tsx        # KPI grid + loading/empty/error
│   │   ├── metric-card.tsx         # single KPI card + sparkline
│   │   ├── trend-chart.tsx         # Recharts composed MRR chart
│   │   ├── subscriptions-table.tsx # filterable/sortable/paginated table + CSV
│   │   └── states.tsx              # shared empty/error panels
│   └── ui/                         # shadcn/ui primitives
└── lib/
    ├── data.ts                     # deterministic mock dataset
    ├── api.ts                      # client fetch helpers (+ DashboardData/Errors)
    ├── types.ts                    # shared types + validators
    ├── format.ts                   # currency/number/date formatters
    └── utils.ts                    # cn() helper
```

## Notes

- All data is fictional and generated deterministically (seeded), so the demo is stable across reloads and deployments.
- `Health`, `MRR`, and status values in the table are correlated, so filters and sorting behave like a real dataset.
