import { Router } from "express";
export const appRoutes = Router()
import { AppController } from "./app.controller";
import { AuthController } from './auth/auth.controller';
import passport from "passport";
const appController = new AppController();
const authController= new AuthController()
appRoutes.get("/realTimeProducts", appController.realTimeProducts)
appRoutes.get("/addProduct", appController.addProduct)
appRoutes.get("/chat",passport.authenticate("jwt"),authController.validateRol("user") ,appController.chat)
appRoutes.get("/logued",appController.loguedUser)
