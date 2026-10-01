// JavaScript dùng chung: menu, viền nav khi cuộn, hiện dần khi cuộn tới, thanh tiến độ đọc.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Nav: viền dưới khi đã cuộn ---- */
const nav = document.querySelector<HTMLElement>('[data-nav]');
const onScrollNav = () => nav?.classList.toggle('is-scrolled', window.scrollY > 8);
onScrollNav();
window.addEventListener('scroll', onScrollNav, { passive: true });

/* ---- Menu toàn màn hình trên mobile ---- */
const menu = document.querySelector<HTMLElement>('[data-menu]');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');

function focusables(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
}

function openMenu() {
  if (!menu || !openBtn) return;
  menu.hidden = false;
  openBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  closeBtn?.focus();
}

function closeMenu(restoreFocus = true) {
  if (!menu || !openBtn || menu.hidden) return;
  menu.hidden = true;
  openBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  if (restoreFocus) openBtn.focus();
}

openBtn?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', () => closeMenu());
menu?.querySelectorAll('[data-menu-link]').forEach((a) =>
  a.addEventListener('click', () => closeMenu(false)),
);
menu?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
  if (e.key === 'Tab') {
    const f = focusables(menu);
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
  if (e.matches) closeMenu(false);
});

/* ---- Hiện dần khi cuộn tới ---- */
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ---- Thanh tiến độ đọc (trang đồ án) ---- */
const bar = document.querySelector<HTMLElement>('[data-progress]');
if (bar) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    ticking = false;
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}

/* ---- Năm hiện tại ở footer ---- */
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
