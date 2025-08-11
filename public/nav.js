document.addEventListener("DOMContentLoaded", () => {
  const drawer   = document.getElementById("nav-drawer");
  const openBtn  = document.getElementById("nav-toggle");
  const closeBtn = document.getElementById("nav-close");
  const body     = document.body;

  const loginBtn   = document.getElementById("drawer-login-btn");
  const drawerUser = document.getElementById("drawer-user");

  function openDrawer() {
    drawer.hidden = false;
    drawer.classList.add("open");
    body.classList.add("no-scroll");
    openBtn?.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    setTimeout(() => { drawer.hidden = true; }, 180);
    body.classList.remove("no-scroll");
    openBtn?.setAttribute("aria-expanded", "false");
  }

  openBtn?.addEventListener("click", () => {
    if (drawer.hidden || !drawer.classList.contains("open")) openDrawer();
    else closeDrawer();
  });

  closeBtn?.addEventListener("click", closeDrawer);

  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) closeDrawer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer?.classList.contains("open")) closeDrawer();
  });

  /* Login state in drawer */
  function avatarUrl(u) {
    if (!u?.avatar) return "https://cdn.discordapp.com/embed/avatars/0.png";
    const ext = u.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${ext}?size=64`;
  }

  (async () => {
    try {
      const res  = await fetch("/me", { credentials: "include" });
      const data = await res.json();

      if (data?.loggedIn && data.user) {
        loginBtn?.classList.add("hidden");
        if (drawerUser) {
          drawerUser.classList.add("show");
          const img  = drawerUser.querySelector(".user-avatar");
          const name = drawerUser.querySelector(".user-username");
          const id   = drawerUser.querySelector(".user-id .val");
          img.src = avatarUrl(data.user);
          name.textContent = data.user.username;
          id.textContent = data.user.id;

          const logout = drawerUser.querySelector(".logout-btn");
          logout.onclick = async () => {
            try { await fetch("/logout", { method: "POST", credentials: "include" }); } catch {}
            location.reload();
          };
        }
      } else {
        if (loginBtn) loginBtn.href = "/login";
        drawerUser?.classList.remove("show");
      }
    } catch {
      if (loginBtn) loginBtn.href = "/login";
      drawerUser?.classList.remove("show");
    }
  })();
});