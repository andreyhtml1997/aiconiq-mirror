/**
 * Vanilla JS for the WP PHP-rendered side.
 *
 * Loaded on pages using `page-templates/blocks.php`. Provides the minimum
 * interactivity for blocks ported from React: autoplaying muted videos,
 * a simple testimonials slider, a smooth-scroll-to-anchor handler, and
 * Calendly popup integration when their script is present.
 *
 * No animation library — Michael explicitly said animations are not needed.
 * No framework — plain JS, talks to the DOM through `data-aiconiq-*` hooks.
 *
 * Idempotent: safe to load twice (init guards via `data-aiconiq-ready`).
 */
(function () {
  'use strict';

  // ------------------------------------------------------------------
  // Video autoplay polish — set attrs explicitly + retry play() on
  // gesture for browsers that block silent autoplay.
  // ------------------------------------------------------------------
  function initVideos(root) {
    var videos = (root || document).querySelectorAll('video[data-aiconiq-autoplay]');
    videos.forEach(function (v) {
      if (v.dataset.aiconiqReady === '1') return;
      v.dataset.aiconiqReady = '1';
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      var tryPlay = function () {
        var p = v.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () {
            // Browser blocked autoplay (rare for muted) — fall back to first
            // user gesture.
            var onGesture = function () {
              v.play().finally(function () {
                document.removeEventListener('click', onGesture);
                document.removeEventListener('touchstart', onGesture);
              });
            };
            document.addEventListener('click', onGesture, { once: true });
            document.addEventListener('touchstart', onGesture, { once: true });
          });
        }
      };
      if (v.readyState >= 2) tryPlay();
      else v.addEventListener('loadeddata', tryPlay, { once: true });
    });
  }

  // ------------------------------------------------------------------
  // Smooth-scroll-to-anchor — handle in-page hash links (#solutions etc.)
  // without ScrollIntoView() defaults.
  // ------------------------------------------------------------------
  function initAnchors(root) {
    var links = (root || document).querySelectorAll('a[href*="#"]');
    links.forEach(function (a) {
      if (a.dataset.aiconiqReady === '1') return;
      var href = a.getAttribute('href') || '';
      var hashIdx = href.indexOf('#');
      if (hashIdx < 0) return;
      var hash = href.slice(hashIdx + 1);
      if (!hash) return;
      // Only intercept same-page anchors (no path before #).
      var pathPart = href.slice(0, hashIdx);
      if (pathPart && pathPart !== window.location.pathname) return;
      a.dataset.aiconiqReady = '1';
      a.addEventListener('click', function (e) {
        var el = document.getElementById(hash);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + hash);
      });
    });
  }

  // ------------------------------------------------------------------
  // Testimonials slider — replicates the basic carousel behavior
  // without depending on Swiper.
  //
  // Markup contract:
  //   <div data-aiconiq-slider>
  //     <div data-slider-track>
  //       <div data-slider-slide>...</div> ...
  //     </div>
  //     <button data-slider-prev>...</button>
  //     <button data-slider-next>...</button>
  //     <div data-slider-dots></div>
  //   </div>
  // ------------------------------------------------------------------
  function initSliders(root) {
    var sliders = (root || document).querySelectorAll('[data-aiconiq-slider]');
    sliders.forEach(function (slider) {
      if (slider.dataset.aiconiqReady === '1') return;
      slider.dataset.aiconiqReady = '1';
      var track = slider.querySelector('[data-slider-track]');
      var slides = slider.querySelectorAll('[data-slider-slide]');
      if (!track || slides.length < 2) return;
      var prev = slider.querySelector('[data-slider-prev]');
      var next = slider.querySelector('[data-slider-next]');
      var dotsHost = slider.querySelector('[data-slider-dots]');
      var index = 0;

      // Dot buttons.
      if (dotsHost) {
        dotsHost.innerHTML = '';
        slides.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Slide ' + (i + 1));
          dot.className = 'w-2 h-2 rounded-full bg-white/30 transition-colors';
          dot.addEventListener('click', function () { go(i); });
          dotsHost.appendChild(dot);
        });
      }

      function update() {
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
        slides.forEach(function (s, i) {
          s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });
        if (dotsHost) {
          dotsHost.querySelectorAll('button').forEach(function (b, i) {
            b.className = 'w-2 h-2 rounded-full transition-colors ' +
              (i === index ? 'bg-[#d8008d]' : 'bg-white/30 hover:bg-white/50');
          });
        }
      }
      function go(i) {
        index = ((i % slides.length) + slides.length) % slides.length;
        update();
      }
      function goPrev() { go(index - 1); }
      function goNext() { go(index + 1); }

      track.style.display = 'flex';
      track.style.transition = 'transform 400ms ease';
      track.style.willChange = 'transform';
      slides.forEach(function (s) {
        s.style.flex = '0 0 100%';
        s.style.minWidth = '0';
      });

      if (prev) prev.addEventListener('click', goPrev);
      if (next) next.addEventListener('click', goNext);

      // Swipe support (basic).
      var startX = 0;
      var dx = 0;
      track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX; dx = 0;
        track.style.transition = 'none';
      }, { passive: true });
      track.addEventListener('touchmove', function (e) {
        dx = e.touches[0].clientX - startX;
        track.style.transform = 'translateX(calc(' + (-index * 100) + '% + ' + dx + 'px))';
      }, { passive: true });
      track.addEventListener('touchend', function () {
        track.style.transition = 'transform 400ms ease';
        if (Math.abs(dx) > 60) {
          if (dx < 0) goNext(); else goPrev();
        } else {
          update();
        }
      });

      update();
    });
  }

  // ------------------------------------------------------------------
  // Calendly popups — buttons with [data-aiconiq-calendly] open the
  // configured Calendly URL. The Calendly external script is enqueued
  // by WP only on pages that need it.
  // ------------------------------------------------------------------
  function initCalendly(root) {
    var btns = (root || document).querySelectorAll('[data-aiconiq-calendly]');
    btns.forEach(function (b) {
      if (b.dataset.aiconiqReady === '1') return;
      b.dataset.aiconiqReady = '1';
      b.addEventListener('click', function (e) {
        var url = b.getAttribute('data-aiconiq-calendly');
        if (!url || !window.Calendly) return;
        e.preventDefault();
        window.Calendly.initPopupWidget({ url: url });
      });
    });
  }

  // ------------------------------------------------------------------
  // Mobile menu toggle — for the inline nav row.
  //
  //   <button data-aiconiq-burger aria-controls="menu-id">...</button>
  //   <div id="menu-id" data-aiconiq-mobile-menu>...</div>
  // ------------------------------------------------------------------
  function initMobileMenu(root) {
    var triggers = (root || document).querySelectorAll('[data-aiconiq-burger]');
    triggers.forEach(function (trigger) {
      if (trigger.dataset.aiconiqReady === '1') return;
      trigger.dataset.aiconiqReady = '1';
      var menuId = trigger.getAttribute('aria-controls');
      var menu = menuId ? document.getElementById(menuId) : null;
      if (!menu) return;
      var setOpen = function (open) {
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        menu.setAttribute('data-open', open ? '1' : '0');
        document.body.style.overflow = open ? 'hidden' : '';
      };
      setOpen(false);
      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        setOpen(!isOpen);
      });
      // Close on link click inside.
      menu.querySelectorAll('a, [data-close-menu]').forEach(function (el) {
        el.addEventListener('click', function () { setOpen(false); });
      });
      // Close on Esc.
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
      });
    });
  }

  // ------------------------------------------------------------------
  // Count-up on view — animate numbers from 0 to the target when the
  // element first scrolls into view. Marks elements with
  //   <span data-aiconiq-countup>54%</span>
  // and replaces the digit portion with an animated counter. The non-digit
  // surroundings (prefix, suffix, %, etc.) are preserved.
  // ------------------------------------------------------------------
  function initCountUp(root) {
    var els = (root || document).querySelectorAll('[data-aiconiq-countup]');
    if (!els.length || typeof IntersectionObserver === 'undefined') return;

    var parseParts = function (text) {
      // Find first run of digits (with optional decimal).
      var m = String(text).match(/(-?[\d]+(?:[\.,]\d+)?)/);
      if (!m) return null;
      var num = m[1].replace(',', '.');
      var idx = text.indexOf(m[1]);
      return {
        prefix: text.slice(0, idx),
        suffix: text.slice(idx + m[1].length),
        magnitude: parseFloat(num),
        isInt: num.indexOf('.') < 0,
      };
    };

    var animate = function (el) {
      if (el.dataset.aiconiqCountupRan === '1') return;
      el.dataset.aiconiqCountupRan = '1';
      var raw = el.textContent.trim();
      var p = parseParts(raw);
      if (!p) return;
      // Customizable duration via data attribute, default 1800ms.
      var duration = parseInt(el.getAttribute('data-duration') || '1800', 10);
      var start = performance.now();
      var step = function (now) {
        var t = Math.min(1, (now - start) / duration);
        // ease-out cubic
        var eased = 1 - Math.pow(1 - t, 3);
        var value = p.magnitude * eased;
        var shown = p.isInt ? Math.round(value) : value.toFixed(1);
        el.textContent = p.prefix + shown + p.suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = raw; // snap to exact final value
      };
      el.textContent = p.prefix + (p.isInt ? '0' : '0.0') + p.suffix;
      requestAnimationFrame(step);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) animate(entry.target);
      });
    }, { threshold: 0.2 });

    els.forEach(function (el) { io.observe(el); });
  }

  // ------------------------------------------------------------------
  // Security block — sticky right-side image that swaps as the user
  // scrolls through the card list. Mirrors the React Security section's
  // scroll-driven behavior using IntersectionObserver instead of
  // framer-motion's useInView.
  //
  // Markup contract (set by page-templates/blocks/security.php):
  //   <section data-aiconiq-security>
  //     <div data-security-cards>
  //       <article data-security-card data-image="...url..."> ... </article>
  //       <article data-security-card data-image="..."> ... </article>
  //     </div>
  //     <img data-security-active alt="" />
  //   </section>
  // ------------------------------------------------------------------
  function initSecurityScroll(root) {
    var sections = (root || document).querySelectorAll('[data-aiconiq-security]');
    sections.forEach(function (section) {
      if (section.dataset.aiconiqReady === '1') return;
      section.dataset.aiconiqReady = '1';
      var cards = section.querySelectorAll('[data-security-card]');
      var img = section.querySelector('[data-security-active]');
      if (!img || !cards.length) return;

      var setActive = function (idx) {
        var card = cards[idx];
        if (!card) return;
        var src = card.getAttribute('data-image');
        if (src && img.getAttribute('src') !== src) {
          img.style.opacity = '0';
          setTimeout(function () {
            img.setAttribute('src', src);
            img.style.opacity = '1';
          }, 150);
        }
        cards.forEach(function (c, i) {
          c.style.opacity = i === idx ? '1' : '0.5';
        });
      };

      img.style.transition = 'opacity 300ms ease';
      cards.forEach(function (c) {
        c.style.transition = 'opacity 300ms ease';
      });
      setActive(0);

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var idx = parseInt(entry.target.getAttribute('data-card-index') || '0', 10);
            setActive(idx);
          }
        });
      }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

      cards.forEach(function (c, i) {
        c.setAttribute('data-card-index', i);
        io.observe(c);
      });
    });
  }

  // ------------------------------------------------------------------
  // Sticky header — for the floating dark nav that slides in once the
  // inline nav at the top of the page scrolls off.
  //
  //   <div data-aiconiq-sticky-trigger>...</div>  ← the inline nav row
  //   <header data-aiconiq-sticky>...</header>    ← the floating one
  // ------------------------------------------------------------------
  function initStickyHeader() {
    var sticky = document.querySelector('[data-aiconiq-sticky]');
    var trigger = document.querySelector('[data-aiconiq-sticky-trigger]');
    if (!sticky) return;
    var FALLBACK = 80;
    var update = function () {
      var visible = false;
      if (trigger) {
        var rect = trigger.getBoundingClientRect();
        visible = rect.top + rect.height / 2 < 0;
      } else {
        visible = window.scrollY > FALLBACK;
      }
      sticky.setAttribute('data-visible', visible ? '1' : '0');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  // ------------------------------------------------------------------
  // Public init — call on DOMContentLoaded and expose for re-runs
  // after dynamic content updates (e.g. WP block previews).
  // ------------------------------------------------------------------
  function initAll(root) {
    initVideos(root);
    initAnchors(root);
    initSliders(root);
    initCalendly(root);
    initMobileMenu(root);
    initCountUp(root);
    initSecurityScroll(root);
  }

  function boot() {
    initAll(document);
    initStickyHeader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.AICONIQ = window.AICONIQ || {};
  window.AICONIQ.init = initAll;
})();
