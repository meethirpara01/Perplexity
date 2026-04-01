import { Router } from "express"
import { getMe, login, register, resendVerificationEmail, verifyEmail } from "../controllers/auth.controller.js"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import { authUser } from "../middlewares/auth.middleware.js";

const authRoute = Router();

authRoute.post('/register', registerValidator, register)

authRoute.get('/verify-email', verifyEmail)

authRoute.post('/login', loginValidator, login)

authRoute.get('/get-me', authUser, getMe)

authRoute.post('/resend-email', resendVerificationEmail)

export default authRoute