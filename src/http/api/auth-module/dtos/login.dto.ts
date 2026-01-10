import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Email atau username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

export type LoginDto = z.infer<typeof LoginSchema>;
