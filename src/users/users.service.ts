import { UserDontExist } from "../auth/auth.errors";
import { userModel } from "../auth/auth.schemas";
import { mailService } from "../mailing/mailing.service";
import { UserDTO } from "./users.DTO";
import { NoUserFoundError, UnknownUserError, UserError } from './users.errors';

class UsersService {
    constructor(
        protected db=userModel,
        protected mail=mailService
    ){
        this.getUsers=this.getUsers.bind(this);
        this.deleteUsers=this.deleteUsers.bind(this);
        this.setAdmin=this.setAdmin.bind(this);
        this.setPremium=this.setPremium.bind(this);
        this.deleteById=this.deleteById.bind(this);
        this.updateRolById=this.updateRolById.bind(this);

    }
    async updateRolById(id:string,rol:"admin"|"premium"|"user"){
        try{
            const response = await this.db.findByIdAndUpdate(id,{role:rol},{new:true})
            if (response === null) throw new UserDontExist()
            else return response
        }catch(e){
            if (e instanceof UserError) return e
            else return new UnknownUserError(e)
        }
    }
async getUsers(){
    try{
    const response =(await this.db.find({}))
    if (response === null || response.length===0) throw new NoUserFoundError()
    console.log(response,"users")
        return response.map(item=>new UserDTO(`${item.first_name} ${item.last_name}`,item.role,item.email))
}catch(err){
    return new NoUserFoundError(err)
}

}
async setAdmin(id:string){
try{
    const response =await  userModel.findById({_id:id})
    if (response === null) throw new UserDontExist()
    if (response.role === "admin") response.role="user"
    else response.role="admin"
    response.save()
    return response
}catch(e){
    if (e instanceof UserError) return e
    else return new UnknownUserError(e)
}
}
async setPremium(id:string){
    try{
        const response =await userModel.findById({_id:id})
        if (response === null) throw new UserDontExist()
        if (response?.role === "premium" ) response.role="user"
        else response.role="premium"
        response.save()
        return response
    }catch(e){
        if (e instanceof UserError) return e
        else return new UnknownUserError(e)
    }
    }
    async deleteById(id:string){
        try {
            const response = userModel.findByIdAndDelete(id)
            if (response === null) throw new UserDontExist()
                return response
        }catch(e){
            if (e instanceof UserError) return e
            else return new UnknownUserError(e)

        }
    }
async deleteUsers(){
    try{
        const date= new Date("2024-05-21T05:20:00.254Z")
      //  date.setDate(date.getDate()-30)
        //date.setDate("2024-05-21T04:59:26.481Z")
        const usuarios= await userModel.find({last_connection:{$lt:date}})
        console.log(date,usuarios,"service")
        if (usuarios !== null)
            {
                usuarios.forEach(user=>{
                    const response =this.mail.sendEmail(user.email,"Su usuario fue eliminado por inactividad","Por ser un muy ma cliente no te queremos mas deberias haber comprado mas!!!!")
                    console.log(response,"mailed")
                })
                    
            }
        const response = await userModel.deleteMany({last_connection:{$lt:date}})
        return response
    }catch(err){
        return new UnknownUserError(err)
    }
}
}
export const userService = new UsersService()