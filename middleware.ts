import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ token }) => {
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/customers/:path*",
    "/jobs/:path*",
    "/invoices/:path*",
    "/payments/:path*",
    "/dashboard/:path*",
  ],
};
