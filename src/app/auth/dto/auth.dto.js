import {z} from 'zod'

export const registerDTO = z.object({
    email: z.email({message:"Invalid email format"}).toLowerCase().trim(),
    name: z.string().min(2).max(20).trim(),
    password: z.string().min(8).max(16).trim(),
    dob: z.date().optional(),
    gender: z.enum(['male','female']).optional(),
});

export const verifyaccountDTO = z.object({
    email: z.email({message:"Invalid email format"}).toLowerCase().trim(),
    code: z.string().length(6),
})

export const loginDTO = z.object({
    email: z.email({message:"Invalid email format"}).toLowerCase().trim(),
    password: z.string().min(8).max(16).trim(),
});

export const sendOtpDTO = z.object({
    email: z.email({message:"Invalid email format"}).toLowerCase().trim(),
});

export const resetPasswordDTO = z.object({
    email: z.email({message:"Invalid email format"}).toLowerCase().trim(),
    cdoe: z.string().length(6).trim(),
    newPassword: z.string().min(8).max(16).trim()
});
