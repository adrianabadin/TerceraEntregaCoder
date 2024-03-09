import { BeAnObject, IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types';
import  {Document} from "mongoose"
import { ResponseObject } from '../entities/classes';
import { TypegooseDAO } from "../services/typegoose.dao";
import { UserTS, zodCreateUserType, zodUserType } from './auth.schemas';
import * as argon from "argon2"
import { Types } from 'mongoose';
import { CartService } from '../carts/cart.service';
const pm =new TypegooseDAO<Omit<zodCreateUserType["body"],"password2">>(UserTS,"UserTG")
export class AuthService {
    constructor(public service = pm,protected cartService = new CartService()){
      
    }
    async registerUser (user:zodCreateUserType["body"]):Promise<ResponseObject<unknown>>{
        try{
            let cartData = await this.cartService.createCart([])
            let data
            if (cartData.data !== undefined && typeof cartData.data ==="object"&& cartData.data !== null && "_id" in cartData.data){
             data = await this.service.addProduct({...user,password:await argon.hash(user.password),cartId:`${cartData.data._id}`})}

            if (data !== undefined) {
                 return new ResponseObject(null,true,data)
            }else return new ResponseObject("Error Creating User",false,null)
        }catch(error){
            console.log(error)
            return new ResponseObject(error,false,null)
        }
    }
    async loginUser(user:zodUserType["body"]):Promise<ResponseObject<(Document<unknown, BeAnObject, Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        first_name: string;
        last_name: string;
        age: number;
        password2: string;
        cartId?: any;
    }, "password2">>)>| ResponseObject<null>>{
        try{
           const data=await this.service.model.findOne({email:user.email})
           if(data !==undefined && data !== null && typeof data.email ==="string" && data.email === user.email){
               
            if (await argon.verify(data.password,user.password)) return new ResponseObject(null,true,data)
                else return new ResponseObject("Password not Match",false,null)
           }else return new ResponseObject("User not Found",false,null)
        }catch(error){
            console.log(error)
            return new ResponseObject(error,false,null)
        }
    }

}