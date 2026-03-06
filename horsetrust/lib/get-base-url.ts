/**
 * Returns the correct base URL depending on the runtime environment.
 *
 * - Server-side (SSR / Server Components / Route Handlers):
 *   Uses INTERNAL_BASE_URL (e.g. http://app:3000) to communicate
 *   directly with the Next.js container inside the Docker network,
 *   avoiding an unnecessary round-trip through Nginx and the public IP.
 *
 * - Client-side (browser):
 *   Uses NEXT_PUBLIC_BASE_URL (e.g. http://100.53.34.176) which is
 *   the public-facing address the browser can actually reach.
 */
export function getBaseUrl(): string {
  if (typeof window === "undefined") {
    // Server-side: prefer the internal Docker network address
    const internal = process.env.INTERNAL_BASE_URL;
    if (internal) return internal;

    // Fallback to public URL if INTERNAL_BASE_URL is not set
    const pub = process.env.NEXT_PUBLIC_BASE_URL;
    if (pub) return pub;

    // Last resort for local development
    return "http://localhost:3000";
  }

  // Client-side: use the public URL embedded at build time
  const pub = process.env.NEXT_PUBLIC_BASE_URL;
  if (pub) return pub;

  // Fallback: derive from the current browser origin
  return window.location.origin;
}
