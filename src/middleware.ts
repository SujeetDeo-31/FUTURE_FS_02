export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/leads",
    "/leads/:path*",
    "/reports",
    "/reports/:path*",
    "/settings",
    "/settings/:path*",
  ],
};
