function iniciarMenuMovil() {
  const mobileMainMenu = document.getElementById('mobileMainMenu');
  const offcanvasTitle = document.getElementById('offcanvasNavbarLabel');
  const offcanvasElement = document.getElementById('offcanvasNavbar');

  if (!mobileMainMenu) return;

  function backToMainMenu() {
    document.querySelectorAll('.submenu').forEach(s => s.style.display = 'none');
    mobileMainMenu.style.display = 'block';
    if (offcanvasTitle) offcanvasTitle.textContent = 'Categorías';
  }

  function showSubmenu(targetId, linkText = '') {
    mobileMainMenu.style.display = 'none';
    document.querySelectorAll('.submenu').forEach(s => s.style.display = 'none');
    const target = document.getElementById(targetId);
    if (target) target.style.display = 'block';
    if (offcanvasTitle) {
      offcanvasTitle.textContent = linkText ? linkText.replace('›','').trim() : 'Categorías';
    }
  }

  const delegacionObjetivo = offcanvasElement || document;

  delegacionObjetivo.addEventListener('click', function (e) {
    const toggle = e.target.closest('.category-with-submenu');
    if (toggle) {
      e.preventDefault();
      const target = toggle.dataset.target || toggle.getAttribute('data-target');
      if (!target) return;
      showSubmenu(target, toggle.textContent);
      return;
    }

    const backBtn = e.target.closest('.back-to-main');
    if (backBtn) {
      e.preventDefault();
      backToMainMenu();
    }
  });

  if (offcanvasElement && typeof bootstrap !== 'undefined') {
    offcanvasElement.addEventListener('hidden.bs.offcanvas', backToMainMenu);
  }

  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) backToMainMenu();
  });
}

window.addEventListener('partialsLoaded', () => iniciarMenuMovil());

if (document.getElementById('navbar') && document.getElementById('navbar').innerHTML.trim() !== '') {
  setTimeout(() => iniciarMenuMovil(), 50);
}