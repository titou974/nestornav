import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/patron/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/employees/:path*",
    "/history/:path*",
    "/anomalies/:path*",
  ],
};
