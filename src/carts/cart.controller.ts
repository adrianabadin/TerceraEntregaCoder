import { Request, Response } from "express";
import { CartService } from "./cart.service";
import { Products } from "../products/products.schema";
import { Ref } from "@typegoose/typegoose";
import { Product } from "./cart.schema";

export class CartController {
    constructor(
        protected service = new CartService(),
        public createCart = async (req: Request, res: Response) => {
            const products: Product[] = req.body
            console.log(products);
            try {
                const response = await this.service.createCart(products)
                if (response?.ok) {
                    res.status(200).send(response.data)
                } else res.status(404).send({ message: "Couldnt create Cart" })

            } catch (error) {
                console.log(error)
                res.status(404).send(error)
            }

        },
        public getCartProduct = async (req: Request, res: Response) => {
            const { cid } = req.params
            try {
                const response = await this.service.getById(cid)
                if (response?.ok) {
                    if (response?.data !== null && "products" in response?.data)
                        res.status(200).send(response.data.products)
                    else res.status(404).send({ message: "Cart Not Found" })
                }

            } catch (error) { console.log(error) }
        },
        public addProduct = async (req: Request, res: Response) => {
            const { pid, cid } = req.params
            const { quantity } = req.query
            try {
                let response
                if (quantity !== undefined) {
                    response = await this.service.addProductById(cid, { pid, quantity: parseInt(quantity as string) })
                    console.log(response)
                    if (response?.ok) {
                        res.status(200).send(response.data)
                    } else res.status(404).send({ message: "Something blowed up!" })
                }
                else res.status(404).send({ message: "Must provide a quantity param" })
            } catch (error) { console.log(error) }
            console.log(pid, cid, quantity)
        }
        
    ) {
     }
     async deleteCartProduct (req:Request<{cid?:string,pid?:string}>,res:Response){
        const {cid,pid}=req.params
        let data 
        if (cid !== undefined && pid !== undefined)
        data =await this.service.deleteCartProduct(cid,pid)
        res.send(data)
     }
     async deleteCartProducts (req:Request<{cid?:string,pid?:string}>,res:Response){
        const {cid,pid}=req.params
        let data 
        if (cid !== undefined && pid !== undefined)
        data = this.service.deleteCartProducts(cid)
        res.send(data)
     }
     async updateProducts (req:Request<{cid?:string}>,res:Response){
        try{

        }catch(e){console.log(e)
        res.status(404).send(e)
        }
     }
     async updateCartProductQuantity(req:Request<{cid:string,pid:string},any,{quantity:number}>,res:Response){
        const {cid,pid}=req.params
        const {quantity} =req.body
        try{
            const data= await this.service.updateCartProductQuantity(cid,pid,quantity)
            res.status(200).send(data)
        }catch(e){console.log(e)
        res.status(404).send(e)
        }
     }
     async getCartProducts(req:Request,res:Response){
        const {cid}=req.params
        try{
            const data= await this.service.getCartProducts(cid)
            res.status(200).send(data)
        }catch(e){console.log(e)
        res.status(404).send(e)
        }
     }
}