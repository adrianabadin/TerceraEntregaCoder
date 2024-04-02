import { NextFunction, Request, Response } from "express";
import { loggerService } from "./logger.service";

export class LoggerController{
    constructor(
        protected logger= loggerService
    ){
        this.httpLog=this.httpLog.bind(this);
    }
    async httpLog(req:Request,res:Response,next:NextFunction){
        this.logger.http(`${req.method}: ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
    }
}
export const loggerController=new LoggerController()