import { z } from "zod";

export const zSchema = z.object({
  name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(50, { message: "Name must be at most 50 characters." }),
  email: z
    .string()
    .email({ message: "Invalid email format" }),
  
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password is too long" }),
  });



