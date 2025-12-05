import { z } from "zod"

export const formSchema = z.object({
    name: z.string().min(2).max(50),
    cv: z.string().min(1).max(50),
    transmission: z.string().min(2).max(50),
    people: z.string().min(1).max(50),
    photo: z.string().min(2),
    engine: z.string().min(2).max(50),
    type: z.string().min(2).max(50),
    priceDay: z.string().min(1).max(50),
    isPublish: z.boolean(),
})