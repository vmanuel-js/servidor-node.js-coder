import { getCartById } from "./carts.controllers.js";
import productManager from "../managers/ProductosManager.js";

export const cartView = (req, res) => {
  const { cid } = req.params;

  // Llamamos al controller real
  getCartById(
    { params: { cid } },
    {
      json: async (cartData) => {
        // Si viene error, lo mostramos en la vista
        if (cartData.error) {
          return res.render("cart", { error: cartData.error });
        }

        // Los productos del carrito solo tienen pid y quantity
        const productosEnriquecidos = [];

        for (const item of cartData.productos) {
          const producto = await productManager.obtenerProductoPorId(
            item.product
          );

          if (producto) {
            productosEnriquecidos.push({
              title: producto.title,
              price: producto.price,
              quantity: item.quantity,
            });
          }
        }

        res.render("cart", {
          cart: {
            id: cartData.id,
            productos: productosEnriquecidos,
          },
        });
      },
    }
  );
};
