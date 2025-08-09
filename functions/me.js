import { verifyJWT } from "./_utils.js";

export const onRequestGet = async ({ request, env }) => {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)sid=([^;]+)/);
  if (!match) {
    return new Response(JSON.stringify({ loggedIn: false }), { status: 200, headers: { "Content-Type": "application/json" }});
  }
  const token = decodeURIComponent(match[1]);
  const payload = await verifyJWT(token, env.SESSION_SECRET);
  const body = payload ? { loggedIn: true, user: payload } : { loggedIn: false };
  return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" }});
};