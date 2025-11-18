import productManager from "../managers/ProductosManager.js";

export const getAllProducts = async (req, res) => {
  const productos = await productManager.obtenerProductos();
  res.json(productos);
};

export const getProductById = async (req, res) => {
  const id = parseInt(req.params.pid);
  const producto = await productManager.obtenerProductosPorId(id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(producto);
};

export const createProduct = async (req, res) => {
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

  if (
    !title ||
    !description ||
    !code ||
    price == null ||
    stock == null ||
    !category
  ) {
    return res.status(400).json({
      error:
        "Faltan campos por completar. Debe incluir: title, description, code, price, stock, category",
    });
  }

  try {
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

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el producto" });
  }
};

export const updateProduct = async (req, res) => {
  const id = parseInt(req.params.pid);
  const field = req.body;

  const resultado = await productManager.actualizarProducto(id, field);
  if (!resultado) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(resultado);
};

export const deleteProduct = async (req, res) => {
  const id = parseInt(req.params.pid);

  const eliminado = await productManager.eliminarProducto(id);

  if (!eliminado) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json({ mensaje: "Producto eliminado correctamente" });
};
