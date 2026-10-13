/* Horizonte Automotores · carrusel automático de fotografías del hero. */
(() => {
  const root = document.querySelector('[data-hero-carousel]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let active = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  let timer = null;

  const render = () => {
    slides.forEach((slide, index) => {
      const selected = index === active;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
      if (selected) {
        const image = slide.querySelector('img');
        if (image) image.loading = 'eager';
      }
    });
  };

  const stop = () => {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (slides.length < 2 || reducedMotion.matches || saveData || document.hidden) return;
    timer = window.setInterval(() => {
      active = (active + 1) % slides.length;
      render();
    }, 3500);
  };

  if ('IntersectionObserver' in window && window.matchMedia('(max-width: 700px)').matches) {
    const ctaObserver = new IntersectionObserver(([entry]) => {
      document.documentElement.classList.toggle('hero-in-view', entry.isIntersecting);
    }, { threshold: 0 });
    ctaObserver.observe(root);
  }

  render();
  start();
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener?.('change', start);
})();
