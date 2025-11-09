document.addEventListener('DOMContentLoaded', function() {
    // Elementos del menú móvil
    const categoryLinks = document.querySelectorAll('.category-with-submenu');
    const submenus = document.querySelectorAll('.submenu');
    const mobileMainMenu = document.getElementById('mobileMainMenu');
    const offcanvasTitle = document.getElementById('offcanvasNavbarLabel');
    const backButtons = document.querySelectorAll('.back-to-main');

    // Función para mostrar submenú
    function showSubmenu(targetMenuId) {
        // Ocultar menú principal
        mobileMainMenu.style.display = 'none';
        
        // Ocultar todos los submenús primero
        submenus.forEach(menu => {
            menu.style.display = 'none';
        });
        
        // Mostrar el submenú correspondiente
        const targetMenu = document.getElementById(targetMenuId);
        if (targetMenu) {
            targetMenu.style.display = 'block';
        }
    }

    // Función para volver al menú principal
    function backToMainMenu() {
        // Ocultar todos los submenús
        submenus.forEach(menu => {
            menu.style.display = 'none';
        });
        
        // Mostrar menú principal
        mobileMainMenu.style.display = 'block';
        
        // Restaurar título
        offcanvasTitle.textContent = 'Categorías';
    }

    // Agregar event listeners a las categorías
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetMenu = this.getAttribute('data-target');
            
            // Mostrar submenú
            showSubmenu(targetMenu);
            
            // Actualizar título con el nombre de la categoría (sin la flecha)
            const categoryName = this.textContent.trim().replace('›', '');
            offcanvasTitle.textContent = categoryName;
        });
    });

    // Agregar event listeners a los botones de regresar
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            backToMainMenu();
        });
    });

    // Reiniciar el menú cuando se cierre el offcanvas
    const offcanvasElement = document.getElementById('offcanvasNavbar');
    if (offcanvasElement) {
        offcanvasElement.addEventListener('hidden.bs.offcanvas', function () {
            backToMainMenu();
        });
    }

    // También aplicar el comportamiento en resize por si cambia de móvil a desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            backToMainMenu();
        }
    });
});