import {z} from "zod"

export const createUserSchema=z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(8).max(20),
    name:z.string(),

})

export const SignInSchema=z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(8).max(20),
})

export const roomSchema=z.object({
    room:z.string()
})