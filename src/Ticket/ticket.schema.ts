import { Ref, getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import mongoose from "mongoose"
import { CartSchema } from "../carts/cart.schema"

@modelOptions({options:{allowMixed:0}})
export class Ticket2{
    @prop({ref:(()=>CartSchema)})
    public cid!:Ref<CartSchema>
    @prop({required:true,default:0})
    public amount!:number
    @prop({required:true})
    public purchaser!:string
    @prop({required:true,default:new mongoose.mongo.ObjectId(),unique:true})
    public code!:string
    @prop({required:true,default:new Date()})
    public purchased_datatime!:Date
    
}
export const newTicket = getModelForClass(Ticket2,{schemaOptions:{timestamps:{createdAt:"purchased_datatime"}}})
