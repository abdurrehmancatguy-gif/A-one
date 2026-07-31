/* ==========================================================================
   A-ONE International General Trading
   Site behaviour: reveals, header states, navigation, counters, accordion,
   form handling. Vanilla JS, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     Page ready — fades the document in. A timeout backstop guarantees the
     page becomes visible even if something below throws.
     ---------------------------------------------------------------------- */
  function markReady() {
    document.body.classList.add("is-ready");
  }
  if (document.readyState === "complete") {
    markReady();
  } else {
    window.addEventListener("load", markReady);
  }
  setTimeout(markReady, 1200);

  /* ----------------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    // Stagger anything inside a [data-reveal-group] by its position.
    document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
      var step = parseFloat(group.getAttribute("data-reveal-group")) || 0.09;
      group.querySelectorAll("[data-reveal]").forEach(function (child, i) {
        if (!child.style.getPropertyValue("--reveal-delay")) {
          child.style.setProperty("--reveal-delay", (i * step).toFixed(2) + "s");
        }
      });
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) {
      // Anything already in view on load reveals immediately, no flash.
      var box = el.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.92 && box.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    });
  }

  /* ----------------------------------------------------------------------
     Header state on scroll + back-to-top button
     ---------------------------------------------------------------------- */
  function initScrollChrome() {
    var header = document.querySelector(".header");
    var toTop = document.querySelector(".to-top");
    if (!header && !toTop) return;

    var overlay = header && header.classList.contains("header--overlay");
    var threshold = overlay ? Math.min(window.innerHeight * 0.6, 520) : 12;
    var ticking = false;

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (header) header.classList.toggle("is-solid", y > threshold);
      if (toTop) toTop.classList.toggle("is-visible", y > window.innerHeight * 0.9);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener("resize", function () {
      threshold = overlay ? Math.min(window.innerHeight * 0.6, 520) : 12;
      update();
    }, { passive: true });

    update();

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  }

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  function initMobileNav() {
    var burger = document.querySelector(".burger");
    var drawer = document.querySelector(".mobile-nav");
    if (!burger || !drawer) return;

    function setOpen(open) {
      burger.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("nav-open", open);
      if (open) {
        var first = drawer.querySelector("a");
        if (first) first.focus({ preventScroll: true });
      }
    }

    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });

    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        burger.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) setOpen(false);
    }, { passive: true });

    setOpen(false);
  }

  /* ----------------------------------------------------------------------
     Scroll spy — highlights the nav link for the section currently in view.
     Single-page site, so every nav link is an in-page anchor.
     ---------------------------------------------------------------------- */
  function initScrollSpy() {
    var links = [].slice.call(
      document.querySelectorAll('.nav__link[href^="#"], .mobile-nav__link[href^="#"]')
    );
    if (!links.length) return;

    var targets = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) targets.push({ link: link, section: section });
    });
    if (!targets.length) return;

    var ticking = false;

    function update() {
      var header = document.querySelector(".header");
      var offset = (header ? header.offsetHeight : 0) + 24;
      var current = null;

      targets.forEach(function (t) {
        if (t.section.getBoundingClientRect().top <= offset) current = t;
      });

      // Past the end of the document, the last section wins.
      if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 2) {
        current = targets[targets.length - 1];
      }

      targets.forEach(function (t) {
        var on = t === current;
        t.link.classList.toggle("is-active", on);
        if (on) t.link.setAttribute("aria-current", "true");
        else t.link.removeAttribute("aria-current");
      });

      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ----------------------------------------------------------------------
     Accordion
     ---------------------------------------------------------------------- */
  function initAccordion() {
    document.querySelectorAll(".accordion").forEach(function (accordion) {
      var single = accordion.hasAttribute("data-single");
      var triggers = accordion.querySelectorAll(".accordion__trigger");

      triggers.forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          var item = trigger.closest(".accordion__item");
          var open = trigger.getAttribute("aria-expanded") === "true";

          if (single && !open) {
            triggers.forEach(function (other) {
              other.setAttribute("aria-expanded", "false");
              other.closest(".accordion__item").classList.remove("is-open");
            });
          }

          trigger.setAttribute("aria-expanded", String(!open));
          item.classList.toggle("is-open", !open);
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
     Hero parallax on the drifting shapes
     ---------------------------------------------------------------------- */
  function initParallax() {
    if (reduceMotion) return;
    var shapes = document.querySelectorAll("[data-parallax]");
    if (!shapes.length) return;

    var ticking = false;
    function update() {
      var y = window.pageYOffset || 0;
      shapes.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        el.style.setProperty("--parallax", (y * speed).toFixed(1) + "px");
        el.style.translate = "0 " + (y * speed).toFixed(1) + "px";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Contact form
     This is a static site with no backend, so a validated submission is
     handed to the visitor's mail client. Swap in a real endpoint (Formspree,
     Netlify Forms, your own API) by giving the <form> an action + method
     and deleting this handler — see README.
     ---------------------------------------------------------------------- */
  function initForm() {
    var form = document.querySelector("[data-mailto-form]");
    if (!form) return;

    var status = form.querySelector(".form__status");
    var recipient = form.getAttribute("data-mailto-form");

    function fieldOf(input) { return input.closest(".field"); }

    function validate(input) {
      var wrap = fieldOf(input);
      if (!wrap) return true;
      var ok = input.checkValidity();
      wrap.classList.toggle("has-error", !ok);
      var msg = wrap.querySelector(".field__error");
      if (msg && !ok) msg.textContent = input.validationMessage;
      return ok;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("blur", function () { validate(input); });
      input.addEventListener("input", function () {
        var wrap = fieldOf(input);
        if (wrap && wrap.classList.contains("has-error")) validate(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var inputs = form.querySelectorAll("input, select, textarea");
      var valid = true;
      var firstBad = null;

      inputs.forEach(function (input) {
        if (!validate(input)) {
          valid = false;
          if (!firstBad) firstBad = input;
        }
      });

      if (!valid) {
        if (firstBad) firstBad.focus();
        return;
      }

      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var subject = "Enquiry from " + (name || "the A-One website");

      var lines = [];
      data.forEach(function (value, key) {
        var label = key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ");
        lines.push(label + ": " + value);
      });

      var href = "mailto:" + recipient +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      if (status) {
        status.textContent =
          "Opening your email app with this enquiry ready to send. " +
          "If nothing happens, write to us directly at " + recipient + ".";
        status.classList.add("is-visible");
      }

      window.location.href = href;
    });
  }

  /* ----------------------------------------------------------------------
     Consent
     The site sets no tracking, analytics or advertising cookies. The only
     thing that actually discloses anything about a visitor is the web-font
     request, which hands their IP address to Google — so that is what this
     gates. Accept and Decline carry equal weight; declining is a real
     outcome, not a delay. One localStorage entry remembers the answer.
     ---------------------------------------------------------------------- */
  function initConsent() {
    var KEY = "aone-consent";
    var banner = document.querySelector("[data-consent-banner]");
    if (!banner) return;

    // Falls back to memory when storage is blocked (private browsing).
    var sessionChoice = null;

    function read() {
      try { return localStorage.getItem(KEY); } catch (e) { return sessionChoice; }
    }
    function write(value) {
      sessionChoice = value;
      try { localStorage.setItem(KEY, value); } catch (e) {}
    }

    function open() {
      banner.hidden = false;
      // Force layout so the slide-up has a start value to animate from.
      // Deliberately not requestAnimationFrame: that is throttled in
      // background tabs, which would leave the banner parked off-screen.
      void banner.offsetHeight;
      banner.classList.add("is-open");
      document.body.classList.add("consent-open");
    }

    function close() {
      banner.classList.remove("is-open");
      document.body.classList.remove("consent-open");
      window.setTimeout(function () { banner.hidden = true; }, reduceMotion ? 0 : 650);
    }

    banner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var choice = btn.getAttribute("data-consent");
      write(choice);
      if (choice === "granted" && typeof window.__aoneLoadFonts === "function") {
        window.__aoneLoadFonts();
      }
      close();
    });

    document.querySelectorAll("[data-consent-reopen]").forEach(function (el) {
      el.addEventListener("click", function () {
        open();
        var first = banner.querySelector("[data-consent]");
        if (first) first.focus({ preventScroll: true });
      });
    });

    // Lets any future analytics ask before it loads.
    window.__aoneConsent = read;

    if (!read()) window.setTimeout(open, 700);
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ----------------------------------------------------------------------
     Boot — each module isolated so one failure can't take down the rest
     ---------------------------------------------------------------------- */
  function boot() {
    [
      initReveal, initScrollChrome, initMobileNav, initScrollSpy,
      initAccordion, initParallax, initForm, initConsent, initYear
    ].forEach(function (fn) {
      try { fn(); } catch (err) {
        if (window.console) console.error("[a-one] " + fn.name + " failed:", err);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
