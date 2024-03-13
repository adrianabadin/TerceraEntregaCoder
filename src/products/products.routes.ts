import { Request, Response, Router } from "express";
import { ProductController } from "./product.controller";
import { Products } from "./products.schema";
import { TypegooseDAO } from "../services/typegoose.dao";
import { AuthController } from "../auth/auth.controller";
import passport from "passport";
const pm=new TypegooseDAO(Products,"products")
const productController = new ProductController()
const authController = new AuthController()
export const productRoute = Router()
productRoute.get("/products", productController.getProducts)
productRoute.get("/products/:id", productController.getById)
productRoute.post("/product",passport.authenticate("jwt"),authController.validateRol("admin"), productController.addProduct)
productRoute.put("/product",passport.authenticate("jwt"),authController.validateRol("admin") ,productController.updateById)
productRoute.delete("/product/:id",passport.authenticate("jwt"),authController.validateRol("admin") ,productController.deleteById)
productRoute.post("/tgproduct",async (req:Request<any,any,Products>,res:Response)=>{
const body=req.body
const algo=pm.addProduct(body)
res.send(algo)
})