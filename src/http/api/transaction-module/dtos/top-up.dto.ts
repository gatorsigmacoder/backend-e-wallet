import z from "zod";

export const TopUpSchema = z.object({
  phone: z.e164("Format nomor telephone salah"),
  amount: z.number().min(10000, "Jumlah top up minimal adalah 10.000"),
});

export type TopUpDto = z.infer<typeof TopUpSchema>;
