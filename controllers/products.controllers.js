import ProductModel from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    let filtro = {};

    if (query) {
      if (query === "available") filtro.status = true;
      else if (query === "unavailable") filtro.status = false;
      else filtro.category = query;
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const resultado = await ProductModel.paginate(filtro, {
      limit,
      page,
      sort: sortOption,
      lean: true,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    res.json({
      status: "success",
      payload: resultado.docs,
      totalPages: resultado.totalPages,
      prevPage: resultado.prevPage,
      nextPage: resultado.nextPage,
      page: resultado.page,
      hasPrevPage: resultado.hasPrevPage,
      hasNextPage: resultado.hasNextPage,
      prevLink: resultado.hasPrevPage
        ? `${baseUrl}?page=${resultado.prevPage}&limit=${limit}`
        : null,
      nextLink: resultado.hasNextPage
        ? `${baseUrl}?page=${resultado.nextPage}&limit=${limit}`
        : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const producto = await ProductModel.findById(req.params.pid);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch {
    res.status(404).json({ error: "ID inválido" });
  }
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
    const nuevoProducto = await ProductModel.create({
      title,
      description,
      code,
      price,
      status: status ?? true,
      stock,
      category,
      thumbnails: thumbnails || [],
    });

    res.status(201).json({
      status: "success",
      payload: nuevoProducto,
    });
  } catch {
    res.status(500).json({ error: "Error al guardar el producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const resultado = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );
    if (!resultado)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(resultado);
  } catch {
    res.status(404).json({ error: "ID inválido" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const eliminado = await ProductModel.findByIdAndDelete(req.params.pid);
    if (!eliminado)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch {
    res.status(404).json({ error: "ID inválido" });
  }
};
