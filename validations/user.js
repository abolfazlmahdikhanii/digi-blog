import {z} from "zod"

const userSchema=z.object({
    name:z.string().trim().minLength(1).maxLength(50),
    username:z.string().trim().minLength(1).maxLength(30),
    email:z.email(),
    job:z.string().trim().optional(),
    bio:z.string().trim().maxLength(200).optional(),
    profileImg:z.string().trim().optional(),

})
