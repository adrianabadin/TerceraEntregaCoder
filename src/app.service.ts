import {faker} from "@faker-js/faker"
import { v4 } from "uuid"
import { Products } from "./products/products.schema"
export class AppService{
    constructor(){

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
                thumbnail:faker.image.urlPlaceholder()})
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