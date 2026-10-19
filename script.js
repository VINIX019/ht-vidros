(function () {
  'use strict';

  // TROCAR: número no formato internacional (DDI+DDD+número), só dígitos, sem + ou espaços.
  var WHATSAPP = '5500000000000';
  // TROCAR: telefone exibido no site (usado também no link de ligação).
  var TELEFONE = '(00) 00000-0000';
  // TROCAR: nome usado na mensagem pronta do WhatsApp.
  var NOME_EMPRESA = 'Nome da Vidraçaria';

  var chips = document.querySelectorAll('.chip');
  var waLinks = document.querySelectorAll('.js-wa');
  var label = document.getElementById('selected-label');

  document.querySelectorAll('.js-tel').forEach(function (a) {
    a.textContent = TELEFONE;
    a.href = 'tel:+' + WHATSAPP;
  });

  function buildLink(phrase) {
    var msg = 'Olá! Vi o site da ' + NOME_EMPRESA + ' e gostaria de um orçamento para ' + phrase + '.';
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
  }

  function select(chip) {
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
    });
    label.textContent = chip.textContent.trim().toLowerCase();
    var href = buildLink(chip.dataset.phrase);
    waLinks.forEach(function (a) {
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      select(chip);
      if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(chip, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
        gsap.fromTo(label, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
      }
    });
  });

  // Estado inicial: primeira opção
  select(chips[0]);

  /* ---------- GSAP ---------- */
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    // Entrada: cabeçalho e hero
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.header', { y: -30, opacity: 0, duration: 0.8 })
      .from('.badge', { y: 20, opacity: 0, duration: 0.6 }, 0.2)
      .from('.hero h1', { y: 40, opacity: 0, duration: 0.9 }, 0.3)
      .from('.hero .lead', { y: 24, opacity: 0, duration: 0.7 }, 0.55)
      .from('.hero__actions > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.7)
      .from('#art-bg', { scale: 0.92, opacity: 0, transformOrigin: '50% 50%', duration: 1 }, 0.2)
      .from('.hero__art svg > *:not(#art-bg)', { opacity: 0, duration: 0.8, stagger: 0.06 }, 0.45);

    // Vidro do box deslizando (abre e fecha) e brilho passando
    gsap.to('.pane', { x: 148, duration: 2.6, ease: 'power2.inOut', repeat: -1, yoyo: true, repeatDelay: 1.2, delay: 1.6 });
    gsap.fromTo('.shine', { opacity: 0.2 }, { opacity: 0.85, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.3 });

    // Leve parallax da ilustração
    gsap.to('.hero__art svg', {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Títulos de seção
    gsap.utils.toArray('.services h2, .steps h2, .reviews h2, .about h2, .faq h2, .contact h2').forEach(function (h) {
      gsap.from(h, { y: 34, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });

    // Blocos em cascata
    function reveal(sel, opts) {
      var els = gsap.utils.toArray(sel);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: opts.y || 36 });
      ScrollTrigger.batch(els, {
        start: 'top 90%', once: true,
        onEnter: function (b) {
          gsap.to(b, { opacity: 1, y: 0, duration: 0.8, stagger: opts.stagger || 0.12, ease: 'power3.out', overwrite: true });
        }
      });
    }
    reveal('.services__picker > *', { y: 24, stagger: 0.1 });
    reveal('.services .card', { y: 40 });
    reveal('.steps li', { y: 40, stagger: 0.15 });
    reveal('.review', { y: 40 });
    reveal('.about p', { y: 24 });
    reveal('.faq details', { y: 24, stagger: 0.1 });
    reveal('.contact__cta > *', { y: 24, stagger: 0.1 });
    reveal('.contact__info > div', { y: 24 });
    reveal('.map', { y: 30 });

    // Linha de cada passo "desenha" de lado a lado
    gsap.utils.toArray('.steps li').forEach(function (li) {
      gsap.fromTo(li, { borderTopColor: 'rgba(10,107,120,0.15)' }, {
        borderTopColor: '#0A6B78', duration: 0.8,
        scrollTrigger: { trigger: li, start: 'top 85%', once: true }
      });
    });

    // Cards: leve elevação ao passar o mouse
    document.querySelectorAll('.services .card, .review').forEach(function (c) {
      c.addEventListener('pointerenter', function () { gsap.to(c, { y: -6, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }); });
      c.addEventListener('pointerleave', function () { gsap.to(c, { y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }); });
    });

    // Botões principais: pulso suave de atenção
    gsap.to('.hero__actions .btn', { scale: 1.04, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 3 });

    // FAQ: anima o texto ao abrir
    document.querySelectorAll('.faq details').forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) gsap.from(d.querySelector('p'), { y: -10, opacity: 0, duration: 0.4, ease: 'power2.out' });
      });
    });
  });
})();