import { Transporter, createTransport } from "nodemailer";
import * as dotenv from "dotenv";
import * as Mail from "nodemailer/lib/mailer";
dotenv.config();

export default class NodemailerUtils {
  private smtp!: Transporter;

  constructor() {
    this.smtp = createTransport({
      host: "smtp.ethereal.email",
      secure: true,
      port: 587,
      auth: {
        user: process.env["MAIL_USER"],
        pass: process.env["MAIL_PASS"],
      },
      tls: {
        rejectUnauthorized: false,
        timeout: 0,
      },
    });
  }

  async send(options: Mail.Options) {
    options.from = `${process.env["MAIL_USER"]}`;

    return this.smtp.sendMail(options);
  }
}
