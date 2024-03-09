import { Cart, ResponseObject } from '../entities/classes';
import { ICartService, IProductService } from "../entities/products";
import { ProductManager } from "../services/fs.dao";
import { Response } from 'express';
import { TypegooseDAO } from "../services/typegoose.dao";
import { CartSchema,Product } from './cart.schema';
import { FilterQuery } from 'mongoose';
import { Ref } from '@typegoose/typegoose';
import { Products } from '../products/products.schema';
const productManager = new ProductManager<Cart>("./src/carts/carts.json")
const pm  = new TypegooseDAO<CartSchema>(CartSchema,'carts')
export class CartService<T extends Product>  {
    constructor(
        protected dao = pm ,//productManager,
        public createCart = async (products?: T[]) => {
          //  const cartObject = new Cart(products)
            try {
                const response = await this.dao.addProduct({products})
                if (response !== undefined) {
                    return new ResponseObject(null, true, response)
                } else return new ResponseObject("Crasheeed", false, null)
            } catch (error) {
                console.log(error)
                return new ResponseObject(error, false, null)
            }

        },
        public getCarts = async (limit?: number,page?:number,sort?:{field:keyof CartSchema,descending:boolean},query?:FilterQuery<CartSchema>) => {
            try {
                const response = await this.dao.getProducts(limit,page,sort,query)
                if (response !== undefined) {
                    return new ResponseObject(null, true, response)
                } else return new ResponseObject("SOmething went Wrong", false, null)


            } catch (error) {
                console.log(error)
                return new ResponseObject(error, false, null)

            }
        },
        public getById = async (id: string) => {
            try {
                const response = await this.dao.getProductById(id)
                if (response !== undefined) {
                    return new ResponseObject(null, true, response)
                } else return new ResponseObject("SOmething went wrong", false, null)

            } catch (error) {
                console.log(error)
                return new ResponseObject(error, false, null)
            }
        },
        public addProductById = async (id: string, product: {pid:string,quantity:number}) => {
            try {
                const cartData = await this.dao.getProductById(id)
                if (cartData !== undefined && cartData!==null && "products" in cartData && Array.isArray(cartData.products))  {
                    const productData = cartData.products.findIndex(productField => product.pid === `${productField.pid}`)
                    if (productData !== -1) {
                        cartData.products[productData].quantity++
                    } else {
                        cartData.products.push(product as unknown as T)
                    }
                    const response = await this.dao.updateProduct(id, cartData)
                    if (response !== undefined) {
                        return new ResponseObject(null, true, response)
                    } else return new ResponseObject("Caboom", false, null)
                }
            } catch (error) {
                console.log(error)
                return new ResponseObject(error, false, null)
            }
        }
    ) { }
async deleteCartProduct(cid:string,pid:string){
    try{
    const data = this.dao.model.updateOne({_id:cid},{$pull:{products:{pid}}})
    return new ResponseObject(null,true,data)
}catch(e){console.log(e)
return new ResponseObject(e,false,null)
}
}
async deleteCartProducts(cid:string){
    try{
    const data = this.dao.model.updateOne({_id:cid},{$pullAll:{products:{}}})
    return new ResponseObject(null,true,data)
}catch(e){console.log(e)
return new ResponseObject(e,false,null)
}
}
async updateProducts(cid:string,products:T[]){
    try{
        const data = await this.dao.model.updateOne({_id:cid},products)
        return new ResponseObject(null,true,data)
    }catch(e){
        console.log(e)
        return new ResponseObject(e,false,null)
    }
}
async updateCartProductQuantity(cid:string,pid:string,quantity:number){
    try{
        const data = await this.dao.model.updateOne({_id:cid,products:{pid}},{quantity})
        return new ResponseObject(null,true,data)
    }catch(e){console.log(e)
    return new ResponseObject(e,false,null)
    }
}
async getCartProducts(cid:string){
try{
const data = this.dao.model.findById(cid).populate("products.pid")
return new ResponseObject(null,true,data)

}catch(e){console.log(e)
return new ResponseObject(e,false,null)
}
}
}