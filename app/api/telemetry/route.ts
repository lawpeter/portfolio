import { neon } from "@neondatabase/serverless";

/*
 * Silent page-view logger (§6.3) — the display ships in a later phase; this
 * exists from Phase 0 so real history has accumulated by then.
 *
 * Deliberately silent in every failure mode: no DATABASE_URL (not yet
 * provisioned), bad payload, or DB error all return 204 — analytics must
 * never break or slow the site. Table schema: docs/telemetry.sql.
 */
export async function POST(request: Request): Promise<Response> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return new Response(null, { status: 204 });

  try {
    const body: unknown = await request.json();
    const path =
      typeof body === "object" && body !== null && "path" in body
        ? (body as { path: unknown }).path
        : undefined;
    if (typeof path !== "string" || path.length === 0 || path.length > 512) {
      return new Response(null, { status: 204 });
    }
    const sql = neon(databaseUrl);
    await sql`INSERT INTO pageviews (path) VALUES (${path})`;
  } catch {
    // silent by design
  }
  return new Response(null, { status: 204 });
}
