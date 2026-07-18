<div align="center">

# Tanager Invoicing

**Invoicing and job management platform for small service businesses.**

Built with Next.js 16 &middot; TypeScript 5 &middot; PostgreSQL &middot; Prisma &middot; Tailwind CSS

[Live Demo](https://tanager-invoicing-topaz.vercel.app/)

</div>

---

## Overview

Tanager Invoicing is a multi-tenant web application that helps small service businesses manage their customers, jobs, invoices, and payments in one place. Each company's data is fully isolated, and the platform supports the complete job lifecycle from creation through invoicing and payment collection.

A public **demo mode** is available at `/demo` with read-only sample data — no account or database required.

## Features

- **Multi-tenant architecture** — complete data isolation per company
- **Customer management** — contacts, email, phone, and job history
- **Job tracking** — create and manage jobs with Open / In Progress / Closed status
- **Invoicing** — line-item invoices with Unpaid / In Progress / Paid workflow
- **Payments** — record payments against invoices with running balance calculation
- **PDF generation** — create and download professional invoice PDFs via pdf-lib
- **Email delivery** — send invoices and password resets through Resend, using each company as the sender with its email as the reply-to
- **Authentication** — credentials-based auth with JWT sessions and password reset via NextAuth.js
- **Search & filtering** — searchable lists with status tabs across jobs, invoices, and customers
- **Demo mode** — static fixture data at `/demo`, no login required

## Tech Stack

| Layer          | Technology                                                                            |
| -------------- | ------------------------------------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org/) (App Router)                                        |
| Language       | [TypeScript 5](https://www.typescriptlang.org/)                                       |
| Database       | [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)    |
| Authentication | [NextAuth.js v4](https://next-auth.js.org/) (credentials + JWT)                       |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com/)                                           |
| PDF Generation | [pdf-lib](https://pdf-lib.js.org/)                                                    |
| Email          | [Resend](https://resend.com/)                                                         |
| Testing        | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) |
| Deployment     | [Vercel](https://vercel.com/)                                                         |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22 or later
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

```bash
git clone https://github.com/matheuspina-dev/tanager-invoicing.git
cd tanager-invoicing
pnpm install
```

### Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable          | Required | Description                                                               |
| ----------------- | :------: | ------------------------------------------------------------------------- |
| `DATABASE_URL`    |   Yes    | PostgreSQL connection string                                              |
| `NEXTAUTH_SECRET` |   Yes    | Random secret for JWT signing (e.g. `openssl rand -base64 32`)           |
| `NEXTAUTH_URL`    |   Yes    | Application URL used for auth callbacks (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_URL` |   Yes    | Public-facing URL used for password reset links (usually same as above)  |
| `RESEND_API_KEY`  |    No    | Resend API key for sending invoice and password-reset emails              |
| `EMAIL_FROM`      |    No    | Default sender address for transactional emails                           |

Email features are optional; the app will run without them, but invoice and reset emails will fail until Resend is configured.

### Database Setup

Push the Prisma schema to your database and generate the client:

```bash
pnpm prisma db push
pnpm prisma generate
```

Optionally seed the database with sample data:

```bash
pnpm db:seed
```

### Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo

The demo is built in and renders static fixtures from [`lib/demo/seed.ts`](lib/demo/seed.ts) — no database or authentication is required.

1. Start the app: `pnpm dev`
2. Open [http://localhost:3000/demo](http://localhost:3000/demo)

The same fixtures are used by `pnpm db:seed` when seeding a local development database.

## Testing

```bash
pnpm test          # Run all tests once
pnpm test:watch    # Run tests in watch mode
pnpm test:ui       # Open the Vitest UI
```

## Project Structure

```
tanager-invoicing/
├── app/
│   ├── (auth)/                    # Authentication pages
│   │   ├── login/                 #   Sign in
│   │   ├── register/              #   Create account
│   │   ├── forgot-password/       #   Request password reset
│   │   └── reset-password/        #   Complete password reset
│   ├── (dashboard)/               # Protected application routes
│   │   ├── customers/             #   Customer management
│   │   ├── jobs/                  #   Job tracking
│   │   ├── invoices/              #   Invoice CRUD, PDF generation, and email
│   │   ├── payments/              #   Payment recording
│   │   ├── profile/               #   User profile
│   │   └── settings/              #   Company settings
│   ├── api/auth/[...nextauth]/    # NextAuth.js route handler
│   ├── components/                # Shared UI components (Sidebar, TopBar, etc.)
│   └── demo/                      # Public demo page (no auth)
├── lib/
│   ├── auth.ts                    # NextAuth.js configuration & helpers
│   ├── demo/                      # Static fixture data for demo and seed
│   ├── email.ts                   # Resend email client
│   ├── invoice-utils.ts           # Calculation and formatting helpers
│   ├── prisma.ts                  # Prisma client singleton
│   ├── server-action-utils.ts     # Shared server-action helpers
│   ├── types.ts                   # Shared TypeScript interfaces
│   └── validation.ts              # Input validation utilities
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed.ts                    # Development seed script
│   └── migrations/                # Prisma migrations
├── __tests__/                     # Unit and component tests
└── scripts/                       # One-off utility scripts
```

## Data Model

```
Company 1─┬─* User
          ├─* Customer 1──* Job
          ├─* Job 1──* Invoice 1──* Payment
          │                   └──* InvoiceItem
          ├─* Invoice
          └─* Payment
```

All monetary values are stored as **integers in cents** to avoid floating-point precision issues.

## Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Start the development server       |
| `pnpm build`      | Create a production build          |
| `pnpm start`      | Start the production server        |
| `pnpm lint`       | Run ESLint                         |
| `pnpm test`       | Run the test suite                 |
| `pnpm test:watch` | Run tests in watch mode            |
| `pnpm test:ui`    | Open Vitest UI                     |
| `pnpm db:seed`    | Seed the database with sample data |

## License

MIT
