import { Document, FilterQuery } from "mongoose";
import { ResponseObject } from "../entities/classes";
import { IProductService, Product } from "../entities/products";
import { ProductManager } from "../services/fs.dao";
import { TypegooseDAO } from "../services/typegoose.dao";
import { Products } from "./products.schema";
//const productManager = new ProductManager<Product>("./src/products/products.json")
const pm=new TypegooseDAO<Products>(Products,"products")
export class ProductService  {
    constructor(
        protected dao = pm,//productManager,
        public getData = async (limit?: number,page?:number,sort?:{field:keyof Product,descending:boolean},query?:FilterQuery<Product>) => {
            try {
                
                const data = await this.dao.getProducts(limit,page,sort,query)
                return new ResponseObject<Products>(null, true, data as any||null)
            } catch (e) {
                console.log(e)
                return new ResponseObject<Products>(e, false, null)
            }
        },
        public getById = async (id: string) => {
            try {
                const data = await this.dao.getProductById(id)
                if (data !== undefined) return new ResponseObject<Products>(null, true, data)
                else return new ResponseObject<Products>("Product not found", false, null)
            }
            catch (error) {
                console.log(error)
                return new ResponseObject<Products>(error, false, null)
            }
        },
        public addProduct = async (product: Products|Omit<Products,"id">) => {
            try {
                const response = await this.dao.addProduct(product)
                return new ResponseObject<Products>(null, true, response as Products)

            } catch (error) {
                console.log(error)
                return new ResponseObject<Products>(error, false, null)
            }
        },
        public updateProduct = async (product: Products&{_id:any}) => {
            try {
                const response = await this.dao.updateProduct(product._id, product)
                return new ResponseObject<any>(null, true, response)

            } catch (error) {
                console.log(error)
                return new ResponseObject<Products>(error, false, null)
            }
        },
        public deleteProduct = async (id: string): Promise<ResponseObject<null> | undefined> => {
            try {
                await this.dao.deleteProduct(id)
                return new ResponseObject<null>(null, true, null)

            } catch (error) {
                console.log(error)
                return new ResponseObject<null>(error, false, null)
            }
        }
    ) {
    }
}