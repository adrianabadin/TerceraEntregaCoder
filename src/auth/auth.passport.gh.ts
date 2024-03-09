import passport from 'passport'
import { Strategy } from 'passport-github2'
import { PassportController } from './auth.passport.controller'
import dotenv from "dotenv"
dotenv.config()
const passportController =new PassportController()
passport.use("github",
    new Strategy
        (
        {
            clientID:process.env.id as string,
            clientSecret:process.env.secret as string,
            callbackURL:process.env.callback as string
        },
        passportController.gitHubLogin
        )
        )