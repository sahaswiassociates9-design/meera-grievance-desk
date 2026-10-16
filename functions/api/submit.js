import { json, mintId, clean, validPhone, MAX_PER_PHONE_PER_DAY } from './_lib.js';

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: 'Bad request.' }, 400); }
  const phone = String(d.phone || '').replace(/\D/g, '');
  if (!validPhone(phone)) return json({ ok: false, error: 'Enter a valid 10-digit Indian mobile number.' }, 400);
  const t = {
    phase: clean(d.phase, 40), block: clean(d.block, 20), flat: clean(d.flat, 20), name: clean(d.name, 80),
    category: clean(d.category, 60), priority: d.priority === 'urgent' ? 'urgent' : 'normal', desc: clean(d.desc, 2000)
  };
  if (!t.phase || !t.block || !t.flat || !t.name || !t.category || !t.desc) return json({ ok: false, error: 'Every field is required.' }, 400);

  const since = Date.now() - 86400000;
  const { cnt } = await env.DB.prepare('SELECT COUNT(*) AS cnt FROM tickets WHERE phone = ? AND ts > ?').bind(phone, since).first();
  if (cnt >= MAX_PER_PHONE_PER_DAY) return json({ ok: false, error: `This number has already logged ${MAX_PER_PHONE_PER_DAY} tickets today. Try again tomorrow.` }, 429);

  for (let attempt = 0; attempt < 3; attempt++) {
    const id = mintId();
    try {
      await env.DB.prepare(
        'INSERT INTO tickets (id, ts, phase, block, flat, name, phone, category, priority, desc, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
      ).bind(id, Date.now(), t.phase, t.block, t.flat, t.name, phone, t.category, t.priority, t.desc, 'open').run();
      return json({ ok: true, id });
    } catch (e) {
      if (!/UNIQUE|PRIMARY KEY/i.test(String(e))) throw e;
    }
  }
  return json({ ok: false, error: 'Could not log the issue. Try again.' }, 500);
}
