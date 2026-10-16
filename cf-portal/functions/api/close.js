import { json, clean } from './_lib.js';

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: 'Bad request.' }, 400); }
  const id = clean(d.id, 20).toUpperCase();
  const phone = String(d.phone || '').replace(/\D/g, '');
  const note = clean(d.note, 300);
  const t = await env.DB.prepare('SELECT id, phone, status FROM tickets WHERE id = ?').bind(id).first();
  if (!t) return json({ ok: false, error: `No ticket ${id} found.` }, 404);
  if (t.phone !== phone) return json({ ok: false, error: 'That mobile number does not match the one this ticket was logged with.' }, 403);
  if (t.status === 'closed') return json({ ok: false, error: 'This ticket is already closed.' }, 409);
  await env.DB.prepare('UPDATE tickets SET status = ?, closed_at = ?, close_note = ? WHERE id = ?').bind('closed', Date.now(), note, id).run();
  return json({ ok: true });
}
