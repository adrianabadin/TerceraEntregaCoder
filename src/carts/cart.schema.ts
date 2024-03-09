import { Ref, modelOptions, prop } from "@typegoose/typegoose"
import { Products } from '../products/products.schema';
import mongoose from 'mongoose';
import Schema from 'mongoose';
import {z} from "zod"
//import { Product } from '../entities/products';
//type Product={pid:string,quantity:number}
@modelOptions({options: {allowMixed:0}})
export class Product{
@prop({ref:Products})
pid!:Ref<Products>
@prop()
quantity!:number
}
@modelOptions({options: {allowMixed:0}})
export class CartSchema {
    @prop({required:false})
    public products?:Product[]

}
