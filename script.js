const links = document.querySelectorAll(".link-btn");

const dashboard = document.querySelector(".dashboard");
const producto = document.querySelector(".producto");

const overlay = document.querySelector(".overlay");

const inputs = document.querySelectorAll(".input");

const btnProducto = document.getElementById("btn-producto");

const tablaProductos = document.getElementById("tabla");
const tbody = tablaProductos.querySelector("tbody");

const agregarProductoBtn = document.getElementById("agregar-producto");

const totalDeProductos = document.getElementById("total-productos");
const precioTotalInventario = document.getElementById("precio-total");

const inputsNumeros = document.querySelectorAll(".numero");

const busqueda = document.getElementById("filtro-nombre");
const categoria = document.getElementById("filtro-categoria");

const graficaCategoria = document.getElementById("grafica-categoria");

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
    categoria: "videojuegos",
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
  {
    id: "0006",
    nombre: "Pc Gamer ultima gen",
    categoria: "videojuegos",
    precio: 3000000,
    cantidad: 3,
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
    // obtener el id de los elementos li
    const linkId = link.getAttribute("id");

    // si el id es mostrar-dashboard, llama a la función mostrarDashboard, si es mostrar-productos llama a la función mostrarProductos
    if (linkId === "mostrar-dashboard") {
      mostrarDashboard();
    } else {
      mostrarProductos();
    }
  });
});

function obtenerProductosPorCategoria() {
  // guardar cuantas veces aparece la categoria
  const cantidades = {};

  productos.forEach((producto) => {
    if (cantidades[producto.categoria]) {
      cantidades[producto.categoria] += 1;
    } else {
      cantidades[producto.categoria] = 1;
    }
  });

  // ordenar las categorias de mayor a menor
  const categoriasOrdenadas = Object.entries(cantidades).sort(
    (a, b) => b[1] - a[1],
  );

  // obtener solo las 5 categorias con mas productos
  const top5 = categoriasOrdenadas.slice(0, 5);

  // quedarse solo con la categoria
  const categorias = top5.map((categoria) => categoria[0]);

  //quedarce solo con la cantidad de productos
  const cantidadesProductos = top5.map((categoria) => categoria[1]);

  return {
    categorias,
    cantidades: cantidadesProductos,
  };
}

function crearGraficaCategoria() {
  const datos = obtenerProductosPorCategoria();

  new Chart(graficaCategoria, {
    type: "bar",

    data: {
      labels: datos.categorias,

      datasets: [
        {
          label: "Cantidad de productos por categoria",
          data: datos.cantidades,
        },
      ],
    },
  });
}

crearGraficaCategoria();

function mostrarModal() {
  overlay.style.display = "flex";
}

function cerrarModal() {
  overlay.style.display = "none";

  // limpiar los inputs al cerrar el modal
  limpiarInputs();
  // resetear el estado de las variables de edicion al cerrar el modal
  estaEditando = false;
  idProductoEditando = null;
  agregarProductoBtn.textContent = "Agregar producto";
}

inputs.forEach((input) => {
  input.addEventListener("keydown", (e) => {
    // obtener el tipo del input
    const tipoDeInput = input.getAttribute("type");

    // validar que no se pueda escribir letras en los inputs de tipo numero
    if (tipoDeInput === "number") {
      const caracteresNoPermitidos = "abcdefghijklmnñopqrstuvwxyz-";
      if (caracteresNoPermitidos.includes(e.key) || input.value < 0) {
        e.preventDefault();
      }
    }
  });
});

// actualiza el valor de las tarjetas del dashboard
function actualizarDatosDashboard() {
  // actualizar el total de productos con la longitud del array de productos
  totalDeProductos.textContent = productos.length;

  // actualizar el precio total del inventario con la suma de los precios de los productos multiplicados por su cantidad
  let precioTotal = 0;
  productos.forEach((producto) => {
    precioTotal += producto.precio * producto.cantidad;
  });
  precioTotalInventario.textContent = `$${Intl.NumberFormat("es-CO").format(precioTotal)}`;
}

actualizarDatosDashboard();

// mostrar en la tabla los 5 productos
function renderizarProductos() {
  productos.forEach((producto) => {
    agregarProductoATabla(producto);
  });
}

renderizarProductos();

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
      <td>
        <button title="Editar producto" onclick="editarProducto('${producto.id}')">
          <img src="icon/editar.svg" alt="Editar" />
        </button>
        <button title="Eliminar producto" onclick="eliminarProducto('${producto.id}')">
          <img src="icon/eliminar.svg" alt="Eliminar" />
        </button>
      </td>
    `;

  tbody.appendChild(nuevaFila);
}

function eliminarProducto(id) {
  const indice = productos.findIndex((producto) => producto.id === id);
  productos.splice(indice, 1);
  tbody.innerHTML = "";
  renderizarProductos();
  actualizarDatosDashboard();
}

// variable para saber si se esta editando un producto
let estaEditando = false;
// guardar el id del producto que se esta editando
let idProductoEditando = null;

function editarProducto(id) {
  estaEditando = true;

  mostrarModal();
  // encontrar el producto que se editar con el id
  const producto = productos.find((producto) => producto.id === id);

  // guardar el id del producto que se esta editando
  idProductoEditando = producto.id;

  document.getElementById("id").value = producto.id;
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("categoria").value = producto.categoria;
  document.getElementById("precio").value = producto.precio;
  document.getElementById("cantidad").value = producto.cantidad;

  agregarProductoBtn.textContent = "Guardar cambios";
}

function crearProducto() {
  const id = document.getElementById("id").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const categoria = document.getElementById("categoria").value.trim();
  const precio = Number(document.getElementById("precio").value.trim());
  const cantidad = document.getElementById("cantidad").value.trim();

  // validar que todos los campos esten completos y que el precio y la cantidad sean mayores a 0
  if (
    !id ||
    !nombre ||
    !categoria ||
    precio <= 0 ||
    !cantidad ||
    cantidad < 0
  ) {
    alert("Por favor, complete todos los campos correctamente");
    return;
  }

  if (estaEditando) {
    const indice = productos.findIndex(
      (producto) => producto.id === idProductoEditando,
    );
    productos[indice] = { id, nombre, categoria, precio, cantidad };
  } else {
    // validar que el id del producto sea unico
    const existeProducto = productos.find((producto) => producto.id === id);
    if (existeProducto) {
      alert("El ID del producto ya existe. Por favor, ingrese un ID único.");
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
  }

  tbody.innerHTML = "";
  renderizarProductos();
  cerrarModal();
  actualizarDatosDashboard();
}

// limpiar los inputs despues de agregar un producto
function limpiarInputs() {
  document.getElementById("id").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("cantidad").value = "";
}

// validar que los inputs type number tengan una longitud maxima de 20 numeros
inputsNumeros.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.length > 20) {
      input.value = input.value.slice(0, 20);

      alert("El valor de los campos numericos debe de ser menor a 20 numeros");
    }
  });
});

function filtrarProducto() {
  const productosFiltrados = productos.filter((producto) => {
    const filtroNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda.value.toLowerCase().trim());

    const filtroCategoria =
      categoria.value === "todas" // si el select es todas devolvel todos los productos
        ? producto
        : producto.categoria === categoria.value;

    // filtrar solo si el producto cumpla con ambos filtros
    return filtroNombre && filtroCategoria;
  });

  tbody.innerHTML = "";

  productosFiltrados.forEach((producto) => {
    agregarProductoATabla(producto);
  });
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

busqueda.addEventListener("input", filtrarProducto);
categoria.addEventListener("input", filtrarProducto);
