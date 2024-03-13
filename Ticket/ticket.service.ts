import { ReturnModelType } from "@typegoose/typegoose";

import { BeAnObject, Ref } from "@typegoose/typegoose/lib/types";
import { Products } from "../src/products/products.schema";
import { v4 } from "uuid";
import { cartModel, newTicket } from "../src/carts/cart.schema";
import mongoose from "mongoose";


export class TicketService {
    constructor(protected model:ReturnModelType<typeof newTicket,BeAnObject>=newTicket){
        this.createTicket=this.createTicket.bind(this);
    }
   async createTicket(cartData:{
    totalPrice: number;
    _id: string;
    products: {
        quantity: number;
        pid: Products & {
            _id: string;
        };
    }[]},userId:string){
       try{
        const key= v4()
        console.log(key,userId,cartData)
        const response = new newTicket({amount:cartData.totalPrice,purchaser:userId})
        const cart=(await (await  cartModel.findById(cartData._id))?.populate({path:"products",populate:{path:"pid"}}))
        if (cart !== undefined){
        const leanCart:{_id:string,products:{quantity:number,pid:Products&{_id:string}}[]}= cart?.toJSON() as {_id:string,products:{quantity:number,pid:Products&{_id:string}}[]}
        leanCart?.products.filter(item=> item.quantity>item.pid.stock)
        cart.products=leanCart.products  as any
        cart.save()
        return response
    }
    }catch(error){console.log(error)}
    }
}
export const ticketService = new TicketService(newTicket)