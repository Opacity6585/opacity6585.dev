document.addEventListener("DOMContentLoaded", () => {
  const root     = document.documentElement;
  const drawer   = document.getElementById("nav-drawer");
  const openBtn  = document.getElementById("nav-toggle");
  const closeBtn = document.getElementById("nav-close");
  const body     = document.body;

  const loginBtn   = document.getElementById("drawer-login-btn");
  const drawerUser = document.getElementById("drawer-user");

  if (!drawer || !openBtn) return;

  // --- Scrollbar width compensation ---
  function setScrollbarWidthVar() {
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    root.style.setProperty("--sbw", sbw + "px");
  }
  setScrollbarWidthVar();
  window.addEventListener("resize", setScrollbarWidthVar);

  function openDrawer() {
    drawer.classList.add("open");
    body.classList.add("no-scroll");
    openBtn.classList.add("active");
    openBtn.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    body.classList.remove("no-scroll");
    openBtn.classList.remove("active");
    openBtn.setAttribute("aria-expanded", "false");
  }

  openBtn.addEventListener("click", () => {
    drawer.classList.contains("open") ? closeDrawer() : openDrawer();
  });
  closeBtn?.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) closeDrawer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });

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
          drawerUser.querySelector(".user-avatar").src = avatarUrl(data.user);
          drawerUser.querySelector(".user-username").textContent = data.user.username;
          drawerUser.querySelector(".user-id .val").textContent   = data.user.id;

          const logout = drawerUser.querySelector(".logout-btn");
          logout.onclick = async () => {
            try { await fetch("/logout", { method: "POST", credentials: "include" }); } catch {}
            location.reload();
          };
        }
      } else {
        if (loginBtn) loginBtn.classList.remove("hidden");
        drawerUser?.classList.remove("show");
      }
    } catch {
      if (loginBtn) loginBtn.classList.remove("hidden");
      drawerUser?.classList.remove("show");
    }
  })();
});