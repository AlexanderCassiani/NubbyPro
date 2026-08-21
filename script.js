const links = document.querySelectorAll(".link-btn");

const dashboard = document.querySelector(".dashboard");
const producto = document.querySelector(".producto");

const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");

const inputs = document.querySelectorAll(".input");

const btnProducto = document.getElementById("btn-producto");

const tablaProductos = document.getElementById("tabla");
const tbody = tablaProductos.querySelector("tbody");

const agregarProductoBtn = document.getElementById("agregar-producto");

const productos = [
  {
    id: "0001",
    nombre: "Lavadora",
    categoria: "electrodomesticos",
    precio: 1000000,
    cantidad: 10,
  },
  {
    id: "0002",
    nombre: "Camiza oversize",
    categoria: "ropa",
    precio: 50000,
    cantidad: 20,
  },
  {
    id: "0003",
    nombre: "Silla gamer",
    categoria: "viedojuegos",
    precio: 200000,
    cantidad: 5,
  },
  {
    id: "0004",
    nombre: "Zapatos",
    categoria: "calzado",
    precio: 150000,
    cantidad: 15,
  },
  {
    id: "0005",
    nombre: "Reloj Rolex",
    categoria: "accesorio",
    precio: 5000000,
    cantidad: 0,
  },
];

function mostrarDashboard() {
  producto.style.display = "none";
  dashboard.style.display = "block";
}

function mostrarProductos() {
  producto.style.display = "block";
  dashboard.style.display = "none";
}

// navegacion entre dashborad y productos
links.forEach((link) => {
  link.addEventListener("click", () => {
    // obtener el id de los elementos a
    const linkId = link.getAttribute("id");

    // si el id es mostrar-dashboard, llama a la función mostrarDashboard, si es mostrar-productos llama a la función mostrarProductos
    if (linkId === "mostrar-dashboard") {
      mostrarDashboard();
    } else {
      mostrarProductos();
    }
  });
});

function mostrarModal() {
  overlay.style.display = "flex";
}

function cerrarModal() {
  overlay.style.display = "none";
}

inputs.forEach((input) => {
  input.addEventListener("keydown", (e) => {
    // obtener el tipo del input
    const tipoDeInput = input.getAttribute("type");

    // hacer las validaciones de los inputs, si es number no permitir letras, si es text no permitir numeros
    if (tipoDeInput === "number") {
      const caracteresNoPermitidos = "abcdefghijklmnñopqrstuvwxyz-";
      if (caracteresNoPermitidos.includes(e.key) || input.value < 0) {
        e.preventDefault();
      }
    } else if (tipoDeInput === "text") {
      const caracteresNoPermitidos = "0123456789";
      if (caracteresNoPermitidos.includes(e.key)) {
        e.preventDefault();
      }
    }
  });
});

// mostrar en la tabla los 5 productos
function renderizarProductosIniciales() {
  productos.forEach((producto) => {
    agregarProductoATabla(producto);
  });
}

renderizarProductosIniciales();

// agregar un producto a la tabla
function agregarProductoATabla(producto) {
  const nuevaFila = document.createElement("tr");

  // formatear el precio
  const precioFormateado = Intl.NumberFormat("es-CO").format(producto.precio);

  nuevaFila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>$${precioFormateado}</td>
      <td>${producto.cantidad}</td>
    `;

  tbody.appendChild(nuevaFila);
}

function crearProducto() {
  const id = document.getElementById("id").value;
  const nombre = document.getElementById("nombre").value;
  const categoria = document.getElementById("categoria").value;
  const precio = Number(document.getElementById("precio").value);
  const cantidad = document.getElementById("cantidad").value;

  if (!id || !nombre || !categoria || precio <= 0 || !cantidad) {
    alert("Por favor, complete todos los campos");
    return;
  }

  const nuevoProducto = {
    id,
    nombre,
    categoria,
    precio,
    cantidad,
  };

  productos.push(nuevoProducto);
  agregarProductoATabla(nuevoProducto);
  cerrarModal();
  limpiarInputs();
}

// limpiar los inputs despues de agregar un producto
function limpiarInputs() {
  document.getElementById("id").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("cantidad").value = "";
}

overlay.addEventListener("click", (e) => {
  // cerrar el modal al darle click al overlay (al fondo gris)
  if (e.target === overlay) {
    cerrarModal();
  }
});

btnProducto.addEventListener("click", () => {
  mostrarModal();
});

agregarProductoBtn.addEventListener("click", () => {
  crearProducto();
});
