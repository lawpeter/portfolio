-- Page-view telemetry table (PRD §6.3 groundwork).
-- Run once against the Neon Postgres database after provisioning it via the
-- Vercel marketplace integration, then set DATABASE_URL (see .env.example).

CREATE TABLE IF NOT EXISTS pageviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  path TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The later analytics display (§6.3) will query by time range.
CREATE INDEX IF NOT EXISTS pageviews_ts_idx ON pageviews (ts);
