import { Strategy,ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Request } from "express";
import { PassportController } from "./auth.passport.controller";
import { TokenError } from "./auth.errors";
const passportController= new PassportController()
function cookieExtractor(req:Request):string{
    if ( req.headers.authorization !== undefined ) {
        console.log("coso",req.headers.authorization)
        return req.headers.authorization
    }
    if ("jwt" in req.cookies && typeof req.cookies.jwt === "string"){
        return req.cookies.jwt
} 
throw new TokenError()
}
passport.use('jwt',
    new Strategy(
        {
            passReqToCallback:true,
            jwtFromRequest:ExtractJwt.fromExtractors(
                [
                    ExtractJwt.fromAuthHeaderAsBearerToken(),cookieExtractor
                    ]
                    ),
            secretOrKey:"Tokenize your life"}, 
            passportController.jwtLoginVerify))