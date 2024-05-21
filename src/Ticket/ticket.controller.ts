import { Request, Response } from "express";
import { ticketService } from "./ticket.service";

class TicketController {
    constructor(protected service= ticketService){
        this.getTickets=this.getTickets.bind(this);
    }
    async getTickets(req:Request,res:Response){
        const response =await  this.service.getTickets()
        return res.status(200).send(response)
    }
}
export const ticketController= new TicketController()