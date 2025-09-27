import { clerkMiddleware } from "@clerk/nextjs/server";

// Keep it minimal so Clerk can always detect it
export default clerkMiddleware();

export const config = {
  matcher: [
    // All paths except static files and _next
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
