import "./globals.css";
import DashboardShell from "./components/DashboardShell";

export const metadata = {
  title: "Tanager Invoicing",
  description: "Manage Jobs, Customers, Invoices, and Payments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
