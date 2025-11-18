import express from "express";

import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import viewsRouter from "./routes/views.route.js";

const app = express();
const PORT = 8080;
app.use(express.json());

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Servidor en el puerto 8080
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
