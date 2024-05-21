import { ReturnModelType } from "@typegoose/typegoose";

import { BeAnObject, Ref } from "@typegoose/typegoose/lib/types";
import { Products } from "../products/products.schema";
import { v4 } from "uuid";
import { cartModel } from "../carts/cart.schema";
import mongoose from "mongoose";
import { newTicket } from "./ticket.schema";


export class TicketService {
    constructor(protected model=newTicket){
        this.createTicket=this.createTicket.bind(this);
        this.getTickets=this.getTickets.bind(this);
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
        const cart=(await (await  cartModel.findById(cartData._id))?.populate({path:"products",populate:{path:"pid"}}))
        const response = await newTicket.create({amount:cartData.totalPrice,purchaser:userId,cid:cartData._id})
        response.save()
        if (cart !== undefined){
        const leanCart:{_id:string,products:{quantity:number,pid:Products&{_id:string}}[]}= cart?.toJSON() as {_id:string,products:{quantity:number,pid:Products&{_id:string}}[]}
        leanCart?.products.filter(item=> item.quantity>item.pid.stock)
        cart.products=leanCart.products  as any
        cart.save()
        return response
    }
    }catch(error){console.log(error)}
    }
    async getTickets (){
        try{
            const response =await newTicket.find({})
            console.log(response,"service XXXXXXXXXXXXXXXX")
            return response
        }catch(e){console.log(e)}
    }
}
export const ticketService = new TicketService(newTicket)