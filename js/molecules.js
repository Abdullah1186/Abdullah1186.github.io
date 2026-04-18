(function () {
  /* Fallback SVG shown if 3Dmol or PubChem fails */
  function showFallback(el) {
    el.innerHTML = `
      <svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="opacity:0.35">
        <g stroke="#4fc3f7" stroke-width="2" fill="none">
          <polygon points="60,20 95,40 95,80 60,100 25,80 25,40" />
          <line x1="60" y1="20" x2="60" y2="100" />
          <line x1="25" y1="40" x2="95" y2="80" />
          <line x1="95" y1="40" x2="25" y2="80" />
          <circle cx="60" cy="20"  r="4" fill="#4fc3f7"/>
          <circle cx="95" cy="40"  r="4" fill="#4fc3f7"/>
          <circle cx="95" cy="80"  r="4" fill="#4fc3f7"/>
          <circle cx="60" cy="100" r="4" fill="#4fc3f7"/>
          <circle cx="25" cy="80"  r="4" fill="#4fc3f7"/>
          <circle cx="25" cy="40"  r="4" fill="#4fc3f7"/>
        </g>
      </svg>`;
  }

  function hideMolLoader(el) {
    const loader = el.parentElement.querySelector('.mol-loader');
    if (loader) loader.style.display = 'none';
  }

  function createViewer(elementId, pubchemCID, options) {
    const el = document.getElementById(elementId);
    if (!el) return null;

    if (typeof $3Dmol === 'undefined') {
      showFallback(el);
      return null;
    }

    const cfg = {
      backgroundColor: options.bg !== undefined ? options.bg : 'transparent',
      antialias: true,
      alpha: true,
    };

    let viewer;
    try {
      viewer = $3Dmol.createViewer(el, cfg);
    } catch (e) {
      showFallback(el);
      return null;
    }

    function applyStyleAndSpin() {
      hideMolLoader(el);
      viewer.setStyle({}, {
        stick: {
          colorscheme: options.colorscheme || 'cyanCarbon',
          radius: 0.14
        },
        sphere: {
          colorscheme: options.colorscheme || 'cyanCarbon',
          scale: 0.28
        }
      });
      if (options.surface) {
        viewer.addSurface($3Dmol.SurfaceType.SES, {
          opacity: 0.45,
          colorscheme: options.colorscheme || 'cyanCarbon'
        });
      }
      viewer.zoomTo();
      viewer.zoom(0.88);
      viewer.render();
      viewer.spin('y', options.speed || 1);
    }

    $3Dmol.download('cid:' + pubchemCID, viewer, { format: 'sdf' }, function (mol) {
      if (!mol) { showFallback(el); return; }
      applyStyleAndSpin();
    });

    /* Resize on container resize */
    if (window.ResizeObserver) {
      new ResizeObserver(() => { if (viewer) viewer.resize(); }).observe(el);
    }

    return viewer;
  }

  window.initMolecules = function () {
    /* Hero — Caffeine CID 2519 */
    createViewer('hero-mol', 2519, {
      bg: 'transparent',
      colorscheme: 'cyanCarbon',
      speed: 0.9
    });

    /* Publication card — Aspirin CID 2244 */
    createViewer('pub-mol', 2244, {
      bg: '#0a0e1a',
      colorscheme: 'cyanCarbon',
      speed: 1
    });

    /* Thesis card — Ibuprofen CID 3672 */
    createViewer('thesis-mol', 3672, {
      bg: '#0a0e1a',
      colorscheme: 'cyanCarbon',
      surface: true,
      speed: 0.8
    });
  };
})();
