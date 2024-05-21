import { Document, FilterQuery } from "mongoose";
import { ResponseObject } from "../entities/classes";
import { IProductService, Product } from "../entities/products";
import { ProductManager } from "../services/fs.dao";
import { TypegooseDAO } from "../services/typegoose.dao";
import { productModel, Products } from "./products.schema";
import { ProductError, ProductNotFound, UnknowProductError, ProductCreateError } from './products.errors';
import { mailService } from "../mailing/mailing.service";
//const productManager = new ProductManager<Product>("./src/products/products.json")
const pm=new TypegooseDAO<Products>(Products,"products")
export class ProductService  {
    constructor(
        protected dao = pm,//productManager,
        protected model=productModel,
        protected mail = mailService,
        public getData = async (limit: number=10,page:number=1,sort?:{field:keyof Product,descending:boolean},query?:FilterQuery<Product>) => {
            try {
                
                const productCount = await this.model.countDocuments()
                const totalPages =Math.ceil( productCount/limit)
                const data= (await this.model.find(query||{}).skip((totalPages-1)*limit).limit(limit).sort(sort?.field))
                
               return data
            } catch (e) {
                return new UnknowProductError(e)
            }
        },
        public getById = async (id: string) => {
            try {
                
                const data = await  productModel.findById(id)//await this.dao.getProductById(id)
                if (data !== null )  return data.toObject()
                else throw new ProductNotFound()
            }
            catch (error) {
                console.log(error)
                if (error instanceof ProductError) return error
                else return new UnknowProductError(error)
            }
        },
        public addProduct = async (product: Products|Omit<Products,"id">) => {
            try {
                const response =(await productModel.create(product)).toObject() // await this.dao.addProduct(product)
                return response

            } catch (error) {
                
                return new ProductCreateError(error)
            }
        },
        public updateProduct = async (product: Products&{_id:any}) => {
            try {
                const response = (await productModel.findByIdAndUpdate({_id:product._id},product,{new:true}))?.toObject() //await this.dao.updateProduct(product._id, product)
                if (response === null) throw new ProductNotFound()
                return response

            } catch (error) {
                if (error instanceof ProductError) return error
                else return new UnknowProductError(error)
                
            }
        },
        public deleteProduct = async (id: string,owner:string) => {
            try {
                const response = (await productModel.findByIdAndDelete({_id:id,owner}))?.toObject()
                if (response === undefined || response === null) throw new ProductNotFound()
                if (response.owner !== "admin") this.mail.sendEmail(response.owner,"Producto eliminado","El producto que usted publico ha sido eliminado")
                    return response
            } catch (error) {
                if (error instanceof ProductError) return error
else  return new UnknowProductError(error)
            }
        }
    ) {
    }
}