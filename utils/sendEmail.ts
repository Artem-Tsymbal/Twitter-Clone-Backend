import { SentMessageInfo } from 'nodemailer/lib/sendmail-transport';
import mailer from '../core/mailer';

interface ISendEmailProps {
  emailFrom: string;
  emailTo: string;
  subject: string;
  html: string;
}

export default function sendEmail(
  { emailFrom, emailTo, subject, html }: ISendEmailProps,
  callback?: (err: Error | null, info: SentMessageInfo) => void,
): void {
  mailer.sendMail(
    {
      from: emailFrom,
      to: emailTo,
      subject,
      html,
    },
    callback ||
    ((err: Error | null, info: SentMessageInfo) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    }),
  );
}
