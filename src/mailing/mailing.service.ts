import {Transporter, createTransport} from "nodemailer"
import dotenv from 'dotenv';
import SMTPTransport from "nodemailer/lib/smtp-transport";
dotenv.config()
export const transport = createTransport({
    service:"gmail",
    port:587,
    auth:{
        user:"aabadin@gmail.com",
        pass:process.env.gmail
    }
})

export class MailService {
    constructor(protected transportService: Transporter<SMTPTransport.SentMessageInfo> = transport){
        this.sendEmail=this.sendEmail.bind(this)
    }
    async sendEmail(to:string,subject:string,content:string){
        try{
            const response = await this.transportService.sendMail({
                to,subject,html:`
                <h1>CoderHouse Feat</h1>
                <h2>By Adrian Abadin</h2>
                <p>${content}</p>
                `
            })
            return response
        }catch(error){
            console.log(error)
            return new Error(`${error}`)
        }
    }
}
export const mailService = new MailService()