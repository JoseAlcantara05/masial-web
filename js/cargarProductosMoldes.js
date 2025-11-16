function cargarProductosMoldes(rutas) {
  const contenedor = document.getElementById("contenedor-productos");

  rutas.forEach(ruta => {
    fetch(ruta)
      .then(res => res.text())
      .then(html => {
        const temp = document.createElement("div");
        temp.innerHTML = html;

        // Buscar todos los elementos con la clase "card"
        const productos = temp.querySelectorAll(".card");
        productos.forEach(card => {
          const col = document.createElement("div");
          col.classList.add("col-sm-6", "col-md-4", "col-lg-3", "mb-4");
          col.appendChild(card.cloneNode(true));
          contenedor.appendChild(col);
        });
      })
      .catch(err => console.error("Error al cargar:", ruta, err));
  });
}
