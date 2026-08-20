const links = document.querySelectorAll(".link-btn");

// obtener el pagina actual (dashboard.html)
const paginaActual = window.location.pathname.split("/").pop();

links.forEach((link) => {
  // obtener el valor del atributo href de los a del sidebar
  const pagina = link.getAttribute("href");

  if (pagina === paginaActual) {
    link.classList.add("link-activo");
  }
});
