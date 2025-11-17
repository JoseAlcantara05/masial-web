// partials.js - Versión más robusta
function cargarPartials() {
    Promise.all([
        fetch('partials/navbar.html').then(r => {
            if (!r.ok) throw new Error('No se pudo cargar navbar.html');
            return r.text();
        }),
        fetch('partials/footer.html').then(r => {
            if (!r.ok) throw new Error('No se pudo cargar footer.html');
            return r.text();
        })
    ])
    .then(([navHtml, footerHtml]) => {
        const navContainer = document.getElementById('navbar');
        const footerContainer = document.getElementById('footer');

        if (navContainer) navContainer.innerHTML = navHtml;
        if (footerContainer) footerContainer.innerHTML = footerHtml;

        // Disparar evento cuando el DOM esté listo
        setTimeout(() => {
            window.dispatchEvent(new Event('partialsLoaded'));
            console.log('Partials cargados y DOM listo ✅');
        }, 100);
    })
    .catch(err => {
        console.error('Error cargando partials:', err);
    });
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarPartials);
} else {
    cargarPartials();
}