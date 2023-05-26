import { Transporter, createTransport } from "nodemailer";
import * as dotenv from "dotenv";
import * as Mail from "nodemailer/lib/mailer";
dotenv.config();

export default class NodemailerUtils {
  private smtp!: Transporter;

  constructor() {
    this.smtp = createTransport({
      // service: "aol",
      // port: 25,
      // secure: false,
      // auth: {
      //   user: process.env["MAIL_USER"],
      //   pass: process.env["MAIL_PASS"],
      // },
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "cortney.gleichner@ethereal.email",
        pass: "V9buafPEfTjsnaY1c7",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async send(options: Mail.Options) {
    options.from = "cortney.gleichner@ethereal.email"; // `${process.env["MAIL_USER"]}`;
    try {
      await this.smtp.sendMail(options);
      return true;
    } catch (error) {
      console.debug(error);
      throw new Error("Unable to send mail");
    }
  }
}
