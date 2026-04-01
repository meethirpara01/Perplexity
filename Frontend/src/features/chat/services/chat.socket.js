import { io } from 'socket.io-client'

export const initializeSocketConnection = () => {
    const API_BASE_URL = "https://perplexity-islp.onrender.com" || "http://localhost:3000"

    const socket = io(API_BASE_URL, {
        withCredentials: true,
    })

    socket.on('connect', () => {
        console.log('Connected to Socket.io server')
    })
}