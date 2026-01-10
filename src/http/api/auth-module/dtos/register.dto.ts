import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3, "Name harus memiliki panjang minimal 3 karakter"),
  email: z.email("Format email salah"),
  phone: z.e164("Format nomor telephone salah"),
  password: z
    .string()
    .min(8, "Password harus memiliki panjang minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus berisi huruf kapital")
    .regex(/[0-9]/, "Password harus berisi angka")
    .regex(/[@$!%*?&#]/, "Password harus berisi simbol"),
  address: z.string().min(1, "Alamat harus diisi"),
  bio: z.string().min(0),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
