import { NextFunction, Request, Response } from "express";
import { userModel, zodCreateUserType } from './auth.schemas';
import { PassportService } from "./auth.pasport.service";
import { UserDontExist } from "./auth.errors";
const passportService =  new PassportService()
export class AuthController{
    constructor(protected service =passportService){
this.jwtSign=this.jwtSign.bind(this)
this.getGhLogin=this.getGhLogin.bind(this)
this.getLogin=this.getLogin.bind(this)
this.getProfile=this.getProfile.bind(this)
this.getRegister=this.getRegister.bind(this)
this.logout=this.logout.bind(this)
this.validateRol=this.validateRol.bind(this)
}
   
    async getLogin (_req:Request,res:Response){
        res.render("login")
            }
    getGhLogin(_req:Request,res:Response){
        res.render("login")
    }        
    getRegister (_req:Request,res:Response){res.render("register")}
    getProfile (req:Request,res:Response) {
    console.log(req.user,"texto")
    if (req.user !== undefined){
    const data:Omit<zodCreateUserType["body"], "password2">& {createdAt:Date} = req.user as any
        res.render("profile",{user:{email:data.email,role:data.role,createdAt:data.createdAt,name:data.first_name,lastName:data.last_name,age:data.age}})
    }
    }
    validateRol (admitedRoles:zodCreateUserType["body"]["role"]|zodCreateUserType["body"]["role"][]){return (req:Request,res:Response,next:NextFunction)=>{
    console.log("dentro de validateRol",req.user)
    if (req.user !== undefined && "role" in req.user){
        if (Array.isArray(admitedRoles) && admitedRoles.length>0){
            admitedRoles.forEach(item=>{
                if(req.user !== undefined && "role" in req.user) 
                if (item===req.user.role) 
                    {
                    console.log("Autorizado")
                     next()
                    }
})
        }
        if (admitedRoles === req.user.role)  {
            console.log("Autorizado")
            next()
}        else {
    console.log("No Autorizado"	)
    res.send("Unauthorized")}
    }else res.render("login")
    }}
    logout(req:Request,res:Response){
        //req.session.destroy((error)=>res.send({message:"Unable to destroy session",error}))
        res.clearCookie("jwt")
        res.redirect("/auth/login")

    }
    async jwtSign(req:Request,res:Response,next:NextFunction){
        console.log(req.user,"aca estoy")
        if (req.isAuthenticated()){ 
        if ("_id" in req.user)
            {
                const {_id:id}=req.user
                console.log(id,passportService,"empty")
                const lastConection=await  userModel.findByIdAndUpdate({_id:id},{last_connection:new Date()},{new:true})
                if (lastConection ===null) return res.status(401).send(new UserDontExist())
                const response = await  this.service.signJWT(`${id}`)
                res.clearCookie("jwt")
                res.cookie("jwt",response,{secure:true})
                next()
                return
            }else {return res.status(403).send("Authentication failed")
        
        }
        
        }return res.status(403).send("Not Authenticated")
        
        
            
                }
}
