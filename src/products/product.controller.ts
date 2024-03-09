import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { Product } from "../entities/products";
import { ResponseObject } from '../entities/classes';
import { Server, Socket } from "socket.io";
import { io } from "../app";
import { DefaultEventsMap } from "socket.io/dist/typed-events";


export class ProductController {
    constructor(
        protected service = new ProductService(),
        public getProducts = (req: Request<any,any,any,{limit?:string,page?:string,query?:string,sort?:string}>, res: Response) => {
            const { limit,page,query,sort } = req.query
            
               this.service.getData(parseInt(limit || "10"),parseInt(page || "1"),JSON.parse(sort||"{}"),JSON.parse(query||"{}")).then(response => {
                    if (response?.ok) res.status(200).send(response)
                    else res.status(404).send(response?.error)
                }).catch(e => {
                    console.log(e)
                    res.status(404).send(e)}
                )
                         
            
        },
        public addProduct = async (req: Request, res: Response) => {
            const { code, description, price, stock, thumbnail, title }: Product = req.body;
            const response = await this.service.addProduct({ code, description, price, stock, thumbnail, title });
            if (response !== undefined) {
                console.log("emited", response, req.get("referer"));
                io.emit("newProduct", response); // <- Emitir el evento "newProduct" aquí
                res.redirect(req.get("referer") || "/");
            } else res.status(404).send("Unable to add product");
        },

        public getById = async (req: Request, res: Response) => {
            const { id } = req.params
            try {
                const response = await this.service.getById(id)
                if (response?.ok) res.status(200).send(response)
                else res.status(404).send(response)
            } catch (e) { console.log(e) }
        },
        public updateById = async (req: Request, res: Response) => {
            const product: Partial<Product> & { id: string } = req.body
            try {
                const data: ResponseObject<Product & {_id:any}> = await this.service.getById(product.id) as ResponseObject<Product & {_id:any}>
                let procesedData: Product&{_id:any}
                if (data?.ok) {
                    if (!Array.isArray(data?.data) && data?.data !== null) {
                        procesedData = { ...data.data, ...product };
                        const response = await this.service.updateProduct(procesedData)
                        if (response?.ok) {
                            res.status(200).send(response)
                        } else res.status(404).send(response)
                    }
                }
            } catch (error) {
                console.log(error)
                res.status(404).send("caboom")
            }
        },
        public deleteById = async (req: Request, res: Response) => {
            const { id } = req.params
            try {
                const response = await this.service.deleteProduct(id)
                if (response?.ok) {
                    io.emit("eraseProduct", id)
                    res.status(200).send(response)

                } else res.status(404).send(response)

            } catch (error) { console.log(error) }
        }
    ) { }
}