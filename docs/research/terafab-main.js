/* TERAFAB — minimal, considered interactions */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var qsa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  /* coalesce scroll work to one call per frame (avoids repeated layout reads per scroll event) */
  var rafThrottle = function (fn) {
    var scheduled = false;
    return function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () { scheduled = false; fn(); });
    };
  };

  /* nav — frost on scroll; logo + CTAs appear once hero actions scroll past */
  var nav = document.getElementById("nav");
  var heroActions = document.querySelector("#hero .hero__actions");
  var NAV_SCROLL = 320;
  var logoRetracted = false;
  var heroPast = false;
  var atFooter = false;

  function isHeroActionsPast() {
    if (!heroActions) return false;
    var r = heroActions.getBoundingClientRect();
    return r.bottom <= 0;
  }

  function setHeroPast(past) {
    if (!nav || past === heroPast) return;
    heroPast = past;
    nav.classList.toggle("nav--cta-visible", past);
    updateLogoRetract();
  }

  function setAtFooter(at) {
    if (at === atFooter) return;
    atFooter = at;
    updateLogoRetract();
  }

  /* T-tile while scrolling the body; full wordmark at the top (hero) and again
     once the footer is reached */
  function updateLogoRetract() {
    setLogoRetract(heroPast && !atFooter);
  }

  function setLogoRetract(retract) {
    if (!nav || retract === logoRetracted) return;
    logoRetracted = retract;
    nav.classList.toggle("nav--logo-retract", retract);
  }

  function navEase(t) { return 1 - Math.pow(1 - t, 2.4); }
  function onScroll() {
    if (!nav) return;
    var y = window.scrollY || 0;
    var t = navEase(Math.min(1, y / NAV_SCROLL));
    nav.style.setProperty("--nav-blur", (t * 26).toFixed(1) + "px");
    nav.style.setProperty("--nav-bg", (t * 0.88).toFixed(3));
    nav.style.setProperty("--nav-fade", t.toFixed(3));
  }
  window.addEventListener("scroll", rafThrottle(onScroll), { passive: true });

  if (heroActions && "IntersectionObserver" in window) {
    var heroPastIo = new IntersectionObserver(function (entries) {
      var e = entries[0];
      if (!e) return;
      var past = !e.isIntersecting && e.boundingClientRect.top < 0;
      setHeroPast(past);
    }, { threshold: 0 });
    heroPastIo.observe(heroActions);
  } else if (heroActions) {
    window.addEventListener("scroll", function () {
      setHeroPast(isHeroActionsPast());
    }, { passive: true });
  }

  var footerEl = document.getElementById("join");
  function isFooterReached() {
    if (!footerEl) return false;
    var r = footerEl.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top <= vh * 0.5;
  }
  if (footerEl && "IntersectionObserver" in window) {
    var footerIo = new IntersectionObserver(function (entries) {
      var e = entries[0];
      if (!e) return;
      setAtFooter(e.isIntersecting);
    }, { threshold: 0, rootMargin: "0px 0px -50% 0px" });
    footerIo.observe(footerEl);
  } else if (footerEl) {
    window.addEventListener("scroll", function () {
      setAtFooter(isFooterReached());
    }, { passive: true });
  }

  setHeroPast(isHeroActionsPast());
  onScroll();

  document.body.classList.add("is-loaded");

  /* structural grid — one static overlay per section (no scroll switching) */
  qsa("[data-grid-lines]").forEach(function (sec) {
    var misplaced = sec.querySelector(".container > .section-grid, .kard-shell > .section-grid");
    if (misplaced) sec.insertBefore(misplaced, sec.firstChild);
    var existing = sec.querySelector(":scope > .section-grid");
    if (existing) {
      var oldHlines = existing.querySelector(".section-grid__hlines");
      if (oldHlines) oldHlines.remove();
      return;
    }
    var wrap = document.createElement("div");
    wrap.className = "section-grid";
    wrap.setAttribute("aria-hidden", "true");
    var frame = document.createElement("div");
    frame.className = "section-grid__frame";
    for (var c = 0; c < 12; c++) {
      var col = document.createElement("span");
      col.className = "section-grid__col";
      frame.appendChild(col);
    }
    wrap.appendChild(frame);
    sec.insertBefore(wrap, sec.firstChild);
  });

  /* load sequence — logo → hero copy → grid intro */
  var heroEl = document.getElementById("hero");
  var HERO_READY_DELAY = 280;
  function revealNavLogo() {
    if (nav) nav.classList.add("nav--logo-in");
  }
  function revealHero() {
    if (heroEl) heroEl.classList.add("hero--ready");
  }
  if (reduced) {
    revealNavLogo();
    revealHero();
  } else {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        revealNavLogo();
        window.setTimeout(revealHero, HERO_READY_DELAY);
      });
    });
  }

  /* output gauge — trigger earlier + slower fill (easy to miss on fast scroll) */
  var gaugeEl = document.querySelector("#output .gauge");
  if (gaugeEl) {
    if (reduced) gaugeEl.classList.add("gauge--in-view");
    else if ("IntersectionObserver" in window) {
      var gIo = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (e.isIntersecting) {
            gaugeEl.classList.add("gauge--in-view");
            gIo.unobserve(e.target);
          }
        });
      }, { threshold: 0.22, rootMargin: "0px 0px 18% 0px" });
      gIo.observe(gaugeEl);
    } else gaugeEl.classList.add("gauge--in-view");
  }

  /* scaling — label ticks aligned to Scaling_clean.png column centers */
  var scalingDiagram = document.querySelector("#scaling .diagram");
  var scalingImg = scalingDiagram ? scalingDiagram.querySelector("img") : null;
  /* anchors are percentages of the intrinsic image — viewport-independent, so
     scan the pixels once and reuse (resize just re-applies the cached values) */
  var scalingMeasured = null;
  var SCALING_FALLBACK = {
    optimus:  { cx: 270, left: 250, top: 690, base: 718 },
    starship: { cx: 477, left: 405, top: 250, base: 718 },
    sat:      { cx: 693, left: 676, top: 64,  base: 718 }
  };
  function measureScalingAnchors(img) {
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    if (!w || !h) return null;
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, w, h).data;
    var bands = [
      { key: "optimus", x0: 0, x1: Math.floor(w / 3) },
      { key: "starship", x0: Math.floor(w / 3), x1: Math.floor((2 * w) / 3) },
      { key: "sat", x0: Math.floor((2 * w) / 3), x1: w }
    ];
    var out = {};
    bands.forEach(function (band) {
      var mass = 0, weighted = 0, minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, i;
      for (var x = band.x0; x < band.x1; x++) {
        var count = 0, cMinY = Infinity, cMaxY = -Infinity;
        for (var y = 0; y < h; y++) {
          i = (y * w + x) * 4;
          if (Math.max(data[i], data[i + 1], data[i + 2]) > 8 && data[i + 3] > 8) {
            count++;
            if (y < cMinY) cMinY = y;
            if (y > cMaxY) cMaxY = y;
          }
        }
        if (count > 2) {
          mass += count; weighted += x * count;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (cMinY < minY) minY = cMinY;
          if (cMaxY > maxY) maxY = cMaxY;
        }
      }
      out[band.key] = mass ? { cx: weighted / mass, left: minX, right: maxX, top: minY, base: maxY } : null;
    });
    return out;
  }
  function applyScalingAnchors() {
    if (!scalingDiagram) return;
    var w = scalingImg && scalingImg.naturalWidth ? scalingImg.naturalWidth : 985;
    var h = scalingImg && scalingImg.naturalHeight ? scalingImg.naturalHeight : 777;
    var measured = scalingImg ? (scalingMeasured || (scalingMeasured = measureScalingAnchors(scalingImg))) : null;
    var s = scalingDiagram.style;
    ["optimus", "starship", "sat"].forEach(function (key) {
      var o = (measured && measured[key]) || SCALING_FALLBACK[key];
      s.setProperty("--anchor-" + key, (o.cx / w * 100).toFixed(2) + "%");
      s.setProperty("--obj-" + key + "-x", (o.left / w * 100).toFixed(2) + "%");
      s.setProperty("--obj-" + key + "-base", (o.base / h * 100).toFixed(2) + "%");
      s.setProperty("--obj-" + key + "-h", ((o.base - o.top) / h * 100).toFixed(2) + "%");
    });
  }
  applyScalingAnchors();
  if (scalingImg) {
    if (!scalingImg.complete) scalingImg.addEventListener("load", applyScalingAnchors);
    else applyScalingAnchors();
    window.addEventListener("resize", applyScalingAnchors);
  }

  /* subtle reveal */
  var SEL = ".reveal, .h2, .statement";
  var els = qsa(SEL);
  els.forEach(function (el) {
    var p = el.parentElement; if (!p) return;
    var sibs = Array.prototype.filter.call(p.children, function (c) { return c.matches && c.matches(SEL); });
    var i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty("--reveal-delay", Math.min(i * 0.07, 0.4) + "s");
  });
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } }); }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in-view"); }); }

  /* space — Always Sunny wordmark (five words, fill-in stagger via CSS) */
  function prepareSunnySvg(root) {
    if (!root || root.dataset.words) return;
    if (!qsa(".sunny__word", root).length) return;
    root.dataset.words = "1";
  }
  function replaySunnyWordmark(root) {
    if (!root) return;
    root.classList.remove("space__sunny--ready");
    void root.offsetWidth;
    root.classList.add("space__sunny--ready");
  }
  function sunnyMarkInView(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var visH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    return visH >= Math.min(Math.max(r.height * 0.22, 40), 120) && r.top < vh * 0.9;
  }
  function wireSunnyWordmark(root) {
    if (!root) return;
    if (reduced) { replaySunnyWordmark(root); return; }
    var armed = false;
    function onEnter() {
      armed = true;
      replaySunnyWordmark(root);
    }
    function onLeave() {
      armed = false;
    }
    if ("IntersectionObserver" in window) {
      var sunnyIo = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (e.target !== root) return;
          var show = e.isIntersecting && e.intersectionRatio >= 0.12;
          if (show && !armed) onEnter();
          else if (!show && armed) onLeave();
        });
      }, { threshold: [0, 0.06, 0.12, 0.22, 0.38, 0.55], rootMargin: "0px 0px -10% 0px" });
      sunnyIo.observe(root);
      if (sunnyMarkInView(root)) onEnter();
    } else replaySunnyWordmark(root);
  }
  function initSunnyWordmark() {
    var inline = document.querySelector("svg.space__sunny");
    if (inline) {
      prepareSunnySvg(inline);
      wireSunnyWordmark(inline);
      return;
    }
    var img = document.querySelector("img.space__sunny");
    if (!img || img.dataset.sunnyLoad) return;
    img.dataset.sunnyLoad = "1";
    fetch(img.src).then(function (r) { return r.text(); }).then(function (txt) {
      var doc = new DOMParser().parseFromString(txt, "image/svg+xml");
      var el = doc.documentElement;
      if (!el || el.querySelector("parsererror")) {
        replaySunnyWordmark(img);
        return;
      }
      el.classList.add("space__sunny");
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", img.getAttribute("alt") || "Always sunny in space");
      el.removeAttribute("width");
      el.removeAttribute("height");
      img.parentNode.replaceChild(el, img);
      prepareSunnySvg(el);
      wireSunnyWordmark(el);
    }).catch(function () { wireSunnyWordmark(img); });
  }
  initSunnyWordmark();

  /* statement — words turn white as you scroll through the block */
  var stmtSec = document.querySelector(".statement-sec");
  var stmtEl = stmtSec ? stmtSec.querySelector(".statement") : null;
  if (stmtEl && !stmtEl.dataset.words) {
    stmtEl.dataset.words = "1";
    var parts = stmtEl.innerHTML.trim().split(/<br\s*\/?>/i);
    var words = [];
    parts.forEach(function (html, li) {
      if (li) words.push({ br: true });
      html.replace(/<[^>]+>/g, "").trim().split(/\s+/).filter(Boolean).forEach(function (w) {
        words.push({ text: w });
      });
    });
    var wordCount = words.filter(function (x) { return x.text; }).length;
    var emphFrom = Math.max(0, wordCount - 5);
    stmtEl.textContent = "";
    var wi = 0;
    var needSpace = false;
    words.forEach(function (item) {
      if (item.br) {
        stmtEl.appendChild(document.createElement("br"));
        needSpace = false;
        return;
      }
      if (needSpace) stmtEl.appendChild(document.createTextNode(" "));
      var span = document.createElement("span");
      span.className = "statement__w" + (wi >= emphFrom ? " statement__w--emph" : "");
      span.textContent = item.text;
      stmtEl.appendChild(span);
      wi += 1;
      needSpace = true;
    });
  }
  var stmtWords = stmtEl ? qsa(".statement__w", stmtEl) : [];
  if (stmtSec && stmtWords.length) {
    function applyStatementScroll() {
      var rect = stmtSec.getBoundingClientRect();
      var vh = window.innerHeight;
      var t = (vh * 0.72 - rect.top) / (rect.height + vh * 0.16);
      t = Math.max(0, Math.min(1, t));
      var lit = Math.ceil(t * stmtWords.length);
      stmtWords.forEach(function (w, i) { w.classList.toggle("is-lit", i < lit); });
    }
    if (reduced) stmtWords.forEach(function (w) { w.classList.add("is-lit"); });
    else {
      window.addEventListener("scroll", rafThrottle(applyStatementScroll), { passive: true });
      window.addEventListener("resize", applyStatementScroll, { passive: true });
      applyStatementScroll();
    }
  }

  var siteDesktopMq = window.matchMedia("(min-width: 981px)");
  function siteDesktop() { return siteDesktopMq.matches; }
  function scrollVh() {
    return window.innerHeight || document.documentElement.clientHeight;
  }

  /* sun — marker anchor (video frame @ object-position 54% 50%) */
  var sunSection = document.getElementById("sun");
  var sunVideo = sunSection ? sunSection.querySelector(".scene__bg") : null;
  var sunMode = null;
  function sunWantedSrc() {
    if (!sunVideo) return "";
    return siteDesktop() ? sunVideo.dataset.srcDesktop : sunVideo.dataset.srcMobile;
  }
  function setSunSource() {
    if (!sunVideo) return;
    var src = sunWantedSrc();
    if (!src) return;
    var mode = siteDesktop() ? "desktop" : "mobile";
    var cur = sunVideo.querySelector("source");
    var needSwap = !cur || cur.getAttribute("src") !== src;
    if (!needSwap && mode === sunMode) return;
    sunMode = mode;
    if (!needSwap) return;
    sunVideo.innerHTML = "";
    var s = document.createElement("source");
    s.src = src;
    s.type = "video/mp4";
    sunVideo.appendChild(s);
    sunVideo.load();
    var pr = sunVideo.play();
    if (pr && pr.catch) pr.catch(function () {});
  }
  function applySunMarkerAnchor() {
    if (!sunSection) return;
    sunSection.style.setProperty("--sun-marker-x", "20%");
    sunSection.style.setProperty("--sun-marker-y", "27.4%");
  }
  applySunMarkerAnchor();
  if (sunVideo && !sunVideo.complete) sunVideo.addEventListener("loadeddata", applySunMarkerAnchor);
  if (sunVideo) {
    function onSunLayoutChange() { setSunSource(); applySunMarkerAnchor(); }
    if (siteDesktopMq.addEventListener) siteDesktopMq.addEventListener("change", onSunLayoutChange);
    else siteDesktopMq.addListener(onSunLayoutChange);
  }

  /* sun — handwritten SVG label (solid fill ink-in, no stroke), circle around earth */
  var sunMarker = document.querySelector(".sun__marker");
  var sunLabel = sunMarker ? sunMarker.querySelector(".sun__label") : null;
  var sunHideMarker = window.matchMedia("(max-width: 980px)").matches;
  if (sunLabel && !sunHideMarker && !sunLabel.querySelector(".sun__label-svg")) {
    fetch("assets/sun/you-are-here.svg")
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var doc = new DOMParser().parseFromString(txt, "image/svg+xml");
        var svg = doc.documentElement;
        if (!svg || svg.querySelector("parsererror")) return;
        sunLabel.appendChild(document.importNode(svg, true));
      })
      .catch(function () {});
  }
  if (sunMarker && sunSection && !sunHideMarker) {
    if (reduced) sunMarker.classList.add("sun__marker--in-view");
    else if ("IntersectionObserver" in window) {
      var sunIo = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (e.isIntersecting) { sunMarker.classList.add("sun__marker--in-view"); sunIo.unobserve(e.target); }
        });
      }, { threshold: 0.32 });
      sunIo.observe(sunSection);
    } else sunMarker.classList.add("sun__marker--in-view");
  }

  var sunScrim = document.querySelector(".sun__scrim");
  if (sunSection && sunScrim && !reduced && siteDesktop()) {
    function applySunScrim() {
      var r = sunSection.getBoundingClientRect();
      var vh = scrollVh();
      var mid = r.top + r.height * 0.38;
      var fade = Math.max(0, Math.min(1, (mid - vh * 0.22) / (vh * 0.38)));
      sunScrim.style.opacity = String(0.22 + fade * 0.78);
      sunScrim.style.setProperty("--sun-line", String(0.12 + fade * 0.38));
    }
    applySunScrim();
    window.addEventListener("scroll", rafThrottle(applySunScrim), { passive: true });
    window.addEventListener("resize", applySunScrim, { passive: true });
  }

  /* kardashev: desktop = 1080p hard cut; mobile = 720p is-active + instant handoff */
  var tiers = qsa(".scale__tier");
  var ksection = document.getElementById("kardashev"), shell = ksection ? ksection.querySelector(".kard-shell") : null;
  var seg = {}; qsa(".kard__vid").forEach(function (v) { seg[v.dataset.seg] = v; });
  var dur = { "1": 6.083, "2": 6.083 }, lastTier = 0, kTarget = 0, kCurrent = 0, kardSegOn = 1, kardMode = null;
  // android's MediaCodec makes paused-video seeking janky, so on android we scrub a
  // preloaded webp frame sequence on a canvas instead. ios/desktop keep the <video> path.
  var kIsAndroid = /Android/i.test(navigator.userAgent || "");
  var KFPS = 10;                                  // frames were extracted at 10fps
  var KFRAME_COUNT = { "1": 61, "2": 61 };
  var kframes = { "1": [], "2": [] }, kCanvas = null, kCtx = null;
  function setTier(n) {
    if (n === lastTier) return;
    lastTier = n;
    tiers.forEach(function (t) { t.classList.toggle("is-active", t.dataset.tier === String(n)); });
  }
  function applyTierVisual(p) {
    if (siteDesktop()) {
      setTier(p < 0.25 ? 1 : (p < 0.75 ? 2 : 3));
      tiers.forEach(function (t) { t.style.opacity = ""; });
      return;
    }
    tiers.forEach(function (t) {
      var n = parseInt(t.dataset.tier, 10);
      var center = n === 1 ? 0.14 : n === 2 ? 0.5 : 0.86;
      var o = 0.42 + 0.58 * Math.max(0, 1 - Math.abs(p - center) / 0.3);
      t.style.opacity = String(Math.min(1, o));
      t.classList.toggle("is-active", o >= 0.8);
      if (o >= 0.8) lastTier = n;
    });
  }
  function clearKardSegStyles() {
    Object.keys(seg).forEach(function (k) {
      var v = seg[k];
      v.style.opacity = "";
      v.style.visibility = "";
      v.classList.remove("is-active");
    });
    if (seg["1"]) seg["1"].classList.add("is-active");
  }
  function setKardSources() {
    if (kIsAndroid) { kSetupCanvas(); return; } // android uses the frame canvas, not videos
    var desktop = siteDesktop();
    var mode = desktop ? "desktop" : "mobile";
    if (mode === kardMode) return;
    kardMode = mode;
    kardSegOn = 1;
    Object.keys(seg).forEach(function (k) {
      var v = seg[k], tag = desktop ? v.dataset.srcDesktop : v.dataset.srcMobileMp4, webm = desktop ? null : v.dataset.srcMobileWebm;
      if (!tag) return;
      delete v.dataset.kardPrimed;
      delete v.dataset.kardSeeking;
      delete v.dataset.kardSeek;
      v.preload = "metadata";
      v.innerHTML = "";
      if (desktop) {
        var mp4 = document.createElement("source");
        mp4.src = tag;
        mp4.type = "video/mp4";
        v.appendChild(mp4);
      } else {
        var m4 = document.createElement("source");
        m4.src = tag;
        m4.type = "video/mp4";
        v.appendChild(m4);
        if (webm) {
          var wm = document.createElement("source");
          wm.src = webm;
          wm.type = "video/webm";
          v.appendChild(wm);
        }
      }
      v.load();
    });
    clearKardSegStyles();
  }
  function showSeg(n) {
    var useTwo = n === 2 && seg["2"] && seg["2"].readyState >= 1;
    if (seg["1"]) seg["1"].classList.toggle("is-active", n === 1 || (n === 2 && !useTwo));
    if (seg["2"]) seg["2"].classList.toggle("is-active", useTwo);
  }
  function setSegOpacity(o1, o2) {
    if (seg["1"]) {
      seg["1"].style.opacity = String(o1);
      seg["1"].style.visibility = o1 > 0 ? "visible" : "hidden";
    }
    if (seg["2"]) {
      seg["2"].style.opacity = String(o2);
      seg["2"].style.visibility = o2 > 0 ? "visible" : "hidden";
    }
  }
  function primeVideoMobile(v, cb) {
    if (!v || v.dataset.kardPrimed === "1") { if (cb) cb(); return; }
    var done = function () { v.dataset.kardPrimed = "1"; v.pause(); if (cb) cb(); };
    var pr = v.play();
    if (pr && pr.then) pr.then(done).catch(function () {
      v.addEventListener("loadeddata", done, { once: true });
      v.load();
    });
    else done();
  }
  function primeVideoDesktop(v, cb) {
    if (!v || v.dataset.kardPrimed === "1") { if (cb) cb(); return; }
    var done = function () {
      v.dataset.kardPrimed = "1";
      v.pause();
      try { if (v.currentTime > 0.02) v.currentTime = 0; } catch (e) {}
      if (cb) cb();
    };
    var kick = function () {
      var pr = v.play();
      if (pr && pr.then) pr.then(done).catch(done);
      else done();
    };
    if (v.readyState >= 2) kick();
    else v.addEventListener("loadeddata", kick, { once: true });
  }
  function primeVideo(v, cb) {
    if (siteDesktop()) primeVideoDesktop(v, cb);
    else primeVideoMobile(v, cb);
  }
  function seekMobile(v, t) {
    if (!v) return;
    var run = function () {
      if (!v.duration || isNaN(v.duration)) return;
      if (Math.abs(v.currentTime - t) > 0.012) { try { v.currentTime = t; } catch (e) {} }
    };
    if (v.readyState >= 1) run();
    else v.addEventListener("loadeddata", run, { once: true });
  }
  function seekDesktop(v, t) {
    if (!v) return;
    v.dataset.kardSeek = String(t);
    var run = function () {
      if (!v.duration || isNaN(v.duration)) return;
      var target = parseFloat(v.dataset.kardSeek);
      if (isNaN(target)) return;
      if (Math.abs(v.currentTime - target) <= 0.03) return;
      if (v.dataset.kardSeeking === "1") return;
      v.dataset.kardSeeking = "1";
      var onSeeked = function () {
        v.dataset.kardSeeking = "0";
        var next = parseFloat(v.dataset.kardSeek);
        if (!isNaN(next) && Math.abs(v.currentTime - next) > 0.03) run();
      };
      v.addEventListener("seeked", onSeeked, { once: true });
      try { v.currentTime = target; } catch (e) { v.removeEventListener("seeked", onSeeked); v.dataset.kardSeeking = "0"; }
    };
    if (v.readyState >= 1) run();
    else v.addEventListener("loadeddata", run, { once: true });
  }
  function seek(v, t) {
    if (siteDesktop()) seekDesktop(v, t);
    else seekMobile(v, t);
  }
  function kardInView() {
    if (!ksection) return false;
    var r = ksection.getBoundingClientRect();
    var vh = scrollVh();
    return r.bottom > 0 && r.top < vh;
  }
  function kProgress() {
    if (!ksection) return 0;
    var vh = scrollVh();
    if (shell) {
      var total = shell.offsetHeight - vh;
      if (total > 48) {
        var r = shell.getBoundingClientRect();
        if (!siteDesktop()) {
          var startTop = vh * 0.1;
          var range = Math.max(total + startTop, 1);
          return Math.min(Math.max((startTop - r.top) / range, 0), 1);
        }
        return Math.min(Math.max(-r.top / total, 0), 1);
      }
    }
    var rr = ksection.getBoundingClientRect();
    return Math.min(Math.max((vh - rr.top) / (vh + rr.height), 0), 1);
  }
  function applyKardMobile(p) {
    applyTierVisual(p);
    if (p < 0.5) { showSeg(1); seek(seg["1"], (p / 0.5) * dur["1"]); }
    else { showSeg(2); seek(seg["2"], ((p - 0.5) / 0.5) * dur["2"]); }
  }
  function applyKardDesktop(p) {
    applyTierVisual(p);
    var v2ready = seg["2"] && seg["2"].readyState >= 1;
    if (v2ready) {
      if (p >= 0.5) kardSegOn = 2;
      else if (p < 0.46) kardSegOn = 1;
    } else {
      kardSegOn = 1;
    }
    if (kardSegOn === 1) {
      setSegOpacity(1, 0);
      seek(seg["1"], Math.min(1, p / 0.5) * dur["1"]);
      if (p > 0.38) seek(seg["2"], 0);
    } else {
      setSegOpacity(0, 1);
      seek(seg["2"], Math.max(0, (p - 0.5) / 0.5) * dur["2"]);
    }
  }
  // --- android frame-sequence scrub ---
  function kpad3(n) { n = String(n); while (n.length < 3) n = "0" + n; return n; }
  function kSetupCanvas() {
    if (kCanvas || !ksection) return;
    var media = ksection.querySelector(".kard-media");
    if (!media) return;
    kCanvas = document.createElement("canvas");
    kCanvas.className = "kard__canvas";
    kCanvas.width = 1280; kCanvas.height = 720; // native frame size; CSS object-fit:cover crops
    kCtx = kCanvas.getContext("2d");
    var scrim = media.querySelector(".kard-scrim");
    media.insertBefore(kCanvas, scrim); // sits at the top video's layer; scrim stays above-in-DOM
    media.classList.add("is-frames");
    // don't download the segment videos/posters on android — frames replace them
    Object.keys(seg).forEach(function (k) {
      var v = seg[k]; if (!v) return;
      v.removeAttribute("poster"); v.preload = "none"; v.innerHTML = "";
      try { v.load(); } catch (e) {}
    });
  }
  function kPreloadFrames() {
    if (kframes["1"].length) return;
    ["1", "2"].forEach(function (s) {
      for (var i = 0; i < KFRAME_COUNT[s]; i++) {
        var img = new Image();
        img.decoding = "async";
        img.addEventListener("load", kRedraw, { once: true });
        img.src = "assets/kardashev/frames/s" + s + "/f_" + kpad3(i) + ".webp";
        kframes[s][i] = img;
      }
    });
  }
  function kDrawFrame(s, t) {
    if (!kCtx) return;
    var arr = kframes[s], n = KFRAME_COUNT[s];
    var idx = Math.round(t * KFPS);
    if (idx < 0) idx = 0; else if (idx > n - 1) idx = n - 1;
    var img = arr[idx];
    if (!(img && img.complete && img.naturalWidth)) {
      for (var d = 1; d < n; d++) {
        var a = arr[idx - d], b = arr[idx + d];
        if (a && a.complete && a.naturalWidth) { img = a; break; }
        if (b && b.complete && b.naturalWidth) { img = b; break; }
      }
    }
    if (img && img.complete && img.naturalWidth) kCtx.drawImage(img, 0, 0, kCanvas.width, kCanvas.height);
  }
  function applyKardAndroid(p) {
    applyTierVisual(p);
    if (p < 0.5) kDrawFrame("1", (p / 0.5) * dur["1"]);
    else kDrawFrame("2", ((p - 0.5) / 0.5) * dur["2"]);
  }
  function kRedraw() { if (kardInView()) applyKardAndroid(kCurrent); }
  function applyKard(p) {
    if (kIsAndroid) return applyKardAndroid(p);
    if (siteDesktop()) applyKardDesktop(p);
    else applyKardMobile(p);
  }
  function primeAllKard(cb) {
    if (kIsAndroid) { kPreloadFrames(); kRedraw(); if (cb) cb(); return; }
    var keys = Object.keys(seg), left = keys.length;
    if (!left) { if (cb) cb(); return; }
    keys.forEach(function (k) {
      primeVideo(seg[k], function () {
        left -= 1;
        if (left <= 0 && cb) cb();
      });
    });
  }
  /* defer loading until section is near viewport */
  var kardSourcesLoaded = false;
  function initKardSources() {
    if (kardSourcesLoaded) return;
    kardSourcesLoaded = true;
    setKardSources();
  }
  Object.keys(seg).forEach(function (k) {
    var v = seg[k];
    v.addEventListener("loadedmetadata", function () {
      dur[k] = v.duration || dur[k];
      kTarget = kProgress();
      kCurrent = kTarget;
      applyKard(kCurrent);
    });
  });
  if (ksection && "IntersectionObserver" in window) {
    var kLoadIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          initKardSources();
          kLoadIo.disconnect();
        }
      });
    }, { rootMargin: "400px" });
    kLoadIo.observe(ksection);
    var kPrimeIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        primeAllKard(function () { applyKard(kCurrent); });
        kPrimeIo.disconnect();
      });
    }, { threshold: 0.12, rootMargin: "12% 0px 0px 0px" });
    kPrimeIo.observe(ksection);
  }
  if (tiers.length && ksection) {
    function absTop(el) { return el.getBoundingClientRect().top + window.pageYOffset; }
    tiers.forEach(function (t) {
      t.addEventListener("click", function () {
        var n = parseInt(t.dataset.tier, 10), tp = n === 1 ? 0 : n === 2 ? 0.5 : 1, y;
        var vh = scrollVh();
        if (shell && shell.offsetHeight > vh + 48) {
          y = absTop(shell) + tp * (shell.offsetHeight - vh);
        } else {
          var h = ksection.offsetHeight || vh;
          y = absTop(ksection) + tp * (h + vh) - vh;
        }
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
    function onKardLayoutChange() {
      setKardSources();
      kTarget = kProgress();
      kCurrent = kTarget;
      primeAllKard(function () { applyKard(kCurrent); });
    }
    if (siteDesktopMq.addEventListener) siteDesktopMq.addEventListener("change", onKardLayoutChange);
    else siteDesktopMq.addListener(onKardLayoutChange);
    if (reduced) {
      window.addEventListener("scroll", function () {
        kTarget = kProgress();
        kCurrent = kTarget;
        applyKard(kCurrent);
      }, { passive: true });
      applyKard(kProgress());
    } else if (!siteDesktop()) {
      window.addEventListener("scroll", function () {
        kTarget = kProgress();
        kCurrent = kTarget;
        if (kardInView()) applyKard(kCurrent);
      }, { passive: true });
      kTarget = kProgress();
      kCurrent = kTarget;
      applyKard(kCurrent);
    } else {
      window.addEventListener("scroll", function () { kTarget = kProgress(); }, { passive: true });
      window.addEventListener("resize", function () { kTarget = kProgress(); });
      kTarget = kProgress();
      (function loop() {
        var delta = kTarget - kCurrent;
        kCurrent += Math.abs(delta) > 0.35 ? delta * 0.22 : delta * 0.12;
        if (kardInView()) applyKard(kCurrent);
        requestAnimationFrame(loop);
      })();
    }
  }
})();

/* interactive point field — a clean, fluid take on the original pixel mosaic (hero + footer) */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initField(canvas, opts) {
    if (!canvas || !canvas.getContext) return null;
    opts = opts || {};
    var interactive = opts.interactive === true;
    var ctx = canvas.getContext("2d");
    var host = canvas.parentElement;
    var PITCH = opts.pitch || 22;
    var BASE = opts.base != null ? opts.base : 0.045;
    var PEAK = opts.peak != null ? opts.peak : 0.72;
    var dpr = 1, cssW = 0, cssH = 0, cols = 0, rows = 0, offX = 0, offY = 0, R = interactive ? 180 : 0;
    var bx = null, by = null, ox = null, oy = null, wt = null, ph = null, twSpd = null, starHue = null, starTint = null, introCol = null, introGlow = null, shimCol = null, shimGlow = null, twExtra = null;
    var PULSE_ATTACK = 0.2;
    var PULSE_DECAY = 0.982;
    var lastFrameNow = 0;
    var pulseSmooth = !!(opts.intro || opts.periodicShimmer);
    var twinkle = !!opts.twinkle;
    var periodicShimmer = !!opts.periodicShimmer;
    var scrollShimmer = !!opts.scrollShimmer;
    var scrollShimmerEl = opts.scrollShimmerEl || null;
    var shimmerStart = 0;
    var shimmerNextAt = 0;
    var shimmerDur = opts.shimmerDur != null ? opts.shimmerDur : 2600;
    var shimmerBandW = 0.2;
    var shimmerVaryDir = opts.shimmerVaryDir === true;
    var SHIMMER_IDLE_MIN = opts.shimmerIdleMin != null ? opts.shimmerIdleMin : 4000;
    var SHIMMER_IDLE_RANGE = opts.shimmerIdleRange != null ? opts.shimmerIdleRange : 2800;
    /* continuous interference pattern (a drifting/rotating plaid of light) */
    var patternField = !!opts.patternField;
    var patternScale = opts.patternScale != null ? opts.patternScale : 3.4;
    var patternSpeed = opts.patternSpeed != null ? opts.patternSpeed : 0.1;
    var patternRot = opts.patternRot != null ? opts.patternRot : 0.045;
    var patternFloor = opts.patternFloor != null ? opts.patternFloor : 0.5;
    var patternAmp = opts.patternAmp != null ? opts.patternAmp : 1;
    var starsOnly = !!opts.stars;
    var starHover = opts.starHover != null ? !!opts.starHover : starsOnly;
    var autoRun = !!opts.autoRun;
    var autoDrift = !!opts.autoDrift;
    var driftMul = opts.driftMul != null ? opts.driftMul : 1;
    var driftAmp = opts.driftAmp != null ? opts.driftAmp : 1;
    var waveMul = opts.waveMul != null ? opts.waveMul : 1;
    var twMul = opts.twinkleMul != null ? opts.twinkleMul : 1;
    var timeMul = opts.timeMul != null ? opts.timeMul : 1;
    var starTwPow = opts.starTwPow != null ? opts.starTwPow : 1.35;
    var starTwFloor = opts.starTwFloor != null ? opts.starTwFloor : 0.04;
    var tintRate = opts.tintRate != null ? opts.tintRate : (starsOnly ? 0.26 : 0);
    var sparkCutoff = opts.sparkCutoff != null ? opts.sparkCutoff : null;
    var alphaMul = opts.alphaMul != null ? opts.alphaMul : 1;
    var maxAlpha = opts.maxAlpha != null ? opts.maxAlpha : 0.98;
    var textShields = null;
    var textShieldFloor = opts.textShieldFloor != null ? opts.textShieldFloor : 0.76;
    var textShieldFeather = opts.textShieldFeather != null ? opts.textShieldFeather : 52;
    var sizeMul = opts.sizeMul != null ? opts.sizeMul : 1;
    var heroDots = !!opts.heroDots;
    var topScatter = !!opts.topScatter;
    var scatterBand = opts.scatterBand != null ? opts.scatterBand : 0.5;
    var scatterDepth = opts.scatterDepth != null ? opts.scatterDepth : 0.38;
    var scatterKeep = opts.scatterKeep != null ? opts.scatterKeep : null;
    var rightScatter = !!opts.rightScatter;
    var rightFade = opts.rightFade != null ? opts.rightFade : 0;
    var leftFade = opts.leftFade != null ? opts.leftFade : 0;
    var edgeGate = null;
    var insetL = 0, insetR = 0, insetT = 0, insetB = 0;
    var fieldW = 0, fieldH = 0;
    var hasInset = false;
    var insetFeather = opts.insetFeather != null ? opts.insetFeather : 52;
    (function applyInsetOpts() {
      var ins = opts.inset;
      if (typeof ins === "number") insetL = insetR = insetT = insetB = ins;
      else if (ins && typeof ins === "object") {
        insetT = ins.top || 0;
        insetR = ins.right || 0;
        insetB = ins.bottom || 0;
        insetL = ins.left || 0;
      }
      if (opts.insetX != null) insetL = insetR = opts.insetX;
      if (opts.insetY != null) insetT = insetB = opts.insetY;
      if (opts.insetTop != null) insetT = opts.insetTop;
      if (opts.insetRight != null) insetR = opts.insetRight;
      if (opts.insetBottom != null) insetB = opts.insetBottom;
      if (opts.insetLeft != null) insetL = opts.insetLeft;
      hasInset = insetL + insetR + insetT + insetB > 0;
    })();
    var px = -9999, py = -9999, tx = 0, ty = 0;
    var hasPointer = false, lastMove = -9999, raf = 0, running = false;
    var boostTarget = 0, boost = 0, hotX = -9999, hotY = -9999;
    var intro = !!opts.intro;
    var deferIntroVisible = !!opts.deferIntroVisible;
    var introStart = 0;
    var INTRO_MS = 2800;
    var INTRO_BAND = 0.24;
    var INTRO_TAIL_MS = 1400;
    function easeOut3(t) { return 1 - Math.pow(1 - t, 3); }
    function smooth01(t) { return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); }
    function pulseMix(v, lo, hi) { return smooth01((v - lo) / (hi - lo)); }

    function hash01(a, b, c) {
      var x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
      return x - Math.floor(x);
    }

    function edgeInsetDim(cx, cy) {
      if (!hasInset) return 1;
      var dl = cx - insetL;
      var dr = insetR > 0 ? (cssW - insetR) - cx : Infinity;
      var dt = cy - insetT;
      var db = (cssH - insetB) - cy;
      var d = Math.min(dl, dr, dt, db);
      if (d >= insetFeather) return 1;
      if (d <= 0) return 0;
      return smooth01(d / insetFeather);
    }

    function sideFadeDim(cx) {
      var dim = 1;
      var rf = rightFade > 0 && rightFade <= 1 ? rightFade * cssW : rightFade;
      var lf = leftFade > 0 && leftFade <= 1 ? leftFade * cssW : leftFade;
      if (rf > 0 && cx > cssW - rf) dim *= smooth01((cssW - cx) / rf);
      if (lf > 0 && cx < lf) dim *= smooth01(cx / lf);
      return dim;
    }

    function rightScatterGate(x, c, r, ph) {
      var xNorm = cssW > 0 ? x / cssW : 0;
      if (xNorm < 0.5) return 1;
      var t = smooth01((xNorm - 0.5) / 0.5);
      var spor = hash01(ph, c * 0.43, r * 0.29);
      var cut = 0.52 + t * 0.46;
      if (spor > cut) return 0;
      return 0.35 + (1 - t) * 0.65 * (0.5 + spor * 0.5);
    }

    function topScatterGate(y, x, c, r, ph, w) {
      var xNorm = fieldW > 0 ? (x - insetL) / fieldW : 0;
      var yn = fieldH > 0 ? (y - insetT) / fieldH : y / cssH;
      var edge =
        scatterBand +
        Math.sin(xNorm * 8.1 + ph * 0.42) * 0.15 +
        Math.sin(xNorm * 3.1 + c * 0.51 + r * 0.17) * 0.13 +
        Math.cos(xNorm * 5.4 - ph * 1.1 + r * 0.28) * 0.1 +
        (hash01(ph, c * 0.37, r * 0.21) - 0.5) * 0.28;
      var dist = yn - edge;
      if (dist >= scatterDepth) return 1;
      if (dist <= -scatterDepth * 0.28) return 0;
      var t = smooth01((dist + scatterDepth * 0.28) / (scatterDepth * 1.22));
      var n1 = hash01(ph, c * 0.17, r * 0.23);
      var n2 = 0.5 + 0.5 * Math.sin(ph * 4.1 + c * 0.91 + r * 1.37);
      var n3 = 0.5 + 0.5 * Math.cos(ph * 2.6 - c * 1.2 + r * 0.55);
      var spor = n1 * n2 * n3;
      var gate = 0.1 + t * (0.22 + spor * 0.78) * (0.42 + w * 0.58);
      if (t < 0.32 && spor < 0.18) gate *= 0.32;
      return Math.min(1, gate);
    }

    function textShieldDim(cx, cy) {
      if (!textShields || !textShields.length) return 1;
      var dim = 1, si, sh, sdx, sdy, sd, floor, feather;
      for (si = 0; si < textShields.length; si++) {
        sh = textShields[si];
        floor = sh.floor != null ? sh.floor : textShieldFloor;
        feather = sh.feather != null ? sh.feather : textShieldFeather;
        sdx = Math.max(sh.x0 - cx, 0, cx - sh.x1);
        sdy = Math.max(sh.y0 - cy, 0, cy - sh.y1);
        sd = Math.sqrt(sdx * sdx + sdy * sdy);
        if (sd < feather) {
          dim = Math.min(dim, sd <= 0 ? floor : floor + (sd / feather) * (1 - floor));
        }
      }
      return dim;
    }

    function armShimmerPause(now, delayMs) {
      shimmerNextAt = now + (delayMs != null ? delayMs : SHIMMER_IDLE_MIN + Math.random() * SHIMMER_IDLE_RANGE);
    }

    function triggerShimmer(now) {
      shimmerStart = now;
      shimmerBandW = 0.14 + Math.random() * 0.13;
      /* re-aim the sweep each time so the pattern keeps evolving */
      if (shimmerVaryDir && shimCol && bx && shimCol.length === bx.length) {
        var ang = Math.random() * Math.PI * 2;
        var dx = Math.cos(ang), dy = Math.sin(ang);
        var minS = Infinity, maxS = -Infinity, si, s;
        for (si = 0; si < bx.length; si++) {
          s = (bx[si] / cssW) * dx + (by[si] / cssH) * dy;
          shimCol[si] = s;
          if (s < minS) minS = s;
          if (s > maxS) maxS = s;
        }
        var rng = maxS - minS || 1;
        for (si = 0; si < bx.length; si++) shimCol[si] = (shimCol[si] - minS) / rng;
      }
    }

    function size() {
      var r = host.getBoundingClientRect();
      cssW = Math.max(1, r.width); cssH = Math.max(1, r.height);
      if (typeof opts.getInset === "function") {
        var ins = opts.getInset(host, cssW, cssH);
        insetT = ins.top || 0;
        insetR = ins.right || 0;
        insetB = ins.bottom || 0;
        insetL = ins.left || 0;
        hasInset = insetL + insetR + insetT + insetB > 0;
      }
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = starsOnly ? Math.max(130, Math.min(cssW * 0.22, 260)) : Math.max(140, Math.min(cssW * 0.18, 250));
      fieldW = Math.max(PITCH * 3, cssW - insetL - insetR);
      fieldH = Math.max(PITCH * 3, cssH - insetT - insetB);
      if (hasInset) {
        cols = Math.max(3, Math.ceil(fieldW / PITCH) + 1);
        rows = Math.max(3, Math.ceil(fieldH / PITCH) + 1);
      } else {
        cols = Math.ceil(fieldW / PITCH) + 2;
        rows = Math.ceil(fieldH / PITCH) + 2;
      }
      offX = insetL + Math.round((fieldW - (cols - 1) * PITCH) / 2);
      offY = insetT + Math.round((fieldH - (rows - 1) * PITCH) / 2);
      var n = cols * rows;
      bx = new Float32Array(n); by = new Float32Array(n);
      ox = new Float32Array(n); oy = new Float32Array(n);
      wt = new Float32Array(n); ph = new Float32Array(n);
      if (twinkle) twSpd = new Float32Array(n);
      if (starsOnly) { starHue = new Float32Array(n); starTint = new Float32Array(n); }
      if (intro) introCol = new Float32Array(n);
      if (topScatter || scatterKeep != null || rightScatter) edgeGate = new Float32Array(n);
      var k = 0;
      for (var rr = 0; rr < rows; rr++) for (var c = 0; c < cols; c++) {
        bx[k] = offX + c * PITCH; by[k] = offY + rr * PITCH;

        wt[k] = 0.45 + Math.random() * 0.55; ph[k] = Math.random() * 6.283;
        if (twinkle) {
          var tb = starsOnly ? (opts.starTwBase != null ? opts.starTwBase : 0.18) : 0.55;
          var tr = starsOnly ? (opts.starTwRange != null ? opts.starTwRange : 0.75) : 2.4;
          twSpd[k] = (tb + Math.random() * tr) * twMul;
        }
        if (starsOnly) {
          starHue[k] = 185 + Math.random() * 155;
          starTint[k] = Math.random() < tintRate ? 1 : 0;
        }
        if (topScatter || scatterKeep != null || rightScatter) {
          var gate = 1;
          if (topScatter) gate *= topScatterGate(by[k], bx[k], c, rr, ph[k], wt[k]);
          if (scatterKeep != null && hash01(ph[k], c * 0.37, rr * 0.21) > scatterKeep) gate = 0;
          if (rightScatter) gate *= rightScatterGate(bx[k], c, rr, ph[k]);
          edgeGate[k] = gate;
        }
        k++;
      }
      if (intro && bx.length) {
        if (!introCol || introCol.length !== bx.length) introCol = new Float32Array(bx.length);
        if (!introGlow || introGlow.length !== bx.length) introGlow = new Float32Array(bx.length);
        var iMin = Infinity, iMax = -Infinity, ii;
        for (ii = 0; ii < bx.length; ii++) {
          var iv = (bx[ii] / cssW) * (0.8 + Math.sin(ph[ii] * 1.25) * 0.05) + (by[ii] / cssH) * (0.3 + Math.cos(ph[ii] * 1.6) * 0.06);
          introCol[ii] = iv;
          if (iv < iMin) iMin = iv;
          if (iv > iMax) iMax = iv;
        }
        var iRange = iMax - iMin || 1;
        for (ii = 0; ii < bx.length; ii++) introCol[ii] = (introCol[ii] - iMin) / iRange;
      }
      if (pulseSmooth && bx.length) {
        if (!twExtra || twExtra.length !== bx.length) twExtra = new Float32Array(bx.length);
      }
      if (periodicShimmer && bx.length) {
        if (!shimCol || shimCol.length !== bx.length) shimCol = new Float32Array(bx.length);
        if (!shimGlow || shimGlow.length !== bx.length) shimGlow = new Float32Array(bx.length);
        var minS = Infinity, maxS = -Infinity, si;
        for (si = 0; si < bx.length; si++) {
          var s = (bx[si] / cssW) * (0.76 + Math.sin(ph[si] * 1.3) * 0.04) + (by[si] / cssH) * (0.26 + Math.cos(ph[si] * 1.7) * 0.05);
          shimCol[si] = s;
          if (s < minS) minS = s;
          if (s > maxS) maxS = s;
        }
        var sRange = maxS - minS || 1;
        for (si = 0; si < bx.length; si++) shimCol[si] = (shimCol[si] - minS) / sRange;
      }
    }

    function render(now) {
      var dt = lastFrameNow > 0 ? Math.min(48, now - lastFrameNow) : 16.67;
      lastFrameNow = now;
      var pulseDecay = Math.pow(PULSE_DECAY, dt / 16.67);
      var pulseAttack = 1 - Math.pow(1 - PULSE_ATTACK, dt / 16.67);
      var aa = now * 0.00018;
      if (interactive) {
        var auto = !hasPointer || (now - lastMove) > 2400;
        if (auto) {
          tx = cssW * (0.5 + 0.30 * Math.cos(aa) + 0.07 * Math.cos(aa * 2.7));
          ty = cssH * (0.46 + 0.26 * Math.sin(aa * 1.25));
        }
        if (px < -9000) { px = tx; py = ty; }
        px += (tx - px) * 0.09; py += (ty - py) * 0.09;
      } else if (autoDrift) {
        tx = cssW * (0.5 + 0.34 * Math.cos(aa) + 0.09 * Math.cos(aa * 2.4));
        ty = cssH * (0.48 + 0.26 * Math.sin(aa * 1.3) + 0.07 * Math.sin(aa * 2.1));
        if (px < -9000) { px = tx; py = ty; }
        px += (tx - px) * 0.07; py += (ty - py) * 0.07;
      } else if (!starsOnly) {
        tx = cssW * (0.52 + 0.22 * Math.cos(aa) + 0.06 * Math.sin(aa * 1.8));
        ty = cssH * (0.44 + 0.18 * Math.sin(aa * 1.1) + 0.05 * Math.cos(aa * 2.4));
        px = tx; py = ty;
      }
      if (starHover && hasPointer) {
        if (px < -9000) { px = tx; py = ty; }
        px += (tx - px) * 0.12; py += (ty - py) * 0.12;
      }
      boost += (boostTarget - boost) * (boostTarget > boost ? 0.14 : 0.07);
      var Rnow = R * (1 + boost * 1.05);
      var T = now * 0.001, Tt = T * (starsOnly ? (0.32 + boost * 1.15) * timeMul : 1);
      var R2 = Rnow * Rnow, n = bx.length;
      var hotR = Rnow * (1.22 + boost * 0.32), hotR2 = hotR * hotR;
      var hotOn = boost > 0.04 && hotX > -9000;
      var patInvW = 0, patInvH = 0, patCos = 1, patSin = 0, patPhase = 0;
      if (patternField) {
        patInvW = 1 / cssW; patInvH = 1 / cssH;
        var patAng = T * patternRot;
        patCos = Math.cos(patAng); patSin = Math.sin(patAng);
        patPhase = T * patternSpeed;
      }

      var introBusy = intro && introStart > 0 && (now - introStart) < INTRO_MS + INTRO_TAIL_MS;
      if (periodicShimmer && !reduced) {
        if (!introBusy) {
          if (shimmerStart > 0 && now - shimmerStart >= shimmerDur) {
            shimmerStart = 0;
            armShimmerPause(now);
          } else if (shimmerStart <= 0 && now >= shimmerNextAt) {
            triggerShimmer(now);
          }
        }
      }

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = "#ffffff";
      for (var i = 0; i < n; i++) {
        var X = bx[i], Y = by[i];
        var footerStar = autoDrift && starsOnly && !heroDots;
        var driftT = footerStar ? T * timeMul : T;
        var fx = Math.sin(driftT * 0.55 + X * 0.011 + ph[i]);
        var fy = Math.cos(driftT * 0.52 + Y * 0.013 + ph[i]);
        var dx = X - px, dy = Y - py, d2 = dx * dx + dy * dy;
        var illum = 0, repel = 0, hover = 0;
        if ((interactive || starHover) && px > -9000 && d2 < R2) {
          var d = Math.sqrt(d2) || 1, t = 1 - d / Rnow, s = t * t * (3 - 2 * t);
          illum = s; hover = s;
          if (interactive) repel = s * 16 / d;
        }
        if (hotOn) {
          var hdx = X - hotX, hdy = Y - hotY, hd2 = hdx * hdx + hdy * hdy;
          if (hd2 < hotR2) {
            var hd = Math.sqrt(hd2) || 1, ht = 1 - hd / hotR, hs = ht * ht * (3 - 2 * ht) * boost;
            illum = Math.max(illum, hs * 0.68);
            hover = Math.max(hover, hs * 0.5);
            repel += hs * (9 + boost * 4) / hd;
          }
        }
        var wave = interactive ? 0 : footerStar
          ? 0.09 * waveMul * (0.5 + 0.5 * Math.sin(driftT * 1.35 + ph[i] * 2 + X * 0.01))
          : starsOnly ? 0 : (twinkle ? 0.05 : 0.14) * (0.5 + 0.5 * Math.sin(T * 0.9 + ph[i] * 2 + X * 0.008));
        var drift = starsOnly ? (autoDrift ? 0.12 * driftMul * driftAmp : 0.12) : twinkle ? 0.5 : 1.2;
        var tox = fx * drift + dx * repel;
        var toy = fy * drift + dy * repel;
        var settle = starsOnly ? (autoDrift ? 0.075 : 0.04) : twinkle ? 0.06 : 0.12;
        ox[i] += (tox - ox[i]) * settle; oy[i] += (toy - oy[i]) * settle;
        var w = wt[i];
        var tw = 1, sparkle = 0;
        if (twinkle) {
          var t1 = Math.sin(Tt * twSpd[i] * (1 + boost * 0.8) + ph[i]);
          var t2 = Math.sin(Tt * twSpd[i] * 1.9 * (1 + boost * 0.5) + ph[i] * 1.85);
          var t3 = Math.sin(Tt * twSpd[i] * 0.35 + ph[i] * 0.6);
          var twPow = footerStar ? starTwPow - boost * 0.28 : 1.7 - boost * 0.35;
          var twSpan = 1 - starTwFloor;
          tw = footerStar
            ? starTwFloor + twSpan * Math.pow(0.5 + 0.5 * t1, twPow) * (0.5 + 0.5 * (0.5 + 0.5 * t3))
            : 0.06 + 0.94 * Math.pow(0.5 + 0.5 * t1, twPow) * (0.65 + 0.35 * (0.5 + 0.5 * t3));
          var cut = sparkCutoff != null ? sparkCutoff : (0.96 - boost * 0.12);
          var cutW = footerStar ? 0.2 : 0.04;
          if (t2 > cut) {
            sparkle = 1;
            tw = Math.min(footerStar ? 2.65 : 1.85, tw + (0.7 + boost * 0.5) * ((t2 - cut) / cutW));
          }
        }
        var a;
        if (starsOnly) {
          a = (BASE * w * tw * 3.1 + (w > 0.82 ? 0.05 * tw : 0) + wave * w) * (1 + boost * 0.45) * alphaMul;
          if (hover > 0.04) a *= 1 + hover * (0.22 + boost * 0.35);
        }
        else a = (BASE * w + 0.018 * (0.5 + 0.5 * fx) + illum * PEAK * w * (1 + boost * 0.5) + wave * w) * tw;
        var patB = 0;
        if (patternField) {
          var pnx = X * patInvW, pny = Y * patInvH;
          var pu = pnx * patCos + pny * patSin;
          var pv = pny * patCos - pnx * patSin;
          var pband = Math.sin((pu * patternScale - patPhase) * 6.2831853) * 0.6
                    + Math.sin((pv * patternScale * 0.85 + patPhase * 0.7) * 6.2831853) * 0.4;
          patB = 0.5 + 0.5 * pband;
          patB = patB * patB * (3 - 2 * patB);
          a *= patternFloor + patternAmp * patB;
        }
        if (intro && introCol && !reduced && !introStart) continue;

        var pulseTarget = 0;
        if (intro && introCol && !reduced && introStart > 0) {
          var introElapsed = now - introStart;
          var introT = Math.min(1, introElapsed / INTRO_MS);
          if (introT < 1) {
            var introFront = easeOut3(introT) * (1 + INTRO_BAND * 1.45);
            var introNx = introCol[i] + Math.sin(ph[i] * 2.3 + Y * 0.008 + X * 0.005) * 0.058;
            var introBand = (introFront - introNx) / INTRO_BAND;
            var introGate = smooth01(introBand);
            var introWake = smooth01((introFront - introNx + INTRO_BAND * 0.62) / (INTRO_BAND * 1.85));
            var textDimIntro = textShields ? textShieldDim(X, Y) : 1;
            a *= Math.max(introGate, introWake * 0.16 * (0.4 + 0.6 * textDimIntro));
            if (a < 0.008) continue;
            var introCrest = 0;
            if (introBand > 0 && introBand < 1) {
              introCrest = Math.pow(Math.sin(introBand * Math.PI), 0.78);
              if (introGlow) introGlow[i] = Math.max(introGlow[i], introCrest);
              pulseTarget = Math.max(pulseTarget, introCrest * (1.35 + wt[i] * 0.32) + introGate * 0.18);
            } else if (introWake > 0.35 && introGlow) {
              introGlow[i] = Math.max(introGlow[i], introWake * 0.28);
              pulseTarget = Math.max(pulseTarget, introWake * 0.18);
            }
          }
          if (introGlow) {
            var iGlow = introGlow[i];
            if (iGlow > 0.002) {
              iGlow *= Math.pow(0.962, dt / 16.67);
              introGlow[i] = iGlow;
              pulseTarget = Math.max(pulseTarget, iGlow * (0.9 + wt[i] * 0.24));
            } else {
              introGlow[i] = 0;
            }
          }
        }
        if (periodicShimmer && shimCol && shimmerStart > 0) {
          var shimT = Math.min(1, (now - shimmerStart) / shimmerDur);
          var shimFront = easeOut3(shimT) * (1 + shimmerBandW * 1.2);
          var shimPos = shimCol[i] + Math.sin(ph[i] * 2.4 + X * 0.009 + Y * 0.007) * 0.055;
          var shimBand = (shimFront - shimPos) / shimmerBandW;
          var shimGate = smooth01(shimBand);
          if (shimGate > 0.02) {
            var shimPulse = Math.sin(shimBand * Math.PI);
            if (shimGlow) shimGlow[i] = Math.max(shimGlow[i], shimPulse);
            pulseTarget = Math.max(pulseTarget, shimPulse * (1.02 + wt[i] * 0.32));
          }
        }
        if (periodicShimmer && shimGlow) {
          var glow = shimGlow[i];
          if (glow > 0.002) {
            glow *= Math.pow(0.978, dt / 16.67);
            shimGlow[i] = glow;
            pulseTarget = Math.max(pulseTarget, glow * (0.76 + wt[i] * 0.18));
          } else {
            shimGlow[i] = 0;
          }
        }
        var cx = X + ox[i], cy = Y + oy[i];
        var textDim = textShields ? textShieldDim(cx, cy) : 1;
        if (textDim < 0.92 && pulseTarget > 0) {
          pulseTarget *= 0.42 + 0.58 * textDim;
        }
        var extra = 0;
        var twDraw = tw;
        if (twExtra) {
          extra = twExtra[i];
          if (pulseTarget > extra) extra += (pulseTarget - extra) * pulseAttack;
          else {
            var extraDecay = pulseDecay;
            if (textDim < 0.9) extraDecay = Math.pow(0.93, dt / 16.67);
            extra *= extraDecay;
            if (extra < 0.002) extra = 0;
          }
          twExtra[i] = extra;
          twDraw = tw + extra;
          a *= 1 + extra * 0.3;
        }
        a *= textDim;
        if (edgeGate) a *= edgeGate[i];
        if (rightFade || leftFade) a *= sideFadeDim(cx);
        if (hasInset) {
          var insetDim = edgeInsetDim(cx, cy);
          a *= insetDim;
          if (insetDim < 0.008) continue;
        }
        if (a < 0.008) continue;
        if (a > maxAlpha) a = maxAlpha;
        ctx.globalAlpha = a;
        if (starsOnly) {
          if (hover > 0.04) {
            var hue = (ph[i] * 57.3 + Math.atan2(dy, dx) * 57.3 + 240) % 360;
            ctx.fillStyle = "hsl(" + hue.toFixed(0) + ", " + (62 + hover * 32) + "%, " + (56 + hover * 34) + "%)";
          } else {
            var tintMix = (periodicShimmer || intro) ? pulseMix(extra, 0.035, 0.24) : 0;
            if (tintMix > 0.001) {
              var sh = 205 + Math.sin(ph[i] * 1.6 + Tt * 0.6) * 22 + starHue[i] * 0.04;
              var sat = (20 + twDraw * 16) * tintMix;
              var lit = 92 * (1 - tintMix) + (72 + twDraw * 24) * tintMix;
              ctx.fillStyle = "hsl(" + sh.toFixed(0) + ", " + sat.toFixed(0) + "%, " + lit.toFixed(0) + "%)";
            } else if (starTint[i] > 0.5 && (sparkle || twDraw > (autoDrift && sparkle ? 0.55 : 0.82))) {
              var h = starHue[i] + Math.sin(Tt * 0.45 + ph[i]) * 14;
              ctx.fillStyle = "hsl(" + h.toFixed(0) + ", " + (48 + twDraw * 42).toFixed(0) + "%, " + (52 + twDraw * 34).toFixed(0) + "%)";
            } else if (autoDrift && sparkle) {
              ctx.fillStyle = "hsl(" + (210 + Math.sin(Tt + ph[i]) * 18).toFixed(0) + ", 28%, " + (78 + twDraw * 18).toFixed(0) + "%)";
            } else {
              ctx.fillStyle = "#ffffff";
            }
          }
          var pulseSz = extra * 1.05;
          var szPulse = footerStar ? 0.35 * (0.5 + 0.5 * Math.sin(Tt * 1.4 + ph[i])) : 0;
          var sz = (0.65 + w * 0.55 + twDraw * (footerStar ? 2.15 : 1.85) + szPulse + (autoDrift && sparkle ? 0.65 : 0) + pulseSz + patB * 0.8) * sizeMul * (1 + hover * (0.18 + boost * 0.22) + boost * 0.08);
          var half = sz * 0.5;
          ctx.fillRect(cx - half, cy - half, sz, sz);
        } else {
          var sz = (twinkle ? 1 + twDraw * 1.6 + illum * 2.2 : 2 + illum * 2.6) * (1 + boost * 0.2);
          ctx.fillRect(cx - sz * 0.5, cy - sz * 0.5, sz, sz);
        }
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(render);
    }

    function armIntro() {
      if (!intro || introStart || reduced) return;
      introStart = performance.now();
      if (deferIntroVisible) canvas.classList.add("is-on");
      if (periodicShimmer && !shimmerNextAt) {
        armShimmerPause(introStart, INTRO_MS + INTRO_TAIL_MS + 1800);
      }
    }

    function start() {
      if (running || reduced) return;
      var now = performance.now();
      if (periodicShimmer && !shimmerNextAt && !intro) {
        armShimmerPause(now, 2400 + Math.random() * 1200);
      }
      running = true;
      raf = requestAnimationFrame(render);
    }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    if (interactive || starHover) {
      window.addEventListener("pointermove", function (e) {
        var r = host.getBoundingClientRect();
        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) { hasPointer = false; px = -9999; py = -9999; return; }
        tx = e.clientX - r.left; ty = e.clientY - r.top;
        hasPointer = true; lastMove = performance.now();
      }, { passive: true });
    }

    var rT;
    window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(function () { size(); if (reduced) render(performance.now()); }, 160); }, { passive: true });

    size();
    if (reduced) { px = cssW * 0.6; py = cssH * 0.46; render(performance.now()); canvas.classList.add("is-on"); return; }

    if (autoRun) {
      if (!deferIntroVisible) canvas.classList.add("is-on");
      start();
      if ("IntersectionObserver" in window) {
        var ioAuto = new IntersectionObserver(function (en) {
          en[0].isIntersecting ? start() : stop();
        }, { threshold: 0 });
        ioAuto.observe(host);
      }
    } else {
      requestAnimationFrame(function () { canvas.classList.add("is-on"); });
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }, { threshold: 0.02 });
        io.observe(host);
      } else { start(); }
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (autoRun || !("IntersectionObserver" in window)) start();
    });

    if (scrollShimmer && periodicShimmer && "IntersectionObserver" in window && !reduced) {
      var shimTarget = scrollShimmerEl ? document.querySelector(scrollShimmerEl) : host;
      if (shimTarget) {
        var scrollShimmerFired = false;
        var ioScrollShim = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting || scrollShimmerFired) return;
            scrollShimmerFired = true;
            ioScrollShim.disconnect();
            start();
            window.setTimeout(function () {
              var now = performance.now();
              triggerShimmer(now);
              armShimmerPause(now, shimmerDur + SHIMMER_IDLE_MIN + Math.random() * SHIMMER_IDLE_RANGE);
            }, 160);
          });
        }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
        ioScrollShim.observe(shimTarget);
      }
    }

    return {
      setBoost: function (v) { boostTarget = Math.max(0, Math.min(1, v)); },
      setHotspot: function (x, y) { hotX = x; hotY = y; tx = x; ty = y; px = x; py = y; hasPointer = true; lastMove = performance.now(); },
      setTextShields: function (rects) { textShields = rects && rects.length ? rects : null; },
      armIntro: armIntro,
      fireShimmer: function () {
        if (reduced || !periodicShimmer) return;
        start();
        var now = performance.now();
        triggerShimmer(now);
        armShimmerPause(now, shimmerDur + SHIMMER_IDLE_MIN + Math.random() * SHIMMER_IDLE_RANGE);
      }
    };
  }

  /* ---- Aave-style dot grid -------------------------------------------------
     Dense grid of tiny dots that's always gently alive. Each dot's brightness:
       (a) a fixed per-dot random "spark" (most faint, a scattered few bright),
       (b) a smooth low-frequency noise field that clusters brightness into soft
           clouds — gives the field real depth (not a flat glow),
       (c) a slow per-dot twinkle so the whole field breathes (ambient motion),
       (d) a wide, soft cursor lift (brightness + dot size) — responsive but not
           a hard spotlight.
     On first load an organic shimmer sweeps across once (eased, wavy, ramped).
     initField is reassigned so the hero/footer calls use this; the returned
     object exposes no-op stubs for setBoost/setTextShields/armIntro. */
  function makeDotGrid(canvas, opts) {
    var api = { setBoost: function () {}, setTextShields: function () {}, armIntro: function () {} };
    if (!canvas || !canvas.getContext) return api;
    var ctx = canvas.getContext("2d");
    var PITCH = opts && opts.pitch != null ? opts.pitch : 14;  /* dot spacing */
    var DOT = 1.05;          /* base dot radius — a touch bigger than Aave's ~0.9px */
    var BASE = opts && opts.base != null ? opts.base : 0.15;         /* floor brightness for every dot */
    var SPARK = opts && opts.spark != null ? opts.spark : 0.3;       /* extra brightness for scattered bright dots */
    var DEPTH = opts && opts.depth != null ? opts.depth : 0.5;  /* noise-cluster strength (per-instance) */
    var VIS_FLOOR = 0.92;    /* steady visibility before flicker */
    var AMB = 1.15;          /* ambient flicker amplitude (random "activation" pops) */
    var HOVER = 2.4;         /* extra flicker amplitude near cursor (twinkly activation on hover) */
    var FLSPD = 0.0033;      /* base flicker speed (rad/ms) */
    var CLIFT = 0.45;        /* steady brightness lift near the cursor */
    var SIZE_LIFT = 0.35;    /* extra dot size near the cursor */
    var GLOW_R = 460;        /* cursor influence radius */
    var TRAIL_DECAY = 0.986; /* hover-trail fade per frame (leaves a trail for ~a few seconds) */
    var EDGE = 60;           /* fade dots near canvas edges */
    var INTRO_MS = opts && opts.introMs != null ? opts.introMs : 3000;  /* reveal duration (per-instance) */
    var INTRO_BAND = 0.30;   /* softness/width of the reveal front */
    var CREST = 1.2;         /* brightness bloom that travels with the reveal */
    var CRESTW = 0.13;       /* width of that bloom (wide = soft, not a flash) */
    var RAMP_MS = 900;       /* interactivity fades in over this long after the intro */
    var scatterMode = opts && opts.scatter ? String(opts.scatter) : "";
    var getInset = opts && opts.getInset;
    var insetFeather = opts && opts.insetFeather != null ? opts.insetFeather : 52;
    var insetL = 0, insetR = 0, insetT = 0, insetB = 0, fieldW = 0, fieldH = 0;
    var TAU = Math.PI * 2;
    function smooth01(t) { return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); }
    function applyInset() {
      insetL = insetR = insetT = insetB = 0;
      fieldW = cssW;
      fieldH = cssH;
      if (!getInset) return;
      var ins = getInset(canvas, cssW, cssH);
      if (!ins) return;
      insetT = ins.top || 0;
      insetR = ins.right || 0;
      insetB = ins.bottom || 0;
      insetL = ins.left || 0;
      fieldW = Math.max(1, cssW - insetL - insetR);
      fieldH = Math.max(1, cssH - insetT - insetB);
    }
    function insetDim(cx, cy) {
      if (!getInset) return 1;
      var dl = cx - insetL;
      var dr = insetR > 0 ? (cssW - insetR) - cx : Infinity;
      var dt = cy - insetT;
      var db = (cssH - insetB) - cy;
      var d = Math.min(dl, dr, dt, db);
      if (d >= insetFeather) return 1;
      if (d <= 0) return 0;
      return smooth01(d / insetFeather);
    }
    function scatterDim(x, y, col, row, ph, idx) {
      if (!scatterMode) return 1;
      var fx = x - insetL;
      var fy = y - insetT;
      var xn = fieldW > 0 ? fx / fieldW : 0;
      var yn = fieldH > 0 ? fy / fieldH : 0;
      if (scatterMode === "footer") {
        /* Sporadic cloud — bleeds past content, irregular on every edge + interior pockets */
        var spor = rnd(idx + 99) * (0.5 + 0.5 * Math.sin(ph * 4.1 + col * 0.91 + row * 1.37))
          * (0.5 + 0.5 * Math.cos(ph * 2.6 - col * 1.2 + row * 0.55));
        var topEdge =
          -0.06 +
          Math.sin(xn * 7.4 + ph * 0.41) * 0.14 +
          Math.sin(xn * 3.6 + col * 0.43) * 0.1 +
          (rnd(idx + 404) - 0.5) * 0.12;
        var botEdge =
          1.04 +
          Math.sin(xn * 6.1 - ph * 0.62) * 0.12 +
          Math.cos(xn * 4.2 + row * 0.31) * 0.09 +
          (rnd(idx + 505) - 0.5) * 0.1;
        var leftEdge =
          -0.05 +
          Math.sin(yn * 8.2 + ph * 0.33) * 0.14 +
          Math.cos(yn * 3.8 + col * 0.27) * 0.1 +
          (rnd(idx + 606) - 0.5) * 0.11;
        var rightEdge =
          1.05 +
          Math.sin(yn * 5.6 - ph * 0.48) * 0.13 +
          Math.cos(yn * 7.1 + row * 0.19) * 0.09 +
          (rnd(idx + 707) - 0.5) * 0.11;
        var fromTop = yn - topEdge;
        var fromBot = botEdge - yn;
        var fromLeft = xn - leftEdge;
        var fromRight = rightEdge - xn;
        if (fromTop <= -0.08 || fromBot <= -0.08 || fromLeft <= -0.08 || fromRight <= -0.08) return 0;
        var gate = smooth01(fromTop / 0.22) * smooth01(fromBot / 0.22)
          * smooth01(fromLeft / 0.2) * smooth01(fromRight / 0.2);
        gate *= 0.38 + spor * 0.62;
        if (fromTop < 0.14 && spor < 0.14) gate *= 0.35;
        if (fromBot < 0.14 && spor < 0.16) gate *= 0.35;
        gate *= 1.05 - xn * 0.12;
        /* Interior voids — breaks up any rectangular fill */
        if (rnd(idx + 1201) > 0.74 + gate * 0.18) return 0;
        if (rnd(idx + 1302) > 0.88 && spor < 0.35) return 0;
        return gate;
      }
      return 1;
    }
    var dpr = 1, cssW = 0, cssH = 0, cols = 0, rows = 0, offX = 0, offY = 0;
    var spark = null, depth = null, phase = null, spd = null, heat = null;
    var px = 0, py = 0, gx = 0, gy = 0, pointerSeen = false;
    var raf = 0, running = false, inView = true, primed = false, introStart = -1, introEnd = -1;
    var introFired = false, deferIntro = !!(opts && opts.deferIntroVisible);
    var skipIntro = !!(opts && opts.skipIntro);

    function rnd(i) { var x = Math.sin(i * 127.1 + 11.7) * 43758.5453; return x - Math.floor(x); }
    function spike(t, c, w) { var z = (t - c) / w; return Math.exp(-z * z); } /* sharp flash pulse */
    function fieldNoise(x, y) {
      var n = Math.sin(x * 0.0125 + y * 0.0071) * 0.5
            + Math.sin(x * 0.027 - y * 0.019 + 1.7) * 0.32
            + Math.sin((x + y) * 0.0094 + 2.3) * 0.18;
      return 0.5 + 0.5 * n;                      /* ~0..1 smooth clouds */
    }
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      cssW = r.width; cssH = r.height;
      if (!cssW || !cssH) return;
      canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
      cols = Math.ceil(cssW / PITCH) + 1; rows = Math.ceil(cssH / PITCH) + 1;
      offX = Math.round((cssW - (cols - 1) * PITCH) / 2);
      offY = Math.round((cssH - (rows - 1) * PITCH) / 2);
      spark = new Float32Array(cols * rows);
      depth = new Float32Array(cols * rows);
      phase = new Float32Array(cols * rows);
      spd = new Float32Array(cols * rows);
      heat = new Float32Array(cols * rows);
      var k = 0;
      for (var rr = 0; rr < rows; rr++) {
        for (var c = 0; c < cols; c++) {
          var v = rnd(k + 1); spark[k] = v * v;          /* skew faint */
          depth[k] = fieldNoise(offX + c * PITCH, offY + rr * PITCH);
          phase[k] = rnd(k + 941) * TAU;                 /* per-dot flicker phase */
          spd[k] = 0.4 + 1.2 * rnd(k + 5003);            /* per-dot flicker rate (random rhythms) */
          k++;
        }
      }
      applyInset();
      if (!primed) {
        px = gx = insetL + fieldW * 0.35;
        py = gy = insetT + fieldH * 0.42;
        primed = true;
      }
    }
    function edgeDim(x, y) {
      var d = Math.min(x, cssW - x, y, cssH - y);
      return d >= EDGE ? 1 : d <= 0 ? 0 : d / EDGE;
    }
    function draw(now) {
      if (!cssW || !cssH || !spark) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      if (!reduced && !introFired) return;             /* grid isn't there until the reveal fires */
      var introActive = false, front = 0;
      if (introStart >= 0) {
        var ip = (now - introStart) / INTRO_MS;
        if (ip >= 1) { introStart = -1; introEnd = now; }
        else {
          introActive = true;
          var t = ip < 0 ? 0 : ip;
          var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;   /* graceful easeInOut sweep */
          front = e * (1 + 2 * INTRO_BAND) - INTRO_BAND;
        }
      }
      /* interactivity is off during the intro, then fades in smoothly */
      var iFac = introStart >= 0 ? 0 : (introEnd >= 0 ? Math.min(1, (now - introEnd) / RAMP_MS) : 1);
      var paint = iFac > 0 && pointerSeen;
      ctx.fillStyle = "#fff";
      var k = 0;
      for (var rr = 0; rr < rows; rr++) {
        for (var c = 0; c < cols; c++) {
          var s = spark[k], dp = depth[k], ph = phase[k], sp = spd[k];
          var x = offX + c * PITCH, y = offY + rr * PITCH;
          /* hover heat: decays each frame; the cursor paints fresh heat → a fading trail */
          var h = heat[k] * TRAIL_DECAY;
          if (paint) {
            var dx = x - gx, dy = y - gy, d2 = dx * dx + dy * dy;
            if (d2 < GLOW_R * GLOW_R) { var pr = 1 - Math.sqrt(d2) / GLOW_R; pr = pr * pr * iFac; if (pr > h) h += (pr - h) * 0.1; } /* ease heat up, no abrupt pop */
          }
          heat[k] = h; k++;
          var glow = h;
          /* irregular twinkle (two beating sines → more random activation) */
          var f = (0.5 + 0.5 * Math.sin(now * FLSPD * sp + ph)) * (0.5 + 0.5 * Math.sin(now * FLSPD * sp * 0.53 + ph * 2.3 + 1.1));
          f = f * f;
          var a = (BASE + SPARK * s) * (1 - DEPTH + DEPTH * dp) * (VIS_FLOOR + (AMB + HOVER * glow) * f) * (1 + CLIFT * glow);
          var rad = DOT * (0.78 + 0.5 * dp) * (1 + SIZE_LIFT * glow);
          if (introActive) {
            /* dots ease in along a soft diagonal front, lit by a gentle traveling bloom */
            var dpos = (x / cssW + y / cssH) * 0.5 + (ph / TAU - 0.5) * 0.22;
            var dd = front - dpos;
            var rt = dd / INTRO_BAND;
            var reveal = rt <= 0 ? 0 : rt >= 1 ? 1 : rt * rt * (3 - 2 * rt);
            if (reveal <= 0) continue;                   /* not there yet */
            a = (a + CREST * Math.exp(-(dd * dd) / (CRESTW * CRESTW)) * (0.4 + 0.6 * s)) * reveal;
            rad *= 0.45 + 0.55 * reveal;                 /* dots grow in for a clearer reveal */
          }
          a *= scatterDim(x, y, c, rr, ph, k - 1);
          if (a <= 0.004) continue;
          a *= insetDim(x, y);
          if (a <= 0.004) continue;
          if (!getInset) a *= edgeDim(x, y);
          if (a <= 0.004) continue;
          ctx.globalAlpha = a > 1 ? 1 : a;   /* let the brightest twinkles reach full white */
          ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);   /* little squares */
        }
      }
      ctx.globalAlpha = 1;
    }
    function frame() {
      gx += (px - gx) * 0.14;
      gy += (py - gy) * 0.14;
      draw(performance.now());
      if (running) raf = requestAnimationFrame(frame);   /* continuous: ambient twinkle + trail */
    }
    function start() { if (running || reduced) return; running = true; raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    function triggerIntro() { if (introFired || reduced) return; introFired = true; introStart = performance.now(); start(); }
    api.armIntro = triggerIntro;   /* hero calls this once its text has animated in */

    size();
    if (skipIntro) introFired = true;
    draw(performance.now());       /* empty pre-intro (or full grid when reduced-motion / skipIntro) */
    canvas.classList.add("is-on");
    if (reduced) return api;
    if (deferIntro) window.setTimeout(triggerIntro, 250);    /* reveal shortly after the text starts loading in */

    window.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      var nx = e.clientX - r.left, ny = e.clientY - r.top;
      if (!pointerSeen) { gx = nx; gy = ny; }   /* start the glow at the cursor, not the centre */
      px = nx; py = ny; pointerSeen = true;
      if (inView && introFired) start();
    }, { passive: true });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        inView = en[0].isIntersecting;
        if (inView) { if (introFired) start(); else if (!deferIntro) triggerIntro(); }
        else stop();
      }, { threshold: 0.01 });
      io.observe(canvas);
    } else if (!deferIntro) triggerIntro();
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else if (inView && introFired) start(); });
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { size(); draw(performance.now()); }, 150); }, { passive: true });
    return api;
  }
  initField = makeDotGrid;

  var heroGrid = initField(document.querySelector(".hero__grid-fx"), {
    twinkle: true, stars: true, starHover: false, autoRun: true, intro: true, deferIntroVisible: true, periodicShimmer: true,
    patternField: true,
    pitch: 20, base: 0.053, peak: 0, alphaMul: 0.96, maxAlpha: 0.93,
    textShieldFloor: 0.7, textShieldFeather: 52,
    scatterKeep: 0.68, rightScatter: true, rightFade: 0.48,
    insetFeather: 88,
    getInset: function (host, w, h) {
      var hero = host.closest(".hero") || host.parentElement;
      var box = hero && hero.querySelector(".container");
      var bleedX = 48;
      var edgeMin = 20;
      var top = Math.round(20 + h * 0.02);
      var bottom = Math.round(40 + h * 0.04);
      if (!box || !hero) {
        return { top: top, bottom: bottom, left: edgeMin, right: 0 };
      }
      var hr = hero.getBoundingClientRect();
      var cr = box.getBoundingClientRect();
      return {
        top: top,
        bottom: bottom,
        left: Math.max(edgeMin, Math.round(cr.left - hr.left - bleedX)),
        right: 0
      };
    }
  });
  if (heroGrid && !reduced) heroGrid.setBoost(0.12);
  (function wireHeroTextShield() {
    if (!heroGrid || reduced) return;
    var hero = document.getElementById("hero");
    if (!hero) return;
    var titleEl = hero.querySelector(".hero__title");
    function measure() {
      var hr = hero.getBoundingClientRect();
      var rects = [];
      if (titleEl) {
        var r = titleEl.getBoundingClientRect();
        rects.push({
          x0: r.left - hr.left - 20,
          y0: r.top - hr.top - 14,
          x1: r.right - hr.left + 28,
          y1: r.bottom - hr.top + 16,
          floor: 0.56,
          feather: 44
        });
      }
      heroGrid.setTextShields(rects);
    }
    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("load", measure);
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(measure);
      ro.observe(hero);
      if (titleEl) ro.observe(titleEl);
    }
    if ("MutationObserver" in window) {
      new MutationObserver(function () {
        if (hero.classList.contains("hero--ready")) measure();
      }).observe(hero, { attributes: true, attributeFilter: ["class"] });
    }
  })();
  (function wireHeroIntro() {
    if (!heroGrid || reduced) return;
    var hero = document.getElementById("hero");
    var gridIntroDone = false;
    var fallbackTimer = null;
    function fireGridIntro() {
      if (gridIntroDone) return;
      gridIntroDone = true;
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      heroGrid.armIntro();
    }
    function waitForHeroEntrance() {
      if (!hero || !hero.classList.contains("hero--ready")) return;
      /* After line 3 lands — grid overlaps last line, CTAs, and partners */
      var targets = hero.querySelectorAll(".hero__line:nth-child(-n+3)");
      if (!targets.length) {
        fireGridIntro();
        return;
      }
      var remaining = targets.length;
      function oneDone(e) {
        if (e && e.animationName && e.animationName !== "heroLineIn") return;
        remaining--;
        if (remaining <= 0) fireGridIntro();
      }
      targets.forEach(function (el) {
        el.addEventListener("animationend", oneDone, { once: true });
      });
      var maxEnd = 0;
      targets.forEach(function (el) {
        var cs = window.getComputedStyle(el);
        var delay = parseFloat(cs.animationDelay) || 0;
        var dur = parseFloat(cs.animationDuration) || 0;
        if (delay + dur > maxEnd) maxEnd = delay + dur;
      });
      fallbackTimer = window.setTimeout(fireGridIntro, maxEnd * 1000 + 20);
    }
    if (!hero) {
      fireGridIntro();
      return;
    }
    function kick() {
      if (hero.classList.contains("hero--ready")) waitForHeroEntrance();
    }
    kick();
    if (!hero.classList.contains("hero--ready") && "MutationObserver" in window) {
      new MutationObserver(kick).observe(hero, { attributes: true, attributeFilter: ["class"] });
    }
  })();

  initField(document.querySelector(".footer__grid-fx"), {
    scatter: "footer",
    pitch: 11,
    base: 0.19,
    spark: 0.36,
    depth: 0.62,
    skipIntro: true,
    deferIntroVisible: false,
    insetFeather: 36,
    getInset: function (host, w, h) {
      var footer = host.closest(".footer");
      var box = footer && footer.querySelector(".container");
      var bleedX = Math.round(Math.min(80, Math.max(44, w * 0.055)));
      var bleedY = Math.round(Math.min(28, h * 0.035));
      var top = Math.max(0, Math.round(6 + h * 0.008 - bleedY));
      var bottom = 0;
      if (!box || !footer) {
        return { top: top, bottom: bottom, left: Math.round(w * 0.02), right: Math.round(w * 0.02) };
      }
      var fr = footer.getBoundingClientRect();
      var cr = box.getBoundingClientRect();
      return {
        top: top,
        bottom: bottom,
        left: Math.max(0, Math.round(cr.left - fr.left - bleedX)),
        right: Math.max(0, Math.round(fr.right - cr.right - bleedX))
      };
    }
  });
})();

