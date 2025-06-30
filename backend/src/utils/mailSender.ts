import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const mailSender = async (
  email: string,
  title: string,
  body: string
): Promise<nodemailer.SentMessageInfo | Error> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"BaatCheet" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log(info);
    return info;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};

export default mailSender;
