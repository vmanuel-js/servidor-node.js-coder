import express from "express";
import {
  addProductToCart,
  createCart,
  getCartById,
} from "../controllers/carts.controllers.js";

const router = express.Router();

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProductToCart);

export default router;
