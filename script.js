/* ==========================================================================
   script.js — Birthday app for janssss
   Shared by every page; each init function only runs if its elements exist.
   ========================================================================== */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const rand = (min, max) => min + Math.random() * (max - min);

  const GOLD_COLORS = ['#dfb15b', '#f3e3b3', '#ffffff', '#b8862f', '#9b1c31'];
  const SECRET_CODE = 'shhh';

  /* ------------------------------------------------------------------------
     Confetti helpers
     ------------------------------------------------------------------------ */
  function goldConfetti(overrides = {}) {
    if (typeof window.confetti !== 'function') return;
    window.confetti(Object.assign({
      particleCount: 120,
      spread: 90,
      startVelocity: 42,
      ticks: 220,
      origin: { x: 0.5, y: 0.6 },
      colors: GOLD_COLORS
    }, overrides));
  }

  function confettiFrom(el, overrides = {}) {
    const r = el.getBoundingClientRect();
    goldConfetti(Object.assign({
      origin: {
        x: (r.left + r.width / 2) / window.innerWidth,
        y: (r.top + r.height / 2) / window.innerHeight
      }
    }, overrides));
  }

  /* ------------------------------------------------------------------------
     Page navigation (fade out, then redirect)
     ------------------------------------------------------------------------ */
  let leaving = false;

  function navigateWithFade(url, delay = 800) {
    if (leaving) return false;
    leaving = true;
    document.body.classList.add('page-leaving');
    setTimeout(() => { window.location.href = url; }, delay);
    return false;
  }

  /* ------------------------------------------------------------------------
     Flower explosion — shared tulip generator
     Uses polar coordinates (Math.cos / Math.sin) to place each tulip, then
     exposes the result as inline CSS variables: --tx, --ty, --s, --r.
     ------------------------------------------------------------------------ */
  const TULIP_COUNT = 100;

  function buildTulips() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Scale the radius to the viewport so the corners are reached too
    const reachX = w * 0.75;
    const reachY = h * 0.75;
    // Smaller screens get slightly smaller flowers
    const sizeFactor = Math.max(0.7, Math.min(1.2, Math.min(w, h) / 700));
    const frag = document.createDocumentFragment();
    const tulips = [];

    for (let i = 0; i < TULIP_COUNT; i++) {
      const angle  = Math.random() * Math.PI * 2;       // 0 → 360°
      const radius = Math.sqrt(Math.random());          // uniform over the disc
      const tx = Math.cos(angle) * radius * reachX;
      const ty = Math.sin(angle) * radius * reachY;
      const scale = (2.4 + Math.random() * 2.8) * sizeFactor;
      const rot = (Math.random() - 0.5) * 140;

      const el = document.createElement('div');
      el.className = 'tulip';
      el.textContent = '🌷';
      el.style.setProperty('--tx', tx.toFixed(1) + 'px');
      el.style.setProperty('--ty', ty.toFixed(1) + 'px');
      el.style.setProperty('--s', scale.toFixed(2));
      el.style.setProperty('--r', rot.toFixed(1) + 'deg');

      frag.appendChild(el);
      tulips.push({ el, ty });
    }
    return { frag, tulips };
  }

  /* ------------------------------------------------------------------------
     PHASE 1 — runs on vault.html when the Note card is clicked
     ------------------------------------------------------------------------ */
  function triggerFlowerTransition(url) {
    if (document.getElementById('flower-overlay')) return;   // already running

    const overlay = document.createElement('div');
    overlay.id = 'flower-overlay';
    overlay.className = 'flower-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const bg = document.createElement('div');
    bg.className = 'flower-bg';
    overlay.appendChild(bg);

    const { frag, tulips } = buildTulips();
    tulips.forEach(({ el }) => {
      el.style.setProperty('--delay', rand(0, 0.45).toFixed(2) + 's');
      el.style.setProperty('--dur', rand(0.9, 1.4).toFixed(2) + 's');
    });
    overlay.appendChild(frag);

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Two frames so the browser registers the scale(0) start state first
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bg.classList.add('fade-in');
      tulips.forEach(({ el }) => el.classList.add('burst'));
    }));

    // Longest burst ≈ 0.45s delay + 1.4s duration; dark bg is solid by ~1.35s
    setTimeout(() => { window.location.href = url; }, 2000);
  }

  /* ------------------------------------------------------------------------
     PHASE 2 — runs on note.html at DOMContentLoaded
     ------------------------------------------------------------------------ */
  function initFlowerReveal() {
    const overlay = document.getElementById('flower-overlay');
    if (!overlay) return;                                    // only note.html has it

    overlay.style.pointerEvents = 'none';
    const bg = $('.flower-bg', overlay);
    document.body.style.overflow = 'hidden';

    const { frag, tulips } = buildTulips();
    const h = window.innerHeight;
    let longest = 0;

    tulips.forEach(({ el, ty }) => {
      const delay = rand(0.15, 1.0);
      const dur = rand(1.8, 2.8);
      longest = Math.max(longest, delay + dur);

      // Fall distance: always carries the tulip beyond 150vh, however high it started
      el.style.setProperty('--fall', (h * 1.5 + Math.abs(ty) + 200).toFixed(0) + 'px');
      el.style.setProperty('--sway', rand(-90, 90).toFixed(0) + 'px');
      el.style.setProperty('--spin', rand(-220, 220).toFixed(0) + 'deg');
      el.style.setProperty('--delay', delay.toFixed(2) + 's');
      el.style.setProperty('--dur', dur.toFixed(2) + 's');
      el.classList.add('scattered');
    });
    overlay.appendChild(frag);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (bg) bg.classList.add('fade-out');                  // reveal the letter
      tulips.forEach(({ el }) => el.classList.add('fall'));  // gravity
    }));

    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, (longest + 0.4) * 1000);
  }

  /* ------------------------------------------------------------------------
     Ambient sparkles (all pages)
     ------------------------------------------------------------------------ */
  function initAmbient() {
    let box = $('#ambient');
    if (!box) {
      box = document.createElement('div');
      box.id = 'ambient';
      box.className = 'ambient';
      box.setAttribute('aria-hidden', 'true');
      document.body.prepend(box);
    }
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('span');
      const size = rand(3, 9);
      s.className = 'sparkle';
      s.style.width = s.style.height = size.toFixed(1) + 'px';
      s.style.left = rand(0, 100).toFixed(1) + '%';
      s.style.setProperty('--drift', rand(-60, 60).toFixed(0) + 'px');
      s.style.animationDuration = rand(9, 20).toFixed(1) + 's';
      s.style.animationDelay = (-rand(0, 20)).toFixed(1) + 's';
      box.appendChild(s);
    }
  }

  /* ------------------------------------------------------------------------
     Generic [data-nav] links → fade navigation
     ------------------------------------------------------------------------ */
  function initNav() {
    $$('[data-nav]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        navigateWithFade(el.getAttribute('data-nav'));
      });
    });
  }

  /* ------------------------------------------------------------------------
     1. Lock screen
     ------------------------------------------------------------------------ */
  function initLock() {
    const form = $('#lock-form');
    if (!form) return;

    const card = $('#lock-card');
    const input = $('#passcode');
    const error = $('#lock-error');
    const clearBtn = $('#clear-btn');
    const unlockBtn = $('#unlock-btn');
    const eyeBtn = $('#eye-btn');
    let unlocked = false;

    function hideError() { error.classList.remove('show'); }

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (unlocked) return;

      // Trim + ignore case so phone auto-capitalisation can't lock her out
      const value = input.value.trim().toLowerCase();

      if (value !== SECRET_CODE) {
        error.textContent = 'Nice try! Check the hint 🤫';
        error.classList.add('show');
        card.classList.remove('shake');
        void card.offsetWidth;                // restart the animation
        card.classList.add('shake');
        input.select();
        return;
      }

      unlocked = true;
      hideError();
      unlockBtn.disabled = true;
      clearBtn.disabled = true;
      input.disabled = true;

      goldConfetti({ particleCount: 160, spread: 110, origin: { x: 0.5, y: 0.55 } });
      setTimeout(() => goldConfetti({ particleCount: 90, spread: 140, angle: 60,  origin: { x: 0, y: 0.7 } }), 200);
      setTimeout(() => goldConfetti({ particleCount: 90, spread: 140, angle: 120, origin: { x: 1, y: 0.7 } }), 200);

      setTimeout(() => document.body.classList.add('page-leaving'), 700);
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1600);
    });

    card.addEventListener('animationend', e => {
      if (e.animationName === 'shake') card.classList.remove('shake');
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      hideError();
      input.focus();
    });

    input.addEventListener('input', hideError);

    eyeBtn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      eyeBtn.innerHTML = show ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
      eyeBtn.setAttribute('aria-label', show ? 'Hide passcode' : 'Show passcode');
      input.focus();
    });

    input.focus();
  }

  /* ------------------------------------------------------------------------
     2a. Dashboard — blow out the candle
     ------------------------------------------------------------------------ */
  function initCake() {
    const blowBtn = $('#blow-btn');
    if (!blowBtn) return;

    const flame = $('#flame');
    const smoke = $('#smoke');
    const wish = $('#wish-text');

    blowBtn.addEventListener('click', () => {
      if (blowBtn.disabled) return;
      blowBtn.disabled = true;

      flame.classList.add('out');
      smoke.classList.add('puff');
      blowBtn.textContent = '✨ Wish Made ✨';

      confettiFrom(blowBtn, { particleCount: 150, spread: 100, startVelocity: 48 });
      setTimeout(() => confettiFrom(flame, { particleCount: 80, spread: 160, startVelocity: 30 }), 250);

      wish.classList.add('show');
    });
  }

  /* ------------------------------------------------------------------------
     2b. Dashboard — evasive NO button
     ------------------------------------------------------------------------ */
  function initEvasive() {
    const noBtn = $('#no-btn');
    const yesBtn = $('#yes-btn');
    const msgEl = $('#no-msg');
    if (!noBtn || !yesBtn) return;

    const messages = [
      'Nope, wrong button! 😜',
      'Click YES instead 💅',
      'Too slow, queen! 🏃‍♀️💨',
      'Error 404: NO not found 🚫',
      'Nice try, janssss 😏',
      'The NO button is on vacation 🏖️',
      'Just press YES already 🎁'
    ];

    let msgIndex = 0;
    let offX = 0;
    let offY = 0;
    let lastDodge = 0;

    function showMessage() {
      msgEl.textContent = messages[msgIndex % messages.length];
      msgIndex++;
      msgEl.classList.remove('pop');
      void msgEl.offsetWidth;
      msgEl.classList.add('pop');
    }

    function dodge(px, py) {
      const now = performance.now();
      if (now - lastDodge < 160) return;       // avoid jitter loops
      lastDodge = now;

      const r = noBtn.getBoundingClientRect();
      // Where the button would sit with no transform applied
      const natLeft = r.left - offX;
      const natTop = r.top - offY;
      const bw = r.width;
      const bh = r.height;

      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const margin = 14;
      const yr = yesBtn.getBoundingClientRect();

      let best = null;
      let bestScore = -1;

      for (let i = 0; i < 50; i++) {
        const nl = margin + Math.random() * Math.max(1, vw - bw - margin * 2);
        const nt = margin + Math.random() * Math.max(1, vh - bh - margin * 2);
        const cx = nl + bw / 2;
        const cy = nt + bh / 2;

        const overlapsYes = !(
          nl + bw < yr.left - 24 || nl > yr.right + 24 ||
          nt + bh < yr.top - 24  || nt > yr.bottom + 24
        );
        if (overlapsYes) continue;

        const dPointer = px == null ? 999 : Math.hypot(cx - px, cy - py);
        const dCurrent = Math.hypot(nl - (natLeft + offX), nt - (natTop + offY));

        if (dPointer >= 170 && dCurrent >= 120) { best = { nl, nt }; break; }

        const score = Math.min(dPointer, 400) + Math.min(dCurrent, 300);
        if (score > bestScore) { bestScore = score; best = { nl, nt }; }
      }

      if (best) {
        offX = best.nl - natLeft;
        offY = best.nt - natTop;
      } else {
        offX = -offX || 160;                   // fallback: hop sideways
        offY = -offY || -80;
      }

      noBtn.style.transform = `translate(${offX.toFixed(0)}px, ${offY.toFixed(0)}px)`;
      showMessage();
    }

    noBtn.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') dodge(e.clientX, e.clientY); });
    noBtn.addEventListener('pointerdown', e => { e.preventDefault(); dodge(e.clientX, e.clientY); });
    noBtn.addEventListener('click', e => { e.preventDefault(); dodge(e.clientX, e.clientY); });
    noBtn.addEventListener('focus', () => dodge(null, null));

    // Mouse users get dodged a little before they even touch it
    document.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = noBtn.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(dx, dy) < 40) dodge(e.clientX, e.clientY);
    });

    window.addEventListener('resize', () => {
      offX = 0;
      offY = 0;
      noBtn.style.transform = '';
    });

    yesBtn.addEventListener('click', () => {
      confettiFrom(yesBtn, { particleCount: 130, spread: 110 });
      navigateWithFade('vault.html', 900);
    });
  }

  /* ------------------------------------------------------------------------
     6. Flip cards
     ------------------------------------------------------------------------ */
  function initFlipCards() {
    $$('.flip-card').forEach(card => {
      const toggle = () => {
        const flipped = card.classList.toggle('flipped');
        card.setAttribute('aria-pressed', String(flipped));
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Back/forward cache: undo fade-outs and overlays when returning to a page
     ------------------------------------------------------------------------ */
  window.addEventListener('pageshow', e => {
    if (!e.persisted) return;
    leaving = false;
    document.body.classList.remove('page-leaving');
    document.body.style.overflow = '';
    const overlay = document.getElementById('flower-overlay');
    if (overlay) overlay.remove();
  });

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initAmbient();
    initNav();
    initLock();
    initCake();
    initEvasive();
    initFlipCards();
    initFlowerReveal();      // note.html only (needs #flower-overlay)
  });

  // Inline onclick handlers in the HTML need these on window
  window.triggerFlowerTransition = triggerFlowerTransition;
  window.navigateWithFade = navigateWithFade;
})();