import passport from 'passport'
import { Strategy } from 'passport-local'
import { PassportController } from './auth.passport.controller'
const authController = new PassportController()
passport.use('login', new Strategy({usernameField:"email",  passReqToCallback: true,session:true, }, authController.localLogin))
passport.use('register', new Strategy({usernameField:"email", passReqToCallback: true,session:true }, authController.localSignUp))
passport.serializeUser(authController.serialize)
passport.deserializeUser(authController.deSerialize)