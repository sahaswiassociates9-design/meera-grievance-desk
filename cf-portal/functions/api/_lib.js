export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export const MAX_PER_PHONE_PER_DAY = 5;

export function mask(phone) {
  const p = String(phone || '');
  return p.length === 10 ? p.slice(0, 2) + 'XXXXXX' + p.slice(8) : '';
}

export function mintId() {
  const d = new Date();
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const buf = new Uint8Array(4);
  crypto.getRandomValues(buf);
  const r = Array.from(buf, b => alphabet[b % alphabet.length]).join('');
  return `GRV-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}-${r}`;
}

export const clean = (v, max) => String(v ?? '').trim().slice(0, max);
export const validPhone = p => /^[6-9]\d{9}$/.test(p);
