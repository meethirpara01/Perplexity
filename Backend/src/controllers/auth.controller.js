import userModel from "../models/user.model.js"
import jwt, { decode } from 'jsonwebtoken'
import { sendEmail } from "../services/mail.service.js"

export async function register(req, res) {

    const { username, email, password } = req.body

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: 'User Alredy exist with this email or password',
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    const emailVerificationToken = jwt.sign({
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    try {
        console.log(`📧 Sending verification email to: ${email}`)
        await sendEmail({
            to: email,
            subject: "Welcome to Perplexity! Verify Your Email",
            html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${process.env.FRONTEND_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
        })
        console.log(`✅ Verification email sent to: ${email}`)
    }
    catch (err) {
        console.error(`❌ Failed to send verification email to ${email}:`, err.message)
        // Delete the user since email failed
        await userModel.findByIdAndDelete(user._id)
        
        return res.status(500).json({
            message: 'Failed to send verification email. Please check your email address and try again.',
            success: false,
            err: err.message
        })
    }

    res.status(201).json({
        message: "User registered successfully! Check your email to verify.",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function login(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({
        $or: [
            {
                email: email
            },
            {
                password: password
            }
        ]
    })

    if (!user) {
        return res.status(400).json({
            message: 'User with this email does not exist',
            success: false,
            err: "User Not Found"
        });
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid email or password',
            success: false,
            err: "Invalid Credentials"
        });
    }

    if (!user.verified) {
        return res.status(400).json({
            message: 'Email not verified. Please verify your email before logging in.',
            success: false,
            err: "Email Not Verified"
        });
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('JWT_TOKEN', token)

    res.status(200).json({
        message: 'Login successful',
        success: true,
        data: {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
                createdAt: user.createdAt
            },
        }
    })
}

export async function getMe(req, res) {

    const userID = req.user.id

    const user = await userModel.findById(userID).select('-password');

    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            success: false,
            err: "User Not Found"
        });
    }

    res.status(200).json({
        message: 'User details fetched successfully',
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            verified: user.verified,
            createdAt: user.createdAt
        },

    });
}

export async function resendVerificationEmail(req, res) {
    const { email } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: 'User with this email does not exist',
            success: false,
            err: "User Not Found"
        });
    }

    if (user.verified) {
        return res.status(400).json({
            message: 'Email is already verified. You can log in to your account.',
            success: false,
            err: "Email Already Verified"
        });
    }

    const emailVerificationToken = jwt.sign({
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    try {
        console.log(`📧 Resending verification email to: ${email}`)
        await sendEmail({
            to: email,
            subject: "Welcome to Perplexity! Verify Your Email",
            html: `
                <p>Hi ${user.username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${process.env.FRONTEND_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
        })
        console.log(`✅ Verification email resent to: ${email}`)
    } catch (err) {
        console.error(`❌ Failed to resend verification email to ${email}:`, err.message)
        return res.status(500).json({
            message: 'Failed to resend verification email. Please try again later.',
            success: false,
            err: err.message
        })
    }

    res.status(201).json({
        message: 'Verification email resent successfully! Check your email.',
        success: true,
    })
}

export async function verifyEmail(req, res) {

    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({ email: decoded.email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        if (user.verified) {
            const html = `
                <h3>Hey ${user.username},</h3>
                <p>Your email is already verified. You can log in to your account.</p>
                <a href="${process.env.FRONTEND_URL}/login">Login to Perplexity</a>
                <p>Best regards,<br/>The Perplexity Team</p>
            `

            return res.send(html)
        }

        user.verified = true
        await user.save()

        const html = `
                <h3>Hey ${user.username},</h3>
                <h3>Email Verified Successfully!</h3>
                <p>Your email has been verified. You can now log in to your account.</p>
                <a href="${process.env.FRONTEND_URL}/login">Login to Perplexity</a>
                <p>Best regards,<br/>The Perplexity Team</p>
        `

        return res.send(html)

    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: error.message
        })
    }
}