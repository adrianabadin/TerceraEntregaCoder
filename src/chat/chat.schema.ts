import { prop } from "@typegoose/typegoose";

export class ChatMessage {
    @prop({required: true})
    public message!: string
    @prop({required: true})
    public author!:string
}