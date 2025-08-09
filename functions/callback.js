import { signJWT, sessionCookie } from "./_utils.js";

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  const base = (env.BASE_URL || url.origin).replace(/\/$/, '');
  const redirectUri = base + "/callback";

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri
    })
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) return new Response("Failed to get access token", { status: 400 });

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const user = await userRes.json();
  if (!userRes.ok) return new Response("Failed to fetch user", { status: 400 });

  const payload = { id: user.id, username: user.username, discriminator: user.discriminator, avatar: user.avatar };
  const jwt = await signJWT(payload, env.SESSION_SECRET, 60 * 60 * 24 * 7);

  const headers = new Headers({
    "Set-Cookie": sessionCookie(jwt),
    "Location": base + "/"
  });
  return new Response(null, { status: 302, headers });
};