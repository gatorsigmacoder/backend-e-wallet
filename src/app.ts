import express from "express";
import api from "./routes/api";
import { responseHandler } from "./http/middlewares/response.middleware";
import {
  errorHandler,
  notFoundHandler,
} from "./http/middlewares/error-handler.middleware";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler);
app.use("/api/v1", api);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
