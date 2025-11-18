import cartManager from "../managers/CarritoManager.js";

export const createCart = async (req, res) => {
  const nuevoCarrito = await cartManager.crearCarrito();
  res.json(nuevoCarrito);
};

export const getCartById = async (req, res) => {
  const cid = parseInt(req.params.cid);
  const carrito = await cartManager.obtenerCarritoPorId(cid);

  if (!carrito) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(carrito);
};

export const addProductToCart = async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const carritoActualizado = await cartManager.agregarProductoAlCarrito(
    cid,
    pid
  );

  if (carritoActualizado === null) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  if (carritoActualizado === "No existe el producto") {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(carritoActualizado);
};
