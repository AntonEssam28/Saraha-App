//create transporter
import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

    // ESTABLISH CONNECTION WITH GMAIL
    const transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        // port: 587,
        // secure:false,
        service:"gmail",
        auth:{
            user : process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

export async function sendEmail(to,subject,html){

    await transporter.sendMail({
        from: `"Saraha-App" <${process.env.MAIL_USER}>`,
        to: to,
        subject:subject,
        html:html
    });
}