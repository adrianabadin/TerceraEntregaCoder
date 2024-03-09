import { v4 } from "uuid";
import { ICart } from "./products";
export class ResponseObject<T>{
    constructor(
        public error: any,
        public ok: boolean,
        public data: T | T[] | null

    ) { }

}
export class Cart {
    public id: string

    constructor(
        public products: { pid: string, quantity: number }[]
    ) {
        this.id = v4()
        this.products = [...this.products]
    }
}