// /nav.js
document.addEventListener("DOMContentLoaded", () => {
  const drawer   = document.getElementById("nav-drawer");
  const openBtn  = document.getElementById("nav-toggle");
  const closeBtn = document.getElementById("nav-close");
  const body     = document.body;

  const loginBtn   = document.getElementById("drawer-login-btn");
  const drawerUser = document.getElementById("drawer-user");

  if (!drawer || !openBtn) {
    console.warn("[nav] Missing drawer or toggle button. Check IDs.");
    return;
  }

  function openDrawer() {
    console.log("[nav] openDrawer");
    drawer.removeAttribute("hidden");
    drawer.classList.add("open");
    body.classList.add("no-scroll");
    openBtn.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    console.log("[nav] closeDrawer");
    drawer.classList.remove("open");
    setTimeout(() => { drawer.setAttribute("hidden", ""); }, 200);  // hide after slide-out
    body.classList.remove("no-scroll");
    openBtn.setAttribute("aria-expanded", "false");
  }

  openBtn.addEventListener("click", () => {
    console.log("[nav] toggle clicked");
    const isOpen = drawer.classList.contains("open");
    isOpen ? closeDrawer() : openDrawer();
  });

  closeBtn?.addEventListener("click", closeDrawer);

  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) closeDrawer(); // click outside panel closes
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });

  // ---- Populate login state inside drawer ----
  function avatarUrl(u) {
    if (!u?.avatar) return "https://cdn.discordapp.com/embed/avatars/0.png";
    const ext = u.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${ext}?size=64`;
  }

  (async () => {
    try {
      const res  = await fetch("/me", { credentials: "include" });
      const data = await res.json();
      console.log("[nav] /me", data);

      if (data?.loggedIn && data.user) {
        loginBtn?.classList.add("hidden");
        if (drawerUser) {
          drawerUser.classList.add("show");
          const img  = drawerUser.querySelector(".user-avatar");
          const name = drawerUser.querySelector(".user-username");
          const id   = drawerUser.querySelector(".user-id .val");
          if (img)  img.src = avatarUrl(data.user);
          if (name) name.textContent = data.user.username;
          if (id)   id.textContent   = data.user.id;

          const logout = drawerUser.querySelector(".logout-btn");
          if (logout) {
            logout.onclick = async () => {
              try { await fetch("/logout", { method: "POST", credentials: "include" }); } catch {}
              location.reload();
            };
          }
        }
      } else {
        if (loginBtn) loginBtn.href = "/login";
        drawerUser?.classList.remove("show");
      }
    } catch (err) {
      console.warn("[nav] /me fetch failed", err);
      if (loginBtn) loginBtn.href = "/login";
      drawerUser?.classList.remove("show");
    }
  })();
});