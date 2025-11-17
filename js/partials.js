// partials.js - Versión robusta para local y GitHub Pages
(function () {
  'use strict';

  // Determinar base del sitio en GitHub Pages (ej: /masial-web) o vacío para producción en servidor
  const isGithubPages = location.hostname.includes('github.io');
  // Si es GH pages, normalmente la ruta será /<usuario>.github.io/<repo>/... => toma el primer segmento después de "/"
  const githubBase = (function () {
    if (!isGithubPages) return '';
    const parts = location.pathname.split('/').filter(Boolean);
    // parts[0] suele ser el username.github.io o el repo? En Github Pages user/organisation site it's root.
    // Cuando usas username.github.io/repo/, el repo es parts[0]. Si estás en username.github.io (user site), repo no aplica.
    // Para soportar ambos casos:
    if (parts.length && parts[0] !== (location.hostname.split('.')[0])) {
      return '/' + parts[0];
    }
    // si no detectó repo, devolver vacío (site en root)
    return '';
  })();

  // Función para normalizar y convertir rutas relativas usadas en partials a rutas absolutas basadas en repo
  function fixRelativeUrls(container) {
    if (!container) return;

    // Lista de atributos y prefijos que queremos reescribir
    const rules = [
      { attr: 'src', prefix: 'img/' },
      { attr: 'src', prefix: '../img/' },
      { attr: 'src', prefix: '../../img/' },
      { attr: 'href', prefix: 'css/' },
      { attr: 'href', prefix: '../css/' },
      { attr: 'href', prefix: '../../css/' },
      { attr: 'href', prefix: 'js/' },
      { attr: 'href', prefix: '../js/' },
      { attr: 'href', prefix: '../../js/' },
      { attr: 'href', prefix: 'partials/' },
      { attr: 'href', prefix: '../partials/' },
      { attr: 'href', prefix: '../../partials/' }
    ];

    rules.forEach(rule => {
      // select elements that have the attribute and whose value starts with the prefix
      const selector = '[' + rule.attr + '^="' + rule.prefix + '"]';
      const els = container.querySelectorAll(selector);
      els.forEach(el => {
        const val = el.getAttribute(rule.attr);
        // no tocar URLs absolutas ni data: ni http(s)
        if (/^(https?:|\/\/|data:|#)/i.test(val)) return;

        // Queremos montar la ruta desde la raíz del repositorio (githubBase) o desde '/':
        // ejemplo final: "/masial-web/img/masial_blanco.jpg" (si githubBase=="/masial-web")
        // o "/img/masial_blanco.jpg" si githubBase == ''
        // Construimos newVal tomando solamente la parte después del último "img/" o "css/" etc.
        // Encontrar índice del prefijo dentro de la cadena:
        const idx = val.indexOf(rule.prefix);
        const relativePart = (idx >= 0) ? val.slice(idx + rule.prefix.length) : val;
        const folder = rule.prefix.includes('img') ? 'img' :
                       rule.prefix.includes('css') ? 'css' :
                       rule.prefix.includes('js') ? 'js' :
                       rule.prefix.includes('partials') ? 'partials' : '';

        // Si por alguna razón no detectamos folder, dejamos el valor
        if (!folder) return;

        // Construir ruta absoluta/desde-root
        const newVal = (githubBase || '/') === '/' 
          ? `/${folder}/${relativePart}`               // e.g. /img/archivo.jpg
          : `${githubBase}/${folder}/${relativePart}`; // e.g. /masial-web/img/archivo.jpg

        el.setAttribute(rule.attr, newVal);
      });
    });

    // Ajustar links internos del navbar (por ejemplo el logo "home-link")
    const home = container.querySelector('#home-link');
    if (home) {
      if (isGithubPages) {
        // GitHub pages: si tu repositorio se publica en username.github.io/<repo>/ -> usar githubBase + /index.html
        // Si githubBase es '', y tu repo es user.github.io (site a la raíz), usar '/index.html'
        const target = (githubBase && githubBase !== '') ? `${githubBase}/index.html` : '/index.html';
        home.setAttribute('href', target);
      } else {
        // Local: recomendamos usar rutas relativas desde root del proyecto web servido (por ejemplo /index.html)
        // En servidor local (Live Server) '/' apunta a la raíz del servidor -> funciona
        home.setAttribute('href', '/index.html');
      }
    }

    // También actualizar cualquier <a> del navbar que apunte a rutas como "/productos/..." para que incluyan githubBase
    const anchors = container.querySelectorAll('a[href^="/"]');
    anchors.forEach(a => {
      const href = a.getAttribute('href');
      // evitar modificar enlaces externos
      if (/^(https?:|\/\/)/i.test(href)) return;
      // si href ya empieza con githubBase, no tocar
      if (githubBase && href.startsWith(githubBase + '/')) return;
      // Construir nuevo href
      if (githubBase) {
        a.setAttribute('href', githubBase + href);
      }
    });
  }

  // Cargar partials y ajustar rutas
  function cargarPartials() {
    const navContainer = document.getElementById('navbar');
    const footerContainer = document.getElementById('footer');

    // Ajusta la URL de fetch para partials (relativa al index donde se ejecute)
    // Aquí asumimos que partials están en /partials/... en el repo (desde root)
    const partialsPath = (isGithubPages && githubBase) ? `${githubBase}/partials` : '/partials';

    Promise.all([
      fetch(`${partialsPath}/navbar.html`).then(r => {
        if (!r.ok) throw new Error('No se pudo cargar navbar.html (' + r.status + ')');
        return r.text();
      }),
      fetch(`${partialsPath}/footer.html`).then(r => {
        if (!r.ok) throw new Error('No se pudo cargar footer.html (' + r.status + ')');
        return r.text();
      })
    ])
      .then(([navHtml, footerHtml]) => {
        if (navContainer) {
          navContainer.innerHTML = navHtml;
          // arreglar rutas internas del navbar
          fixRelativeUrls(navContainer);
        }
        if (footerContainer) {
          footerContainer.innerHTML = footerHtml;
          fixRelativeUrls(footerContainer);
        }

        // Emitir evento para que otros scripts (menu móvil) puedan inicializarse
        // damos un pequeño delay para que el navegador parseé el HTML inyectado
        setTimeout(() => {
          window.dispatchEvent(new Event('partialsLoaded'));
          console.log('partials.js: navbar y footer inyectados ✅ (base:', githubBase || '/', ')');
        }, 60);
      })
      .catch(err => {
        console.error('partials.js - error cargando partials:', err);
      });
  }

  // Ejecutar en DOMContentLoaded (si ya está listo, ejecutar de inmediato)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarPartials);
  } else {
    cargarPartials();
  }

})();