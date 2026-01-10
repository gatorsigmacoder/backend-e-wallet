import { db } from "../../../../database/client";
import { emailQueue } from "../../../../email/init.email";
import {
  TransactionStatus,
  TransactionType,
} from "../../../../enums/transaction.enum";
import {
  TopUpResult,
  TransferResult,
} from "../../../../interfaces/transaction.interface";
import { formatRupiah } from "../../../../utils/format.util";
import { HttpStatus } from "../../../../utils/http-status.util";
import { TopUpDto } from "../dtos/top-up.dto";
import { TransferDto } from "../dtos/transfer.dto";

export class TransactionService {
  async topUp(payload: TopUpDto): Promise<TopUpResult> {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const { rows }: any = await client.query(
        "SELECT e_wallets.balance as user_balance, e_wallets.id as e_wallet_id, users.id as user_id FROM users LEFT JOIN e_wallets ON users.id = e_wallets.user_id INNER JOIN profiles ON users.id = profiles.user_id WHERE profiles.phone = $1 FOR UPDATE OF users",
        [payload.phone]
      );

      console.log(rows);
      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return {
          success: false,
          code: HttpStatus.NOT_FOUND.code,
          message: "Pengguna tidak ditemukan",
        };
      }

      const updatedBalance = payload.amount + parseFloat(rows[0].user_balance);
      await client.query(
        "UPDATE e_wallets SET balance = $1 WHERE user_id = $2",
        [updatedBalance, rows[0].user_id]
      );
      let currentDate = new Date();
      let isoString = currentDate.toISOString();
      await client.query(
        "INSERT INTO transactions (e_wallet_id, amount, transaction_type, transaction_status, transaction_date) VALUES ($1, $2, $3, $4, $5)",
        [
          rows[0].e_wallet_id,
          payload.amount,
          TransactionType.TOP_UP,
          TransactionStatus.DONE,
          isoString,
        ]
      );
      await client.query("COMMIT");
      return {
        success: true,
        code: HttpStatus.CREATED.code,
        message: "Top up sukses",
      };
    } catch (error: any) {
      await client.query("ROLLBACK");
      return {
        success: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR.code,
        message: error.message,
      };
    } finally {
      await client.release();
    }
  }

  async transfer(payload: TransferDto): Promise<TransferResult> {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const { rows: fromRes }: any = await client.query(
        "SELECT e_wallets.balance as user_balance, e_wallets.id as e_wallet_id, users.id as user_id, users.email as user_email FROM users LEFT JOIN e_wallets ON users.id = e_wallets.user_id INNER JOIN profiles ON users.id = profiles.user_id WHERE profiles.phone = $1 FOR UPDATE OF users",
        [payload.phone_sender]
      );

      if (fromRes.length === 0) {
        await client.query("ROLLBACK");
        return {
          code: HttpStatus.NOT_FOUND.code,
          success: false,
          message: "Pengirim tidak ditemukan",
        };
      }

      if (parseFloat(fromRes[0].user_balance) <= payload.amount) {
        await client.query("ROLLBACK");
        return {
          code: HttpStatus.UNPROCESSABLE_ENTITY.code,
          success: false,
          message: "Jumlah saldo anda tidak mencukupi",
        };
      }

      const { rows: toRes }: any = await client.query(
        "SELECT e_wallets.balance as user_balance, e_wallets.id as e_wallet_id, users.id as user_id FROM users LEFT JOIN e_wallets ON users.id = e_wallets.user_id INNER JOIN profiles ON users.id = profiles.user_id WHERE profiles.phone = $1 FOR UPDATE OF users",
        [payload.phone_receiver]
      );

      if (toRes.length === 0) {
        await client.query("ROLLBACK");
        return {
          code: HttpStatus.NOT_FOUND.code,
          success: false,
          message: "Penerima tidak ditemukan",
        };
      }

      const newFromBalance =
        parseFloat(fromRes[0].user_balance) - payload.amount;
      const newToBalance = parseFloat(toRes[0].user_balance) + payload.amount;

      if (Number.isNaN(newFromBalance) || Number.isNaN(newToBalance)) {
        await client.query("ROLLBACK");
        return {
          code: HttpStatus.UNPROCESSABLE_ENTITY.code,
          success: false,
          message: "Kesalahan pada hasil transaksi",
        };
      }

      await client.query(
        "UPDATE e_wallets SET balance = $1 WHERE user_id = $2",
        [newFromBalance, fromRes[0].user_id]
      );
      await client.query(
        "UPDATE e_wallets SET balance = $1 WHERE user_id = $2",
        [newToBalance, toRes[0].user_id]
      );

      let currentDate = new Date();
      let isoString = currentDate.toISOString();
      await client.query(
        "INSERT INTO transactions (e_wallet_id, e_wallet_trf_from, e_wallet_trf_to, amount, transaction_type, transaction_status, transaction_date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          fromRes[0].e_wallet_id,
          fromRes[0].e_wallet_id,
          toRes[0].e_wallet_id,
          payload.amount,
          TransactionType.TRANSFER,
          TransactionStatus.DONE,
          isoString,
        ]
      );
      await client.query(
        "INSERT INTO transactions (e_wallet_id, e_wallet_trf_from, e_wallet_trf_to, amount, transaction_type, transaction_status, transaction_date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          toRes[0].e_wallet_id,
          fromRes[0].e_wallet_id,
          toRes[0].e_wallet_id,
          payload.amount,
          TransactionType.TRANSFER,
          TransactionStatus.DONE,
          isoString,
        ]
      );
      await client.query("COMMIT");
      await emailQueue.add({
        to: fromRes[0].user_email,
        subject: "Transfer Berhasil",
        text: `Transfer ke nomor ${
          payload.phone_receiver
        } dengan nominal ${formatRupiah(payload.amount)} telah berhasil`,
      });
      return {
        code: HttpStatus.CREATED.code,
        success: true,
        message: "Transfer berhasil",
      };
    } catch (error: any) {
      await client.query("ROLLBACK");
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR.code,
        success: false,
        message: error.message,
      };
    } finally {
      client.release();
    }
  }
}
