import { Request, Response, Router } from "express";
import loggerService from "./logger.service";

export const logRoutes=Router()
logRoutes.get("/test",(req:Request,res:Response)=>{
    console.log("yo")
    loggerService.debug("Debug mode"),
    loggerService.info("Info Mode"),
    loggerService.warning("Warning Mode"),
    loggerService.error("Error Mode"),
    loggerService.fatal("Fatal Mode") 
    res.status(200).send("ok")
})