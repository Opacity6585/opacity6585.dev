import { clearSessionCookie } from "./_utils.js";

export const onRequestPost = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Set-Cookie": clearSessionCookie(), "Content-Type": "application/json" }
  });
};