import "dotenv/config"
import nodemailer from 'nodemailer'

const transpoter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID,
    }
})

transpoter.verify()
    .then(() => {
        console.log("Email transpoter is redy to send email");
    })
    .catch((err) => {
        console.log("Email transpoter verification failed:", err)
    })

export async function sendEmail({ to, subject, html })
{
    const mailOption = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html
    }

    const details = await transpoter.sendMail(mailOption)
    .catch((err) => {
        console.error("Failed to send email:", err)
        throw new Error("Failed to send email")
    })
    console.log("Email Sent:", details)
}