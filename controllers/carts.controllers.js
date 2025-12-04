import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export const createCart = async (req, res) => {
  try {
    const { productos } = req.body;

    const nuevoCarrito = await CartModel.create({
      productos: productos || [],
    });

    res.status(201).json(nuevoCarrito);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};

export const getCartById = async (req, res) => {
  const carrito = await CartModel.findById(req.params.cid).populate(
    "productos.product"
  );

  if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

  res.json(carrito);
};

export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const productExists = await ProductModel.findById(pid);
  if (!productExists)
    return res.status(404).json({ error: "Producto no existe" });

  // Buscar producto en el carrito
  const item = cart.productos.find((p) => p.product.toString() === pid);

  if (item) {
    item.quantity++;
  } else {
    cart.productos.push({ product: pid, quantity: 1 });
  }

  await cart.save();
  res.json({ status: "success", payload: cart });
};

export const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(400).json({ error: "Carrito no encontrado" });

  const productInCart = cart.productos.find(
    (p) => p.product.toString() === pid
  );

  if (!productInCart)
    return res.status(400).json({ error: "Producto no existe en el carrito" });

  productInCart.quantity = quantity;

  await cart.save();

  res.json({ status: "success", payload: cart });
};

export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  cart.productos = cart.productos.filter(
    (item) => item.product.toString() !== pid
  );

  await cart.save();
  res.json({ status: "success", message: "Producto eliminado" });
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { productos } = req.body;

    // Validar que productos exista y sea un array
    if (!Array.isArray(productos)) {
      return res.status(400).json({
        error:
          "Debes enviar un array en 'productos'. Ejemplo: { productos: [...] }",
      });
    }

    // Buscar carrito
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Validar cada producto enviado
    for (const item of productos) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          error:
            "Formato inválido. Cada elemento debe incluir 'product' y 'quantity'.",
        });
      }

      const prod = await ProductModel.findById(item.product);
      if (!prod) {
        return res
          .status(400)
          .json({ error: `Producto no existe: ${item.product}` });
      }
    }

    // Reemplazar productos del carrito
    cart.productos = productos;
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllProducts = async (req, res) => {
  const { cid } = req.params;

  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(400).json({ error: "Carrito no encontrado" });

  cart.productos = [];
  await cart.save();

  res.json({ status: "success", message: "Carrito vaciado" });
};
