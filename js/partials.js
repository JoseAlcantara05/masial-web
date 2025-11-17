// partials.js — versión final, limpia y estable

function cargarPartials() {
    Promise.all([
        // Cargar NAVBAR
        fetch('partials/navbar.html').then(r => {
            if (!r.ok) throw new Error('No se pudo cargar navbar.html');
            return r.text();
        }),

        // Cargar FOOTER
        fetch('partials/footer.html').then(r => {
            if (!r.ok) throw new Error('No se pudo cargar footer.html');
            return r.text();
        })
    ])
    .then(([navHtml, footerHtml]) => {

        // Insertar NAVBAR
        const navContainer = document.getElementById('navbar');
        if (navContainer) {
            navContainer.innerHTML = navHtml;
        }

        // Insertar FOOTER
        const footerContainer = document.getElementById('footer');
        if (footerContainer) {
            footerContainer.innerHTML = footerHtml;
        }

        // ESPERAR a que el contenido insertado exista en el DOM
        setTimeout(() => {

            // Ajustar ruta del LOGO HOME en el navbar
            const home = document.getElementById("home-link");

            if (!home) {
                console.warn("⚠ No se encontró #home-link en el navbar");
            } else {
                // GitHub Pages
                if (location.hostname.includes("github.io")) {
                    home.href = "/masial-web/index.html"; 
                }
                // Local
                else {
                    home.href = "../index.html";
                }
            }

            // Mandar evento indicando que ya terminaron los partials
            window.dispatchEvent(new Event('partialsLoaded'));
            console.log('Partials cargados correctamente ✔');

        }, 80); // pequeño delay para que el DOM del navbar ya esté parseado
    })
    .catch(err => {
        console.error('❌ Error cargando partials:', err);
    });
}


// Ejecutar al cargar el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarPartials);
} else {
    cargarPartials();
}
