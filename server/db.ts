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
  const revisions = Object.fromEntries(Object.keys(defaults).map(key=>[key,0])) as Record<ContentKey,number>;
  if (!process.env.DATABASE_URL) return { data, revisions };
  const rows = await sql()`SELECT section, data, revision FROM vui_content`;
  for (const row of rows) {
    if (!Object.hasOwn(defaults, row.section)) continue;
    const section = row.section as ContentKey;
    if (section === "contact") {
      const { zalo: _oldZalo, ...contact } = row.data;
      data.contact = { ...defaults.contact, ...contact };
    } else {
      Object.assign(data, { [section]: row.data as SiteContent[typeof section] });
    }
    revisions[section] = row.revision;
  }
  for (const [page, sections] of Object.entries(defaults.pageContent)) {
    for (const [section, fields] of Object.entries(sections)) {
      data.pageContent[page] ??= {};
      data.pageContent[page][section] = {...fields,...data.pageContent[page][section]};
    }
  }
  const { home, shared } = data.pageContent;
  const chat = home.general;
  // Older copies saved in Neon already include the Zalo wording.
  chat["text-23"] = chat["text-23"].replace(/\bZalo\b/g, "Tammi");
  chat["text-25"] = chat["text-25"].trim() === "2. Mở Chat Zalo với số"
    ? defaults.pageContent.home.general["text-25"] : chat["text-25"].replace(/\bZalo\b/g, "Tammi");
  chat["text-27"] = chat["text-27"].replace(/\bZalo\b/g, "Tammi");
  home.home["text-6"] = home.home["text-6"].replace(/\bZalo\b/g, "Tammi");
  shared.general["text-1"] = shared.general["text-1"].replace(/\bZalo\b/g, "Tammi");
  return { data, revisions };
}
