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
import { appService } from "./app.service";
import { ProductError } from "./products/products.errors";
import { UserNotAuthenticated } from "./auth/auth.errors";
import { CartError } from "./carts/carts.errors";
export class AppController {
    constructor(
        public productsService = new ProductService(),
        protected app=appService,
        protected chatService =new ChatService(),
        public getMock=async (req: Request, res: Response)=>{
            const content= await this.app.getProductMocks()
            res.render("index",{content})
        },
        public getAllProducts = async (req: Request, res: Response) => {
            
                const response = await this.productsService.getData()
                if (response instanceof ProductError) return res.status(500).send(response)
                let content: any[]= [];
                    content = response//.map((item:any)=> ({...item.doc,id:`${item.doc["_id" ] as string}`}) )// as Document<Products>[];
                    if (req.user === undefined ) return res.redirect("/auth/login") //.status(401).send(new UserNotAuthenticated())
                    const user:any= req.user
                    if (!( "cartId" in user)) return res.redirect("/auth/login")//.status(401).send(new UserNotAuthenticated())
                else   return res.render("index", {content:content.map(item=>({cid:user.cartId ,stock:item["stock"],code:item["code"],thumbnail:item["thumbnail"],price:item["price"],description:item["description"],id:item["_id"],title:item["title"]}))})
                

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
        },
        public getCart=async (req:Request,res:Response)=>{
            const {cartId} =req.user as any
            if (cartId === undefined) return res.status(401).send(new UserNotAuthenticated())
            const data:any=await this.app.getCart(cartId)
        if (data instanceof CartError)return  res.status(404).send(data)
            const products:(Product&{quantity:number})[]=data?.products.map((product:{pid:Product[],quantity:number})=>({...product.pid,quantity:product.quantity}))
            return res.render("cart",{cid:cartId,product:products.map(product=>({title:product.title,price:product.price,quantity:product.quantity}))})
        }

    ) { }
}