import { Router } from "express";
import { CartController } from "./cart.controller";
export const cartRouter = Router()
const cartController = new CartController()
cartRouter.post("/", cartController.createCart)
cartRouter.post("/:cid/product/:pid", cartController.addProduct)
cartRouter.get("/:cid", cartController.getCartProducts)
cartRouter.delete("/:cid/products/:pid",cartController.deleteCartProduct)
cartRouter.delete("/:cid/products",cartController.deleteCartProducts)
cartRouter.put("/:cid/products/:pid",cartController.updateCartProductQuantity)
cartRouter.put("/:cid",cartController.updateProducts)
