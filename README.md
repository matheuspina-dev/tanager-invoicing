<div align="center">
  <img src="https://placehold.co/120x120/2563eb/white?text=TI" alt="Tanager Invoicing Logo" width="120" height="120" style="border-radius: 20px" />

# Tanager Invoicing 🚀

**Professional Multi-Tenant Service & Invoicing Management Platform**

  <p>
    An all-in-one solution for service businesses to manage jobs, track customers, <br/> 
    and generate professional PDF invoices with automated payment tracking.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" />
    <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?style=flat-square&logo=postgresql" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma" />
    <img src="https://img.shields.io/badge/Node.js-22.16.0-339933?style=flat-square&logo=nodedotjs" />
    <img src="https://img.shields.io/badge/pnpm-9.x-F69220?style=flat-square&logo=pnpm" />
  </p>

<a href="#-key-features">Key Features</a> •
<a href="#-getting-started">Getting Started</a> •
<a href="#-architecture">Architecture</a> •
<a href="#-license">License</a>

</div>

<br />

## 📸 Overview

|                                              **Dashboard View**                                               |                                        **Professional PDF Invoice**                                        |
| :-----------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
| <img src="https://placehold.co/600x400/f8fafc/64748b?text=Dashboard+UI+Preview" alt="Dashboard" width="100%"> | <img src="https://placehold.co/600x400/ffffff/0f172a?text=Dynamic+PDF+Preview" alt="Invoice" width="100%"> |

---

## ✨ Key Features

### 🏢 Enterprise-Grade Multi-Tenancy

- **Strict Data Isolation:** Built-in security helpers ensure users only ever access data belonging to their specific `companyId`.
- **Role Hierarchy:** Specialized access for **Owners** (Company management) and **Employees** (Daily operations).
- **Secure Onboarding:** Unique 6-character **Invite Codes** for secure employee registration.

### 📋 Service Operations

- **Job Lifecycle:** Track projects from **Open** to **Closed** with a unified status system.
- **Dynamic CRM:** Centralized customer database with contact details and full service history.
- **Payment Engine:** Record full or partial payments across various methods (Cash, Card, etc.).

### 📄 Professional Invoicing

- **PDF Generation:** High-quality, branded invoices generated on-the-fly using `pdf-lib`.
- **Smart Wrapping:** Intelligent text-handling for long job descriptions to prevent layout breakage.
- **Auto-Balancing:** Automatic calculation of "Total Paid" and "Balance Due" based on payment history.
- **Custom Branding:** Dynamic company header featuring your business address, phone, and email.

### 🔒 Security & Auth

- **NextAuth.js Integration:** Secure session management via JWT.
- **Password Protection:** Industry-standard hashing using `bcrypt`.
- **Account Recovery:** Full "Forgot Password" flow with secure, time-limited email tokens.

---

## 🛠️ Tech Stack

| Component           | Technology                |
| :------------------ | :------------------------ |
| **Framework**       | Next.js 16.1 (App Router) |
| **Runtime**         | Node.js 22.16.0           |
| **Package Manager** | pnpm                      |
| **Database**        | PostgreSQL                |
| **ORM**             | Prisma                    |
| **Auth**            | NextAuth.js               |
| **Styling**         | Tailwind CSS              |
| **PDF Engine**      | pdf-lib                   |
| **Icons**           | Lucide React              |

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js:** v22.16.0 or higher
- **pnpm:** `npm install -g pnpm`
- **PostgreSQL:** Local instance or hosted (e.g., Neon, Supabase)

### 2. Installation

```bash
# Clone the repository
git clone [https://github.com/matheuspina-dev/tanager-invoicing.git](https://github.com/matheuspina-dev/tanager-invoicing.git)

# Navigate to project
cd tanager-invoicing

# Install dependencies
pnpm install
```

### 3. Environment Configuration

```bash
#Create a .env file in the root directory
cp .env.example .env
```

<details> <summary><b>Click to see required .env variables</b></summary>
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/tanager_db"

# NextAuth Configuration

NEXTAUTH_SECRET="your-generated-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_URL="http://localhost:3000"

# SMTP (Email) Settings

EMAIL_SERVER_HOST="smtp.your-provider.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-smtp-password"
EMAIL_FROM="billing@your-company.com"

</details>

### 4. Database Initialization

```bash
# Sync database schema
pnpm prisma db push

# Generate Prisma client
pnpm prisma generate
```

### 5. Launch

```bash
pnpm dev
```

<p>Open http://localhost:3000 to view the application.</p>
