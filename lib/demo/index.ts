/**
 * Demo mode exports.
 *
 * Set NEXT_PUBLIC_DEMO_MODE=true in your environment to enable the demo
 * landing page at /demo. This does not affect the authenticated dashboard,
 * which always reads from the database.
 */

export { DEMO_INVOICES, DEMO_CUSTOMERS, DEMO_COMPANY, DEMO_JOBS } from "./seed";

/**
 * Returns true when NEXT_PUBLIC_DEMO_MODE is set to "true".
 * Safe to call on both client and server.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