/* xAI website AnimatedArrow — chevron morphs to arrow on hover (animated-arrow.tsx) */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var qsa = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var ARROW_HTML = '<span class="link-cta__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line data-part="shaft" x1="15" y1="12" x2="15" y2="12"></line><line data-part="upper" x1="11" y1="8" x2="15" y2="12"></line><line data-part="lower" x1="11" y1="16" x2="15" y2="12"></line></svg></span>';

  function lerp(a, b, t) { return a + (b - a) * t; }

  function setArrowProgress(svg, p) {
    var shaft = svg.querySelector('[data-part="shaft"]');
    var upper = svg.querySelector('[data-part="upper"]');
    var lower = svg.querySelector('[data-part="lower"]');
    if (!shaft || !upper || !lower) return;
    shaft.setAttribute("x1", String(lerp(15, 9, p)));
    shaft.setAttribute("x2", String(lerp(15, 18, p)));
    shaft.style.opacity = p < 0.1 ? "0" : String(lerp(0, 1, (p - 0.1) / 0.9));
    upper.setAttribute("x1", String(lerp(11, 14, p)));
    upper.setAttribute("x2", String(lerp(15, 18, p)));
    lower.setAttribute("x1", String(lerp(11, 14, p)));
    lower.setAttribute("x2", String(lerp(15, 18, p)));
  }

  qsa(".link-cta").forEach(function (link) {
    if (!link.querySelector(".link-cta__arrow")) link.insertAdjacentHTML("beforeend", ARROW_HTML);
    var svg = link.querySelector(".link-cta__arrow svg");
    if (!svg) return;
    setArrowProgress(svg, 0);

    if (reduced) {
      link.addEventListener("mouseenter", function () { setArrowProgress(svg, 1); });
      link.addEventListener("mouseleave", function () { setArrowProgress(svg, 0); });
      link.addEventListener("focusin", function () { setArrowProgress(svg, 1); });
      link.addEventListener("focusout", function () { setArrowProgress(svg, 0); });
      return;
    }

    var progress = 0, target = 0, velocity = 0, raf = 0;
    function tick() {
      var spring = -500 * (progress - target) - 30 * velocity;
      velocity += spring * (1 / 60);
      progress += velocity * (1 / 60);
      if (Math.abs(progress - target) < 0.002 && Math.abs(velocity) < 0.002) { progress = target; velocity = 0; }
      setArrowProgress(svg, progress);
      if (progress !== target || Math.abs(velocity) > 0.002) raf = requestAnimationFrame(tick);
      else raf = 0;
    }
    function setTarget(v) { target = v; if (!raf) raf = requestAnimationFrame(tick); }
    link.addEventListener("mouseenter", function () { setTarget(1); });
    link.addEventListener("mouseleave", function () { setTarget(0); });
    link.addEventListener("focusin", function () { setTarget(1); });
    link.addEventListener("focusout", function () { setTarget(0); });
  });
})();

