import { Request, Response } from "express";
import { TopUpSchema } from "../dtos/top-up.dto";
import { getZodError } from "../../../../utils/request.util";
import { HttpStatus } from "../../../../utils/http-status.util";
import { TransactionService } from "../services/transaction.service";
import { TransferSchema } from "../dtos/transfer.dto";

const transactionService = new TransactionService();

export class TransactionController {
  async topUp(req: Request, res: Response) {
    const validate = TopUpSchema.safeParse(req.body);

    if (!validate.success) {
      const errors = getZodError(validate.error);

      return res.error(
        HttpStatus.BAD_REQUEST.code,
        HttpStatus.BAD_REQUEST.message,
        errors
      );
    }

    const parsedBody = validate.data;

    const result = await transactionService.topUp(parsedBody);
    if (!result.success) {
      return res.error(
        result.code || HttpStatus.INTERNAL_SERVER_ERROR.code,
        result.message || HttpStatus.INTERNAL_SERVER_ERROR.message
      );
    }

    return res.success(result.code, result.message);
  }

  async transfer(req: Request, res: Response) {
    const validate = TransferSchema.safeParse(req.body);

    if (!validate.success) {
      const errors = getZodError(validate.error);

      return res.error(
        HttpStatus.BAD_REQUEST.code,
        HttpStatus.BAD_REQUEST.message,
        errors
      );
    }

    const parsedBody = validate.data;
    const result = await transactionService.transfer(parsedBody);

    if (!result.success) {
      return res.error(
        result.code || HttpStatus.INTERNAL_SERVER_ERROR.code,
        result.message || HttpStatus.INTERNAL_SERVER_ERROR.message
      );
    }

    return res.success(result.code, result.message);
  }
}
