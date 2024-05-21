import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { Product } from "../entities/products";
import { ResponseObject } from '../entities/classes';
import { Server, Socket } from "socket.io";
import { io } from "../app";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Products } from "./products.schema";
import { PremiumNotOwnerError, ProductCreateError, ProductError, UnknowProductError } from './products.errors';
import { AuthError, UserNotAuthenticated } from "../auth/auth.errors";


export class ProductController {
    constructor(
        protected service = new ProductService(),
        public getProducts = async (req: Request<any,any,any,{limit?:string,page?:string,query?:string,sort?:string}>, res: Response) => {
            const { limit,page,query,sort } = req.query
            const response= await this.service.getData(parseInt(limit||'10'),parseInt(page||'1'),JSON.parse(sort||'{}'),JSON.parse(query||"{}"))
            if (response instanceof ProductError) return res.status(500).send(response)
            return res.status(200).send(response)    
            
                         
            
        },
        public addProduct = async (req: Request, res: Response) => {
            const { code, description, price, stock, thumbnail, title }: Product = req.body;
            let owner:string = "admin"
            if (req.user !== undefined && "role" in req.user && req.user.role !== null){
                if ("email" in req.user && req.user.role !== "admin")
                owner=req.user?.email as string
            }
            const response = await this.service.addProduct({owner, code, description, price, stock, thumbnail, title });
            if (response instanceof ProductError) return res.status(500).send(response)
            if (response !== undefined) {
                console.log("emited", response, req.get("referer"));
                io.emit("newProduct", response); // <- Emitir el evento "newProduct" aquí
                return res.redirect(req.get("referer") || "/");
            } else return  res.status(404).send(new ProductCreateError());
        },

        public getById = async (req: Request, res: Response) => {
            const { id } = req.params
                const response = await this.service.getById(id)
                if (!(response instanceof ProductError))  return res.status(200).send(response)
                else return res.status(404).send(response)
        },
        public updateById = async (req: Request, res: Response) => {
            const product: Partial<Product> & { id: string } = req.body
        
                const data = await this.service.getById(product.id)
                if (data instanceof ProductError) return res.status(404).send(data)
                if(req.user !== undefined && "role" in req.user && req.user.role !==null ){
                    if("email" in req.user && req.user.email !==null){
                        if (req.user.role === "admin" || data.owner === req.user.email){
                            const response = await this.service.updateProduct({...data,...product})   
                            if (response === null) return res.status(500).send(new UnknowProductError())
                            if (response instanceof ProductError) return res.status(500).send(response)
                            return res.status(200).send(response)  
                        } else return res.status(404).send(new PremiumNotOwnerError())
                    }else return res.status(401).send(new UserNotAuthenticated())
                }else return res.status(401).send(new UserNotAuthenticated())
            
        },
        public deleteById = async (req: Request, res: Response) => {
            const { id } = req.params
            if (req.user !== undefined && "email" in req.user && req.user.email !== null && typeof req.user.email ==="string") 
            {   
                const response = await this.service.deleteProduct(id,req.user.email)
                if (response instanceof ProductError) return res.status(404).send(response)
                    io.emit("eraseProduct", id)
                    return res.status(200).send(response)
            }         
        }
    ) { }
}