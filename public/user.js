(async function () {
  const userMenu = document.getElementById("user-menu");
  if (!userMenu) return;

  function avatarUrl(user) {
    if (!user?.avatar) return "https://cdn.discordapp.com/embed/avatars/0.png";
    const ext = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=64`;
  }

  let data;
  try {
    const res = await fetch("/me", { credentials: "include" });
    data = await res.json();
  } catch {
    data = { loggedIn: false };
  }

  if (!data?.loggedIn) {
    userMenu.innerHTML = `<a id="login-link" href="/login">Login with Discord</a>`;
    return;
  }

  const u = data.user;
  userMenu.innerHTML = `
    <button class="user-btn" id="user-btn" aria-expanded="false" aria-haspopup="menu">
      <img src="${avatarUrl(u)}" alt="" class="user-avatar">
      <span class="user-name">${u.username}</span>
      <span class="chev">▾</span>
    </button>
    <div class="user-dropdown" id="user-dropdown" hidden>
      <div class="user-info">
        <img src="${avatarUrl(u)}" alt="" class="user-avatar lg">
        <div>
          <div class="user-username">${u.username}</div>
          <div class="user-id"><span>ID:</span><span>${u.id}</span></div>
        </div>
      </div>
      <button id="logout-btn" class="logout-btn">Log out</button>
    </div>
  `;

  const btn = document.getElementById("user-btn");
  const dd  = document.getElementById("user-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  btn.addEventListener("click", () => {
    const open = !dd.hasAttribute("hidden");
    if (open) {
      dd.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
    } else {
      dd.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      dd.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    await fetch("/logout", { method: "POST", credentials: "include" });
    location.reload();
  });
})();