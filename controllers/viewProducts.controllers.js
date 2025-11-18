import { getAllProducts } from "./products.controllers.js";

export const productsView = (req, res) => {
  const products = getAllProducts(null, {
    json: (data) => {
      res.render("products", { products: data });
    },
  });
};
