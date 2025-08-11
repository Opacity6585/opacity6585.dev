// nav.js
(function () {
  const drawer = document.getElementById('nav-drawer');
  const panel  = drawer?.querySelector('.drawer-panel');
  const openBtn = document.getElementById('nav-toggle');
  const closeBtn = document.getElementById('nav-close');
  const loginAnchor = document.getElementById('drawer-login');

  if (!drawer || !panel || !openBtn || !closeBtn || !loginAnchor) return;

  function openDrawer() {
    drawer.removeAttribute('hidden');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.setAttribute('hidden', '');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  // Replace "Login" with user block if logged in
  function makeUserBlock(user) {
    const wrap = document.createElement('div');
    wrap.className = 'drawer-user';

    const row = document.createElement('div');
    row.className = 'row';

    const img = document.createElement('img');
    img.className = 'user-avatar';
    img.alt = '';
    img.src = avatarUrl(user);

    const meta = document.createElement('div');
    meta.className = 'user-meta';

    const u = document.createElement('div');
    u.className = 'user-username';
    u.textContent = user.username;

    const id = document.createElement('div');
    id.className = 'user-id';
    id.textContent = `ID: ${user.id}`;

    meta.appendChild(u);
    meta.appendChild(id);

    row.appendChild(img);
    row.appendChild(meta);

    const btn = document.createElement('button');
    btn.className = 'logout-btn';
    btn.id = 'drawer-logout';
    btn.textContent = 'Log out';
    btn.addEventListener('click', async () => {
      try {
        await fetch('/logout', { method: 'POST', credentials: 'include' });
      } catch(_) {}
      location.reload();
    });

    wrap.appendChild(row);
    wrap.appendChild(btn);
    return wrap;
  }

  function avatarUrl(user) {
    if (!user?.avatar) return 'https://cdn.discordapp.com/embed/avatars/0.png';
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=64`;
  }

  async function updateDrawerLogin() {
    try {
      const res = await fetch('/me', { credentials: 'include' });
      const data = await res.json();

      if (data?.loggedIn && data.user) {
        // Swap the "Login" anchor with a user block
        const userBlock = makeUserBlock(data.user);
        loginAnchor.replaceWith(userBlock);
      } else {
        // Ensure it still points to /login if not logged in
        loginAnchor.setAttribute('href', '/login');
        loginAnchor.textContent = 'Login';
      }
    } catch (_) {
      // Leave as "Login" if /me fails
      loginAnchor.setAttribute('href', '/login');
      loginAnchor.textContent = 'Login';
    }
  }

  // Run immediately so the drawer shows correct state on first open
  updateDrawerLogin();
})();