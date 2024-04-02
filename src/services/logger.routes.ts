import { Request, Response, Router } from "express";
import loggerService from "./logger.service";

export const logRoutes=Router()
logRoutes.get("/",(req:Request,res:Response)=>{
    loggerService.debug("Debug mode"),
    loggerService.info("Info Mode"),
    loggerService.warning("Warning Mode"),
    loggerService.error("Error Mode"),
    loggerService.fatal("Fatal Mode") 
    res.status(200).send("ok")
})