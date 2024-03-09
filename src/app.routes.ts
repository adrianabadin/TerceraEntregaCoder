import { Router } from "express";
export const appRoutes = Router()
import { AppController } from "./app.controller";
const appController = new AppController();
appRoutes.get("/realTimeProducts", appController.realTimeProducts)
appRoutes.get("/addProduct", appController.addProduct)
appRoutes.get("/chat", appController.chat)
appRoutes.get("/logued",appController.loguedUser)
