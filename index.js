import express from "express";
import http from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import viewsRouter from "./routes/views.route.js";
import productsViewRouter from "./routes/products.view.route.js";
import cartsViewRouter from "./routes/carts.view.route.js";
import realtimeRouter from "./routes/realtime.route.js";
import ProductosManager from "./managers/ProductosManager.js";

const PORT = 8080;
const app = express();
const servidor = http.createServer(app);
const servidorWS = new Server(servidor);

servidorWS.on("connection", async (socket) => {
  console.log("Producto recibido");

  socket.emit("listaProductos", await ProductosManager.obtenerProductos());

  socket.on("nuevoProducto", async (data) => {
    await ProductosManager.agregarProducto(data);
    servidorWS.emit("listaProductos", await ProductosManager.obtenerProductos());
  });

  socket.on("eliminarProducto", async (pid) => {
    await ProductosManager.eliminarProducto(pid);
    servidorWS.emit("listaProductos", await ProductosManager.obtenerProductos());
  })
});

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.static("public"));

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/products", productsViewRouter);
app.use("/carts", cartsViewRouter);
app.use("/realtimeproducts", realtimeRouter);

// Servidor en el puerto 8080
servidor.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
