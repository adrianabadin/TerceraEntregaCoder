import { Request,Response } from "express";
import { MailBody } from "./mailing.schemas";
import { MailService, mailService } from "./mailing.service";

class MailingController {
    constructor(protected MailService:MailService= mailService){
        this.sendMail=this.sendMail.bind(this);
    }
    async sendMail(req:Request<any,any,MailBody["body"]>,res:Response){
const {content,subject,to}=req.body
        const response = await this.MailService.sendEmail(to,subject,content)
        if (response instanceof Error) res.status(500).send(response)
        else res.status(200).send(response)


    }
}

export const mailingController = new MailingController();