/* space — sun glimmer that brightens as you scroll the section into view */
(function () {
  "use strict";
  var glow = document.querySelector(".space__sun-glow");
  var section = document.getElementById("space");
  if (!glow || !section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    glow.style.opacity = "1";
    return;
  }
  var scheduled = false;
  function spaceSunYRatio() {
    var y = getComputedStyle(section).getPropertyValue("--space-sun-y").trim();
    if (y.endsWith("%")) return parseFloat(y) / 100;
    return 0.16;
  }
  var media = section.querySelector(".scene__media");
  function apply() {
    scheduled = false;
    var r = (media || section).getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var sunY = r.top + r.height * spaceSunYRatio();
    var p = (vh - sunY) / (vh * 0.6);            /* 0 as it enters from the bottom → 1 once well in view */
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    var e = p * p * (3 - 2 * p);                 /* smoothstep */
    glow.style.opacity = e.toFixed(3);           /* opacity only — keeps the blurred layer cached (no jank) */
  }
  function onScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(apply); } }
  apply();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();

/* modal video player — custom on desktop; native controls on mobile */
(function () {
  "use strict";
  var openers = Array.prototype.slice.call(document.querySelectorAll("[data-video-open]"));
  if (!openers.length) return;

  var siteDesktopMq = window.matchMedia("(min-width: 981px)");
  var MODAL_MS = 500;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) MODAL_MS = 120;
  var openT = 0;
  var closeT = 0;

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function setupPlayer(root) {
    var video = root.querySelector("video");
    var frame = root.querySelector(".vplayer__frame");
    var toggle = root.querySelector(".vplayer__toggle");
    var scrub = root.querySelector(".vplayer__scrub");
    var buffer = root.querySelector(".vplayer__buffer");
    var cur = root.querySelector(".vplayer__cur");
    var dur = root.querySelector(".vplayer__dur");
    var mute = root.querySelector(".vplayer__mute");
    var volume = root.querySelector(".vplayer__audio");
    var vol = root.querySelector(".vplayer__vol");
    var fsBtn = root.querySelector(".vplayer__fs");
    if (!video || !frame) return null;
    var hideT = 0;
    var CHROME_HIDE_MS = 2800;
    var dragging = false;
    var scrubDragged = false;
    var scrubReleased = false;
    var scrubStartX = 0;
    var scrubStartY = 0;
    var scrubTapP = 0;
    var SCRUB_DRAG_THRESH = 8;
    var seekAnimating = false;
    var seekAnimRaf = 0;
    var SEEK_ANIM_MS = 240;
    var volDragging = false;
    var volAnimating = false;
    var volAnimRaf = 0;
    var smoothVol = 1;
    var lastVol = 1;
    var VOL_ANIM_MS = 400;
    var smoothP = 0;
    var progressRaf = 0;
    var progressOn = false;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var toggleAnimT = 0;
    var muteAnimT = 0;
    var fsAnimT = 0;

    function fsTarget() {
      return frame;
    }
    function fsActive() {
      var el = fsTarget();
      return document.fullscreenElement === el || document.webkitFullscreenElement === el;
    }
    function exitFs() {
      if (!fsActive()) return;
      var x = document.exitFullscreen || document.webkitExitFullscreen;
      if (x) x.call(document);
    }
    function enterFs() {
      var el = fsTarget();
      var req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (!req) return;
      var p = req.call(el);
      if (p && p.catch) p.catch(function () {});
    }
    function toggleFs() {
      if (fsActive()) exitFs();
      else enterFs();
    }
    function onFsChange() {
      var on = fsActive();
      root.classList.toggle("is-fullscreen", on);
      if (fsBtn) fsBtn.setAttribute("aria-label", on ? "Exit fullscreen" : "Fullscreen");
    }
    function pulseFsAnim() {
      if (!fsBtn || reduceMotion) return;
      fsBtn.classList.add("is-animating");
      window.clearTimeout(fsAnimT);
      fsAnimT = window.setTimeout(function () {
        fsBtn.classList.remove("is-animating");
      }, 440);
    }

    function setVolUI(p) {
      smoothVol = Math.max(0, Math.min(1, p));
      if (!vol) return;
      vol.style.setProperty("--vp-vol", smoothVol.toFixed(4));
      vol.setAttribute("aria-valuenow", Math.round(smoothVol * 100));
    }
    function cancelVolAnim() {
      if (volAnimRaf) cancelAnimationFrame(volAnimRaf);
      volAnimRaf = 0;
      volAnimating = false;
      if (vol) vol.classList.remove("is-animating");
    }
    function animateVolTo(target, onDone) {
      target = Math.max(0, Math.min(1, target));
      cancelVolAnim();
      if (reduceMotion) {
        setVolUI(target);
        if (onDone) onDone();
        return;
      }
      volAnimating = true;
      if (vol) vol.classList.add("is-animating");
      var start = smoothVol;
      var t0 = performance.now();
      function tick(now) {
        var u = Math.min(1, (now - t0) / VOL_ANIM_MS);
        var eased = 1 - Math.pow(1 - u, 3);
        setVolUI(start + (target - start) * eased);
        if (u < 1) {
          volAnimRaf = requestAnimationFrame(tick);
          return;
        }
        setVolUI(target);
        cancelVolAnim();
        if (onDone) onDone();
      }
      volAnimRaf = requestAnimationFrame(tick);
    }
    function syncMuteState() {
      var muted = video.muted || video.volume === 0;
      root.classList.toggle("is-muted", muted);
      if (mute) mute.setAttribute("aria-label", muted ? "Unmute" : "Mute");
    }
    function setVolumeLevel(p, remember) {
      cancelVolAnim();
      p = Math.max(0, Math.min(1, p));
      if (p === 0) {
        if (video.volume > 0 && remember !== false) lastVol = video.volume;
        video.muted = true;
        setVolUI(0);
      } else {
        if (remember !== false) lastVol = p;
        video.muted = false;
        video.volume = p;
        setVolUI(p);
      }
      syncMuteState();
    }

    function setProgress(p) {
      if (!scrub) return;
      p = Math.max(0, Math.min(1, p));
      scrub.style.setProperty("--vp-p", p.toFixed(5));
    }
    function setBuffer(p) {
      if (!scrub) return;
      scrub.style.setProperty("--vp-buffer", Math.max(0, Math.min(1, p)).toFixed(5));
    }
    function targetProgress() {
      var d = video.duration;
      return d && isFinite(d) ? video.currentTime / d : 0;
    }
    function progressTick() {
      if (!progressOn) return;
      if (seekAnimating) {
        progressRaf = requestAnimationFrame(progressTick);
        return;
      }
      var target = targetProgress();
      if (dragging || reduceMotion) {
        smoothP = target;
      } else if (!video.paused) {
        var diff = target - smoothP;
        smoothP += diff * 0.35;
        if (Math.abs(diff) < 0.00006) smoothP = target;
      } else {
        smoothP += (target - smoothP) * 0.55;
        if (Math.abs(target - smoothP) < 0.00006) smoothP = target;
      }
      setProgress(smoothP);
      progressRaf = requestAnimationFrame(progressTick);
    }
    function startProgress() {
      if (progressOn) return;
      progressOn = true;
      progressRaf = requestAnimationFrame(progressTick);
    }
    function stopProgress() {
      progressOn = false;
      if (progressRaf) cancelAnimationFrame(progressRaf);
      progressRaf = 0;
    }
    function pulseToggleAnim() {
      if (!toggle || reduceMotion) return;
      toggle.classList.add("is-animating");
      window.clearTimeout(toggleAnimT);
      toggleAnimT = window.setTimeout(function () {
        toggle.classList.remove("is-animating");
      }, 440);
    }
    function pulseMuteAnim() {
      if (!mute || reduceMotion) return;
      mute.classList.add("is-animating");
      window.clearTimeout(muteAnimT);
      muteAnimT = window.setTimeout(function () {
        mute.classList.remove("is-animating");
      }, 440);
    }

    function showChrome(persist) {
      root.classList.remove("is-idle");
      root.classList.add("is-chrome-visible");
      window.clearTimeout(hideT);
      if (!persist && !video.paused && !dragging && !volDragging && !seekAnimating) {
        hideT = window.setTimeout(function () {
          root.classList.remove("is-chrome-visible");
          root.classList.add("is-idle");
        }, CHROME_HIDE_MS);
      }
    }
    function hideChromeSoon() {
      if (video.paused || dragging || volDragging || seekAnimating) showChrome(true);
      else showChrome(false);
    }

    function playPause() {
      pulseToggleAnim();
      if (video.paused) {
        var pr = video.play();
        if (pr && pr.catch) pr.catch(function () {});
      } else {
        video.pause();
      }
    }
    if (toggle) {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        playPause();
        showChrome(true);
      });
    }
    frame.addEventListener("click", function (e) {
      if (e.target.closest(".vplayer__close, .vplayer__dock")) return;
      playPause();
      showChrome(true);
    });
    video.addEventListener("play", function () {
      root.classList.add("is-playing");
      if (toggle) toggle.setAttribute("aria-label", "Pause");
      hideChromeSoon();
    });
    video.addEventListener("pause", function () {
      root.classList.remove("is-playing");
      if (toggle) toggle.setAttribute("aria-label", "Play");
      showChrome(true);
    });
    video.addEventListener("ended", function () {
      root.classList.remove("is-playing");
      if (toggle) toggle.setAttribute("aria-label", "Play");
      try { video.currentTime = 0; } catch (e) {}
      showChrome(true);
    });
    video.addEventListener("timeupdate", function () {
      var d = video.duration || 0;
      if (cur) cur.textContent = fmt(video.currentTime);
      if (scrub && d) scrub.setAttribute("aria-valuenow", Math.round(video.currentTime / d * 100));
    });
    video.addEventListener("progress", function () {
      try {
        if (video.buffered.length && video.duration) {
          setBuffer(video.buffered.end(video.buffered.length - 1) / video.duration);
        }
      } catch (e) {}
    });
    video.addEventListener("loadedmetadata", function () {
      if (dur) dur.textContent = fmt(video.duration);
    });
    video.addEventListener("volumechange", function () {
      if (!video.muted && video.volume > 0) lastVol = video.volume;
      if (!volAnimating && !volDragging) {
        setVolUI(video.muted || video.volume === 0 ? 0 : video.volume);
      }
      syncMuteState();
    });
    if (mute) {
      mute.addEventListener("click", function (e) {
        e.stopPropagation();
        pulseMuteAnim();
        if (video.muted || video.volume === 0) {
          var restore = lastVol > 0 ? lastVol : 1;
          video.muted = false;
          video.volume = restore;
          syncMuteState();
          animateVolTo(restore);
        } else {
          lastVol = video.volume > 0 ? video.volume : lastVol;
          video.muted = true;
          syncMuteState();
          animateVolTo(0);
        }
        showChrome(true);
      });
    }
    function volAt(clientX) {
      if (!vol) return;
      var line = vol.querySelector(".vplayer__vol-line");
      var r = line ? line.getBoundingClientRect() : vol.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      setVolumeLevel(p, true);
    }
    function endVolDrag() {
      volDragging = false;
      if (volume) volume.classList.remove("is-dragging");
      if (vol) vol.classList.remove("is-dragging");
      hideChromeSoon();
    }
    if (vol) {
      setVolUI(video.muted ? 0 : video.volume || 1);
      vol.addEventListener("pointerdown", function (e) {
        e.stopPropagation();
        volDragging = true;
        if (volume) volume.classList.add("is-dragging");
        vol.classList.add("is-dragging");
        showChrome(true);
        try { vol.setPointerCapture(e.pointerId); } catch (x) {}
        volAt(e.clientX);
      });
      vol.addEventListener("pointermove", function (e) { if (volDragging) volAt(e.clientX); });
      vol.addEventListener("pointerup", endVolDrag);
      vol.addEventListener("pointercancel", endVolDrag);
      vol.addEventListener("lostpointercapture", endVolDrag);
      vol.addEventListener("keydown", function (e) {
        var step = 0.05;
        var v = video.muted ? 0 : video.volume;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          setVolumeLevel(Math.min(1, v + step), true);
          e.preventDefault();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          setVolumeLevel(Math.max(0, v - step), true);
          e.preventDefault();
        }
        showChrome(true);
      });
    }
    if (fsBtn) {
      fsBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        pulseFsAnim();
        toggleFs();
        showChrome(true);
      });
    }
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);

    function scrubRatio(clientX) {
      if (!scrub) return 0;
      var line = scrub.querySelector(".vplayer__track-line");
      var r = line ? line.getBoundingClientRect() : scrub.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    }
    function cancelSeekAnim() {
      if (seekAnimRaf) cancelAnimationFrame(seekAnimRaf);
      seekAnimRaf = 0;
      seekAnimating = false;
      if (scrub) scrub.classList.remove("is-seeking");
    }
    function applySeek(p) {
      if (!video.duration) return;
      p = Math.max(0, Math.min(1, p));
      try { video.currentTime = p * video.duration; } catch (e) {}
      smoothP = p;
      setProgress(p);
      if (scrub) scrub.setAttribute("aria-valuenow", Math.round(p * 100));
      if (cur) cur.textContent = fmt(video.currentTime);
    }
    function seekVideoTo(p) {
      if (!video.duration) return;
      p = Math.max(0, Math.min(1, p));
      try { video.currentTime = p * video.duration; } catch (e) {}
      if (cur) cur.textContent = fmt(video.currentTime);
    }
    function setSeekUI(p) {
      p = Math.max(0, Math.min(1, p));
      smoothP = p;
      setProgress(p);
      if (scrub) scrub.setAttribute("aria-valuenow", Math.round(p * 100));
    }
    function animateSeekTo(p) {
      if (!video.duration) return;
      p = Math.max(0, Math.min(1, p));
      cancelSeekAnim();
      seekVideoTo(p);
      if (reduceMotion) {
        setSeekUI(p);
        hideChromeSoon();
        return;
      }
      seekAnimating = true;
      if (scrub) scrub.classList.add("is-seeking");
      showChrome(true);
      var startP = smoothP;
      var t0 = performance.now();
      function tick(now) {
        var u = Math.min(1, (now - t0) / SEEK_ANIM_MS);
        var eased = 1 - Math.pow(1 - u, 3);
        setSeekUI(startP + (p - startP) * eased);
        if (u < 1) {
          seekAnimRaf = requestAnimationFrame(tick);
          return;
        }
        setSeekUI(p);
        cancelSeekAnim();
        hideChromeSoon();
      }
      seekAnimRaf = requestAnimationFrame(tick);
    }
    function seekAt(clientX) {
      if (!scrub || !video.duration) return;
      cancelSeekAnim();
      applySeek(scrubRatio(clientX));
    }
    function endDrag() {
      dragging = false;
      scrubDragged = false;
      if (scrub) scrub.classList.remove("is-dragging");
      hideChromeSoon();
    }
    function releaseScrub(e) {
      if (scrubReleased) return;
      scrubReleased = true;
      if (dragging && !scrubDragged && video.duration) {
        var p = scrubTapP;
        if (e && e.clientX != null) p = scrubRatio(e.clientX);
        animateSeekTo(p);
      }
      endDrag();
    }
    if (scrub) {
      scrub.addEventListener("pointerdown", function (e) {
        e.stopPropagation();
        cancelSeekAnim();
        dragging = true;
        scrubReleased = false;
        scrubDragged = false;
        scrubStartX = e.clientX;
        scrubStartY = e.clientY;
        scrubTapP = scrubRatio(e.clientX);
        showChrome(true);
        scrub.classList.add("is-dragging");
        try { scrub.setPointerCapture(e.pointerId); } catch (x) {}
      });
      scrub.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        if (!scrubDragged) {
          var dx = e.clientX - scrubStartX;
          var dy = e.clientY - scrubStartY;
          if (dx * dx + dy * dy < SCRUB_DRAG_THRESH * SCRUB_DRAG_THRESH) return;
          scrubDragged = true;
        }
        seekAt(e.clientX);
      });
      scrub.addEventListener("pointerup", releaseScrub);
      scrub.addEventListener("pointercancel", releaseScrub);
      scrub.addEventListener("lostpointercapture", releaseScrub);
      scrub.addEventListener("keydown", function (e) {
        if (!video.duration) return;
        if (e.key === "ArrowRight") {
          animateSeekTo(Math.min(1, (video.currentTime + 5) / video.duration));
          e.preventDefault();
        } else if (e.key === "ArrowLeft") {
          animateSeekTo(Math.max(0, (video.currentTime - 5) / video.duration));
          e.preventDefault();
        }
        showChrome(true);
      });
    }
    frame.addEventListener("pointermove", function () {
      if (root.classList.contains("is-open")) {
        showChrome(!video.paused && !dragging && !volDragging && !seekAnimating);
      }
    });
    frame.addEventListener("pointerleave", function () {
      if (!root.classList.contains("is-ready")) return;
      if (!video.paused && !dragging && !volDragging && !seekAnimating) showChrome(false);
    });

    return {
      prime: function () {
        try { video.load(); } catch (e) {}
        startProgress();
      },
      play: function () {
        showChrome(true);
        startProgress();
        var pr = video.play();
        if (pr && pr.catch) pr.catch(function () {});
      },
      stop: function () {
        window.clearTimeout(hideT);
        window.clearTimeout(toggleAnimT);
        window.clearTimeout(muteAnimT);
        window.clearTimeout(fsAnimT);
        cancelVolAnim();
        cancelSeekAnim();
        exitFs();
        stopProgress();
        try { video.pause(); video.currentTime = 0; } catch (e) {}
        video.muted = false;
        video.volume = 1;
        lastVol = 1;
        smoothVol = 1;
        setVolUI(1);
        smoothP = 0;
        setProgress(0);
        setBuffer(0);
        if (cur) cur.textContent = "0:00";
        if (dur) dur.textContent = "0:00";
        if (scrub) {
          scrub.classList.remove("is-dragging");
          scrub.setAttribute("aria-valuenow", "0");
        }
        dragging = false;
        if (toggle) toggle.classList.remove("is-animating");
        if (mute) {
          mute.classList.remove("is-animating");
          mute.setAttribute("aria-label", "Mute");
        }
        if (fsBtn) {
          fsBtn.classList.remove("is-animating");
          fsBtn.setAttribute("aria-label", "Fullscreen");
        }
        if (volume) volume.classList.remove("is-dragging");
        if (vol) vol.classList.remove("is-dragging");
        volDragging = false;
        root.classList.remove("is-playing", "is-muted", "is-fullscreen", "is-chrome-visible", "is-idle");
        if (toggle) toggle.setAttribute("aria-label", "Play");
      }
    };
  }

  function openNativePlayer(root) {
    var srcVideo = root.querySelector(".vplayer__video");
    var srcUrl = "";
    if (srcVideo) {
      var s = srcVideo.querySelector("source");
      srcUrl = (s && s.src) || srcVideo.currentSrc || "";
    }
    if (!srcUrl) return;

    var prior = document.querySelector(".vplayer-native");
    if (prior) prior.remove();

    var shell = document.createElement("div");
    shell.className = "vplayer-native";
    shell.setAttribute("role", "dialog");
    shell.setAttribute("aria-modal", "true");
    shell.setAttribute("aria-label", "Video");

    var v = document.createElement("video");
    v.className = "vplayer-native__video";
    v.src = srcUrl;
    v.controls = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.preload = "auto";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "vplayer-native__close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\u00d7";

    shell.appendChild(v);
    shell.appendChild(closeBtn);
    document.body.appendChild(shell);
    document.documentElement.style.overflow = "hidden";

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      try { v.pause(); v.removeAttribute("src"); v.load(); } catch (e) {}
      shell.remove();
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
      if (e.key === "Escape" || e.keyCode === 27) close();
    }

    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      close();
    });
    v.addEventListener("ended", close);
    document.addEventListener("keydown", onKey);

    var pr = v.play();
    if (pr && pr.catch) pr.catch(function () {});
  }

  function openDialog(root, api) {
    if (root.classList.contains("is-active")) return;
    window.clearTimeout(openT);
    window.clearTimeout(closeT);
    root.classList.remove("is-open", "is-closing", "is-ready", "is-playing", "is-chrome-visible", "is-idle");
    root.classList.add("is-active");
    root.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    if (api) api.prime();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.add("is-open", "is-chrome-visible");
        root.classList.remove("is-idle");
      });
    });
    openT = window.setTimeout(function () {
      root.classList.add("is-ready");
      if (api) api.play();
    }, MODAL_MS);
  }

  function closeDialog(root, api) {
    if (!root.classList.contains("is-active")) return;
    window.clearTimeout(openT);
    window.clearTimeout(closeT);
    if (api) api.stop();
    root.classList.remove("is-open", "is-ready", "is-playing", "is-chrome-visible", "is-idle");
    root.classList.add("is-closing");
    closeT = window.setTimeout(function () {
      root.classList.remove("is-active", "is-closing");
      root.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
    }, MODAL_MS);
  }

  openers.forEach(function (btn) {
    var root = document.getElementById(btn.getAttribute("data-video-open"));
    if (!root) return;
    if (!siteDesktopMq.matches) {
      btn.addEventListener("click", function () { openNativePlayer(root); });
      return;
    }
    var api = setupPlayer(root);
    btn.addEventListener("click", function () { openDialog(root, api); });
    Array.prototype.slice.call(root.querySelectorAll("[data-vplayer-close]")).forEach(function (c) {
      c.addEventListener("click", function (e) {
        e.stopPropagation();
        closeDialog(root, api);
      });
    });
    document.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.keyCode === 27) && root.classList.contains("is-active")) {
        closeDialog(root, api);
      }
      if (e.key === " " && root.classList.contains("is-open")) {
        var scrubEl = root.querySelector(".vplayer__scrub");
        if (scrubEl && document.activeElement === scrubEl) return;
        var volEl = root.querySelector(".vplayer__vol");
        if (volEl && document.activeElement === volEl) return;
        e.preventDefault();
        var v = root.querySelector("video");
        if (!v) return;
        if (v.paused) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      }
      if ((e.key === "f" || e.key === "F") && root.classList.contains("is-open")) {
        var fs = root.querySelector(".vplayer__fs");
        if (fs) { fs.click(); e.preventDefault(); }
      }
    });
  });
})();

