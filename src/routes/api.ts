import { Router } from "express";
import { AuthController } from "../http/api/auth-module/controllers/auth.controller";
import { authenticateJWT } from "../http/middlewares/auth.middleware";
import { TransactionController } from "../http/api/transaction-module/controllers/transaction.controller";
import { UserController } from "../http/api/user-module/controllers/user.controller";

const api = Router();
const authController = new AuthController();
const transactionController = new TransactionController();
const userController = new UserController();

api.post("/auth/register", (req, res) => authController.register(req, res));
api.post("/auth/login", (req, res) => authController.login(req, res));

api.post("/transaction/topup", authenticateJWT, (req, res) =>
  transactionController.topUp(req, res)
);
api.post("/transaction/transfer", authenticateJWT, (req, res) =>
  transactionController.transfer(req, res)
);

api.get("/users", authenticateJWT, (req, res) =>
  userController.getAllUser(req, res)
);
export default api;
