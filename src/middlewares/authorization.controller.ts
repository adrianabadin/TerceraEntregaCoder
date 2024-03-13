import { Request, Response, NextFunction } from 'express';
import { zodCreateUserType } from "../auth/auth.schemas";
import { CartSchema, Product } from "../carts/cart.schema";
import { ChatMessage } from "../chat/chat.schema";
import { Products } from "../products/products.schema";
import { TypegooseDAO } from "../services/typegoose.dao";

class AuthorizationController<T extends Omit<zodCreateUserType["body"],"password2">> {
    constructor(protected DAO:TypegooseDAO<T>){
        this.DAO=DAO
    }
async authorizeUser(req:Request,res:Response,next:NextFunction){
    if (req.use)
}
}
