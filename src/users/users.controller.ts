import { Request, Response } from "express";
import { UserError } from "./users.errors";
import { userService } from "./users.service";
import { UserTS } from "../auth/auth.schemas";
import { UserNotAuthenticated } from "../auth/auth.errors";

class UsersController {
    constructor(protected service=userService){
        this.getUsers=this.getUsers.bind(this);
        this.deleteUsers=this.deleteUsers.bind(this);
        this.setAdminUser=this.setAdminUser.bind(this)
        this.setPremiumUser=this.setPremiumUser.bind(this)
        this.deleteById=this.deleteById.bind(this)
        this.updateRolById=this.updateRolById.bind(this)
        this.getUpdateRol=this.getUpdateRol.bind(this)

    }
    async getUpdateRol(req:Request,res:Response){
        const {role:rol,_id:id,last_name,first_name} = req.user as UserTS &{_id:string}
        if (id === undefined || rol === undefined || last_name===undefined|| first_name=== undefined) throw new UserNotAuthenticated()
        res.render('userupdate',{id,rol,nombre:`${first_name} ${last_name}`})

    }
    async updateRolById(req:Request,res:Response){
        const {id} = req.params
        const {rol} = req.body
        if (id === undefined) return res.status(404).send("Must provide an Id")
        if (rol===undefined)     return res.status(404).send("Must provide a rol")
        const response = await this.service.updateRolById(id,rol)
        if (response instanceof UserError) return res.status(500).send(response)
        res.clearCookie("jwt")
        res.clearCookie("connect.sid")

            return res.status(200).send(response)

        
    }
    async getUsers(req:Request,res:Response){
        const response = await this.service.getUsers()
        if (response instanceof UserError) return res.status(500).send(response)
        return res.status(200).send(response)    
    }
async deleteById(req:Request,res:Response){
    const {id} = req.params
    if (id === undefined) return res.status(404).send("Must provide an valid id")
    const response = await this.service.deleteById(id)
if (response instanceof UserError) return res.status(500).send(response)
    else return res.status(200).send(response)
}
    async deleteUsers(req:Request,res:Response){
        const response= await this.service.deleteUsers()
        console.log(response,"controller")
        if (response instanceof UserError) return res.status(500).send(response)
        return res.status(200).send({...response})//redirect('/')
    }

    async setAdminUser(req:Request,res:Response){
        const {id} = req.params
        if (id === undefined) return res.status(404).send(new Error('ID is missing'))
        const response= await this.service.setAdmin(id)
        if (response instanceof UserError) return res.status(500).send(response)
        return res.status(200).send(response)
    }

    async setPremiumUser(req:Request,res:Response){
        const {id} = req.params
        if (id === undefined) return res.status(404).send(new Error('ID is missing'))
        const response= await this.service.setPremium(id)
        if (response instanceof UserError) return res.status(500).send(response)
        return res.status(200).send(response)
    }
    
}

export const usersController= new UsersController()