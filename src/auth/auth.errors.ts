export abstract class AuthError extends Error{
    constructor(public errorContent?:any, public message:string="Error de autenticacion",public code:number=0){
        super(message)
        this.name="AuthError"
    }
}

export class UserDontExist extends AuthError{
    public text:string
    constructor(public errorContent?:any, public message:string="El usuario no existe",public code:number=401){
        super(errorContent,message,code)
        this.text=message
        this.name="User dont exists"
    }
}
export class DeserializeError extends AuthError{
    public text:string
    constructor(public errorContent?:any, public message:string="Error al recuperar usuario de la base de datos",public code:number=402){
        super(errorContent,message,code)
        this.text=message
        this.name="DeSerialize Error"
    }
    
}

export class UserCreateError extends AuthError{
    public text:string
    constructor(public errorContent?:any, public message:string="Error al crear el usuario",public code:number=403){
        super(errorContent,message,code)
        this.text=message
        this.name="User Create Error"
    }
   
}
export class WrongPassword extends AuthError{
    public text:string
    constructor(public errorContent?:any, public message:string="La contraseña proporcionada no coincide",public code:number=404){
        super(errorContent,message,code)
        this.text=message
        this.name="Wrong Password"
    }
    
}
export class TokenError extends AuthError{
    public text:string
    constructor(public errorContent?:any, public message:string="No hay un Token valido",public code:number=405){
        super(errorContent,message,code)
        this.text=message
        this.name="Token Error"
    }
    
}