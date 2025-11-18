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

  async actualizarProducto(id, field) {
    const productos = await this.obtenerProductos();
    const index = productos.findIndex((p) => p.id === id);

    if (index === -1) {
      return null;
    }

    // Hacer que el ID no se actualice
    const productoActualizado = {
      ...productos[index],
      ...field,
      id: productos[index].id,
    };

    productos[index] = productoActualizado;

    await fs.writeFile(this.ruta, JSON.stringify(productos, null, 2));
    return productoActualizado;
  }

  async eliminarProducto(id) {
    const productos = await this.obtenerProductos();
    const index = productos.findIndex((p) => p.id === id);

    if (index === -1) {
      return false;
    }

    productos.splice(index, 1);
    await fs.writeFile(this.ruta, JSON.stringify(productos, null, 2));
    return true;
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

  async obtenerCarritoPorId(id) {
    const carritos = await this.obtenerCarrito();
    return carritos.find((c) => c.id === id);
  }

  async agregarProductoAlCarrito(cid, pid) {
    const carritos = await this.obtenerCarrito();
    const carrito = carritos.find((c) => c.id === cid);

    if (!carrito) {
      return null;
    }

    // Ver si el producto existe
    const item = carrito.productos.find((p) => p.product == pid);

    if (item) {
      item.quantity += 1;
    } else {
      carrito.productos.push({ product: pid, quantity: 1 });
    }

    await fs.writeFile(this.ruta, JSON.stringify(carritos, null, 2));
    return carrito;
  }
}

const productManager = new ProductosManager("productos.json");
const cartManager = new CarritoManager("carrito.json");

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

// PUT -> /api/products/:pid
servidor.put("/api/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const field = req.body;

  const resultado = await productManager.actualizarProducto(id, field);
  if (!resultado) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(resultado);
});

// DELETE /api/products/:pid
servidor.delete("/api/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

  const eliminado = await productManager.eliminarProducto(id);

  if (!eliminado) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json({ mensaje: "Producto eliminado correctamente" });
});

// POST -> /api/carts
servidor.post("/api/carts", async (req, res) => {
  const nuevoCarrito = await cartManager.crearCarrito();
  res.json(nuevoCarrito);
});

// GET -> /api/carts/:cid
servidor.get("/api/carts/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const carrito = await cartManager.obtenerCarritoPorId(cid);

  if (!carrito) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(carrito.productos);
});

// POST -> /api/carts/:cid/product/:pid
servidor.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const carritoActualizado = await cartManager.agregarProductoAlCarrito(
    cid,
    pid
  );

  if (!carritoActualizado) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(carritoActualizado);
});

// Servidor en el puerto 8080
servidor.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
