const te = new TextEncoder();

function base64urlEncode(buf) {
  let b = '';
  const a = new Uint8Array(buf);
  for (let i = 0; i < a.byteLength; i++) b += String.fromCharCode(a[i]);
  return btoa(b).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlFromString(str) {
  return base64urlEncode(te.encode(str));
}

async function importKey(secret) {
  return crypto.subtle.importKey("raw", te.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signJWT(payload, secret, exp = 60 * 60 * 24 * 7) {
  const h = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const data = { ...payload, iat: now, exp: now + exp };
  const eh = base64urlFromString(JSON.stringify(h));
  const ep = base64urlFromString(JSON.stringify(data));
  const toSign = `${eh}.${ep}`;
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, te.encode(toSign));
  const es = base64urlEncode(sig);
  return `${toSign}.${es}`;
}

export async function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [eh, ep, es] = parts;
  const tv = `${eh}.${ep}`;
  const b64 = es.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
  const sigBytes = Uint8Array.from(atob(b64 + pad), c => c.charCodeAt(0));
  const key = await importKey(secret);
  const ok = await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(tv));
  if (!ok) return null;
  const b64p = ep.replace(/-/g, '+').replace(/_/g, '/');
  const padp = b64p.length % 4 ? '='.repeat(4 - (b64p.length % 4)) : '';
  const json = atob(b64p + padp);
  return JSON.parse(json);
}

export function sessionCookie(token, maxAge = 60 * 60 * 24 * 7) {
  return [`sid=${token}`, "Path=/", "HttpOnly", "Secure", "SameSite=Strict", `Max-Age=${maxAge}`].join("; ");
}

export function clearSessionCookie() {
  return "sid=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
}