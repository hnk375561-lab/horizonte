/* Horizonte Automotores · carrusel de fotos del hero. */
(() => {
  const root = document.querySelector('[data-hero-carousel]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const previous = root.querySelector('[data-hero-prev]');
  const next = root.querySelector('[data-hero-next]');
  const toggle = root.querySelector('[data-hero-toggle]');
  const toggleText = root.querySelector('[data-hero-toggle-text]');
  const count = root.querySelector('[data-hero-count]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let active = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  let paused = reducedMotion.matches || saveData;
  let motionOverride = false;
  let saveDataOverride = false;
  let timer = null;

  if (slides.length < 2) {
    if (previous) previous.disabled = true;
    if (next) next.disabled = true;
    if (toggle) toggle.disabled = true;
    return;
  }

  root.classList.add('hero-carousel-ready');

  if ('IntersectionObserver' in window && window.matchMedia('(max-width: 700px)').matches) {
    const ctaObserver = new IntersectionObserver(([entry]) => {
      document.documentElement.classList.toggle('hero-in-view', entry.isIntersecting);
    }, { threshold: 0 });
    ctaObserver.observe(root);
  }

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
    if (count) count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  const renderToggle = () => {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Reanudar carrusel' : 'Pausar carrusel');
    if (toggleText) toggleText.textContent = paused ? 'Reanudar' : 'Pausar';
  };

  const stop = () => {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (paused || document.hidden || (reducedMotion.matches && !motionOverride) || (saveData && !saveDataOverride)) return;
    timer = window.setInterval(() => {
      active = (active + 1) % slides.length;
      render();
    }, 3000);
  };

  const move = (delta) => {
    active = (active + delta + slides.length) % slides.length;
    render();
    start();
  };

  previous?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  toggle?.addEventListener('click', () => {
    paused = !paused;
    if (!paused) {
      motionOverride = reducedMotion.matches;
      saveDataOverride = saveData;
    }
    renderToggle();
    start();
  });

  root.addEventListener('focusin', () => {
    if (!paused) {
      paused = true;
      renderToggle();
    }
    stop();
  });
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener?.('change', (event) => {
    if (event.matches && !motionOverride) paused = true;
    renderToggle();
    start();
  });

  render();
  renderToggle();
  start();
})();
