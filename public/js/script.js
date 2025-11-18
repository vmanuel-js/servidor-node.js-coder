const socket = io();

socket.on("listaProductos", (productos) => {
  const contenedor = document.getElementById("lista");
  contenedor.innerHTML = "";

  productos.forEach(p => {
    contenedor.innerHTML += `<li>${p.title} - ${p.price}</li>`;
  });
});

document.getElementById("formProducto").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const price = parseFloat(document.getElementById("price").value);

  socket.emit("nuevoProducto", { title, price });

  e.target.reset();
});
