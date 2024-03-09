import { ProductManager } from "../services/fs.dao"
import { ResponseObject } from "./classes"

export interface Product {
    title: string
    description: string
    price: number
    thumbnail: string
    code: string
    stock: number
}
export interface ICart<T> {
    products: T[]
    id: string
}
export interface ICartService {
    public addProductById: (id: string, product: T) => Promise<ResponseObject<null> | ResponseObject<Partial<Cart> & {
        id: string;
    }> | undefined>
    public getById: (id: string) => Promise<ResponseObject<Cart> | ResponseObject<null>>
    public getCarts: () => Promise<ResponseObject<Cart> | ResponseObject<null>>
    public createCart: (products: { pid: string, quantity: number }[]) => Promise<ResponseObject<Cart> | ResponseObject<null>>


}
export interface IProductService {
    public getData: (limit?: number) => Promise<ResponseObject<Product> | undefined>,
    public getById: (id: string) => Promise<ResponseObject<Product> | undefined>,
    public addProduct: (product: Omit<Product, "id">) => Promise<ResponseObject<Product> | undefined>
    public updateProduct: (product: Product) => Promise<ResponseObject<Product> | undefined>
    public deleteProduct: (id: string) => Promise<ResponseObject<null> | undefined>


}
