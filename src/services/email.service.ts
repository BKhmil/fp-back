import { render } from "@react-email/render";
import nodemailer, { Transporter } from "nodemailer";
import React from "react";

import { envConfig } from "../configs/env.config";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ForgotPasswordEmail } from "../templates/ForgotPassword";
import { LogoutEmail } from "../templates/Logout";
import { WelcomeEmail } from "../templates/Welcome";
import { EmailTypeToPayloadType } from "../types/email-type-to-payload.type";

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: envConfig.SMTP_EMAIL,
        pass: envConfig.SMTP_PASSWORD,
      },
    });
  }

  public async sendEmail<T extends EmailTypeEnum>(
    type: T,
    email: string,
    context: EmailTypeToPayloadType[T],
  ): Promise<void> {
    try {
      let emailHtml: string;
      switch (type) {
        case EmailTypeEnum.WELCOME:
          emailHtml = await render(
            React.createElement(WelcomeEmail, {
              context: context as EmailTypeToPayloadType[EmailTypeEnum.WELCOME],
            }),
          );
          break;
        case EmailTypeEnum.FORGOT_PASSWORD:
          emailHtml = await render(
            React.createElement(ForgotPasswordEmail, {
              context:
                context as EmailTypeToPayloadType[EmailTypeEnum.FORGOT_PASSWORD],
            }),
          );
          break;
        case EmailTypeEnum.LOGOUT:
          emailHtml = await render(
            React.createElement(LogoutEmail, {
              context: context as EmailTypeToPayloadType[EmailTypeEnum.LOGOUT],
            }),
          );
          break;
        default:
          throw new Error("Unknown email type");
      }

      const options = {
        from: envConfig.SMTP_EMAIL,
        to: email,
        subject: this.getEmailSubject(type),
        html: emailHtml,
      };

      await this.transporter.sendMail(options);
    } catch (err) {
      throw new Error("Can't send email: " + err.message);
    }
  }

  private getEmailSubject(type: EmailTypeEnum): string {
    const subjects = {
      [EmailTypeEnum.WELCOME]: "Welcome to our service!",
      [EmailTypeEnum.FORGOT_PASSWORD]: "Reset Your Password",
      [EmailTypeEnum.OLD_VISIT]: "We Miss You!",
      [EmailTypeEnum.LOGOUT]: "You've Logged Out",
    };
    return subjects[type] || "Notification";
  }
}

export const emailService = new EmailService();
