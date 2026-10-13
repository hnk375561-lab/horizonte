/* Horizonte Automotores · js/secciones.js
   1) Comparador de hasta 3 unidades (lee el JSON de #cmp-data, que genera scripts/build-index.mjs desde data/vehicles.json).
   2) Formularios «Tu usado» y «Contanos qué auto buscás»: arman un mensaje que la persona copia y envía ella.
      No se transmite ni se guarda nada.
   Sin dependencias. Sin JavaScript, la página sigue completa: las fichas están en #unidades. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, text, cls) { var e = document.createElement(tag); if (text != null) e.textContent = text; if (cls) e.className = cls; return e; };

  /* ---------- copiar al portapapeles (con alternativa) ---------- */
  function copiar(texto, ok) {
    function viejo() {
      var t = el('textarea'); t.value = texto; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(t); t.select();
      var r = false; try { r = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(t); ok(r);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(function () { ok(true); }, viejo);
    else viejo();
  }

  /* ---------- 1) comparador ---------- */
  var box = $('#cmp'), dataEl = $('#cmp-data');
  if (box && dataEl) {
    var list = [];
    try { list = JSON.parse(dataEl.textContent); } catch (e) {}
    if (list.length > 1) comparador(list);
  }

  function comparador(list) {
    var MAX = 3, sel = [];
    var fmt = function (n) { return n.toLocaleString('es-AR'); };
    var fecha = function (iso) { return iso.split('-').reverse().join('/'); };
    var sin = 'Sin dato';
    var pick = $('.cmp-pick', box), out = $('.cmp-out', box), st = $('.cmp-st', box);
    var fs = el('fieldset'); fs.appendChild(el('legend', 'Elegí hasta ' + MAX + ' unidades'));
    list.forEach(function (a, i) {
      var l = el('label', null, 'cmp-opt'), c = el('input'); c.type = 'checkbox'; c.value = String(i);
      l.appendChild(c); l.appendChild(el('span', a.titulo + (a.anio ? ' · ' + a.anio : ''))); fs.appendChild(l);
    });
    pick.appendChild(fs);
    var cbs = $$('input', fs);

    function celdas(a) {
      return [
        a.anio != null ? String(a.anio) : sin,
        a.km != null ? fmt(a.km) + ' km' : sin,
        a.transmision || sin,
        a.combustible || sin,
        a.color || sin,
        a.precio ? (a.precio.moneda === 'USD' ? 'US$ ' : '$ ') + fmt(a.precio.monto) : 'Consultar'
      ];
    }
    var filas = ['Año', 'Kilometraje', 'Transmisión', 'Combustible', 'Color', 'Precio publicado'];

    function pintar() {
      out.textContent = '';
      cbs.forEach(function (c) { c.disabled = !c.checked && sel.length >= MAX; });
      if (sel.length < 2) { st.textContent = sel.length ? 'Elegí al menos una unidad más.' : ''; return; }
      var t = el('table'), cap = el('caption', 'Comparación de unidades'); cap.className = 'sr'; t.appendChild(cap);
      var th = el('tr'); th.appendChild(el('th')); th.firstChild.scope = 'col'; th.firstChild.className = 'sr'; th.firstChild.textContent = 'Dato';
      sel.forEach(function (i) { var h = el('th', list[i].titulo); h.scope = 'col'; th.appendChild(h); });
      var thead = el('thead'); thead.appendChild(th); t.appendChild(thead);
      var tb = el('tbody'), datos = sel.map(function (i) { return celdas(list[i]); });
      filas.forEach(function (f, k) {
        var r = el('tr'), h = el('th', f); h.scope = 'row'; r.appendChild(h);
        datos.forEach(function (d) { r.appendChild(el('td', d[k])); });
        tb.appendChild(r);
      });
      var rl = el('tr'), hl = el('th', 'Ficha'); hl.scope = 'row'; rl.appendChild(hl);
      sel.forEach(function (i) { var td = el('td'), a = el('a', 'Ver publicación'); a.href = list[i].url; a.target = '_blank'; a.rel = 'noopener noreferrer'; td.appendChild(a); rl.appendChild(td); });
      tb.appendChild(rl); t.appendChild(tb);
      var w = el('div', null, 'cmp-sc'); w.appendChild(t); out.appendChild(w);
      var f = sel.map(function (i) { return list[i].precio && list[i].precio.fecha; }).filter(Boolean);
      var nota = 'Precios y kilometrajes tal como figuran en cada ficha pública' + (f.length ? ' (relevados el ' + fecha(f[0]) + ')' : '') + '. Pueden haber cambiado: consultalos antes de ir.';
      out.appendChild(el('p', nota, 'src'));
      st.textContent = 'Comparando ' + sel.length + ' unidades.';
    }
    cbs.forEach(function (c) {
      c.addEventListener('change', function () {
        var i = +c.value, k = sel.indexOf(i);
        if (c.checked && k < 0) { if (sel.length < MAX) sel.push(i); else c.checked = false; }
        if (!c.checked && k >= 0) sel.splice(k, 1);
        pintar();
      });
    });
    box.hidden = false;
    var ns = $('#cmp-ns'); if (ns) ns.hidden = true;
  }

  /* ---------- 2) formularios que arman un mensaje ---------- */
  $$('form[data-msg]').forEach(function (f) {
    var vista = $('.msg-v', f), estado = $('.msg-s', f), btn = $('[data-copiar-msg]', f);
    function texto() {
      var lineas = [f.getAttribute('data-intro') || 'Hola!'];
      $$('[data-lbl]', f).forEach(function (c) {
        var v = (c.value || '').replace(/\s+/g, ' ').trim();
        if (v) lineas.push(c.getAttribute('data-lbl') + ': ' + v);
      });
      return lineas.join('\n');
    }
    function actualizar() { if (vista) vista.value = texto(); }
    f.addEventListener('input', actualizar);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = texto(); actualizar();
      copiar(t, function (ok) {
        estado.textContent = ok ? 'Mensaje copiado. Pegalo en una conversación con la agencia (Facebook o Instagram).' : 'No se pudo copiar solo: seleccioná el mensaje de arriba, copialo y pegalo en una conversación con la agencia.';
      });
    });
    if (btn) btn.hidden = false;
    if (vista) { vista.hidden = false; actualizar(); }
  });

  /* ---------- copiar dirección ---------- */
  $$('[data-copiar]').forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () {
      var antes = b.textContent;
      copiar(b.getAttribute('data-copiar'), function (ok) {
        b.textContent = ok ? 'Dirección copiada' : 'No se pudo copiar';
        setTimeout(function () { b.textContent = antes; }, 2200);
      });
    });
  });
})();
