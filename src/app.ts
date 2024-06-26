import { cartRouter } from "./carts/cart.routes";
import { productRoute } from "./products/products.routes";
import { engine } from "express-handlebars";
import path = require("path");
import cookieParser from "cookie-parser"
import express, { NextFunction, Request, Response } from "express";
import { AppController } from "./app.controller";
import { appRoutes } from "./app.routes";
import http from "http";
import { Server } from "socket.io";
import Session from "express-session"
import MongoDBStore from "connect-mongodb-session"
import { authRouter } from "./auth/auth.routes";
import "./auth/auth.passport.local"
import "./auth/auth.passport.gh"
import "./auth/auth.passport.jwt"
import {z} from "zod"
import passport = require("passport");
import { mailRouter } from "./mailing/mailing.routes";
import  loggerService  from "./services/logger.service";
import { logRoutes } from "./services/logger.routes";
import { loggerController } from "./services/logger.controller";
import  usersRouter  from "./users/users.routes";
import ticketRouter from "./Ticket/ticket.routes";
declare module 'express-session' {
    interface SessionData {   
      user: string;
      role:string;
    }
  }
const dotEnvSchema = z.object({
  connection :z.string().min(1,{message:"Must provide a connection string"}),
  id:z.string().min(1,{message:"Must provide an id for github oAuth"}),
  secret :z.string().min(1,{message:"Must provide a a secret for gitHub oAuth"}),
  callback:z.string().url({message:"Must provide a valid callback for github oAuth"}),
  gmail:z.string().min(3,{message:"Must provide a gmail account key"}),
  gmailUser:z.string().email(),
  NODE_ENV:z.enum(["dev","prod"]),
  

})
dotEnvSchema.parse(process.env)
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof dotEnvSchema> {}
  }
}
const connectionString=process.env.connection
const store =  MongoDBStore(Session)
const session =Session({
  resave:true,saveUninitialized:false,
  secret:"some pass",
  cookie:{maxAge:1000*60*60*24},
  store: new store({uri:connectionString,collection:"My Sessions"})})


const app = express();
const httpServer = http.createServer(app);
export const io = new Server(httpServer); // <- Aquí creamos el servidor de Socket.io
io.engine.use((req:Request, res:Response, next:NextFunction) => {
  if (!("_query" in req && typeof req._query==="object" &&req._query !==null && "sid" in req._query && req._query.sid !== undefined))
  {
    passport.authenticate("jwt", { session: false })(req, res, next);  
  }else next()
}
);
const appController = new AppController();
app.use(express.static(process.env.NODE_ENV === "dev"?'src/public':'public'));
app.engine("handlebars", engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const PORT = 8085;
app.use(session)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(appRoutes);
app.use(loggerController.httpLog)
app.use("/api/", productRoute);
app.use("/api/carts", cartRouter);
app.use("/api/users",usersRouter)
app.use("/api/tickets",ticketRouter)
app.use("/auth",authRouter)
app.use("/mail/",mailRouter)
app.use("/loggerTest",logRoutes)
app.use(appController.getAllProducts);

io.on('connection', (socket) => { // <- Aquí manejamos las conexiones
  loggerService.info("Socket Connected")  
  //console.log('a user connected');
});

httpServer.listen(PORT, () => loggerService.info(`Connected to port ${PORT}`));


// import { cartRouter } from "./carts/cart.routes";
// import { productRoute } from "./products/products.routes";
// import { engine } from "express-handlebars";
// import { Server } from "socket.io";
// import path = require("path");
// import express, { Request, Response } from "express"
// import { AppController } from "./app.controller";
// import { appRoutes } from "./app.routes";
// import http from "http";

// const app = express();
// export const httpServer = http.createServer(app)

// const appController = new AppController()
// app.use(express.static('src/public'))
// app.engine("handlebars", engine())
// app.set('view engine', 'handlebars')
// app.set('views', './views')
// const PORT = 8080
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
// app.use(appRoutes)
// app.use("/api/", productRoute)
// app.use("/api/carts", cartRouter)
// app.use(appController.getAllProducts)
// httpServer.listen(PORT, () => console.log(`Connected to port ${PORT}`))
