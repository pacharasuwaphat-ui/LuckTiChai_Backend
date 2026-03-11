import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false, // port 587
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async onModuleInit() {
    await this.transporter.verify();
    console.log('SMTP ready');
  }

  async sendResetPasswordEmail(to: string, resetLink: string) {
    await this.transporter.sendMail({
      from: `"Luck Ti Chai" <${process.env.MAIL_FROM}>`,
      to,
      subject: 'Reset your password',
      html: `
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a> 
      `,
    });
  }
}