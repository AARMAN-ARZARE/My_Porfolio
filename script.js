(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

  themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const light = theme === 'light';
    themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
    themeButton.querySelector('.theme-label').textContent = `${light ? 'Dark' : 'Light'} mode`;
    themeButton.querySelector('.theme-icon').textContent = light ? '☾' : '☼';
    document.querySelector('meta[name="theme-color"]').content = light ? '#f4f7ff' : '#0a1020';
  }

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -60% 0px' });
    sections.forEach(section => observer.observe(section));
  }

  const year = document.querySelector('#year');
  year.textContent = new Date().getFullYear();

  form.addEventListener('submit', event => {
    event.preventDefault();
    status.classList.remove('is-error');
    const fields = [...form.querySelectorAll('input, textarea')];
    let firstInvalid = null;
    fields.forEach(field => {
      const valid = field.checkValidity();
      field.setAttribute('aria-invalid', String(!valid));
      if (!valid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      status.textContent = 'Please check the highlighted fields and try again.';
      status.classList.add('is-error');
      firstInvalid.focus();
      return;
    }
    status.textContent = 'Looks good! This demo does not send the message yet.';
    form.reset();
    fields.forEach(field => field.removeAttribute('aria-invalid'));
  });

  form.querySelectorAll('input, textarea').forEach(field => field.addEventListener('input', () => {
    if (field.checkValidity()) field.removeAttribute('aria-invalid');
    if (status.textContent) status.textContent = '';
  }));
})();
