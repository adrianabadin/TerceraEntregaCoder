import mongoose, { model } from "mongoose";
import { ChatMessage } from "./chat.schema";
import { TypegooseDAO } from "../services/typegoose.dao";

export class ChatService extends TypegooseDAO<ChatMessage>{
       
    constructor(
        public createMessage=async (message:ChatMessage)=>{
           const data =await this.addProduct(message)
           return data
        },
        public getMessages=async()=>{
            const data= await this.getProducts()
            return data
        }
    ){
super(ChatMessage,"messages")}
}