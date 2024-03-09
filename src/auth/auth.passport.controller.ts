import { Request } from "express"
import { PassportService} from "./auth.pasport.service"
import * as argon from "argon2"
import { DoneCallback } from "passport"
import passport from 'passport';
import { zodCreateUserType } from "./auth.schemas";
import { CartService } from "../carts/cart.service";
import { DeserializeError, UserCreateError, UserDontExist, WrongPassword } from "./auth.errors";
const passportService = new PassportService()
const cartService= new CartService()
export class PassportController {
    constructor (
        protected passportServicedb= passportService    ){
            this.jwtLoginVerify=this.jwtLoginVerify.bind(this)
        }

        async localLogin(req:Request,email:string,password:string,done:(error:any,data:any,...args:any)=>any){
try{
        const data = await passportService.findByEmail(email)
        if (data !==undefined){
            const response = data
            if (response !== null&& typeof response ==="object" && "password" in response){
                if (await argon.verify(response.password,password)){
                    return done(null,response)
                }else throw new WrongPassword()
            }else throw new UserDontExist()
        }else throw new UserDontExist()
}catch(e){
    console.log(e)
    return done(e,null)
}
    }
    async localSignUp(req:Request<any,any,zodCreateUserType["body"]>,email:string,password:string,done:(error:any,data:any,...args:any)=>any){
        try{
            console.log(email)
            const data =await passportService.findByEmail(email)
            // si el usuario fue encontrado entonces retorna user exist error
            if (data !== null){
                console.log(data)
                    return done(new Error("User Alrready exists"),null)
            }else {
                //aqui va el codigo que crea el usuario 
                const cartData = await cartService.createCart()
                
                let response
                if (cartData.data !== undefined && typeof cartData.data ==="object"&& cartData.data !== null && "_id" in cartData.data) {
                    
                 response = await passportService.createUser({...req.body,password:await argon.hash(password),cartId:cartData.data._id})
                }
                if(response !== undefined && response !==null){
                    if (typeof response === "object" && response !==null&& "_id" in response)
                    {
                        return done(null,response)
                    }else return done(new UserCreateError(),null)
                }
            }
        }catch(e){
            console.log(e)
return done(e,null)

        }
    }
    async serialize(user:any,done:DoneCallback){
        done(null,user._id)
    }
    async deSerialize(userId:string,done:DoneCallback){
        const data= await passportService.findById(userId)
        if (data !== undefined && data !== null){

            done (null,data)
        }else done(new DeserializeError(),null)
    }
    async gitHubLogin(accesstoken:string,refreshtoken:string,profile:any,cb:DoneCallback){
        try{
 
            if (profile !== null &&typeof profile =="object" && "_json" in profile && "email" in profile._json) {
                const username = profile["_json"].email as string
                const data = await passportService.findByEmail(username.toLowerCase())
                console.log(data,username)
                if (data !== undefined && data!== null){
                    const response = data
                    if (response !== null && typeof response ==="object" && "_id" in response){
                        return cb(null,response)

                    } else{
                        throw new UserDontExist()
                    }
                }else throw new UserDontExist()
            }else throw new UserDontExist()
            

        }catch(e){
            console.log(e)
            return cb(e,null)

        }

    }
    async jwtLoginVerify(req: Request, jwtPayload: {id:string}, done: (...args:any)=>void) {
        try{
            
            const user =await this.passportServicedb.findById(jwtPayload.id)
              if (user !==null){    
                done(null,user)}
                   else throw new UserDontExist() 
        }catch(error){
            console.log(error)
            done(error,null)
        }
    }
}