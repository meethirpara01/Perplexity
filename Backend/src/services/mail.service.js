import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID,
    }
})

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GOOGLE_USER,
//     pass: process.env.GOOGLE_APP_PASSWORD
//   }
// });

transporter.verify()
    .then(() => {
        console.log("✅ [EMAIL] Transporter is ready to send emails")
    })
    .catch((err) => {
        console.error("❌ [EMAIL] Transporter verification failed!")
        console.error("Error details:", err.message)
        console.error("Make sure these env vars are set:")
        console.error("  - GOOGLE_USER:", process.env.GOOGLE_USER ? "✓" : "✗")
        console.error("  - GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✓" : "✗")
        console.error("  - GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✓" : "✗")
        console.error("  - GOOGLE_REFRESH_TOKEN:", process.env.GOOGLE_REFRESH_TOKEN ? "✓" : "✗")
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
        console.log("✅ Email Sent Successfully:", details.messageId)
        return details
    }
    catch (err) {
        console.error("❌ Failed to send email:", err.message)
        throw err  // IMPORTANT: Throw the error so the caller knows it failed
    }
}
