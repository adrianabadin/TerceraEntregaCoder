import { getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CartSchema } from "../carts/cart.schema";
import { Products } from "../products/products.schema";
import mongoose, { FilterQuery, Model, MongooseQueryOptions, QueryOpThatReturnsDocument, QueryOptions, Schema } from "mongoose";
import { AnyParamConstructor, ModelType } from "@typegoose/typegoose/lib/types";
import { ResponseObject } from "../entities/classes";
import { ChatMessage } from "../chat/chat.schema";
import { UserTS, zodCreateUserType } from "../auth/auth.schemas";
const connectionString="mongodb+srv://dcsweb:adrian123@dcsweb.snm3hyr.mongodb.net/"

export class TypegooseDAO<T extends Products| CartSchema|ChatMessage|Omit<zodCreateUserType["body"],"password2">> {
    static instance:any
    public model!:ModelType<T>
     constructor(
protected schema: AnyParamConstructor<T>,
protected modelName:string,

)        
    {   

                 mongoose.connect(connectionString).then(()=>{
                    this.model=getModelForClass(this.schema,{schemaOptions:{timestamps:true}})
                    TypegooseDAO.instance=this
                    console.log("Connected to Mongoose")
                }).catch(error=>{console.log(error)});
        }
        async addProduct  (product: Omit<T,"_id">) {
            try{
            const data=await this.model.create(product)
            return data
        }catch(e){console.log(e)}
        }
        async getProducts(limit?: number,page?:number,sort?:{field:keyof T,descending:boolean},query?:FilterQuery<T>){
            try{
                const totalRecords = (await this.model.count())
                console.log(totalRecords)
                limit=limit || 10
                page=page ||1
                const totalPages=Math.ceil( totalRecords/limit)
                const prevPage =page >1 ?page-1:null
                const nextPage =page <totalPages ?page+1:null
                const hasNextPage =page<totalPages
                const hasPrevPage =page>1
                let prevLink
                if (hasPrevPage) 
                    prevLink =`http://localhost:8080/api/products?page=${prevPage}`
                let nextLink
                if (hasNextPage) 
                    nextLink =`http://localhost:8080/api/products?page=${nextPage}`
                const data = await this.model.find(query||{}).skip((page-1)*limit).limit(limit).sort(sort !== undefined ? sort?.descending ? `-${sort.field as string}`: `${sort.field as string}`:null).lean()
                return {payload:data,page,totalPages,prevPage,hasPrevPage,prevLink,nextPage,hasNextPage,nextLink}
            }catch(e){console.log(e)}
        }
        async getProductById (id:string){
            try {
                const data = await this.model.findById(id)
                return data
            }catch(e){console.log(e)}
        }
        async updateProduct(id:string,product:Partial<T>){
        try{
            const data =await this.model.updateOne({_id:id},product)
            return data
        }catch(e){console.log(e)}
        }
        async deleteProduct(id:string){
            try{
                const data =await this.model.deleteOne({id})
                return data
            }catch(e){console.log(e)}
        }
        
}