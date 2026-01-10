import { appConfig } from "../config/app.config";
import { emailQueue, transporter } from "./init.email";

console.log("Running!");
emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;

  console.log(`Sending email to ${to}`);
  await transporter.sendMail({
    from: `${appConfig.APP_NAME} <no-reply@myapp.com>`,
    to,
    subject,
    text,
  });

  console.log(`Email sent to ${to}`);
});
