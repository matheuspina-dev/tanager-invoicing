Tanager Invoicing 🚀

Professional Service & Invoicing Management Platform
Tanager Invoicing is a robust, multi-tenant web application designed for small to medium-sized service businesses. It streamlines the entire workflow from customer acquisition and job tracking to professional PDF invoicing and payment recording.

✨ Key Features
🏢 Multi-Tenant Infrastructure
Company Isolation: Strict data partitioning ensures that users only ever see data belonging to their specific company.

Role-Based Access: Built-in support for Owners (full company control) and Employees (operational access).

Invite System: Owners generate unique 6-character Company Codes to securely onboard their team members.

📋 Operational Management
Job Tracking: Manage the lifecycle of service requests with status stages (Open, In Progress, Closed).

CRM (Customer Management): Centralized database for customer contact details and service history.

Payment Tracking: Record partial or full payments against invoices with support for various methods (Cash, Card, etc.).

📄 Dynamic PDF Invoicing
Professional Templates: Automatically generates clean, professional PDF invoices using pdf-lib.

Dynamic Layouts: Intelligent text-wrapping for long job descriptions to prevent layout overlap.

Auto-Calculations: Real-time balance and status updates (Unpaid, In Progress, Paid) based on recorded payments.

Company Branding: Invoices automatically pull your company's address, phone, and logo details from your settings.

🔒 Security & Auth
Secure Authentication: Powered by NextAuth.js with JWT strategy.

Password Protection: Industry-standard hashing via bcrypt.

Password Reset: Complete "Forgot Password" flow with secure email tokens.

🛠️ Tech Stack
Framework: Next.js 16.1 (App Router)

Language: TypeScript

Database: PostgreSQL (via Prisma ORM)

Package Manager: pnpm

Authentication: NextAuth.js

Styling: Tailwind CSS

PDF Generation: pdf-lib

Icons: Lucide React

🚀 Getting Started

1. Prerequisites
   Node.js: 22.16.0 or higher

   pnpm: npm install -g pnpm

   PostgreSQL: A running instance (local or hosted)

2. Installation

   # Clone the repository

   git clone https://github.com/matheuspina-dev/tanager-invoicing.git

   # Install dependencies

   pnpm install

   # Set up environment variables

   cp .env.example .env

3. Environment Variables
   Configure your .env file:

   DATABASE_URL="postgresql://user:password@localhost:5432/serviceflow"
   NEXTAUTH_SECRET="your-random-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_URL="http://localhost:3000"

   # Email Settings (SMTP)

   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="user@example.com"
   EMAIL_SERVER_PASSWORD="password"
   EMAIL_FROM="user@example.com"

4. Database Setup

   # Sync schema and generate Prisma client

   pnpm prisma db push
   pnpm prisma generate

5. Run the App
   pnpm dev

📐 Application Architecture
The application is architected around a Multi-Tenant Server Actions pattern. Every query is scoped via a companyId retrieved from the secure JWT session.

Shared Database: All companies live in one database.

Row-Level Filtering: Middleware and helper functions (requireCompanyId) ensure that where: { companyId } is applied to every single Prisma call.

Server Components: Fetches data directly on the server for maximum performance and SEO.

📝 License
Distributed under the MIT License.
