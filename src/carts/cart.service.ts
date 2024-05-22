import { Cart, ResponseObject } from '../entities/classes';
import { ProductManager } from "../services/fs.dao";
import { TypegooseDAO } from "../services/typegoose.dao";
import { CartSchema, ProductItem, cartModel,  productItemModel } from './cart.schema';
import { FilterQuery } from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import { Products, productModel } from '../products/products.schema';
import { UserTS, zodCreateUserType } from '../auth/auth.schemas';
import { TicketService } from '../Ticket/ticket.service';
import { ProductError, ProductNotFound } from '../products/products.errors';
import { CartError, CartNotFound, UnknownCartError } from './carts.errors';
import { PremiumUserCanBuy, UserError } from '../users/users.errors';

const productManager = new ProductManager<Cart>("./src/carts/carts.json")
const pm  = new TypegooseDAO<CartSchema>(CartSchema,'carts')
const userDb = new TypegooseDAO<Omit<zodCreateUserType["body"],"password2">>(UserTS as any,"UserTG")
const ticket= new TicketService()
export class CartService<T extends {pid:string,quantity:number}>  {
    constructor(
        protected dao = pm ,//productManager,
        protected userDao=userDb,
        protected cart=cartModel,
        protected product=productModel,
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
        public addProductById = async (email:string,role:string,id: string, product: {pid:string,quantity:number}) => {
            try {
                //falta limitar la compra de usuarios premium que no pueden agregar productos propios
                const productData = await this.product.findById({_id:product.pid})
                if (productData === null) throw new ProductNotFound()
                if (role === "premium"){
                    console.log("premium user")
                    if (productData.owner ===email){
                        console.log("premium and owner")
                        throw new PremiumUserCanBuy()
                    }
                }
                const cartData = await this.cart.findById({_id:id}).populate({path:"products",populate:{path:"pid",model:"Products"}}).exec() //await this.dao.getProductById(id)
                if (cartData === null ) throw new CartNotFound()
                let result:boolean =false
            let productItemId:string =""
                cartData?.products.forEach((producto:any)=>{
                    console.log(producto.pid._id,"xxxxxxxxxxxxxxxxx",product.pid)
                    if (((producto as any).pid._id).toString() === product.pid) {
                        productItemId=producto._id
                        result=true}
                })
                console.log(result,"bool",product.pid)
                if (result === false) {
                    const productItem=await productItemModel.create(product)
                    cartData.products.push(productItem)
                    cartData.save()
                    const productResponse=await productModel.findById(product.pid)
                    if (productResponse ===null) throw new ProductNotFound()
                    productResponse.stock-=product.quantity
                    productResponse.save()

                }else{
                    if (productItemId === "" ) throw new ProductNotFound()
                    const item= await productItemModel.findOne({_id:productItemId}).exec()
                    console.log(item,"DDDD")
                    if (item !==null) item.quantity += product.quantity
                    item?.save()
                    const productStock=await productModel.findById(product.pid)     
                    if (productStock === null) throw new ProductNotFound()
                    productStock.stock-= product.quantity
                    productStock?.save()
                }

                return new ResponseObject(null,true,{message:"Product Added"})
            } catch (error) {
                if (error instanceof ProductError || error instanceof UserError || error instanceof CartError) return error
                return new UnknownCartError(error)
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