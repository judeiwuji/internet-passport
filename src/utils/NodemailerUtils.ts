import { Transporter, createTransport } from "nodemailer";
import * as dotenv from "dotenv";
import * as Mail from "nodemailer/lib/mailer";
dotenv.config();

export default class NodemailerUtils {
  private smtp!: Transporter;

  constructor() {
    this.smtp = createTransport({
      service: "aol",
      port: 25,
      secure: false,
      auth: {
        user: process.env["MAIL_USER"],
        pass: process.env["MAIL_PASS"],
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async send(options: Mail.Options) {
    console.log(process.env["MAIL_USER"]);
    options.from = `${process.env["MAIL_USER"]}`;

    return this.smtp.sendMail(options);
  }
}
