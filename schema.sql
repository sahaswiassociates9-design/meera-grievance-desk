CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  ts INTEGER NOT NULL,
  phase TEXT NOT NULL,
  block TEXT NOT NULL,
  flat TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  desc TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  closed_at INTEGER,
  close_note TEXT
);
CREATE INDEX IF NOT EXISTS idx_tickets_phone_ts ON tickets(phone, ts);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
