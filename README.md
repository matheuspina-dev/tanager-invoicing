# Tanager Invoicing

Invoice and job management for small service businesses. Built with Next.js 16 App Router, TypeScript, Prisma, and Tailwind CSS.

Live demo: [tanager-invoicing.vercel.app](https://tanager-invoicing.vercel.app) — visit `/demo` for a read-only view without signing in.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js (credentials + JWT) |
| Styling | Tailwind CSS v4 |
| PDF | pdf-lib |
| Tests | Vitest + React Testing Library |
| Deploy | Vercel |

---

## Features

- Multi-tenant: each company sees only its own data
- Job lifecycle tracking (Open / Closed)
- Customer CRM with contact history
- Invoice creation with line items and status tracking (Unpaid / In Progress / Paid)
- Payment recording with running balance
- PDF invoice generation and email delivery
- Demo mode at `/demo` — static fixture data, no login required

---

## Run locally

**Prerequisites:** Node.js 22+, pnpm, PostgreSQL

```bash
git clone https://github.com/matheuspina-dev/tanager-invoicing.git
cd tanager-invoicing
pnpm install
```

Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/tanager_db
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_URL=http://localhost:3000

# Optional — email delivery
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=
```

Push the schema and generate the Prisma client:

```bash
pnpm prisma db push
pnpm prisma generate
```

Seed demo data (optional):

```bash
pnpm db:seed
```

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tests

```bash
pnpm test
```

Runs Vitest in CI mode. Tests cover:

- `lib/invoice-utils` — calculateTotal, formatCurrency, getStatusColor, getStatusLabel, calculateBalanceDue
- `InvoiceStatusBadge` — color class and label per status
- `StatusTabs` — tab rendering, active state, router integration
- `SearchInput` — controlled input, router integration
- `lib/demo/seed` — fixture shape and data integrity
- `InvoiceRow` — render, edit toggle, cancel reset

---

## Project structure

```
app/
  (auth)/         login, register, password reset
  (dashboard)/    protected routes: invoices, jobs, customers, payments, settings
  components/     shared UI: Sidebar, TopBar, InvoiceTable, InvoiceStatusBadge, EmptyState
  demo/           read-only demo page (no auth required)
lib/
  types.ts        shared domain interfaces
  invoice-utils.ts  pure calculation and formatting helpers
  demo/           seeded fixture data
prisma/
  schema.prisma   database schema
  seed.ts         development seed script
__tests__/        all test files
```

---

## License

MIT
