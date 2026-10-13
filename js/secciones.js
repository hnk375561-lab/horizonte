/* Horizonte Automotores · js/secciones.js
   1) Catálogo: filtros, orden y comparador de hasta 4 unidades (lee el JSON de #cat-data, que genera scripts/build-index.mjs desde data/vehicles.json).
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

  /* ---------- 1) catálogo: filtros, orden y comparador ----------
     Lee el JSON de #cat-data (lo genera scripts/build-index.mjs desde data/vehicles.json) y trabaja sobre las
     fichas ya escritas en #cars. El estado de los filtros vive en la URL (?marca=Renault&anio_d=2017...). */
  (function () {
    var tools = $('#tools'), ul = $('#cars'), dataEl = $('#cat-data'), sinres = $('#sinres');
    if (!tools || !ul || !dataEl) return;
    var list = [];
    try { list = JSON.parse(dataEl.textContent); } catch (e) {}
    if (list.length < 2) return;

    var fmt = function (n) { return n.toLocaleString('es-AR'); };
    var norm = function (t) { return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
    var peso = function (a) { return (a.precio.moneda === 'USD' ? 'US$ ' : '$ ') + fmt(a.precio.monto); };
    var fecha = function (iso) { return iso.split('-').reverse().join('/'); };
    var alfa = function (x, y) { return String(x).localeCompare(String(y), 'es'); };
    var anioHoy = new Date().getFullYear();
    var items = {};
    $$('li.car', ul).forEach(function (li) { items[li.getAttribute('data-i')] = li; });
    list.forEach(function (a) {
      a.t = items[a.i] ? items[a.i].getAttribute('data-t') : norm(a.titulo);
      a.ant = a.anio != null ? anioHoy - a.anio : null;
      a.monto = a.precio && a.precio.moneda === 'ARS' ? a.precio.monto : null;
      a.modeloTxt = a.titulo.indexOf(a.marca + ' ') === 0 ? a.titulo.slice(a.marca.length + 1) : a.titulo;
    });

    /* ----- definición de los filtros (todo sale de los datos publicados) ----- */
    function uniq(f) {
      var seen = {}, out = [];
      list.forEach(function (a) { var v = f(a); if (v != null && v !== '' && !seen[v]) { seen[v] = 1; out.push(v); } });
      return out;
    }
    function porValor(k, tipo, titulo, span, get, orden, extra) {
      var vals = uniq(get).sort(orden || alfa);
      return {
        k: k, tipo: tipo, t: titulo, s: span, todos: extra && extra.todos,
        ops: vals.map(function (v) {
          var o = { id: String(v), label: String(v), test: function (a) { return String(get(a)) === String(v); } };
          if (extra && extra.sw) o.sw = (list.filter(function (a) { return get(a) === v; })[0] || {}).sw;
          return o;
        })
      };
    }
    function pasos(vals, paso) {
      var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), out;
      for (;;) {
        out = [];
        for (var v = Math.floor(mn / paso) * paso; v <= Math.ceil(mx / paso) * paso; v += paso) out.push(v);
        if (out.length <= 12) return out;
        paso *= 2;
      }
    }
    function rango(k, titulo, span, get, valsFn, f, nota) {
      var datos = list.map(get).filter(function (x) { return x != null; });
      var vals = valsFn(datos);
      return { k: k, tipo: 'rango', t: titulo, s: span, get: get, vals: vals, f: f, nota: nota };
    }
    var GR = [];
    GR.push(porValor('marca', 'chips', 'Marca', 5, function (a) { return a.marca; }));
    GR.push(porValor('modelo', 'select', 'Modelo', 3, function (a) { return a.modelo; }, null, { todos: 'Todos los modelos' }));
    GR.push(porValor('version', 'select', 'Versión', 4, function (a) { return a.version; }, null, { todos: 'Todas las versiones' }));
    GR.push(rango('anio', 'Año', 3, function (a) { return a.anio; }, function (d) { return uniq(function (a) { return a.anio; }).sort(function (x, y) { return x - y; }); }, function (n) { return String(n); }));
    GR.push(rango('km', 'Kilómetros', 3, function (a) { return a.km; }, function (d) { return pasos(d, 10000); }, function (n) { return fmt(n) + ' km'; }, 'Las unidades sin kilometraje publicado no entran en este filtro.'));
    GR.push(rango('precio', 'Precio publicado', 3, function (a) { return a.monto; }, function (d) { return pasos(d, 2500000); }, function (n) { return '$ ' + fmt(n); }));
    var buckets = [
      { id: 'a', label: 'Hasta 9 años', test: function (a) { return a.ant != null && a.ant <= 9; } },
      { id: 'b', label: '10 a 15 años', test: function (a) { return a.ant != null && a.ant >= 10 && a.ant <= 15; } },
      { id: 'c', label: 'Más de 15 años', test: function (a) { return a.ant != null && a.ant > 15; } }
    ].filter(function (o) { return list.some(o.test); });
    if (list.some(function (a) { return a.km == null; })) {
      GR.push({ k: 'datos', tipo: 'chips', t: 'Datos de la ficha', s: 3, ops: [{ id: 'km', label: 'Con kilometraje publicado', test: function (a) { return a.km != null; } }] });
    }
    GR.push(porValor('trans', 'chips', 'Caja', 2, function (a) { return a.transmision; }));
    GR.push(porValor('comb', 'chips', 'Combustible', 2, function (a) { return a.combustible; }));
    GR.push(porValor('cil', 'chips', 'Cilindrada', 2, function (a) { return a.cilindrada; }, function (x, y) { return parseFloat(x) - parseFloat(y); }));
    GR.push(porValor('color', 'chips', 'Color', 3, function (a) { return a.color; }, null, { sw: true }));
    GR.push({ k: 'ant', tipo: 'chips', t: 'Antigüedad del modelo', s: 3, ops: buckets });
    /* los filtros que no separan nada (un solo valor distinto en select o rango) no se muestran */
    GR = GR.filter(function (g) { return g.tipo === 'chips' ? g.ops.length > 1 : g.tipo === 'select' ? g.ops.length > 1 : g.vals.length > 1; });

    var ORDEN = [['', 'Orden de publicación'], ['p-asc', 'Precio: menor a mayor'], ['p-desc', 'Precio: mayor a menor'], ['a-desc', 'Año: más nuevo primero'], ['a-asc', 'Año: más antiguo primero'], ['k-asc', 'Kilometraje: menor primero'], ['k-desc', 'Kilometraje: mayor primero'], ['m-asc', 'Marca: de la A a la Z']];
    var KEY = { p: function (a) { return a.monto; }, a: function (a) { return a.anio; }, k: function (a) { return a.km; }, m: function (a) { return a.marca; } };

    /* ----- estado ----- */
    var st = { q: '', orden: '' };
    GR.forEach(function (g) {
      if (g.tipo === 'chips') st[g.k] = [];
      else if (g.tipo === 'select') st[g.k] = '';
      else { st[g.k + 'D'] = ''; st[g.k + 'H'] = ''; }
    });
    function pasa(a, g) {
      if (g.tipo === 'chips') {
        var v = st[g.k]; if (!v.length) return true;
        return g.ops.some(function (o) { return v.indexOf(o.id) > -1 && o.test(a); });
      }
      if (g.tipo === 'select') {
        if (!st[g.k]) return true;
        return g.ops.some(function (o) { return o.id === st[g.k] && o.test(a); });
      }
      var x = g.get(a), d = st[g.k + 'D'], h = st[g.k + 'H'];
      if (d === '' && h === '') return true;
      if (x == null) return false;
      return (d === '' || x >= +d) && (h === '' || x <= +h);
    }
    function coincide(a, salto) {
      var ws = norm(st.q).split(/\s+/).filter(Boolean);
      if (!ws.every(function (w) { return a.t.indexOf(w) > -1; })) return false;
      return GR.every(function (g) { return g.k === salto || pasa(a, g); });
    }
    function contar(g, o) { return list.filter(function (a) { return coincide(a, g.k) && o.test(a); }).length; }

    /* ----- panel ----- */
    var top = el('div', null, 'fx-top'), body = el('div', null, 'fx-body'), act = el('div', null, 'fx-act');
    body.id = 'fx-body';
    var fq = el('div', null, 'f'), lq = el('label', 'Buscar por marca, modelo, año o color'), q = el('input');
    q.type = 'search'; q.id = 'q'; q.autocomplete = 'off'; q.maxLength = 60; lq.htmlFor = 'q'; fq.appendChild(lq); fq.appendChild(q);
    var fo = el('div', null, 'f'), lo = el('label', 'Ordenar'), ord = el('select');
    ord.id = 'orden'; lo.htmlFor = 'orden';
    ORDEN.forEach(function (o) { var op = el('option', o[1]); op.value = o[0]; ord.appendChild(op); });
    fo.appendChild(lo); fo.appendChild(ord);
    var tg = el('button', 'Más filtros', 'btn sm fx-tg'); tg.type = 'button'; tg.setAttribute('aria-controls', 'fx-body');
    top.appendChild(fq); top.appendChild(fo); top.appendChild(tg);

    var refs = {};   /* k -> { g, inputs:[{o,input,n}], select, note, d, h } */
    GR.forEach(function (g) {
      var fs = el('fieldset', null, 'fg s' + g.s), lg = el('legend', g.t), r = refs[g.k] = { g: g, fieldset: fs };
      fs.appendChild(lg);
      if (g.tipo === 'chips') {
        var cw = el('div', null, 'chips'); r.inputs = [];
        g.ops.forEach(function (o) {
          var lb = el('label', null, 'chip'), inp = el('input'), sp = el('span'), n = el('b');
          inp.type = 'checkbox'; inp.value = o.id;
          lb.appendChild(inp);
          if (o.sw) { var dot = el('i', null, 'sw'); dot.style.setProperty('--sw', o.sw); sp.appendChild(dot); }
          sp.appendChild(el('em', o.label)); sp.appendChild(n); lb.appendChild(sp); cw.appendChild(lb);
          r.inputs.push({ o: o, input: inp, n: n });
          inp.addEventListener('change', function () {
            var v = st[g.k], k = v.indexOf(o.id);
            if (inp.checked && k < 0) v.push(o.id);
            if (!inp.checked && k > -1) v.splice(k, 1);
            aplicar(true);
          });
        });
        fs.appendChild(cw);
      } else if (g.tipo === 'select') {
        var sl = el('select'); sl.id = 'f-' + g.k; sl.setAttribute('aria-label', g.t); r.select = sl;
        var o0 = el('option', g.todos); o0.value = ''; sl.appendChild(o0);
        g.ops.forEach(function (o) { var op = el('option', o.label); op.value = o.id; sl.appendChild(op); });
        sl.addEventListener('change', function () { st[g.k] = sl.value; aplicar(true); });
        fs.appendChild(sl);
      } else {
        var rw = el('div', null, 'rng');
        ['D', 'H'].forEach(function (z) {
          var sl = el('select'); sl.setAttribute('aria-label', g.t + ': ' + (z === 'D' ? 'desde' : 'hasta'));
          var o0 = el('option', z === 'D' ? 'Desde' : 'Hasta'); o0.value = ''; sl.appendChild(o0);
          g.vals.forEach(function (v) { var op = el('option', g.f(v)); op.value = String(v); sl.appendChild(op); });
          r[z.toLowerCase()] = sl; rw.appendChild(sl);
          sl.addEventListener('change', function () {
            st[g.k + z] = sl.value;
            var d = st[g.k + 'D'], h = st[g.k + 'H'];
            if (d !== '' && h !== '' && +d > +h) { if (z === 'D') { st[g.k + 'H'] = d; } else { st[g.k + 'D'] = h; } }
            aplicar(true);
          });
        });
        fs.appendChild(rw);
        if (g.nota) { r.note = el('p', g.nota, 'fg-n'); r.note.hidden = true; fs.appendChild(r.note); }
      }
      body.appendChild(fs);
    });
    /* Tres controles de decisión rápida quedan visibles en la píldora; el resto vive en el drawer. */
    ['marca', 'precio', 'anio'].forEach(function (key) {
      if (refs[key] && refs[key].fieldset) { refs[key].fieldset.classList.add('fx-quick'); top.appendChild(refs[key].fieldset); }
    });

    var cuenta = el('p', null, 'fx-n'), tags = el('div', null, 'fx-tags'), lim = el('button', 'Limpiar filtros', 'btn sm'), mostrar = el('button', 'Ver unidades', 'btn p sm');
    cuenta.id = 'cuenta'; cuenta.setAttribute('role', 'status'); cuenta.setAttribute('aria-live', 'polite');
    lim.type = 'button'; lim.id = 'limpiar'; lim.hidden = true;
    mostrar.type = 'button'; mostrar.className += ' fx-view';
    mostrar.addEventListener('click', function () { if (window.matchMedia && window.matchMedia('(max-width: 700px)').matches) { abrirPanel(false); tg.focus(); } });
    act.appendChild(cuenta); act.appendChild(tags); act.appendChild(lim); act.appendChild(mostrar);
    tools.appendChild(top); tools.appendChild(body); tools.appendChild(act);

    /* ----- aplicar ----- */
    function activos() {
      var out = [];
      if (st.q.trim()) out.push({ t: 'Búsqueda: ' + st.q.trim(), quitar: function () { st.q = ''; q.value = ''; } });
      GR.forEach(function (g) {
        if (g.tipo === 'chips') {
          st[g.k].slice().forEach(function (id) {
            var o = g.ops.filter(function (x) { return x.id === id; })[0];
            if (o) out.push({ t: g.t + ': ' + o.label, quitar: function () { st[g.k].splice(st[g.k].indexOf(id), 1); } });
          });
        } else if (g.tipo === 'select') {
          if (st[g.k]) out.push({ t: g.t + ': ' + st[g.k], quitar: function () { st[g.k] = ''; } });
        } else {
          var d = st[g.k + 'D'], h = st[g.k + 'H'];
          if (d === '' && h === '') return;
          var txt = d !== '' && h !== '' ? g.f(+d) + ' a ' + g.f(+h) : d !== '' ? 'desde ' + g.f(+d) : 'hasta ' + g.f(+h);
          out.push({ t: g.t + ': ' + txt, quitar: function () { st[g.k + 'D'] = ''; st[g.k + 'H'] = ''; } });
        }
      });
      return out;
    }
    function ordenar(a, b) {
      var o = st.orden.split('-'), f = KEY[o[0]], dir = o[1] === 'desc' ? -1 : 1;
      if (!f) return a.i - b.i;
      var x = f(a), y = f(b);
      if (x == null && y == null) return a.i - b.i;
      if (x == null) return 1;
      if (y == null) return -1;   /* sin dato: siempre al final */
      var c = typeof x === 'string' ? alfa(x, y) : x - y;
      return c * dir || a.i - b.i;
    }
    function aplicar(escribirUrl) {
      var n = 0;
      list.forEach(function (a) { var ok = coincide(a, null); items[a.i].hidden = !ok; if (ok) n++; });
      list.slice().sort(ordenar).forEach(function (a) { ul.appendChild(items[a.i]); });
      ul.hidden = n === 0; if (sinres) sinres.hidden = n > 0;
      /* opciones y cantidades según lo que ya está elegido en los demás filtros */
      GR.forEach(function (g) {
        var r = refs[g.k];
        if (g.tipo === 'chips') {
          r.inputs.forEach(function (x) {
            var c = contar(g, x.o), on = st[g.k].indexOf(x.o.id) > -1;
            x.input.checked = on; x.input.disabled = c === 0 && !on; x.n.textContent = String(c);
          });
        } else if (g.tipo === 'select') {
          [].slice.call(r.select.options).forEach(function (op, k) {
            if (k === 0) return;
            var o = g.ops[k - 1], c = contar(g, o);
            op.textContent = o.label + ' (' + c + ')'; op.disabled = c === 0 && st[g.k] !== o.id;
          });
          r.select.value = st[g.k];
        } else {
          r.d.value = st[g.k + 'D']; r.h.value = st[g.k + 'H'];
          if (r.note) r.note.hidden = st[g.k + 'D'] === '' && st[g.k + 'H'] === '';
        }
      });
      ord.value = st.orden;
      var act2 = activos();
      tags.textContent = '';
      act2.forEach(function (x) {
        var b = el('button', x.t, 'tag'); b.type = 'button'; b.setAttribute('aria-label', 'Quitar filtro: ' + x.t);
        b.addEventListener('click', function () { x.quitar(); aplicar(true); });
        tags.appendChild(b);
      });
      lim.hidden = !(act2.length || st.orden);
      cuenta.textContent = (n === list.length ? 'Mostrando las ' + list.length + ' unidades' : 'Mostrando ' + n + ' de ' + list.length + ' unidades') + '.';
      mostrar.textContent = 'Ver ' + n + (n === 1 ? ' unidad' : ' unidades');
      nAct = act2.length; etiquetaTg();
      if (escribirUrl) aUrl();
    }

    /* ----- URL ----- */
    function aUrl() {
      var u = new URL(location.href), P = u.searchParams;
      var poner = function (k, v) { v ? P.set(k, v) : P.delete(k); };
      poner('q', st.q.trim()); poner('orden', st.orden);
      GR.forEach(function (g) {
        if (g.tipo === 'chips') poner(g.k, st[g.k].join(','));
        else if (g.tipo === 'select') poner(g.k, st[g.k]);
        else { poner(g.k + '_d', st[g.k + 'D']); poner(g.k + '_h', st[g.k + 'H']); }
      });
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    }
    function deUrl() {
      var P = new URLSearchParams(location.search);
      st.q = (P.get('q') || '').slice(0, 60);
      var ov = P.get('orden') || ''; if (ORDEN.some(function (o) { return o[0] === ov; })) st.orden = ov;
      GR.forEach(function (g) {
        if (g.tipo === 'chips') {
          st[g.k] = (P.get(g.k) || '').split(',').filter(function (id) { return g.ops.some(function (o) { return o.id === id; }); });
        } else if (g.tipo === 'select') {
          var v = P.get(g.k) || ''; st[g.k] = g.ops.some(function (o) { return o.id === v; }) ? v : '';
        } else {
          ['D', 'H'].forEach(function (z) {
            var v = P.get(g.k + '_' + z.toLowerCase()) || '';
            st[g.k + z] = g.vals.some(function (x) { return String(x) === v; }) ? v : '';
          });
        }
      });
      q.value = st.q;
    }

    q.addEventListener('input', function () { st.q = q.value; aplicar(true); });
    ord.addEventListener('change', function () { st.orden = ord.value; aplicar(true); });
    lim.addEventListener('click', function () {
      st.q = ''; q.value = ''; st.orden = '';
      GR.forEach(function (g) {
        if (g.tipo === 'chips') st[g.k] = []; else if (g.tipo === 'select') st[g.k] = ''; else { st[g.k + 'D'] = ''; st[g.k + 'H'] = ''; }
      });
      aplicar(true); q.focus();
    });
    var nAct = 0;
    function etiquetaTg() { tg.textContent = (body.hidden ? 'Más filtros' : 'Cerrar filtros') + (nAct ? ' (' + nAct + ')' : ''); }
    function abrirPanel(si) {
      body.hidden = !si;
      body.setAttribute('role', 'region');
      body.setAttribute('aria-label', 'Más filtros del catálogo');
      body.setAttribute('aria-modal', si ? 'true' : 'false');
      tg.setAttribute('aria-expanded', si ? 'true' : 'false');
      tools.classList.add('filter-bar');
      tools.classList.toggle('is-open', si);
      document.querySelectorAll('header, body > footer, main > section:not(#unidades)').forEach(function (node) { node.inert = !!si; });
      etiquetaTg();
      if (si) { var first = body.querySelector('input,select,button'); if (first) setTimeout(function () { first.focus(); }, 0); }
    }
    tg.addEventListener('click', function () { abrirPanel(body.hidden); });
    document.addEventListener('keydown', function (event) {
      if (body.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); abrirPanel(false); tg.focus(); return; }
      if (event.key !== 'Tab') return;
      var focusables = [].slice.call(body.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')).filter(function (node) { return !node.hidden; });
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });

    /* ----- comparador: hasta 4 unidades, desde un botón en cada ficha ----- */
    var MAX = 4, cmp = [], tray = null, dlg = null;
    var cbs = $$('.car-c input', ul);
    $$('.car-c', ul).forEach(function (l) { l.hidden = false; });
    function sinMarca(a) { return a.modeloTxt; }
    function pintarBandeja() {
      cbs.forEach(function (c) { var on = cmp.indexOf(+c.value) > -1; c.checked = on; c.disabled = !on && cmp.length >= MAX; });
      document.body.classList.toggle('has-tray', cmp.length > 0);
      if (!cmp.length) { if (tray) tray.hidden = true; return; }
      if (!tray) {
        tray = el('div', null, 'tray'); tray.setAttribute('role', 'region'); tray.setAttribute('aria-label', 'Unidades para comparar');
        document.body.appendChild(tray);
        if (window.ResizeObserver) new ResizeObserver(function () { document.documentElement.style.setProperty('--tray-h', tray.offsetHeight + 'px'); }).observe(tray);
      }
      tray.hidden = false; tray.textContent = '';
      var w = el('div', null, 'w'), lst = el('ul', null, 'tray-l');
      cmp.forEach(function (i) {
        var a = list[i], li = el('li', null, 'tray-i'), b = el('button', '×'); b.type = 'button'; b.setAttribute('aria-label', 'Quitar de la comparación: ' + a.titulo);
        li.appendChild(el('span', a.marca + ' ' + a.modeloTxt)); li.appendChild(b); lst.appendChild(li);
        b.addEventListener('click', function () { cmp.splice(cmp.indexOf(i), 1); pintarBandeja(); });
      });
      var ver = el('button', cmp.length < 2 ? 'Elegí una más para comparar' : 'Comparar ' + cmp.length + ' unidades', 'btn p sm'); ver.type = 'button'; ver.disabled = cmp.length < 2;
      var vac = el('button', 'Vaciar', 'btn sm'); vac.type = 'button';
      ver.addEventListener('click', abrirComparacion);
      vac.addEventListener('click', function () { cmp = []; pintarBandeja(); });
      w.appendChild(lst); w.appendChild(ver); w.appendChild(vac); tray.appendChild(w);
    }
    cbs.forEach(function (c) {
      c.addEventListener('change', function () {
        var i = +c.value, k = cmp.indexOf(i);
        if (c.checked && k < 0 && cmp.length < MAX) cmp.push(i);
        if (!c.checked && k > -1) cmp.splice(k, 1);
        pintarBandeja();
      });
    });

    function mejor(sel, f, dir) {
      var v = sel.map(f).filter(function (x) { return x != null; });
      if (v.length < 2) return null;
      var mn = Math.min.apply(null, v), mx = Math.max.apply(null, v);
      return mn === mx ? null : (dir < 0 ? mn : mx);
    }
    function abrirComparacion() {
      var sel = cmp.map(function (i) { return list[i]; });
      if (sel.length < 2) return;
      if (!dlg) {
        dlg = el('dialog', null, 'cmp'); dlg.setAttribute('aria-labelledby', 'cmp-ttl');
        dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
        dlg.addEventListener('close', function () { document.documentElement.classList.remove('has-dlg'); });
        document.body.appendChild(dlg);
      }
      dlg.textContent = '';
      var hd = el('div', null, 'cmp-hd'), h = el('h2', 'Comparación'); h.id = 'cmp-ttl';
      var x = el('button', 'Cerrar', 'btn sm'); x.type = 'button'; x.addEventListener('click', function () { dlg.close(); });
      hd.appendChild(h); hd.appendChild(x); dlg.appendChild(hd);

      var minP = mejor(sel, function (a) { return a.monto; }, -1), maxP = Math.max.apply(null, sel.map(function (a) { return a.monto || 0; }));
      var maxA = mejor(sel, function (a) { return a.anio; }, 1);
      var minK = mejor(sel, function (a) { return a.km; }, -1), maxK = Math.max.apply(null, sel.map(function (a) { return a.km || 0; }));
      var base = Math.min.apply(null, sel.map(function (a) { return a.monto; }).filter(function (v) { return v != null; }));

      var t = el('table', null, 'cmpt'), cap = el('caption', 'Comparación de unidades'); cap.className = 'sr'; t.appendChild(cap); t.style.setProperty('--n', sel.length);
      var hr = el('tr'), c0 = el('th'); c0.scope = 'col'; c0.appendChild(el('span', 'Dato', 'sr')); hr.appendChild(c0);
      sel.forEach(function (a) {
        var th = el('th'); th.scope = 'col';
        th.appendChild(el('span', a.marca, 'cb')); th.appendChild(el('span', sinMarca(a), 'cn'));
        hr.appendChild(th);
      });
      var thead = el('thead'); thead.appendChild(hr); t.appendChild(thead);
      var tb = el('tbody');
      function fila(rotulo, celda) {
        var r = el('tr'), th = el('th', rotulo); th.scope = 'row'; r.appendChild(th);
        sel.forEach(function (a) { var td = el('td'); celda(td, a); r.appendChild(td); });
        tb.appendChild(r);
      }
      function badge(td, txt) { td.appendChild(el('span', txt, 'bd')); }
      function barra(td, v, max, es) { if (v == null || !max) return; var b = el('span', null, 'mb' + (es ? ' best' : '')), i = el('i'); i.style.width = Math.max(4, Math.round(v / max * 100)) + '%'; b.appendChild(i); td.appendChild(b); }
      fila('Precio publicado', function (td, a) {
        td.appendChild(el('strong', a.precio ? peso(a) : 'Consultar', 'big' + (a.precio ? '' : ' nd')));
        if (a.monto != null && minP != null && a.monto === minP) badge(td, 'Menor precio');
        barra(td, a.monto, maxP, a.monto != null && a.monto === minP);
      });
      fila('Diferencia de precio', function (td, a) {
        if (a.monto == null) { td.textContent = 'Sin dato'; return; }
        td.textContent = a.monto === base ? (sel.length > 1 && minP != null ? 'La más económica' : '—') : '+ $ ' + fmt(a.monto - base);
      });
      fila('Año', function (td, a) {
        td.appendChild(el('strong', a.anio != null ? String(a.anio) : 'Sin dato', 'big' + (a.anio != null ? '' : ' nd')));
        if (a.anio != null && maxA != null && a.anio === maxA) badge(td, 'Más nuevo');
      });
      fila('Kilómetros', function (td, a) {
        td.appendChild(el('strong', a.km != null ? fmt(a.km) + ' km' : 'No publicado', 'big' + (a.km != null ? '' : ' nd')));
        if (a.km != null && minK != null && a.km === minK) badge(td, 'Menos km');
        barra(td, a.km, maxK, a.km != null && a.km === minK);
      });
      [['Caja', 'transmision'], ['Combustible', 'combustible'], ['Color', 'color'], ['Cilindrada', 'cilindrada'], ['Versión', 'version']].forEach(function (p) {
        fila(p[0], function (td, a) {
          if (p[1] === 'color' && a.color && a.sw) { var d = el('i', null, 'sw'); d.style.setProperty('--sw', a.sw); td.appendChild(d); }
          td.appendChild(document.createTextNode(a[p[1]] || 'Sin dato'));
        });
      });
      fila('Ficha', function (td, a) {
        var c = el('a', 'Consultar', 'btn p sm'); c.href = a.href; c.target = '_blank'; c.rel = 'noopener noreferrer';
        var v = el('a', 'Ver publicación', 'vp'); v.href = a.url; v.target = '_blank'; v.rel = 'noopener noreferrer';
        td.appendChild(c); td.appendChild(v);
      });
      t.appendChild(tb);
      var sc = el('div', null, 'cmp-sc'); sc.appendChild(t); dlg.appendChild(sc);
      var f = sel.map(function (a) { return a.precio && a.precio.fecha; }).filter(Boolean);
      dlg.appendChild(el('p', 'Precios y kilometrajes tal como figuran en cada ficha pública' + (f.length ? ' (relevados el ' + fecha(f[0]) + ')' : '') + '. Pueden haber cambiado: consultalos antes de ir.', 'src cmp-ft'));
      document.documentElement.classList.add('has-dlg');
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      x.focus();
      /* pista de scroll lateral: la tabla se desvanece en el borde derecho mientras haya más columnas */
      var marca = function () { sc.classList.toggle('mas', sc.scrollLeft + sc.clientWidth < sc.scrollWidth - 2); };
      sc.addEventListener('scroll', marca, { passive: true });
      if (window.ResizeObserver) new ResizeObserver(marca).observe(sc);
      marca();
    }

    /* ----- ficha técnica: dialog nativo, sin datos inventados ----- */
    (function () {
      var triggers = $$('.ficha-trigger', ul);
      if (!triggers.length) return;
      var ficha = null, lastTrigger = null;
      function cerrar() { if (ficha && ficha.open) ficha.close(); }
      function abrir(i, trigger) {
        var a = list[i]; if (!a) return;
        lastTrigger = trigger;
        if (!ficha) {
          ficha = el('dialog', null, 'vehicle-sheet');
          ficha.setAttribute('aria-labelledby', 'vehicle-sheet-title');
          ficha.addEventListener('click', function (event) { if (event.target === ficha) cerrar(); });
          ficha.addEventListener('close', function () { document.documentElement.classList.remove('has-dlg'); if (lastTrigger) lastTrigger.focus(); });
          document.body.appendChild(ficha);
        }
        ficha.textContent = '';
        var head = el('div', null, 'vehicle-sheet-head');
        var title = el('h2', a.titulo); title.id = 'vehicle-sheet-title';
        var close = el('button', 'Cerrar', 'btn sm'); close.type = 'button'; close.addEventListener('click', cerrar);
        head.appendChild(title); head.appendChild(close); ficha.appendChild(head);
        var intro = el('p', 'Ficha completa · información publicada por la agencia', 'vehicle-sheet-kicker'); ficha.appendChild(intro);
        var dl = el('dl', null, 'vehicle-specs');
        [['Marca', a.marca], ['Modelo', a.modeloTxt], ['Año', a.anio != null ? String(a.anio) : 'Sin dato'], ['Kilómetros', a.km != null ? fmt(a.km) + ' km' : 'No publicado'], ['Caja', a.transmision], ['Combustible', a.combustible], ['Color', a.color], ['Cilindrada', a.cilindrada], ['Versión', a.version]].forEach(function (pair) {
          if (pair[1] == null || pair[1] === '') return;
          var group = el('div'), dt = el('dt', pair[0]), dd = el('dd', pair[1]); group.appendChild(dt); group.appendChild(dd); dl.appendChild(group);
        });
        ficha.appendChild(dl);
        if (a.precio) ficha.appendChild(el('p', (a.precio.moneda === 'USD' ? 'US$ ' : '$ ') + fmt(a.precio.monto) + ' · publicado el ' + fecha(a.precio.fecha) + '. Puede haber cambiado.', 'vehicle-price'));
        if (a.nota) ficha.appendChild(el('p', a.nota, 'src'));
        var actions = el('div', null, 'vehicle-actions');
        var consult = el('a', 'Consultar con un asesor', 'btn p'); consult.href = a.href; consult.target = '_blank'; consult.rel = 'noopener noreferrer';
        var source = el('a', 'Ver publicación original', 'btn'); source.href = a.url; source.target = '_blank'; source.rel = 'noopener noreferrer';
        actions.appendChild(consult); actions.appendChild(source); ficha.appendChild(actions);
        document.documentElement.classList.add('has-dlg');
        if (typeof ficha.showModal === 'function') ficha.showModal(); else ficha.setAttribute('open', '');
        close.focus();
      }
      var galleries = $$('.gallery-trigger', ul);
      function galeria(a, host) {
        if (!a.media || !a.media.length) return;
        var wrap = el('div', null, 'vehicle-gallery'), stage = el('div', null, 'vehicle-gallery-stage');
        var image = document.createElement('img'), current = 0;
        image.alt = a.media[0].alt || a.titulo; image.loading = 'eager'; image.decoding = 'async'; stage.appendChild(image);
        var controls = el('div', null, 'vehicle-gallery-controls'), prev = el('button', 'Anterior', 'btn sm'), next = el('button', 'Siguiente', 'btn sm');
        prev.type = 'button'; next.type = 'button'; controls.appendChild(prev); controls.appendChild(next); stage.appendChild(controls); wrap.appendChild(stage);
        var thumbs = el('div', null, 'vehicle-gallery-thumbs');
        function paint() { var m = a.media[current]; image.src = m.src; image.srcset = m.srcset || ''; image.sizes = '(max-width: 700px) 100vw, 680px'; image.alt = m.alt || a.titulo; [].slice.call(thumbs.children).forEach(function (b, i) { b.setAttribute('aria-current', i === current ? 'true' : 'false'); }); prev.disabled = current === 0; next.disabled = current === a.media.length - 1; }
        a.media.forEach(function (m, i) { var b = el('button', null, 'gallery-thumb'); b.type = 'button'; b.setAttribute('aria-label', 'Ver foto ' + (i + 1)); var im = document.createElement('img'); im.src = m.src; im.alt = ''; im.loading = 'lazy'; b.appendChild(im); b.addEventListener('click', function () { current = i; paint(); }); thumbs.appendChild(b); });
        prev.addEventListener('click', function () { if (current) { current--; paint(); } }); next.addEventListener('click', function () { if (current < a.media.length - 1) { current++; paint(); } });
        var startX = 0; stage.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true }); stage.addEventListener('touchend', function (e) { var delta = e.changedTouches[0].clientX - startX; if (Math.abs(delta) > 40) { current = Math.max(0, Math.min(a.media.length - 1, current + (delta < 0 ? 1 : -1))); paint(); } }, { passive: true });
        host.appendChild(wrap); host.appendChild(thumbs);
        if (a.media.length >= 24 && a.media.length <= 36) {
          var spin = el('button', 'Ver en 360°', 'btn sm'); spin.type = 'button'; spin.className += ' gallery-360';
          var start = 0;
          spin.addEventListener('click', function () { wrap.classList.toggle('is-360'); spin.textContent = wrap.classList.contains('is-360') ? 'Cerrar 360°' : 'Ver en 360°'; });
          stage.addEventListener('pointerdown', function (event) { if (wrap.classList.contains('is-360')) { start = event.clientX; stage.setPointerCapture(event.pointerId); } });
          stage.addEventListener('pointermove', function (event) { if (!wrap.classList.contains('is-360') || !start) return; var delta = event.clientX - start; if (Math.abs(delta) < 8) return; var step = delta < 0 ? 1 : -1; current = (current + step + a.media.length) % a.media.length; start = event.clientX; paint(); });
          stage.addEventListener('pointerup', function () { start = 0; });
          host.appendChild(spin);
        }
        paint();
      }
      function abrirGaleria(i, trigger) { var a = list[i]; if (!a || !a.media || !a.media.length) return; abrir(i, trigger); var host = el('div'); host.className = 'vehicle-gallery-host'; ficha.insertBefore(host, ficha.querySelector('.vehicle-specs')); galeria(a, host); }
      triggers.forEach(function (trigger) { trigger.addEventListener('click', function () { abrir(+trigger.getAttribute('data-ficha'), trigger); }); });
      galleries.forEach(function (trigger) { trigger.hidden = false; trigger.addEventListener('click', function () { abrirGaleria(+trigger.getAttribute('data-gallery'), trigger); }); });
      document.addEventListener('keydown', function (event) { if (!ficha || !ficha.open) return; if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return; var image = ficha.querySelector('.vehicle-gallery-stage img'); if (!image) return; var buttons = $$('.gallery-thumb', ficha), active = buttons.findIndex(function (b) { return b.getAttribute('aria-current') === 'true'; }); var target = event.key === 'ArrowLeft' ? active - 1 : active + 1; if (buttons[target]) buttons[target].click(); });
    }());
    deUrl();
    /* Con pocas unidades los filtros sobran: se ve primero el catálogo y los filtros quedan a un clic.
       El panel solo arranca abierto en pantallas anchas y con un catálogo grande (> 8 unidades). */
    abrirPanel((window.matchMedia ? window.matchMedia('(min-width: 900px)').matches : true) && Object.keys(items).length > 8);
    tools.hidden = false;
    aplicar(false);
  })();

  /* ---------- 1b) «Cómo comprar»: el sol sale al llegar a la sección (sin JavaScript queda ya salido) ---------- */
  (function () {
    var r = $('.ruta');
    if (!r || !('IntersectionObserver' in window) || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    r.classList.add('js');
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { r.classList.add('on'); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(r);
  })();

  /* ---------- 2) formularios que arman un mensaje ---------- */
  $$('form[data-msg]').forEach(function (f) {
    var vista = $('.msg-v', f), estado = $('.msg-s', f), btn = $('[data-copiar-msg]', f), wa = $('[data-wa-msg]', f);
    function texto() {
      var lineas = [f.getAttribute('data-intro') || 'Hola!'];
      $$('[data-lbl]', f).forEach(function (c) {
        var v = (c.value || '').replace(/\s+/g, ' ').trim();
        if (v) lineas.push(c.getAttribute('data-lbl') + ': ' + v);
      });
      return lineas.join('\n');
    }
    function actualizar() {
      if (vista) vista.value = texto();
      if (wa) wa.href = 'https://wa.me/' + wa.getAttribute('data-wa') + '?text=' + encodeURIComponent(texto());
    }
    if (wa) wa.addEventListener('click', function (e) {
      if (f.checkValidity && !f.checkValidity()) { e.preventDefault(); if (f.reportValidity) f.reportValidity(); return; }
      actualizar();
    });
    f.addEventListener('input', actualizar);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = texto(); actualizar();
      copiar(t, function (ok) {
        estado.textContent = ok ? 'Mensaje copiado. Pegalo en una conversación con la agencia (' + (wa ? 'WhatsApp, ' : '') + 'Facebook o Instagram).' : 'No se pudo copiar solo: seleccioná el mensaje de arriba, copialo y pegalo en una conversación con la agencia.';
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
