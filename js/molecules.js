(function () {

  function showFallback(el) {
    if (!el) return;
    const loader = el.parentElement && el.parentElement.querySelector('.mol-loader');
    if (loader) loader.style.display = 'none';
    el.innerHTML = '<svg viewBox="0 0 120 120" width="100%" height="100%" style="opacity:0.3"><g stroke="#4fc3f7" stroke-width="2" fill="none"><polygon points="60,18 96,39 96,81 60,102 24,81 24,39"/><circle cx="60" cy="60" r="14" stroke-dasharray="5 3"/><circle cx="60" cy="18" r="5" fill="#4fc3f7"/><circle cx="96" cy="39" r="5" fill="#4fc3f7"/><circle cx="96" cy="81" r="5" fill="#4fc3f7"/><circle cx="60" cy="102" r="5" fill="#4fc3f7"/><circle cx="24" cy="81" r="5" fill="#4fc3f7"/><circle cx="24" cy="39" r="5" fill="#4fc3f7"/></g></svg>';
  }

  function hideLoader(viewerEl) {
    const container = viewerEl.closest
      ? viewerEl.closest('.mol-viewer-container, .pub-mol-container, .paper-mol-container, #mol-bg-wrap')
      : viewerEl.parentElement;
    if (container) {
      const l = container.querySelector('.mol-loader');
      if (l) l.style.display = 'none';
    }
  }

  function createViewer(elementId, cid, opts) {
    const el = document.getElementById(elementId);
    if (!el) return null;
    if (typeof $3Dmol === 'undefined') { showFallback(el); return null; }

    opts = opts || {};
    const bg = opts.bg !== undefined ? opts.bg : 'transparent';
    const speed = opts.speed || 1;

    let viewer;
    try { viewer = $3Dmol.createViewer(el, { backgroundColor: bg, antialias: true, alpha: true }); }
    catch (e) { showFallback(el); return null; }

    fetch('https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + cid + '/SDF?record_type=3d')
      .then(function (r) { if (!r.ok) throw r.status; return r.text(); })
      .then(function (sdf) {
        viewer.addModel(sdf, 'sdf');
        viewer.setStyle({}, { stick: { colorscheme: 'cyanCarbon', radius: 0.15 }, sphere: { colorscheme: 'cyanCarbon', scale: 0.28 } });
        if (opts.surface) {
          viewer.addSurface($3Dmol.SurfaceType.SES, { opacity: 0.4, colorscheme: 'cyanCarbon' });
        }
        viewer.zoomTo();
        viewer.zoom(opts.zoom || 0.85);
        viewer.render();
        viewer.spin('y', speed);
        hideLoader(el);
      })
      .catch(function () { showFallback(el); });

    if (window.ResizeObserver) {
      new ResizeObserver(function () { if (viewer) viewer.resize(); }).observe(el);
    }
    return viewer;
  }

  window.initMolecules = function () {
    /* Full-page background molecule — caffeine */
    createViewer('mol-bg', 2519, { bg: 'transparent', speed: 0.5, zoom: 0.7 });
  };
})();
