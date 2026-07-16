<div align="center">

# Tanager Invoicing

**Invoicing and job management platform for small service businesses.**

Built with Next.js 16 &middot; TypeScript &middot; PostgreSQL &middot; Prisma &middot; Tailwind CSS

[Live Demo](https://tanager-invoicing.vercel.app) &nbsp;&bull;&nbsp; [Try the Demo](https://tanager-invoicing.vercel.app/demo)

</div>

---

## Overview

Tanager Invoicing is a multi-tenant web application that helps small service businesses manage their customers, jobs, invoices, and payments in one place. Each company's data is fully isolated, and the platform supports the complete job lifecycle from creation through invoicing and payment collection.

A public **demo mode** is available at `/demo` with read-only sample data — no account required.

## Features

- **Multi-tenant architecture** — complete data isolation per company
- **Customer management** — contacts, email, phone, and job history
- **Job tracking** — create and manage jobs with Open / Closed status
- **Invoicing** — line-item invoices with Unpaid / In Progress / Paid workflow
- **Payments** — record payments against invoices with running balance calculation
- **PDF generation** — create and download professional invoice PDFs via pdf-lib
- **Email delivery** — send invoices directly to customers through Resend
- **Authentication** — credentials-based auth with JWT sessions via NextAuth.js
- **Demo mode** — static fixture data at `/demo`, no login required

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/) |
| Authentication | [NextAuth.js](https://next-auth.js.org/) (credentials + JWT) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| PDF Generation | [pdf-lib](https://pdf-lib.js.org/) |
| Email | [Resend](https://resend.com/) |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) |
| Deployment | [Vercel](https://vercel.com/) |

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

| Variable | Required | Description |
| --- | :---: | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing |
| `NEXTAUTH_URL` | Yes | Application URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_URL` | Yes | Public-facing URL |
| `RESEND_API_KEY` | No | [Resend](https://resend.com) API key for sending email (password resets and invoices) |
| `EMAIL_FROM` | No | Default/platform sender, e.g. `Tanager <noreply@yourdomain.com>` (must be on a domain verified in Resend) |

Email is sent via Resend. Password-reset emails come from `EMAIL_FROM`; invoice emails
are sent with the company's name as the `From` (on the `EMAIL_FROM` domain) and the
company's own email as `Reply-To`.

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
│   ├── (auth)/              # Authentication pages
│   │   ├── login/           #   Sign in
│   │   ├── register/        #   Create account
│   │   ├── forgot-password/ #   Request password reset
│   │   └── reset-password/  #   Complete password reset
│   ├── (dashboard)/         # Protected application routes
│   │   ├── customers/       #   Customer management
│   │   ├── jobs/            #   Job tracking
│   │   ├── invoices/        #   Invoice CRUD and PDF generation
│   │   ├── payments/        #   Payment recording
│   │   ├── profile/         #   User profile
│   │   └── settings/        #   Company settings
│   ├── components/          # Shared UI components
│   │   ├── Sidebar.tsx      #   Navigation sidebar
│   │   ├── TopBar.tsx       #   Top navigation bar
│   │   ├── InvoiceTable.tsx #   Invoice listing table
│   │   ├── StatusTabs.tsx   #   Filterable status tabs
│   │   ├── SearchInput.tsx  #   Search with URL sync
│   │   └── ...
│   └── demo/                # Public demo page (no auth)
├── lib/
│   ├── types.ts             # Shared TypeScript interfaces
│   ├── invoice-utils.ts     # Calculation and formatting helpers
│   └── demo/                # Static fixture data for demo mode
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Development seed script
└── __tests__/               # Unit and component tests
```

## Data Model

```
Company 1─┬─* User
          ├─* Customer 1──* Job 1──* Invoice 1──* Payment
          │                                  └──* InvoiceItem
          ├─* Job
          ├─* Invoice
          └─* Payment
```

All monetary values are stored as **integers in cents** to avoid floating-point precision issues.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the test suite |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:ui` | Open Vitest UI |
| `pnpm db:seed` | Seed the database with sample data |

## License

[MIT](LICENSE)
