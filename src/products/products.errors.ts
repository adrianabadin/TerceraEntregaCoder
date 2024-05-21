export abstract class ProductError extends Error{
    public code:string
    public errorContent:any

    constructor(errorContent?:any,message:string="Product error",code:string="P0000"){
        super(message)
        this.name="Product Error"
        this.code=code
        this.errorContent=errorContent
    }
}

export class ProductNotFound extends ProductError{    
    constructor(message:string="Product not Found",code:string="P0001"){
        super(message)
        this.name="Product NOT found Error"
        this.code=code
    }
}

export class UnknowProductError extends ProductError{
    public code:string
    constructor(errorContent?:any,message:string="Unknown Product Error",code:string="P0002"){
        super(message)
        this.name="Unknown Product Error"
        this.code=code
        this.errorContent=errorContent
    }
}
export class PremiumNotOwnerError extends ProductError{
    public code:string
    constructor(errorContent?:any,message:string="The premium user is not owner of the product",code:string="P0003"){
        super(message)
        this.name="Premium User not owner"
        this.code=code
        this.errorContent=errorContent
    }
}
export class ProductCreateError extends ProductError{
    public code:string
    constructor(errorContent?:any,message:string="Error creating a product",code:string="P0004"){
        super(message)
        this.name="Product Create Error"
        this.code=code
        this.errorContent=errorContent
    }
}