import { Severity, modelOptions, prop } from "@typegoose/typegoose";
@modelOptions({options: {allowMixed:0}})
export class Products{
    @prop({required: true})
     public code!: string;
     @prop({required: true})
     public description!: string;
     @prop({required: true})
     public price!: number;
     @prop({required: true})
     public stock!: number;
     @prop({required: true})
     public thumbnail!:string;
     @prop({required: true})
     public title!:string;
    

}