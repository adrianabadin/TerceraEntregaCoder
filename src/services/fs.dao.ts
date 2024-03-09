import fs from "fs"
import { v4 } from "uuid";
export class ProductManager
    <T extends {
        id: string;
    }
    >
{
    static PublicId: number = 0;
    static Instance: ProductManager<any>;
    constructor(
        protected path: string,
        protected Products?: any[],
        protected count = () => ProductManager.PublicId++,
        protected loadData = async () => {
            if (fs.existsSync(path)) this.Products = JSON.parse(await fs.promises.readFile(path, "utf-8"))
        },
        public addProduct = async (product: Omit<T, "id">) => {
            try {
                await this.loadData()
                if (this.Products !== undefined) {
                    this.count()
                    this.Products.push({ ...product, id: v4() } as T)
                    await fs.promises.writeFile(path, JSON.stringify(this.Products), "utf-8")
                    return product as T
                }
            } catch (e) { console.log(e) }
        },
        public getProducts = async (): Promise<T[] | undefined> => {
            try {
                await this.loadData()
                return this.Products
            } catch (e) { console.log(e) }

        },
        public getProductById = async (id: string): Promise<T | undefined> => {
            try {
                let data
                await this.loadData()
                if (this.Products !== undefined) {
                    data = await this.Products.find((product) => {
                        if (product.id === id) return true
                        else return false

                    }) as T
                }
                return data
            } catch (e) { console.log(e) }
        },
        public updateProduct = async (id: string, product: Partial<T>) => {
            try {
                await this.loadData()
                if (this.Products !== undefined) {
                    const temporaryData = this.Products.filter(product => product.id !== id)
                    temporaryData.push({ ...product, id })
                    await fs.promises.writeFile(this.path, JSON.stringify(temporaryData), "utf-8")
                    this.Products = temporaryData
                    return { ...product, id }
                }
            } catch (e) { console.log(e) }
        },
        public deleteProduct = async (id: string) => {
            try {
                await this.loadData()
                if (this.Products !== undefined) {
                    this.Products = this.Products.filter(product => product.id !== id)
                    await fs.promises.writeFile(this.path, JSON.stringify(this.Products), "utf-8")
                    return null
                }
            } catch (e) { console.log(e) }
        }

    ) {
        // if (ProductManager.Instance !== undefined) return ProductManager.Instance
        // else {
        //     if (fs.existsSync(path)) {
        //         this.Products = JSON.parse(fs.readFileSync(path, "utf-8"))

        //     }
        //     else {
        //         this.Products = []
        //         fs.writeFileSync(this.path, JSON.stringify(this.Products))
        //     }
        //     ProductManager.Instance = this
        //     return this
    }

}



