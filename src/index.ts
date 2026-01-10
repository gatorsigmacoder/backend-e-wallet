import app from "./app";
import chalk from "chalk";
import { appConfig } from "./config/app.config";

const port = appConfig.APP_PORT;

app.listen(port, () => {
  console.log("=============================================");
  console.log(
    `✨ Server running on ${chalk.blue(`http://localhost:${port}`)} ✨`
  );
  console.log("=============================================");
});
