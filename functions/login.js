export const onRequestGet = async ({ env }) => {
  const base = (env.BASE_URL || '').replace(/\/$/, '');
  const redirectUri = base + "/callback";
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify"
  });
  return Response.redirect("https://discord.com/oauth2/authorize?" + params.toString(), 302);
};