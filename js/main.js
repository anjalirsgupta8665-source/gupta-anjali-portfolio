/* ==========================================================================
   GUPTA ANJALI RAJAN — PORTFOLIO ENGINE
   Vanilla JS. No dependencies.
   Modules
   01 helpers            08 smooth anchors / nav theme
   02 preloader          09 fullscreen menu
   03 smooth wheel       10 flip card + portrait
   04 custom cursor      11 counters / clock / year
   05 magnetic buttons   12 contact form + placeholders
   06 word splitting     13 hero 3D orbital scene (canvas)
   07 scroll reveal      14 footer marquee drag / misc
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 01 · HELPERS ---------- */
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var raf = window.requestAnimationFrame.bind(window);

  var toastEl = $('#toast');
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3200);
  }

  /* ---------- 02 · PRELOADER ---------- */
  function runLoader() {
    var loader = $('#loader');
    if (!loader) return;

    document.body.classList.add('is-locked');

    var words   = $$('.loader__word > span', loader);
    var fill    = $('.loader__bar-fill', loader);
    var count   = $('.loader__count', loader);
    var curtain = $('.loader__curtain', loader);

    /* wrap each word so it can slide from behind a mask */
    words.forEach(function (w) {
      var inner = document.createElement('i');
      inner.textContent = w.textContent;
      w.textContent = '';
      w.appendChild(inner);
      if (!REDUCED) {
        inner.style.transform = 'translateY(115%)';
        inner.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1)';
      }
    });

    function finish() {
      if (!REDUCED) {
        curtain.style.transition = 'transform .6s cubic-bezier(.77,0,.18,1)';
        curtain.style.transform = 'translateY(0)';
      }
      document.body.classList.add('is-loaded');
      setTimeout(function () {
        loader.style.transition = REDUCED ? 'none' : 'transform .9s cubic-bezier(.77,0,.18,1)';
        loader.style.transform = 'translateY(-100%)';
        document.body.classList.remove('is-locked');
      }, REDUCED ? 0 : 520);
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, REDUCED ? 60 : 1600);
    }

    if (REDUCED) { finish(); return; }

    /* entrance for the masked words */
    raf(function () {
      raf(function () {
        words.forEach(function (w, i) {
          var inner = w.firstChild;
          if (!inner) return;
          inner.style.transitionDelay = (i * 90) + 'ms';
          inner.style.transform = 'translateY(0)';
        });
      });
    });

    /* progress: bar + live percentage */
    var DUR = 1750;
    var start = null;
    function tick(now) {
      if (start === null) start = now;
      var t = clamp((now - start) / DUR, 0, 1);
      var eased = 1 - Math.pow(1 - t, 2.4);
      if (fill)  fill.style.transform = 'scaleX(' + eased + ')';
      if (count) count.textContent = String(Math.round(eased * 100)).padStart(3, '0') + '%';
      if (t < 1) raf(tick);
      else setTimeout(finish, 180);
    }
    raf(tick);
  }

  /* ---------- 03 · SMOOTH WHEEL SCROLL (desktop only) ---------- */
  var Smooth = (function () {
    if (REDUCED || !FINE) return null;

    var target  = window.scrollY;
    var current = window.scrollY;
    var active  = false;

    function maxY() { return document.documentElement.scrollHeight - window.innerHeight; }
    function clampY(v) { return clamp(v, 0, maxY()); }

    function frame() {
      current = lerp(current, target, 0.105);
      if (Math.abs(target - current) < 0.4) {
        current = target;
        window.scrollTo(0, current);
        active = false;
        return;
      }
      window.scrollTo(0, current);
      raf(frame);
    }
    function start() {
      if (!active) { active = true; raf(frame); }
    }

    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey) return;                                   // keep zoom gestures
      if (document.body.classList.contains('is-locked')) return;
      if (document.body.classList.contains('menu-open')) return;
      var overflowEl = e.target.closest ? e.target.closest('[data-lock-scroll]') : null;
      if (overflowEl) return;
      e.preventDefault();
      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 18;
      else if (e.deltaMode === 2) d *= window.innerHeight;
      target = clampY(target + d);
      start();
    }, { passive: false });

    window.addEventListener('scroll', function () {
      if (!active) { target = current = window.scrollY; }
    }, { passive: true });

    window.addEventListener('resize', function () { target = clampY(target); });

    return {
      to: function (y) { target = clampY(y); start(); },
      sync: function () { target = current = window.scrollY; }
    };
  })();

  function goToY(y) {
    if (Smooth) { Smooth.to(y); return; }
    window.scrollTo({ top: y, behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ---------- 04 · CUSTOM CURSOR ---------- */
  function initCursor() {
    if (!FINE) return;
    var cursor = $('#cursor');
    if (!cursor) return;
    var dot  = $('.cursor__dot', cursor);
    var ring = $('.cursor__ring', cursor);
    var label = $('.cursor__label', cursor);

    document.body.classList.add('has-cursor');

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.classList.remove('is-hidden');
    }, { passive: true });

    document.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', function () { cursor.classList.remove('is-hidden'); });

    (function loop() {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      dot.style.transform  = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      raf(loop);
    })();

    function setState(state, text) {
      cursor.classList.remove('is-link', 'is-view', 'is-magnetic');
      if (state) cursor.classList.add(state);
      if (label) label.textContent = text || '';
    }

    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var view = t.closest('.card__link');
      if (view) { setState('is-view', 'View'); return; }
      var flip = t.closest('[data-flip]');
      if (flip) { setState('is-view', 'Flip'); return; }
      var mag = t.closest('[data-magnetic]');
      if (mag) { setState('is-magnetic', ''); return; }
      var link = t.closest('a, button, [data-hover]');
      if (link) { setState('is-link', ''); return; }
      setState(null, '');
    });

    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && !e.toElement) cursor.classList.add('is-hidden');
    });
  }

  /* ---------- 05 · MAGNETIC BUTTONS ---------- */
  function initMagnetic() {
    if (!FINE) return;
    $$('[data-magnetic]').forEach(function (el) {
      el.style.willChange = 'transform';
      el.style.transition = 'transform .55s cubic-bezier(.22,1,.36,1)';
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate3d(' + (dx * 0.22) + 'px,' + (dy * 0.32) + 'px,0)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- 06 · WORD SPLITTING ---------- */
  function splitWords(el) {
    if (!el || el.dataset.split === 'done') return;
    el.dataset.split = 'done';

    var index = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span');
            w.className = 'word';
            w.style.setProperty('--wi', index++);
            var inner = document.createElement('span');
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && !child.classList.contains('word')) {
          walk(child);
        }
      });
    }
    walk(el);
  }

  /* ---------- 07 · SCROLL REVEAL ---------- */
  function initReveal() {
    /* stagger index inside groups */
    $$('[data-reveal]').forEach(function (el) {
      var i = 0, sib = el.previousElementSibling;
      while (sib) {
        if (sib.hasAttribute && sib.hasAttribute('data-reveal')) i++;
        sib = sib.previousElementSibling;
      }
      el.style.setProperty('--ri', Math.min(i, 6));
    });

    var targets = $$('[data-reveal], [data-split-words]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 08 · ANCHORS · NAV THEME · PROGRESS · PARALLAX ---------- */
  var nav = $('#nav');
  var progressBar = $('.progress__bar');
  var darkSections = [];
  var parallaxEls = [];

  function collectTheme() {
    darkSections = $$('.dark');
    parallaxEls = [
      { el: $('.edu__watermark'), speed: -0.055, host: null },
      { el: $('.contact__orb'),   speed: 0.1,    host: null }
    ].filter(function (o) { return o.el; });
    parallaxEls.forEach(function (o) { o.host = o.el.parentElement || o.el; });
  }

  function onScrollFrame() {
    var y = window.scrollY;

    if (nav) {
      nav.classList.toggle('is-scrolled', y > 30);
      var probe = 92;
      var dark = false;
      for (var i = 0; i < darkSections.length; i++) {
        var r = darkSections[i].getBoundingClientRect();
        if (r.top < probe && r.bottom > probe) { dark = true; break; }
      }
      nav.classList.toggle('is-dark', dark);
      document.body.classList.toggle('cursor-invert', dark);
    }

    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max, 0, 1) : 0) + ')';
    }

    if (!REDUCED) {
      parallaxEls.forEach(function (o) {
        var r = o.host.getBoundingClientRect();
        if (r.bottom > -200 && r.top < window.innerHeight + 200) {
          var mid = r.top + r.height / 2 - window.innerHeight / 2;
          o.el.style.transform = 'translate3d(0,' + (mid * o.speed).toFixed(1) + 'px,0)';
        }
      });
    }
  }

  var ticking = false;
  function requestScrollFrame() {
    if (ticking) return;
    ticking = true;
    raf(function () { onScrollFrame(); ticking = false; });
  }

  function initAnchors() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      if (link.hasAttribute('data-placeholder')) return; // handled elsewhere
      var href = link.getAttribute('href');
      if (href === '#') { e.preventDefault(); return; }
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      var menuWasOpen = document.body.classList.contains('menu-open');
      if (menuWasOpen) closeMenu();

      var y = href === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
      setTimeout(function () { goToY(y); }, menuWasOpen ? 340 : 0);
    });

    var topBtn = $('#toTop');
    if (topBtn) topBtn.addEventListener('click', function () { goToY(0); });
  }

  /* ---------- 09 · FULLSCREEN MENU ---------- */
  var burger = $('#burger');
  var menu = $('#menu');

  function openMenu() {
    document.body.classList.add('menu-open');
    document.body.classList.add('is-locked');
    if (burger) { burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu'); }
    if (menu) menu.setAttribute('aria-hidden', 'false');
  }
  function closeMenu() {
    document.body.classList.remove('menu-open');
    document.body.classList.remove('is-locked');
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }
    if (menu) menu.setAttribute('aria-hidden', 'true');
  }

  function initMenu() {
    if (burger) {
      burger.addEventListener('click', function () {
        if (document.body.classList.contains('menu-open')) closeMenu();
        else openMenu();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
    });
  }

  /* ---------- 10 · FLIP CARD + PORTRAIT ---------- */
  function initFlip() {
    var flip = $('[data-flip]');
    if (!flip) return;
    if (FINE) {
      flip.addEventListener('mouseenter', function () { flip.classList.add('is-flipped'); });
      flip.addEventListener('mouseleave', function () { flip.classList.remove('is-flipped'); });
    }
    flip.addEventListener('click', function () { flip.classList.toggle('is-flipped'); });

    /* if a real photo exists at assets/profile.jpg it is used automatically */
    var img = new Image();
    img.onload = function () {
      var portrait = $('.portrait', flip);
      if (!portrait) return;
      var inner = $('.portrait__inner', portrait);
      if (inner) inner.style.backgroundImage = 'url("assets/profile.jpg")';
      portrait.classList.add('has-img');
    };
    img.src = 'assets/profile-sm.jpg';
  }

  /* ---------- 11 · COUNTERS · CLOCK · YEAR ---------- */
  function initCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;
    var animate = function (el) {
      var end = parseFloat(el.dataset.count) || 0;
      var dec = parseInt(el.dataset.decimals, 10) || 0;
      var t0 = null;
      var DUR = 1400;
      function step(now) {
        if (t0 === null) t0 = now;
        var p = clamp((now - t0) / DUR, 0, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var v = eased * end;
        el.textContent = dec ? v.toFixed(dec) : Math.round(v);
        if (p < 1) raf(step);
      }
      raf(step);
    };
    if (!('IntersectionObserver' in window) || REDUCED) {
      nums.forEach(function (el) {
        var dec = parseInt(el.dataset.decimals, 10) || 0;
        var v = parseFloat(el.dataset.count) || 0;
        el.textContent = dec ? v.toFixed(dec) : Math.round(v);
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io.observe(el); });
  }

  function initClock() {
    var clock = $('#clock');
    var yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (!clock) return;
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
    } catch (err) { fmt = null; }
    function tick() {
      var d = new Date();
      clock.textContent = fmt ? fmt.format(d) : d.toLocaleTimeString();
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 12 · FORM & PLACEHOLDER LINKS ---------- */
  function initForm() {
    var form = $('#contactForm');
    if (!form) return;

    var emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name  = form.querySelector('#f-name');
      var email = form.querySelector('#f-email');
      var msg   = form.querySelector('#f-msg');
      var ok = true;

      [[name, function (v) { return v.trim().length > 1; }],
       [email, function (v) { return emailRx.test(v.trim()); }],
       [msg, function (v) { return v.trim().length > 3; }]
      ].forEach(function (pair) {
        var input = pair[0];
        var good = pair[1](input.value);
        input.parentElement.classList.toggle('is-err', !good);
        if (!good) ok = false;
      });

      if (!ok) {
        toast('Please complete the highlighted fields.');
        return;
      }

      /* Demo only. To go live: point action= to Formspree / your endpoint
         and remove e.preventDefault(), or wire fetch() here. */
      toast('Demo form — message captured. Connect a backend to send it.');
      form.reset();
    });

    /* live input error clearing */
    form.addEventListener('input', function (e) {
      if (e.target && e.target.parentElement) {
        e.target.parentElement.classList.remove('is-err');
      }
    });
  }

  function initPlaceholders() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-placeholder]') : null;
      if (!a) return;
      e.preventDefault();
      toast('Placeholder link — add the real URL in index.html.');
    });
  }

  /* ---------- 13 · HERO 3D ORBITAL SCENE (canvas) ---------- */
  function initHeroScene() {
    var canvas = $('#deco');
    var hero = $('#hero');
    var orb = $('.hero__orb');
    if (!canvas || !hero) return;

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, DPR = 1;
    var running = false;
    var visible = true;
    var rafId = 0;
    var t0 = performance.now();
    var particles = [];
    var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    var orbCenter = { x: 0, y: 0, r: 100 };
    var FOV = 950;

    function size() {
      var r = hero.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      if (orb) {
        /* layout position relative to the hero, ignoring float transforms */
        var ox = 0, oy = 0, n = orb;
        while (n && n !== hero) { ox += n.offsetLeft; oy += n.offsetTop; n = n.offsetParent; }
        orbCenter.x = ox + orb.offsetWidth / 2;
        orbCenter.y = oy + orb.offsetHeight / 2;
        orbCenter.r = orb.offsetWidth / 2;
      }

      var n = Math.round(clamp(W / 30, 14, 44));
      particles = [];
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.5 + 0.5,
          s: Math.random() * 0.16 + 0.04,
          o: Math.random() * 0.28 + 0.07,
          orange: Math.random() < 0.16,
          ph: Math.random() * Math.PI * 2
        });
      }
    }

    /* draw one 3D ring, painter-style: per-segment alpha by depth */
    function ring(cx, cy, radius, spin, tilt, alpha, orange, t) {
      var N = 84;
      var cosT = Math.cos(tilt), sinT = Math.sin(tilt);
      var prev = null;
      ctx.lineWidth = orange ? 1.1 : 0.8;

      for (var i = 0; i <= N; i++) {
        var a = (i / N) * Math.PI * 2;
        var x = Math.cos(a) * radius;
        var z = Math.sin(a) * radius;

        /* spin around Y */
        var xs = x * Math.cos(spin) + z * Math.sin(spin);
        var zs = -x * Math.sin(spin) + z * Math.cos(spin);
        /* tilt around X */
        var y = -zs * sinT;
        var z2 = zs * cosT;

        var persp = FOV / (FOV + z2);
        var px = cx + xs * persp + pointer.x * 14;
        var py = cy + y * persp + pointer.y * 10;

        if (prev) {
          var depthA = alpha * (0.42 + 0.58 * ((z2 / radius) + 1) / 2);
          ctx.beginPath();
          ctx.moveTo(prev[0], prev[1]);
          ctx.lineTo(px, py);
          ctx.strokeStyle = orange
            ? 'rgba(255,74,0,' + depthA.toFixed(3) + ')'
            : 'rgba(30,29,26,' + depthA.toFixed(3) + ')';
          ctx.stroke();
        }
        prev = [px, py];

        /* satellite on the orange ring */
        if (orange && i === Math.round(((t * 0.34) % (Math.PI * 2)) / (Math.PI * 2) * N)) {
          ctx.beginPath();
          ctx.arc(px, py, 3.4, 0, Math.PI * 2);
          ctx.fillStyle = '#FF4A00';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,74,0,.14)';
          ctx.fill();
        }
      }
    }

    function draw(now) {
      if (!visible) { running = false; return; }
      var t = (now - t0) / 1000;

      pointer.x = lerp(pointer.x, pointer.tx, 0.05);
      pointer.y = lerp(pointer.y, pointer.ty, 0.05);

      ctx.clearRect(0, 0, W, H);

      /* ambient dust */
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y -= p.s;
        if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
        var px = p.x + Math.sin(t * 0.35 + p.ph) * 8 + pointer.x * 6;
        ctx.beginPath();
        ctx.arc(px, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.orange
          ? 'rgba(255,74,0,' + (p.o + 0.1).toFixed(3) + ')'
          : 'rgba(30,29,26,' + (p.o * 0.55).toFixed(3) + ')';
        ctx.fill();
      }

      /* orbital rings around the CSS orb */
      if (orb && orbCenter.r > 10) {
        var R = orbCenter.r;
        ring(orbCenter.x, orbCenter.y, R * 1.78, t * 0.22, 1.18, 0.30, false, t);
        ring(orbCenter.x, orbCenter.y, R * 1.34, -t * 0.16 + 1.2, 1.32, 0.5, true, t);
        ring(orbCenter.x, orbCenter.y, R * 2.22, t * 0.1 + 2, 1.05, 0.14, false, t);
      }

      rafId = raf(draw);
    }

    function start() {
      if (running) return;
      running = true;
      t0 = performance.now() - (t0 ? 0 : 0);
      rafId = raf(draw);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    size();
    window.addEventListener('resize', size);

    if (FINE) {
      hero.addEventListener('pointermove', function (e) {
        pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          if (visible) start(); else stop();
        });
      }, { threshold: 0.02 }).observe(hero);
    }

    if (REDUCED) {
      /* one still frame, no loop */
      visible = true;
      draw(performance.now());
      stop();
    } else {
      start();
    }
  }

  /* ---------- 14 · FOOTER MARQUEE DRAG · MISC ---------- */
  function initFooterDrag() {
    var marquee = $('[data-marquee-drag]');
    if (!marquee) return;
    var track = $('.footer__track', marquee);
    if (!track) return;

    var dragging = false, startX = 0;

    marquee.addEventListener('pointerdown', function (e) {
      dragging = true;
      startX = e.clientX;
      track.style.animationPlayState = 'paused';
      track.style.transition = 'none';
      if (marquee.setPointerCapture) {
        try { marquee.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });
    marquee.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      track.style.transform = 'translate3d(' + (e.clientX - startX) + 'px,0,0)';
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      track.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)';
      track.style.transform = 'translate3d(0,0,0)';
      setTimeout(function () {
        track.style.transition = '';
        track.style.transform = '';
        track.style.animationPlayState = 'running';
      }, 820);
    }
    marquee.addEventListener('pointerup', release);
    marquee.addEventListener('pointercancel', release);
    marquee.addEventListener('pointerleave', release);
  }

  function initMarqueeHover() {
    /* slower marquees feel calmer on touch devices */
    if (!FINE) {
      $$('.marquee__track, .footer__track').forEach(function (tr) {
        tr.style.animationDuration = '70s';
      });
    }
  }

  /* ---------- BOOT ---------- */
  function boot() {
    collectTheme();

    $$('[data-split-words]').forEach(splitWords);

    initCursor();
    initMagnetic();
    initReveal();
    initAnchors();
    initMenu();
    initFlip();
    initCounters();
    initClock();
    initForm();
    initPlaceholders();
    initHeroScene();
    initFooterDrag();
    initMarqueeHover();

    window.addEventListener('scroll', function () {
      requestScrollFrame();
      if (Smooth) { /* keep smooth target fresh after programmatic jumps */ }
    }, { passive: true });
    window.addEventListener('resize', function () { collectTheme(); requestScrollFrame(); });

    requestScrollFrame();
    runLoader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
