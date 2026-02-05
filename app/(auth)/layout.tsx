import "@/app/globals.css";

export const metadata = {
  title: "Tanager Invoicing",
  description: "Login or Register",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex items-center justify-center min-h-screen">
        {children}
      </body>
    </html>
  );
}
