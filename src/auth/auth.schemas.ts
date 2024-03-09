import { Ref, modelOptions, prop } from "@typegoose/typegoose"
import { Products } from '../products/products.schema';
import mongoose from 'mongoose';
import Schema from 'mongoose';
import { ObjectId } from 'mongodb';

import {z} from "zod"
import { CartSchema } from "../carts/cart.schema";
@modelOptions({options: {allowMixed:0}})

export class UserTS {
@prop({required:true,unique:true})
email!:string
@prop({required:true})
password!:string
@prop({required:true,default:"user"})
role!:"admin"|"user"
@prop({required:true})
first_name!:string
@prop({required:true})
last_name!:string
@prop({required:true})
age!:number
@prop({ref:()=>CartSchema})
cartId!:Ref<CartSchema>
}
export const objectIdSchema = z.custom<ObjectId>((val)=> {
    if (typeof val === 'string' || typeof val==='number' ||val instanceof ObjectId)
        return ObjectId.isValid(val)
    else return false
})
export const  zodUser = z.object({
    body:z.object({
        email:z.string({ invalid_type_error:"Email Should be a string"}).nonempty("Must provide a mail"),
        password:z.string({invalid_type_error:"Password should be a string"}).nonempty("Must provide a password"),
   })
})

export const  zodCreateUser = z.object({
    body:z.object({
        email:z.string({ invalid_type_error:"Username Should be a string"}).nonempty("Must provide a user"),
        role:z.union([z.literal("admin"),z.literal("user")]),
        password:z.string({invalid_type_error:"Password should be a string"}).nonempty("Must provide a password"),
        password2:z.string({invalid_type_error:"Password should be a string"}).nonempty("Must provide a password"),
        first_name:z.string().min(3,{message:"First name must have at least 3 letters"}),
        last_name:z.string().min(3,{message:"Last name must have at least 3 letters"}),
        age:z.string(),
        cartId:z.any().optional()
}).refine(data=>data.password===data.password2,"Passwords must be Equal")
})

export type zodCreateUserType = z.infer<typeof zodCreateUser>
export type zodUserType =z.infer<typeof zodUser>
