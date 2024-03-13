import { Router } from "express";
import { mailingController } from "./mailing.controller";
import { validateSchema } from "../middlewares/zodValidation";
import { mailBody } from "./mailing.schemas";
export const mailRouter = Router()

mailRouter.post("/",validateSchema(mailBody),mailingController.sendMail)