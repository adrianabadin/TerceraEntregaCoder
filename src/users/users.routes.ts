import { Router } from "express";
import { usersController } from "./users.controller";
import passport from "passport";
import { authController } from "../auth/auth.routes";
export const usersRouter= Router()
usersRouter.get('/',usersController.getUsers)
usersRouter.delete('/',usersController.deleteUsers)
usersRouter.post("/:id/delete",usersController.deleteById)
usersRouter.put('/:id/premium',usersController.setPremiumUser)
usersRouter.put('/:id/admin',usersController.setAdminUser)
usersRouter.post('/:id/updaterol',usersController.updateRolById)
usersRouter.get('/updaterol',passport.authenticate("jwt",{session:false}),authController.jwtSign,authController.validateRol("admin"),usersController.getUpdateRol)
export default usersRouter