import {z} from "zod"

const userSchema=z.object({
    name:z.string().minLength(1).maxLength(50),
    username:z.string().minLength(1).maxLength(30),
    email:z.email(),
    job:z.string().optional(),
    bio:z.string().maxLength(200).optional(),
    profileImg:z.string().optional(),

})
