import { object, string } from "zod"

export const signInSchema = object({
    username: string({ required_error: "Username is required" })
        .min(1, "Username is required"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
})

export const twofaSignInSchema = object({
    userId: string({ required_error: "userId is required" })
        .min(1, "User ID is required"),
    token: string({ required_error: "token is required" })
        .min(1, "Token is required")
})

export const createUserSchema = object({
    username: string({ required_error: "Email is required" })
        .email("Invalid email address"),
    password: string({ required_error: "Password is required" })
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character")
})

export const editUserSchema = object({
    username: string({ required_error: "Email is required" })
        .email("Invalid email address")
})



export const resetPasswordSchema = object({
    password: string({ required_error: "Password is required" })
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
    passwordConfirmation: string({ required_error: "Password is required" })
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character")
}).refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords must match",
    path: ["passwordConfirmation"],
});