/* output size comparison — scroll-scrubbed video, split into two beats:
   beat 1 (person → Tesla Gigafactory) over the first half of scroll,
   beat 2 (Gigafactory → Terafab) over the second half. */
(function () {
  var section = document.getElementById("output");
  if (!section) return;
  var shell = section.querySelector(".osc-shell");
  var v = section.querySelector(".osc__vid");
  if (!shell || !v) return;
  var capGF = section.querySelector(".osc-cap--gf");
  var capTF = section.querySelector(".osc-cap--tf");
  var compare = section.querySelector(".osc-compare");
  var media = section.querySelector(".osc-media");
  var mobileMq = window.matchMedia("(max-width: 560px)");

  // android's MediaCodec makes paused-video seeking janky, so on android we scrub a
  // preloaded webp frame sequence on a canvas instead (paints instantly). ios (incl.
  // "chrome", which is webkit) and desktop keep the untouched <video> seek path below.
  var isAndroid = /Android/i.test(navigator.userAgent || "");
  var EXTRACT_FPS = 5;      // frames were extracted at 5fps → frame k ≈ video second k/5
  var FRAME_COUNT = 128;
  var FRAME_BASE = "assets/terafab/frames/f_";
  var frames = [], canvas = null, ctx = null;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var T_SPLIT = 15;     // video second where beat 2 begins (slab starts replicating)
  var T_END = 24.95;    // last usable second (before the fade-to-black tail)
  var SPLIT = 0.5;      // scroll fraction mapped to the beat boundary

  function vh() { return window.innerHeight || document.documentElement.clientHeight; }
  function inView() { var r = section.getBoundingClientRect(); return r.bottom > 0 && r.top < vh(); }
  function progress() {
    var vp = vh();
    if (mobileMq.matches && media) {
      // mobile: not pinned — run the whole scrub while the clip rises from fully-entered
      // (bottom) to the upper third, then hold the end frame as it scrolls off. keeps the
      // payoff (Terafab) visible instead of finishing when the clip is near the top edge.
      var m = media.getBoundingClientRect();
      var startTop = vp - m.height - vp * 0.1; // begin scrubbing slightly later (after it has risen a bit)
      var endTop = vp * 0.2;                   // scrub completes here; held afterward
      var span = startTop - endTop;
      if (span < 48) return Math.min(1, Math.max(0, 1 - m.top / Math.max(vp, 1)));
      return Math.min(1, Math.max(0, (startTop - m.top) / span));
    }
    var total = shell.offsetHeight - vp;
    if (total < 48) return 0;
    var lead = vp * 0.12; // head-start: begin scrubbing slightly before the clip fully pins
    return Math.min(1, Math.max(0, (lead - shell.getBoundingClientRect().top) / (total + lead)));
  }
  function timeForProgress(p) {
    var end = (v.duration && !isNaN(v.duration)) ? Math.min(T_END, v.duration - 0.05) : T_END;
    if (p < SPLIT) return (p / SPLIT) * T_SPLIT;
    return T_SPLIT + ((p - SPLIT) / (1 - SPLIT)) * (end - T_SPLIT);
  }
  // coalesced seek — never issue a new seek while one is in flight (prevents thrash)
  function seek(t) {
    v.dataset.seek = String(t);
    if (!v.duration || isNaN(v.duration)) return;
    var target = parseFloat(v.dataset.seek);
    if (isNaN(target) || Math.abs(v.currentTime - target) <= 0.03) return;
    if (v.dataset.seeking === "1") return;
    v.dataset.seeking = "1";
    v.addEventListener("seeked", function onSeeked() {
      v.dataset.seeking = "0";
      var next = parseFloat(v.dataset.seek);
      if (!isNaN(next) && Math.abs(v.currentTime - next) > 0.03) seek(next);
    }, { once: true });
    try { v.currentTime = target; } catch (e) { v.dataset.seeking = "0"; }
  }
  // --- android frame-sequence scrub ---
  function pad3(n) { n = String(n); while (n.length < 3) n = "0" + n; return n; }
  function drawFrameForTime(t) {
    if (!ctx) return;
    var idx = Math.round(t * EXTRACT_FPS);
    if (idx < 0) idx = 0; else if (idx > FRAME_COUNT - 1) idx = FRAME_COUNT - 1;
    var img = frames[idx];
    // if the exact frame hasn't decoded yet, draw the nearest one that has — never flash blank
    if (!(img && img.complete && img.naturalWidth)) {
      for (var d = 1; d < FRAME_COUNT; d++) {
        var a = frames[idx - d], b = frames[idx + d];
        if (a && a.complete && a.naturalWidth) { img = a; break; }
        if (b && b.complete && b.naturalWidth) { img = b; break; }
      }
    }
    if (img && img.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  function redraw() { if (inView()) drawFrameForTime(timeForProgress(cur)); }
  function setupCanvas() {
    canvas = document.createElement("canvas");
    canvas.className = "osc__canvas";
    canvas.width = 1280; canvas.height = 720; // native frame size; CSS object-fit:cover crops it
    ctx = canvas.getContext("2d");
    media.insertBefore(canvas, media.firstChild);
    media.classList.add("is-frames");
    // don't download the 15MB video on android — the frame sequence replaces it
    var src = v.querySelector("source"); if (src) src.removeAttribute("src");
    v.removeAttribute("poster");
    try { v.load(); } catch (e) {}
  }
  function preloadFrames() {
    if (frames.length) return;
    for (var i = 0; i < FRAME_COUNT; i++) {
      var img = new Image();
      img.decoding = "async";
      img.addEventListener("load", redraw, { once: true });
      img.src = FRAME_BASE + pad3(i) + ".webp";
      frames[i] = img;
    }
  }
  function setIn(el, on) {
    if (!el) return;
    if (on) el.classList.remove("is-snap"); // re-enable the transition before fading in
    el.classList.toggle("is-in", on);
  }
  function snapHide(el) {
    // hide instantly (no fade) so it can't overlap the other label on a fast scroll
    if (el) { el.classList.add("is-snap"); el.classList.remove("is-in"); }
  }
  function apply(p) {
    if (isAndroid) drawFrameForTime(timeForProgress(p));
    else seek(timeForProgress(p));
    // toggle entrance state when each beat's window is active; CSS plays the draw-in animation
    var gfOn = p >= 0.3 && p <= 0.45;
    var tfOn = p >= 0.72;
    // the two top-left labels share a position — never let them be visible at once.
    // when one activates, snap the other away instantly (it may still be mid fade-out
    // after a fast reverse scroll); otherwise normal fades apply.
    if (gfOn) snapHide(capTF);
    else if (tfOn) snapHide(capGF);
    setIn(capGF, gfOn);
    setIn(capTF, tfOn);
    setIn(compare, tfOn);
  }

  // force a decode (play→pause) so seeking paints frames — required on iOS/Safari.
  // call play() directly: iOS ignores preload and won't load/decode (or fire loadeddata)
  // until play() actually runs, so gating on readyState/loadeddata deadlocks on device.
  var primed = false;
  function prime(cb) {
    if (primed) { if (cb) cb(); return; }
    var done = function () { primed = true; v.pause(); try { if (v.currentTime > 0.02) v.currentTime = 0; } catch (e) {} if (cb) cb(); };
    var pr = v.play();
    if (pr && pr.then) pr.then(done).catch(function () { v.addEventListener("loadeddata", done, { once: true }); v.load(); });
    else done();
  }

  var target = 0, cur = 0;
  // on android, swap the <video> for a canvas up front so the big mp4 is never fetched
  if (isAndroid) setupCanvas();
  v.addEventListener("loadedmetadata", function () { apply(cur); });
  window.addEventListener("scroll", function () { target = progress(); }, { passive: true });
  window.addEventListener("resize", function () { target = progress(); });
  target = cur = progress();

  // android: preload the frame sequence when near view. everyone else: prime the video.
  function start() {
    if (isAndroid) { preloadFrames(); redraw(); }
    else { prime(function () { apply(cur); }); }
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        start();
        io.disconnect();
      });
    }, { rootMargin: "25% 0px 25% 0px" });
    io.observe(section);
  } else {
    start();
  }
  // iOS fallback: prime within a user gesture (Low Power Mode blocks muted auto-play).
  // the android frame path needs no gesture, so skip it there.
  if (!isAndroid) {
    var gesturePrime = function () { prime(function () { apply(cur); }); };
    document.addEventListener("touchstart", gesturePrime, { once: true, passive: true });
    document.addEventListener("pointerdown", gesturePrime, { once: true, passive: true });
  }

  if (reduced) {
    window.addEventListener("scroll", function () { cur = progress(); apply(cur); }, { passive: true });
    apply(progress());
  } else {
    (function loop() {
      var d = target - cur;
      cur += Math.abs(d) > 0.35 ? d * 0.22 : d * 0.12;
      if (inView()) apply(cur);
      requestAnimationFrame(loop);
    })();
  }
})();
