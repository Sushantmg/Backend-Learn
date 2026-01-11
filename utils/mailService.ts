import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export async function initMailService() {
  if (process.env.NODE_ENV === "development") {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("📧 Ethereal email:", testAccount.user);
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
}

export function getTransporter() {
  if (!transporter) {
    throw new Error("Mail transporter not initialized");
  }
  return transporter;
}
