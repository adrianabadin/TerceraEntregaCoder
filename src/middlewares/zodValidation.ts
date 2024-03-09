import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateSchema=(schema:AnyZodObject)  => (req:Request,res:Response,next:NextFunction) =>{
try{
    console.log(req.body)
    schema.parse({
        body:req.body,
        params:req.params,
        query:req.query
})
next()
}catch(error){
console.log(error)
res.send(error)
}

}