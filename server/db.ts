import { neon } from "@neondatabase/serverless";
import { defaults, type ContentKey, type SiteContent } from "../lib/site-data.ts";

export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Chưa cấu hình Neon.");
  return neon(url, { fetchOptions: { signal: AbortSignal.timeout(10_000) } });
}

export async function initialize() {
  const db = sql();
  for (const statement of [
    db`CREATE TABLE IF NOT EXISTS vui_content (
      section text PRIMARY KEY, data jsonb NOT NULL, revision integer NOT NULL DEFAULT 1
    )`,
    db`CREATE TABLE IF NOT EXISTS vui_sessions (token_hash text PRIMARY KEY, expires_at timestamptz NOT NULL)`,
    db`CREATE TABLE IF NOT EXISTS vui_limits (key text PRIMARY KEY, started_at timestamptz NOT NULL, hits integer NOT NULL)`,
    db`CREATE TABLE IF NOT EXISTS vui_leads (
      id uuid PRIMARY KEY, name text NOT NULL, phone text NOT NULL, email text NOT NULL,
      company text NOT NULL, note text NOT NULL, products jsonb NOT NULL, quotes jsonb NOT NULL,
      status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
      owner_email text NOT NULL DEFAULT 'pending', customer_email text NOT NULL DEFAULT 'pending',
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
    db`ALTER TABLE vui_leads ADD COLUMN IF NOT EXISTS owner_email_id text, ADD COLUMN IF NOT EXISTS customer_email_id text`,
    db`CREATE INDEX IF NOT EXISTS vui_leads_created_at ON vui_leads (created_at DESC, id DESC)`
  ]) await statement;
  await db.transaction(Object.entries(defaults).map(([section, data]) =>
    db`INSERT INTO vui_content (section, data) VALUES (${section}, ${JSON.stringify(data)}::jsonb) ON CONFLICT DO NOTHING`
  ));
}

export async function readContent() {
  const data = structuredClone(defaults);
  const revisions = {} as Record<ContentKey, number>;
  if (!process.env.DATABASE_URL) return { data, revisions };
  const rows = await sql()`SELECT section, data, revision FROM vui_content`;
  for (const row of rows) {
    if (!Object.hasOwn(defaults, row.section)) continue;
    const section = row.section as ContentKey;
    Object.assign(data, { [section]: row.data as SiteContent[typeof section] });
    revisions[section] = row.revision;
  }
  return { data, revisions };
}
