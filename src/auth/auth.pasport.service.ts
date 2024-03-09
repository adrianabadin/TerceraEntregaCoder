import { getModelForClass } from "@typegoose/typegoose";
import { ResponseObject } from "../entities/classes";
import {TypegooseDAO}  from "../services/typegoose.dao"
import { UserTS, zodCreateUserType, zodUserType } from './auth.schemas';
import {sign} from "jsonwebtoken"
const dbServiceObject = new TypegooseDAO<Omit<zodCreateUserType["body"],"password2">>(UserTS,"UserTG")

export class PassportService {
    constructor(){
        this.findByEmail=this.findByEmail.bind(this)
        this.createUser=this.createUser.bind(this)
        this.signJWT=this.signJWT.bind(this)
        this.findById=this.findById.bind(this)
    }
    async findByEmail(email:string){
        try {
            const userModel = await getModelForClass(UserTS)
            const user = await userModel.findOne({email})
            return user
        }catch(error){
            console.log(error)
        }
    }
    async signJWT(id:string){
        try{
            const response = sign({id,date:new Date()},"Tokenize your life")
            return response
        }catch(error){console.log(error)}
    }
    async createUser(userData:zodCreateUserType["body"]){
        try{
            const userModel = await getModelForClass(UserTS)
            const user= userModel.create({...userData,password2:undefined})
            return user
        }catch(error){console.log(error)}
    }
    async findById(id:string){
        try{
            const userModel =await getModelForClass(UserTS)
            const user = await userModel.findById(id)
            return user
        } catch(error){console.log(error)}
    }
}
