import { Cart, ResponseObject } from '../entities/classes';
import { ICartService, IProductService } from "../entities/products";
import { ProductManager } from "../services/fs.dao";
import { Response } from 'express';
import { TypegooseDAO } from "../services/typegoose.dao";
import { CartSchema, ProductItem, cartModel, newTicket, productItemModel } from './cart.schema';
import { FilterQuery } from 'mongoose';
import { Ref, getModelForClass } from '@typegoose/typegoose';
import { Products, productModel } from '../products/products.schema';
import { UserTS, zodCreateUserType } from '../auth/auth.schemas';
import { logger } from '@typegoose/typegoose/lib/logSettings';
import { ObjectId } from 'mongodb';
import { TicketService, ticketService } from '../../Ticket/ticket.service';

const productManager = new ProductManager<Cart>("./src/carts/carts.json")
const pm  = new TypegooseDAO<CartSchema>(CartSchema,'carts')
const userDb = new TypegooseDAO<Omit<zodCreateUserType["body"],"password2">>(UserTS as any,"UserTG")
const ticket= new TicketService()
export class CartService<T extends {pid:string,quantity:number}>  {
    constructor(
        protected dao = pm ,//productManager,
        protected userDao=userDb,
        protected ticketService:TicketService=ticket,
        public createCart = async (products: T[]) => {
          //  const cartObject = new Cart(products)
            try {
                const response = await this.dao.addProduct({products:products as any})
                if (response !== undefined) {
                    return new ResponseObject(null, true, response)
                } else return new ResponseObject("Crasheeed", false, null)
            } catch (error) {
                console.log(error)
                return new ResponseObject(error, false, null)
            }

        },
        public getCarts = async (limit?: number,page?:number,sort?:{field:keyof CartSchema,descending:boolean},query?:FilterQuery<CartSchema>) => {
            try {
                const response = await this.dao.getProducts(limit,page,sort,query)
                if (response !== undefined) {
                    return new ResponseObject(null, true, response)
                } else return new ResponseObject("SOmething went Wrong", false, null)


            } catch (error) {
                console.log(error)
                return new ResponseObject(error, false, null)

            }
        },
        public validateCart=async(email:string,cid:string)=>{
            try{
                const user = await this.userDao.model.findOne({email})
                console.log(user,cid)
                    if (`${user?.cartId}` === cid) return true 
                else return false 
            }catch(error){console.log(error)
            return false
            }
        },
        public getById = async (id: string) => {
            try {
                const response = await this.dao.getProductById(id)
                if (response !== undefined) {
                    return new ResponseObject(null, true, response)
                } else return new ResponseObject("SOmething went wrong", false, null)

            } catch (error) {
                console.log(error)
                return new ResponseObject(error, false, null)
            }
        },
        public addProductById = async (id: string, product: {pid:string,quantity:number}) => {
            try {
                const cartData = await this.dao.getProductById(id)
                if (cartData !== undefined && cartData!==null && "products" in cartData && Array.isArray(cartData.products))  {
                    const productData = cartData.products.findIndex((productField:any) => product.pid === `${productField._id}`)
                    if (productData !== -1) {
                        const tempProduct=  productItemModel
                        const response = await tempProduct.findById(product.pid)
                        if (response !==null)
                        response.quantity++
                    } else {
                        const tempProduct= new productItemModel()
                        tempProduct.pid=product.pid as any
                        tempProduct.quantity=product.quantity
                        tempProduct.save()
                        console.log(cartData,"aca explota?")
                        //cartData.products=[...cartData.products,product] as any
                        //cartData.products.push({pid:product.pid as unknown as Ref<Products>,quantity:product.quantity})
                        cartData.products.push(tempProduct._id)
                        cartData.save()
                        console.log("aca+",cartData)
                    }
                    const response = await this.dao.updateProduct(id, cartData)
                    if (response !== undefined) {
                        return new ResponseObject(null, true, response)
                    } else return new ResponseObject("Caboom", false, null)
                }
            } catch (error) {
                console.log(error)
                return new ResponseObject(error, false, null)
            }
        }
    ) {
        //this.getCartProducts=this.getCartProducts.bind(this)
        this.getCartProducts=this.getCartProducts.bind(this)
        this.purchase=this.purchase.bind(this)
        
     }
async deleteCartProduct(cid:string,pid:string){
    try{
    const data = this.dao.model.updateOne({_id:cid},{$pull:{products:{pid}}})
    return new ResponseObject(null,true,data)
}catch(e){console.log(e)
return new ResponseObject(e,false,null)
}
}
async deleteCartProducts(cid:string){
    try{
    const data = this.dao.model.updateOne({_id:cid},{$pullAll:{products:{}}})
    return new ResponseObject(null,true,data)
}catch(e){console.log(e)
return new ResponseObject(e,false,null)
}
}
async updateProducts(cid:string,products:T[]){
    try{
        const data = await this.dao.model.updateOne({_id:cid},products)
        return new ResponseObject(null,true,data)
    }catch(e){
        console.log(e)
        return new ResponseObject(e,false,null)
    }
}
async decreaseStockBy(pid:string,quantity:number){
    try{
        return await productModel.updateOne({_id:pid},{$inc:{stock:-quantity}})
    }catch(error){console.log(error)}
}
async updateCartProductQuantity(cid:string,pid:string,quantity:number){
    try{
        const data = await this.dao.model.updateOne({_id:cid,products:{pid}},{quantity})
        return new ResponseObject(null,true,data)
    }catch(e){console.log(e)
    return new ResponseObject(e,false,null)
    }
}
async getCartProducts<T>(cid:string){
try{
    const cartModel= await getModelForClass(CartSchema)

const data =await (await (await cartModel.findById(cid))?.populate({path:"products",populate:{path:"pid"}}))//?.populate({path:"product"}) //(cid) //.model.findById(cid)//.populate("products.pid")
const prod:{_id:string,products:{quantity:number,pid:Products&{_id:string}}[]}= data?.toJSON() as {_id:string,products:{quantity:number,pid:Products&{_id:string}}[]}
//const products:{pid:Products &{_id:string},quantity:number}[]=prod?.products as {pid:Products&{_id:string},quantity:number}[]

return prod
}catch(e){console.log(e)
return new Error(`${e}`)
}
}
async validateStock(data:{
        _id: string;
    products: {
        quantity: number;
        pid: Products & {
            _id: string;
        };
    }[]}){
        try{
        const items =data.products.filter(item=>item.quantity<=item.pid.stock)
        const result= items.map(item=>{
            console.log(item)
            return item.quantity*item.pid.price
        }).reduce((acc,cur)=>acc+cur,0)
        console.log(result)
        data.products=items
        return {...data,totalPrice:result}
    }catch(error){console.log(error); return new Error(`${error}`)}
    }
async purchase (cid:string,userId:string){
    try{
        //const cartData=await this.dao.getProductById(cid)
        const cartData=await this.getCartProducts(cid)
        console.log(cartData,"purchase")
        if (cartData instanceof Error ){throw cartData}
        else{
        const validatedCart=await this.validateStock(cartData)
        if (validatedCart instanceof Error) throw validatedCart
        else
        {//const cosa= new newTicket({amount:3,purchaser:"o"}).save()
            const data= await this.ticketService.createTicket(validatedCart,userId)
        return data
        }
    }
        
    }
    catch(error){console.log(error)}
}

}