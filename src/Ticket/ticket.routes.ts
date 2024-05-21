import { Router } from 'express';
import { ticketController } from './ticket.controller';
const ticketRouter= Router()
ticketRouter.get("/",ticketController.getTickets)
export default ticketRouter