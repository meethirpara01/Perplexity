import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from "morgan";
import cors from "cors";
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : "http://localhost:5173",
    credentials: true,
    methods: [ "GET", "POST", "PUT", "DELETE" ],
}))

// Serve static files from public folder (Frontend build)
app.use(express.static(path.join(__dirname, '../public')))


import authRoute from './routes/user.routes.js'
import chatRoute from './routes/chat.routes.js'

app.use('/api/auth', authRoute)
app.use('/api/chats', chatRoute)

// Serve index.html for all unmatched routes (for frontend routing)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

export default app