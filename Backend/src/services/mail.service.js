import nodemailer from 'nodemailer'

// const transpoter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: process.env.GOOGLE_USER,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//     }
// })

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD
  }
});

transporter.verify()
    .then(() => {
        console.log("Email transporter is ready to send email");
    })
    .catch((err) => {
        console.log("Email transporter verification failed:", err)
    })

export async function sendEmail({ to, subject, html }) {
    try {
        const mailOption = {
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html
        }

        const details = await transporter.sendMail(mailOption)
        console.log("Email Sent:", details)
    }
    catch (err) {
        console.error("Failed to send email:", err)
    }
}