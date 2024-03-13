import {z} from "zod"
export const mailBody= z.object({
   body:z.object({
    to:z.string().email(),
    subject:z.string().min(3,{message:"Must provide a subject for email"}),
    content:z.string().min(3,{message:"Must provide body content for email"})})  
})

export type MailBody = z.infer<typeof mailBody>
