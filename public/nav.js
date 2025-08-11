// nav.js
(function () {
  const drawer   = document.getElementById('nav-drawer');
  const panel    = drawer?.querySelector('.drawer-panel');
  const openBtn  = document.getElementById('nav-toggle');
  const closeBtn = document.getElementById('nav-close');
  const loginA   = document.getElementById('drawer-login');

  if (!drawer || !panel || !openBtn || !closeBtn || !loginA) return;

  function openDrawer() {
    drawer.removeAttribute('hidden');
    // allow CSS transition on next frame
    requestAnimationFrame(() => drawer.classList.add('open'));
    openBtn.classList.add('is-open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    openBtn.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // wait for slide-out to finish then hide
    setTimeout(() => drawer.setAttribute('hidden',''), 280);
  }

  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);

  // click on overlay outside the panel closes it
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  // Build user block when logged in
  function avatarUrl(user) {
    if (!user?.avatar) return 'https://cdn.discordapp.com/embed/avatars/0.png';
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=64`;
  }

  function userBlock(user) {
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

    const name = document.createElement('div');
    name.className = 'user-username';
    name.textContent = user.username;

    const id = document.createElement('div');
    id.className = 'user-id';
    id.textContent = `ID: ${user.id}`;

    meta.appendChild(name);
    meta.appendChild(id);
    row.appendChild(img);
    row.appendChild(meta);

    const btn = document.createElement('button');
    btn.className = 'logout-btn';
    btn.textContent = 'Log out';
    btn.addEventListener('click', async () => {
      try { await fetch('/logout', { method: 'POST', credentials: 'include' }); } catch {}
      location.reload();
    });

    wrap.appendChild(row);
    wrap.appendChild(btn);
    return wrap;
  }

  async function syncLogin() {
    try {
      const res = await fetch('/me', { credentials: 'include' });
      const data = await res.json();
      if (data?.loggedIn && data.user) {
        loginA.replaceWith(userBlock(data.user));
      } else {
        loginA.setAttribute('href', '/login');
        loginA.textContent = 'Login';
      }
    } catch {
      loginA.setAttribute('href', '/login');
      loginA.textContent = 'Login';
    }
  }

  syncLogin();
})();