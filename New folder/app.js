// ============================================================
// NOVARA SHOWROOM — APP LOGIC
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // fallback in case 'load' already fired or is slow
  setTimeout(() => loader.classList.add('hidden'), 1800);

  /* ---------- HERO ENTRANCE (GSAP) ---------- */
  if (window.gsap) {
    gsap.set('.hero-title .line', { yPercent: 110 });
    gsap.timeline({ delay: .5 })
      .to('.hero-eyebrow', { opacity: 1, duration: .6, ease: 'power2.out' })
      .to('.hero-title .line', { yPercent: 0, duration: 1, ease: 'power3.out', stagger: .12 }, '-=.2')
      .to('.hero-subtitle', { opacity: 1, duration: .7, ease: 'power2.out' }, '-=.4')
      .to('.hero-actions', { opacity: 1, duration: .7, ease: 'power2.out' }, '-=.5')
      .to('.hero-scroll-cue', { opacity: 1, duration: .6 }, '-=.3');
  } else {
    document.querySelectorAll('.hero-eyebrow,.hero-subtitle,.hero-actions,.hero-scroll-cue').forEach(el => el.style.opacity = 1);
  }

  /* ---------- HERO SILHOUETTES (decorative floating rings) ---------- */
  const silhouetteWrap = document.getElementById('heroSilhouettes');
  const silhouetteSpecs = [
    { size: 220, top: '12%', left: '8%' },
    { size: 140, top: '60%', left: '4%' },
    { size: 300, top: '20%', left: '82%' },
    { size: 160, top: '68%', left: '85%' },
  ];
  silhouetteSpecs.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'silhouette';
    el.style.width = s.size + 'px';
    el.style.height = s.size + 'px';
    el.style.top = s.top;
    el.style.left = s.left;
    el.style.animation = `float ${7 + i}s ease-in-out infinite`;
    el.style.animationDelay = (i * .6) + 's';
    silhouetteWrap.appendChild(el);
  });
  const floatKeyframes = `@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}`;
  const styleTag = document.createElement('style');
  styleTag.textContent = floatKeyframes;
  document.head.appendChild(styleTag);

  /* ---------- CURSOR GLOW ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let glowX = mouseX, glowY = mouseY;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  function animateGlow() {
    glowX += (mouseX - glowX) * .12;
    glowY += (mouseY - glowY) * .12;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  /* ---------- PARTICLE CANVAS (hero ambient) ---------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  function initParticles() {
    const count = window.innerWidth < 700 ? 35 : 70;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 1.8 + .4,
      vy: -(Math.random() * .35 + .08),
      vx: (Math.random() - .5) * .15,
      o: Math.random() * .5 + .15,
    }));
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    particles.forEach(p => {
      p.y += p.vy; p.x += p.vx;
      if (p.y < -10) { p.y = canvas.offsetHeight + 10; p.x = Math.random() * canvas.offsetWidth; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,176,0,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  resizeCanvas(); initParticles(); drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  /* ---------- NAVBAR SCROLL STATE ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ---------- SMOOTH ANCHOR SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  document.getElementById('enterShowroomBtn').addEventListener('click', () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('exploreProductsBtn').addEventListener('click', () => {
    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('tourBtn').addEventListener('click', () => {
    showToast('Virtual tour mode is rendering in this build as the 360° product view — click any product to explore.');
  });

  /* ---------- LANGUAGE DROPDOWN ---------- */
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langCurrent = document.getElementById('langCurrent');
  langBtn.addEventListener('click', e => {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
  });
  langDropdown.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      langCurrent.textContent = li.dataset.lang;
      langDropdown.classList.remove('open');
      showToast(`Language set to ${li.textContent}`);
    });
  });
  document.addEventListener('click', () => langDropdown.classList.remove('open'));

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeToggle.querySelector('i').className = isLight ? 'fa-solid fa-circle-half-stroke' : 'fa-solid fa-sun';
  });

  /* ---------- MOBILE NAV BURGER ---------- */
  const navBurger = document.getElementById('navBurger');
  navBurger.addEventListener('click', () => {
    showToast('Menu coming soon in this preview build.');
  });

  /* ---------- HOLO STAGE BUILDER ---------- */
  function buildHoloStage(product, extraClass = '') {
    return `
      <div class="holo-stage ${extraClass}" style="--holo-color:${product.color}">
        <div class="holo-ring"></div>
        <div class="holo-card" data-shape="${product.shape}"></div>
        <div class="holo-shadow"></div>
      </div>`;
  }

  /* ---------- RENDER CATEGORIES ---------- */
  const categoryGrid = document.getElementById('categoryGrid');
  categoryGrid.innerHTML = CATEGORIES.map(c => `
    <div class="category-card reveal" data-cat="${c.id}">
      <div class="category-icon"><i class="${c.icon}"></i></div>
      <div class="category-name">${c.name}</div>
      <div class="category-count">${c.count} ITEMS</div>
    </div>
  `).join('');
  categoryGrid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- RENDER PRODUCT ISLANDS ---------- */
  const islandGrid = document.getElementById('islandGrid');
  islandGrid.innerHTML = PRODUCTS.map(p => `
    <article class="island reveal" data-id="${p.id}">
      <div class="island-badge">360&deg;</div>
      <div class="island-stage-wrap">${buildHoloStage(p)}</div>
      <div class="island-info">
        <div class="island-category">${p.category.toUpperCase()}</div>
        <h3 class="island-name">${p.name}</h3>
        <div class="island-meta">
          <div class="island-rating"><i class="fa-solid fa-star"></i> ${p.rating} <span style="color:var(--text-faint)">(${p.reviews})</span></div>
          <div class="island-price">$${p.price}</div>
        </div>
        <div class="island-cta"><span>Quick View</span><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
      </div>
    </article>
  `).join('');
  islandGrid.querySelectorAll('.island').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });

  /* ---------- PROMO SLIDER ---------- */
  const promoTrack = document.getElementById('promoTrack');
  const promoDotsWrap = document.getElementById('promoDots');
  promoTrack.innerHTML = PROMOS.map(promo => `
    <div class="promo-slide" style="--promo-color:${promo.color}">
      <div class="promo-slide-bg"></div>
      <div class="promo-glow-edge"></div>
      <div class="promo-content">
        <span class="promo-tag">${promo.tag}</span>
        <h3 class="promo-title">${promo.title}</h3>
        <p class="promo-sub">${promo.sub}</p>
        <button class="btn btn-primary promo-cta"><span>${promo.cta}</span><i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  `).join('');
  promoDotsWrap.innerHTML = PROMOS.map((_, i) => `<div class="promo-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></div>`).join('');

  let promoIdx = 0;
  function goToPromo(i) {
    promoIdx = (i + PROMOS.length) % PROMOS.length;
    promoTrack.style.transform = `translateX(-${promoIdx * 100}%)`;
    promoDotsWrap.querySelectorAll('.promo-dot').forEach((d, idx) => d.classList.toggle('active', idx === promoIdx));
  }
  promoDotsWrap.querySelectorAll('.promo-dot').forEach(dot => {
    dot.addEventListener('click', () => goToPromo(parseInt(dot.dataset.idx)));
  });
  promoTrack.querySelectorAll('.promo-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });
  let promoAutoplay = setInterval(() => goToPromo(promoIdx + 1), 5500);
  document.getElementById('promoSlider').addEventListener('mouseenter', () => clearInterval(promoAutoplay));
  document.getElementById('promoSlider').addEventListener('mouseleave', () => {
    promoAutoplay = setInterval(() => goToPromo(promoIdx + 1), 5500);
  });

  /* ---------- JOURNAL ---------- */
  const journalGrid = document.getElementById('journalGrid');
  const thumbIcons = { headphones: 'fa-headphones', showroom: 'fa-cube', keyboard: 'fa-keyboard', team: 'fa-people-group' };
  journalGrid.innerHTML = JOURNAL.map(j => `
    <article class="journal-card">
      <div class="journal-thumb"><i class="fa-solid ${thumbIcons[j.thumb] || 'fa-newspaper'}"></i></div>
      <div class="journal-body">
        <div class="journal-meta"><span>${j.date}</span><span class="dot"></span><span>${j.category.toUpperCase()}</span></div>
        <h4 class="journal-headline">${j.headline}</h4>
        <a href="#" class="journal-link">Read more <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </article>
  `).join('');

  /* ---------- SCROLL REVEAL OBSERVER ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal, .journal-card').forEach(el => revealObserver.observe(el));

  /* ---------- PRODUCT MODAL ---------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalHolo = document.getElementById('modalHolo');
  const modalCategory = document.getElementById('modalCategory');
  const modalName = document.getElementById('modalName');
  const modalRating = document.getElementById('modalRating');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalPrice = document.getElementById('modalPrice');
  const modalRelatedGrid = document.getElementById('modalRelatedGrid');
  const modalBuyBtn = document.getElementById('modalBuyBtn');

  function openModal(productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;

    modalHolo.style.setProperty('--holo-color', p.color);
    modalHolo.querySelector('.holo-card').setAttribute('data-shape', p.shape);
    modalCategory.textContent = p.category.toUpperCase();
    modalName.textContent = p.name;
    modalRating.innerHTML = `<i class="fa-solid fa-star"></i> ${p.rating} &middot; ${p.reviews} reviews`;
    modalDesc.textContent = p.desc;
    modalPrice.textContent = `$${p.price}`;
    modalSpecs.innerHTML = p.specs.map(s => `
      <div class="spec-item"><div class="spec-label">${s.label.toUpperCase()}</div><div class="spec-value">${s.value}</div></div>
    `).join('');

    const related = PRODUCTS.filter(x => x.id !== p.id && x.category === p.category).slice(0, 3);
    const fallback = PRODUCTS.filter(x => x.id !== p.id).slice(0, 3);
    const relatedList = related.length ? related : fallback;
    modalRelatedGrid.innerHTML = relatedList.map(r => `
      <div class="modal-related-item" data-id="${r.id}">
        ${buildHoloStage(r)}
        <div class="related-name">${r.name}</div>
        <div class="related-price">$${r.price}</div>
      </div>
    `).join('');
    modalRelatedGrid.querySelectorAll('.modal-related-item').forEach(item => {
      item.addEventListener('click', () => openModal(item.dataset.id));
    });

    modalBuyBtn.onclick = () => {
      showToast(`${p.name} added to your bag — $${p.price}`);
    };

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    spawnModalParticles();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function spawnModalParticles() {
    const wrap = document.getElementById('modalParticles');
    wrap.innerHTML = '';
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('div');
      s.className = 'modal-spark';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      if (window.gsap) {
        gsap.fromTo(s, { opacity: 0, scale: .4 }, {
          opacity: Math.random() * .6 + .2, scale: 1,
          duration: 1.2, delay: Math.random() * .8, ease: 'power2.out',
          yoyo: true, repeat: -1, repeatDelay: Math.random() * 2,
        });
      } else { s.style.opacity = '.4'; }
      wrap.appendChild(s);
    }
  }

  /* ---------- NEWSLETTER FORM ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterStatus');
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    newsletterStatus.textContent = "You're on the list. First drop lands in your inbox soon.";
    newsletterForm.reset();
  });

  /* ---------- TOAST ---------- */
  let toastTimeout;
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ---------- PARALLAX TILT ON ISLAND HOVER (subtle depth) ---------- */
  document.querySelectorAll('.island').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.transform = `translateY(-10px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

});
