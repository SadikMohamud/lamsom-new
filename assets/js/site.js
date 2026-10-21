(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  $$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* Smooth scroll */
  let lenis = null;
  if (hasGsap && !reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href*="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = $(url.hash);
    if (!target) return;
    e.preventDefault();
    closePanel();
    lenis ? lenis.scrollTo(target, { offset: -40, duration: 1.4 }) : target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }));

  /* Floating panel menu */
  const btn = $("#js-menu-btn");
  const panel = $("#js-panel");
  let open = false;
  function openPanel() {
    open = true; btn.setAttribute("aria-expanded", "true"); panel.classList.add("is-open");
    if (hasGsap && !reduce) {
      gsap.to(panel, { clipPath: "inset(0% 0% 0% 0% round 22px)", duration: 0.8, ease: "expo.out" });
      gsap.fromTo($$(".panel__link", panel), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.05, delay: 0.1 });
    } else panel.style.clipPath = "none";
  }
  function closePanel() {
    if (!open) return;
    open = false; btn.setAttribute("aria-expanded", "false");
    if (hasGsap && !reduce) gsap.to(panel, { clipPath: "inset(0% 0% 100% 30% round 22px)", duration: 0.6, ease: "expo.inOut", onComplete: () => panel.classList.remove("is-open") });
    else panel.classList.remove("is-open");
  }
  btn && btn.addEventListener("click", () => (open ? closePanel() : openPanel()));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closePanel());
  document.addEventListener("click", (e) => { if (open && !panel.contains(e.target) && !btn.contains(e.target)) closePanel(); });

  /* Weekly timetable */
  const WEEK = [
    { d: "Mon", full: "Monday", s: [{ t: "10am to 3pm", n: "Drop in sessions", p: "Advice and advocacy with our bilingual team. No appointment needed." }] },
    { d: "Tue", full: "Tuesday", s: [{ t: "10am to 12:30pm", n: "Women's coffee morning", p: "Meet, talk and share with other women from the community." }] },
    { d: "Wed", full: "Wednesday", s: [{ t: "10am to 3pm", n: "Drop in sessions", p: "Advice and advocacy with our bilingual team. No appointment needed." }, { t: "10am to 12:30pm", n: "Sewing group", p: "Learn and share sewing skills in a friendly group." }] },
    { d: "Thu", full: "Thursday", s: [{ t: "10am to 3pm", n: "Drop in sessions", p: "Advice and advocacy with our bilingual team. No appointment needed." }] },
    { d: "Fri", full: "Friday", s: [] },
    { d: "Sat", full: "Saturday", s: [{ t: "10am to 2pm", n: "Supplementary school", p: "English, maths and science support for school age children." }, { t: "2:15pm to 6pm", n: "Afternoon sessions", p: "Afternoon activities and study support." }, { t: "7pm to 9pm", n: "Sports session", p: "Stockwell FC training at Larkhall Park." }] },
    { d: "Sun", full: "Sunday", s: [{ t: "10am to 2pm", n: "Supplementary school", p: "English, maths and science support for school age children." }, { t: "2:15pm to 6pm", n: "Afternoon sessions", p: "Afternoon activities and study support." }] }
  ];
  const daysEl = $("#js-days"), sessEl = $("#js-sessions");
  if (daysEl && sessEl) {
    const now = new Date();
    const todayIdx = (now.getDay() + 6) % 7;
    const monday = new Date(now); monday.setDate(now.getDate() - todayIdx);
    const show = (i) => {
      $$(".day", daysEl).forEach((b, j) => b.setAttribute("aria-selected", String(i === j)));
      const day = WEEK[i];
      sessEl.innerHTML = day.s.length
        ? day.s.map((x) => `<li class="session"><time>${x.t}</time><div><h3>${x.n}</h3><p>${x.p}</p></div></li>`).join("")
        : `<li class="session"><time>Closed</time><div><h3>No sessions on ${day.full}</h3><p>Call us on 020 7738 6372 if you need help.</p></div></li>`;
      if (hasGsap && !reduce) gsap.fromTo($$(".session", sessEl), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.06 });
    };
    WEEK.forEach((day, i) => {
      const b = document.createElement("button");
      b.className = "day" + (i === todayIdx ? " is-today" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", day.full);
      if (!day.s.length) b.setAttribute("disabled", "");
      const dt = new Date(monday); dt.setDate(monday.getDate() + i);
      b.innerHTML = `${day.d}<b>${dt.getDate()}</b><small></small>`;
      b.addEventListener("click", () => show(i));
      daysEl.appendChild(b);
    });
    show(WEEK[todayIdx].s.length ? todayIdx : 0);
  }

  /* Gallery page */
  const ALBUMS = {
    "stockwell-fc": { title: "Stockwell FC", imgs: ["face-paint-1", "face-paint-2", "face-paint-3", "face-paint-4", "face-paint-5"] },
    "events-trips": { title: "Events and trips", imgs: ["232", "191", "317", "544", "554", "574", "581", "787", "864", "93"] },
    "supplementary-school": { title: "Supplementary school", imgs: ["roa", "roa1", "roa2", "roa3", "roa4", "roa5", "roa7", "roa8", "roa10"] }
  };
  const galRoot = $("#js-gallery");
  if (galRoot) {
    const all = [];
    galRoot.innerHTML = Object.entries(ALBUMS).map(([id, a]) => `
      <section class="gal" id="${id}">
        <h2 class="h2">${a.title.replace(/(\w+)$/, "<em>$1</em>")}</h2>
        <div class="masonry">${a.imgs.map((n, i) => { all.push({ src: `assets/img/${n}.webp`, alt: `${a.title}, photo ${i + 1}` }); return `<button data-i="${all.length - 1}" aria-label="Open ${a.title} photo ${i + 1}"><img src="assets/img/${n}.webp" alt="${a.title}, photo ${i + 1}" loading="lazy"></button>`; }).join("")}</div>
      </section>`).join("");
    const lb = $("#js-lightbox"), lbImg = $("img", lb), lbCount = $(".lb-count", lb);
    let cur = 0;
    const go = (i) => { cur = (i + all.length) % all.length; lbImg.src = all[cur].src; lbImg.alt = all[cur].alt; lbCount.textContent = `${cur + 1} of ${all.length}`; };
    const openLb = (i) => { go(i); lb.classList.add("is-open"); lenis && lenis.stop(); $(".lb-close", lb).focus(); };
    const closeLb = () => { lb.classList.remove("is-open"); lenis && lenis.start(); };
    $$(".masonry button", galRoot).forEach((b) => b.addEventListener("click", () => openLb(+b.dataset.i)));
    $(".lb-close", lb).addEventListener("click", closeLb);
    $(".lb-prev", lb).addEventListener("click", () => go(cur - 1));
    $(".lb-next", lb).addEventListener("click", () => go(cur + 1));
    lb.addEventListener("click", (e) => e.target === lb && closeLb());
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") go(cur - 1);
      if (e.key === "ArrowRight") go(cur + 1);
    });
    const chips = $$(".chip");
    chips.forEach((c) => c.addEventListener("click", () => { chips.forEach((x) => x.classList.toggle("is-active", x === c)); }));
    if (location.hash && $(location.hash)) setTimeout(() => (lenis ? lenis.scrollTo(location.hash, { offset: -150, immediate: true }) : $(location.hash).scrollIntoView()), 300);
  }

  if (!hasGsap || reduce) return;

  /* Hero logo writes itself in, left to right */
  const heroLogo = $("#js-hero-logo");
  if (heroLogo) gsap.fromTo(heroLogo, { clipPath: "inset(0 100% 0 0)", y: 20 }, { clipPath: "inset(0 0% 0 0)", y: 0, duration: 1.8, ease: "power3.inOut", delay: 0.2 });

  /* Hero: arch opens into the full frame */
  const frame = $("#js-frame");
  const hero = $("#js-hero");
  if (frame && hero) {
    const mobile = () => innerWidth < 900;
    const state = { p: 0 };
    const paint = () => {
      const p = state.p;
      const e = gsap.parseEase("power2.inOut")(Math.min(p / 0.8, 1));
      const side = (mobile() ? 14 : 36) * (1 - e);
      const top = (mobile() ? 38 : 45) * (1 - e);
      const bottom = (mobile() ? 18 : 8) * (1 - e);
      frame.style.setProperty("--is", side + "%");
      frame.style.setProperty("--it", top + "%");
      frame.style.setProperty("--ib", bottom + "%");
      frame.style.setProperty("--r", (1 - e) * 600 + "px");
      frame.style.setProperty("--vs", 1.25 - 0.25 * e);
      const shade = gsap.utils.clamp(0, 1, (p - 0.55) / 0.3);
      hero.style.setProperty("--shade", shade);
      $(".hero__title").style.transform = `translateY(${-e * 30}vh)`;
      $(".hero__title").style.opacity = 1 - e * 1.2;
      $$(".hero__side, .hero__since").forEach((el) => (el.style.opacity = Math.max(0, 1 - e * 4)));
    };
    paint();
    ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom bottom", scrub: 0.6, onUpdate: (s) => { gsap.to(state, { p: s.progress, duration: 0.5, ease: "power2.out", onUpdate: paint, overwrite: true }); } });
  }

  /* Proverb: bars slide off each line */
  $$(".proverb__so .bar").forEach((bar, i) => {
    gsap.to(bar, { scaleX: 0, duration: 1.1, ease: "expo.inOut", delay: i * 0.15, scrollTrigger: { trigger: bar.parentElement, start: "top 80%" } });
  });
  const en = $(".proverb__en");
  if (en) gsap.from(en, { y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: en, start: "top 85%" } });

  /* Words light up as you read */
  $$(".js-words").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    gsap.to($$(".w", el), { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: true } });
  });

  /* Programmes: pinned horizontal track */
  const pin = $("#js-progs-pin"), track = $("#js-track");
  if (pin && track) {
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    gsap.to("#js-progs-bar", { scaleX: 1, ease: "none", scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), scrub: true } });
    $$(".prog__img img", track).forEach((img) => gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), scrub: true } }));
  }

  /* Gentle reveals */
  $$(".rise").forEach((el, i) => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: (i % 3) * 0.1, scrollTrigger: { trigger: el, start: "top 88%" } }));
  $$(".h2").forEach((h) => { if (h.closest(".proverb")) return; gsap.from(h, { yPercent: 25, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 90%" } }); });
  $$(".year").forEach((y) => gsap.from(y, { xPercent: -12, ease: "none", scrollTrigger: { trigger: y, start: "top bottom", end: "bottom top", scrub: true } }));
  const big = $(".foot__logo");
  if (big) gsap.from(big, { yPercent: 40, ease: "none", scrollTrigger: { trigger: big, start: "top bottom", end: "bottom bottom", scrub: true } });
})();
