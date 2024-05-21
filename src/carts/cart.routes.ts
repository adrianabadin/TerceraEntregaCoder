import { Router } from "express";
import { CartController } from "./cart.controller";
import { AuthController } from "../auth/auth.controller";
import passport from "passport"
export const cartRouter = Router()
const authController= new AuthController()
const cartController = new CartController()
cartRouter.post("/", cartController.createCart)
cartRouter.post("/:cid/product/:pid",passport.authenticate("jwt",{session:false}),authController.validateRol(["admin","premium"]), cartController.addProduct)
cartRouter.post("/:cid/purchase",passport.authenticate("jwt",{session:false}),cartController.purchase)
cartRouter.get("/:cid", cartController.getCartProducts)
cartRouter.delete("/:cid/products/:pid",cartController.deleteCartProduct)
cartRouter.delete("/:cid/products",cartController.deleteCartProducts)
cartRouter.put("/:cid/products/:pid",cartController.updateCartProductQuantity)
cartRouter.put("/:cid",cartController.updateProducts)
