import express from "express";
import fs from "fs/promises";

const servidor = express();
const PORT = 8080;
servidor.use(express.json());

// Clase Productos Manager
class ProductosManager {
  constructor(ruta) {
    this.ruta = ruta;
  }

  // Leer todos los productos
  async obtenerProductos() {
    try {
      const data = await fs.readFile(this.ruta, { encoding: "utf-8" });
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (error) {
      console.log(console.error("Hubo un error: ", error));
      return [];
    }
  }

  // Obtener productos por ID
  async obtenerProductosPorId(id) {
    try {
      const data = await this.obtenerProductos();
      return data.find((p) => p.id === id);
    } catch (error) {
      console.error("Hubo un error: ", error);
    }
  }

  // Agregar un nuevo producto
  async agregarProducto(productoData) {
    const producto = await this.obtenerProductos();

    const nuevoProducto = {
      id: producto.length ? producto[producto.length - 1].id + 1 : 1,
      ...productoData,
    };

    producto.push(nuevoProducto);
    await fs.writeFile(this.ruta, JSON.stringify(producto, null, 2));
    return nuevoProducto;
  }
}

// Clase Carrito Manager

class CarritoManager {
  constructor(ruta) {
    this.ruta = ruta;
  }

  async obtenerCarrito() {
    try {
      const data = await fs.readFile(this.ruta, { encoding: "utf-8" });
      const jsonDato = JSON.parse(data);
      return jsonDato;
    } catch (error) {
      console.error("Hubo un error: ", error);
      return [];
    }
  }

  async crearCarrito() {
    const carrito = await this.obtenerCarrito();

    const nuevoCarro = {
      id: carrito.length ? carrito[carrito.length - 1].id + 1 : 1,
      productos: [],
    };

    carrito.push(nuevoCarro);
    await fs.writeFile(this.ruta, JSON.stringify(carrito, null, 2));
    return nuevoCarro;
  }
}

const productManager = new ProductosManager("productos.txt");
const cartManager = new CarritoManager("carrito.txt");

// Rutas

// GET -> /api/products
servidor.get("/api/products", async (req, res) => {
  const productos = await productManager.obtenerProductos();
  res.json(productos);
});

// GET -> /api/products/:pid
servidor.get("/api/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const producto = await productManager.obtenerProductosPorId(id);

  res.json(producto);
});

// POST -> /api/products
servidor.post("/api/products", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const nuevoProducto = await productManager.agregarProducto({
    title,
    description,
    code,
    price,
    status: status ?? true,
    stock,
    category,
    thumbnails: thumbnails || [],
  });

  res.json(nuevoProducto);
});

// POST -> /api/carts
servidor.post("/api/carts", async (req, res) => {
  const nuevoCarrito = await cartManager.crearCarrito();
  res.json(nuevoCarrito);
});

// Servidor en el puerto 8080
servidor.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
