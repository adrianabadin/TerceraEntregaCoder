import { Ref, getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import { Products } from '../products/products.schema';
import mongoose from 'mongoose';
import Schema from 'mongoose';
import {z} from "zod"
import { v4 } from "uuid";
//import { Product } from '../entities/products';
//type Product={pid:string,quantity:number}
@modelOptions({options: {allowMixed:0}})
export class ProductItem{
@prop({ref:()=>Products,autopopulate:true})
pid!:Ref<Products>
@prop({required:true})
quantity!:number
}
export const productItemModel= getModelForClass(ProductItem)
// interface Product{
//     pid:Ref<Products>
//     quantity:number
// }
@modelOptions({options: {allowMixed:0}})
export class CartSchema {
    @prop({required:false,ref:()=>ProductItem,autopopulate:true,default:[]})
    public products!:Ref<ProductItem>[]
}
export const cartModel=getModelForClass(CartSchema)

/**
 * - Id (autogenerado por mongo)
- code: String debe autogenerarse y ser único
- purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se formalizó la compra - (básicamente es un created_at)
- amount: Number, total de la compra.
- purchaser: String, contendrá el correo del usuario asociado al carrito.

 */