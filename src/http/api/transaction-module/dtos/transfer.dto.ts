import z from "zod";

export const TransferSchema = z.object({
  phone_sender: z.e164("Format nomor telephone pengirim salah"),
  phone_receiver: z.e164("Format nomor telephone penerima salah"),
  amount: z.number().min(10000, "Jumlah transfer minimal adalah 10.000"),
});

export type TransferDto = z.infer<typeof TransferSchema>;
