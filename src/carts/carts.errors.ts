export class CartError extends Error{
    public text:string
    public errorContent:any
    public code:string
    constructor(errorContent?:any,message:string="Generic Cart Error",code:string="C0000"){
        super(message)
        this.name="Generic Cart Error"
        this.text=message
        this.code=code
        this.errorContent=errorContent
    }
}

export class CartNotFound extends CartError{
    constructor(errorContent?:any,message:string="Cart not found",code:string="C0001"){
        super(errorContent,message,code)
        this.name="Cart not found error"
    }
}
export class UnknownCartError extends CartError{
    constructor(errorContent?:any,message:string="Unknown Cart Error",code:string="C0002"){
        super(errorContent,message,code)
        this.name="Unknown Cart Error"
    }
}