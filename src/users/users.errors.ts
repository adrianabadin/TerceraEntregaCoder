export class UserError extends Error{
    public code:string
    public errorContent:any
    public textError:string
    constructor(errorContent:any,message:string="Error general de usuario", code:string="U0000"){
        super(message)
        this.name="User Error"
        this.code=code
        this.errorContent=errorContent
        this.textError=message

    }
}
export class NoUserFoundError extends UserError{
    constructor(errorContent?:any,message:string="Error al recuperar usuarios",code:string="U0001"){
        super(errorContent,message,code)
    }
}
export class UnknownUserError extends UserError{
    constructor(errorContent?:any,message:string="Error desconocido de usuario",code:string="U0002"){
        super(errorContent,message,code)
    }
}

export class PremiumUserCanBuy extends UserError{
    constructor(errorContent?:any,message:string="El usuario premium no puede comprar sus propios productos",code:string="U0003"){
        super(errorContent,message,code)
    }
}