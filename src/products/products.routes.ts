import { Request, Response, Router } from "express";
import { ProductController } from "./product.controller";
import { Products } from "./products.schema";
import { TypegooseDAO } from "../services/typegoose.dao";
const pm=new TypegooseDAO(Products,"products")
const productController = new ProductController()
export const productRoute = Router()
productRoute.get("/products", productController.getProducts)
productRoute.get("/products/:id", productController.getById)
productRoute.post("/product", productController.addProduct)
productRoute.put("/product", productController.updateById)
productRoute.delete("/product/:id", productController.deleteById)
productRoute.post("/tgproduct",async (req:Request<any,any,Products>,res:Response)=>{
const body=req.body
const algo=pm.addProduct(body)
res.send(algo)
})