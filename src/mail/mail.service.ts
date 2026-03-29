import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendResetPasswordEmail(to: string, resetLink: string) {
    await this.resend.emails.send({
      from: 'Luck Ti Chai <onboarding@resend.dev>',
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