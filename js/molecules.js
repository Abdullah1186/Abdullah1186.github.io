(function () {
  function showFallback(el) {
    if (!el) return;
    el.innerHTML = `
      <svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="opacity:0.4;display:block;">
        <g stroke="#4fc3f7" stroke-width="2" fill="none">
          <polygon points="60,18 96,39 96,81 60,102 24,81 24,39"/>
          <line x1="60" y1="18" x2="60" y2="102"/>
          <line x1="24" y1="39" x2="96" y2="81"/>
          <line x1="96" y1="39" x2="24" y2="81"/>
          <circle cx="60" cy="18"  r="5" fill="#4fc3f7"/>
          <circle cx="96" cy="39"  r="5" fill="#4fc3f7"/>
          <circle cx="96" cy="81"  r="5" fill="#4fc3f7"/>
          <circle cx="60" cy="102" r="5" fill="#4fc3f7"/>
          <circle cx="24" cy="81"  r="5" fill="#4fc3f7"/>
          <circle cx="24" cy="39"  r="5" fill="#4fc3f7"/>
          <circle cx="60" cy="60"  r="10" stroke="#4fc3f7" stroke-width="1.5" stroke-dasharray="5 3"/>
        </g>
      </svg>`;
    const loader = el.closest('.mol-viewer-container, .pub-mol-container, .paper-mol-container');
    if (loader) {
      const spin = loader.querySelector('.mol-loader');
      if (spin) spin.style.display = 'none';
    }
  }

  function hideMolLoader(viewerEl) {
    const container = viewerEl.closest('.mol-viewer-container, .pub-mol-container, .paper-mol-container');
    if (container) {
      const loader = container.querySelector('.mol-loader');
      if (loader) loader.style.display = 'none';
    }
  }

  function createViewer(elementId, pubchemCID, options) {
    const el = document.getElementById(elementId);
    if (!el) return null;

    if (typeof $3Dmol === 'undefined') {
      showFallback(el);
      return null;
    }

    const bg = (options && options.bg !== undefined) ? options.bg : 'transparent';
    const speed = (options && options.speed) ? options.speed : 1;

    let viewer;
    try {
      viewer = $3Dmol.createViewer(jQuery(el), {
        backgroundColor: bg,
        antialias: true,
        alpha: true
      });
    } catch (e) {
      /* Try without jQuery wrapper */
      try {
        viewer = $3Dmol.createViewer(el, {
          backgroundColor: bg,
          antialias: true,
          alpha: true
        });
      } catch (e2) {
        showFallback(el);
        return null;
      }
    }

    /* Fetch SDF from PubChem directly */
    const url = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + pubchemCID + '/SDF?record_type=3d';

    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (sdf) {
        viewer.addModel(sdf, 'sdf');
        viewer.setStyle({}, {
          stick: { colorscheme: 'cyanCarbon', radius: 0.15 },
          sphere: { colorscheme: 'cyanCarbon', scale: 0.3 }
        });
        viewer.zoomTo();
        viewer.zoom(0.85);
        viewer.render();
        viewer.spin('y', speed);
        hideMolLoader(el);
      })
      .catch(function () {
        showFallback(el);
      });

    if (window.ResizeObserver) {
      new ResizeObserver(function () { if (viewer) viewer.resize(); }).observe(el);
    }

    return viewer;
  }

  window.initMolecules = function () {
    /* Hero — Caffeine */
    createViewer('hero-mol', 2519, { bg: 'transparent', speed: 0.9 });
    /* Publication card — Aspirin */
    createViewer('pub-mol', 2244, { bg: '#0a0e1a', speed: 1 });
    /* Thesis — Ibuprofen */
    createViewer('thesis-mol', 3672, { bg: '#0a0e1a', speed: 0.8 });
  };
})();
