(function () {
  'use strict';

  // Número no formato internacional, sem + ou espaços
  var WHATSAPP = '5519991561516';

  var chips = document.querySelectorAll('.chip');
  var waLinks = document.querySelectorAll('.js-wa');
  var label = document.getElementById('selected-label');

  function buildLink(phrase) {
    var msg = 'Olá! Vi o site da HT Vidros e Box e gostaria de um orçamento para ' + phrase + '.';
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
    chip.addEventListener('click', function () { select(chip); });
  });

  // Estado inicial: primeira opção
  select(chips[0]);
})();