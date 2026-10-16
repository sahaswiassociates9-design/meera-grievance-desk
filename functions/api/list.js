import { json, mask } from './_lib.js';

export async function onRequestGet({ env }) {
  const cutoff = Date.now() - 30 * 86400000;
  const { results } = await env.DB.prepare(
    `SELECT id, ts, phase, block, flat, name, phone, category, priority, desc, status, closed_at, close_note
     FROM tickets WHERE status = 'open' OR (status = 'closed' AND closed_at > ?)
     ORDER BY ts DESC LIMIT 2000`
  ).bind(cutoff).all();
  return json(results.map(t => ({
    id: t.id, ts: t.ts, phase: t.phase, block: t.block, flat: t.flat, name: t.name,
    phoneMasked: mask(t.phone), category: t.category, priority: t.priority, desc: t.desc,
    status: t.status, closedAt: t.closed_at, closeNote: t.close_note
  })));
}
