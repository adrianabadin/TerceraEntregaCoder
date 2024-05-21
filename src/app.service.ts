import {faker} from "@faker-js/faker"
import { v4 } from "uuid"
import { Products } from "./products/products.schema"
import { cartModel } from "./carts/cart.schema"
import { CartError, CartNotFound, UnknownCartError } from "./carts/carts.errors"
export class AppService{
    constructor(protected cart=cartModel){

    }
    async getCart(cid:string){
        try{
            const response = (await this.cart.findById({_id:cid}).populate({path:"products",populate:{path:"pid",model:"Products"}}).exec())?.toObject();
        
            if (response === null) throw new CartNotFound()
                //console.log(response.products,"service")
                return response
        }catch(e){
            if (e instanceof CartError) return e
            return new UnknownCartError(e)
        }
    }
    async getProductMocks(){
        let data:Products[]=[]
        for (let i=0 ;i<100;i++){
            data.push({
                code:v4(),
                title:faker.commerce.product(),
                description:faker.commerce.productDescription(),
                price:parseInt(faker.commerce.price({max:200,dec:0})),
                stock:Math.round((Math.random()*200)),
                thumbnail:faker.image.urlPlaceholder(),
                owner:"admin"})
        }
        return data
    }
}
/**
 * export class Products{
    @prop({required: true})
     public code!: string;
     @prop({required: true})
     public description!: string;
     @prop({required: true})
     public price!: number;
     @prop({required: true})
     public stock!: number;
     @prop({required: true})
     public thumbnail!:string;
     @prop({required: true})
     public title!:string;
    

}
 */
export const appService= new AppService()