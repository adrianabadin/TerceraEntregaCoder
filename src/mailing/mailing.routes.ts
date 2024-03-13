import { Router } from "express";
import { mailingController } from "./mailing.controller";
export const mailRouter = Router()

mailRouter.post("/",mailingController.sendMail)