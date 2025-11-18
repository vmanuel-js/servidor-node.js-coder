import express from "express";
import http from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import viewsRouter from "./routes/views.route.js";
import productsViewRouter from "./routes/products.view.route.js";
import cartsViewRouter from "./routes/carts.view.route.js";

const PORT = 8080;
const app = express();
const servidor = http.createServer(app);
const servidorWS = new Server(servidor);

servidorWS.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("nuevoProducto", (data) => {
    console.log("Producto recibido vía WebSocket: ", data);
    socket.emit("actualizarLista", data);
  });
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

// Servidor en el puerto 8080
servidor.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
