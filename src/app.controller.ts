import { Request, Response } from "express";
import { ProductService } from "./products/product.service";
import { Server } from "socket.io";
import { io } from "./app";
// import { httpServer as server } from "./app";
import { ICart, Product } from "./entities/products";
import { Products } from "./products/products.schema";
import { Document } from "mongoose";
import { ChatService } from "./chat/chat.service";
import { ChatMessage } from "./chat/chat.schema";
export class AppController {
    constructor(
        public productsService = new ProductService(),
        protected chatService =new ChatService(),
        public getAllProducts = async (req: Request, res: Response) => {
            try {
                const response = await this.productsService.getData()
                let content: Products[] = [];
                if (response.data !== null && Array.isArray(response.data)) {
                    content = response.data//.map((item:any)=> ({...item.doc,id:`${item.doc["_id" ] as string}`}) )// as Document<Products>[];
                    console.log(content)
                    res.render("index", { content})
                }else res.render("index", { content:[{title:"empty array"}],user:req.user})
                

            } catch (error) { console.log(error) }

        },
        public addProduct = async (req: Request, res: Response) => {
            res.render("addProduct",{user:req.user})
        },
        public realTimeProducts = async (req: Request, res: Response) => {

            io.on("connection", async () => {
                console.log("Real Time Sockets Connected")
                const response = await this.productsService.getData()
                io.emit("data", response)
            })
            res.render("realtime",{user:req.user})

        },
        public chat = async (req: Request, res: Response) => {
            io.on("connection", async (socket) => {
                socket.on("clientMessage",async (data)=>{
                    console.log("Client Message",data)
                    if (data !==null &&"message" in data &&"author" in data){
                        this.chatService.createMessage(data as ChatMessage)
                        socket.emit("serverMessage",data)
                    }
                })

                const data = await this.chatService.getProducts()
                console.log("Chat Socket connected",data)
                if (data !== undefined){
                socket.emit("chatHistoyy",data)}
                io.on("clientMessage",(data)=>{
                    console.log("Client Message",data)
                //     if (data !== null && "message" in data && "author" in data)
                //     {
                //     this.chatService.createMessage(data as ChatMessage)
                // }
                //     socket.emit("serverMessage",data)
                })
            })

            res.render("chat",{user:req.user})
        },
        public loguedUser=(req:Request,res:Response)=>{
            console.log("texto")
            console.log(req.user,"ee")
            res.render("index",{user: req.user && "username" in req.user ? req.user.username as any :null})
        }

    ) { }
}