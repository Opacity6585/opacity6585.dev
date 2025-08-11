(() => {
  const btn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  const panel = drawer?.querySelector('.drawer-panel');
  const closeBtn = document.getElementById('nav-close');

  if (!btn || !drawer || !panel) return;

  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      panel.setAttribute('tabindex', '-1');
      panel.focus({ preventScroll: true });
      document.body.style.overflow = 'hidden';
    });
  }

  function close() {
    drawer.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      drawer.hidden = true;
      if (lastFocus) lastFocus.focus();
    }, 180);
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });

  closeBtn?.addEventListener('click', close);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', close);
  });
})();
