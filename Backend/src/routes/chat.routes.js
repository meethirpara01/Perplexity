import { Router } from "express"
import { authUser } from "../middlewares/auth.middleware.js"
import { deleteChat, getChats, getMessages, sendMessage } from "../controllers/chat.controller.js"


const chatRoute = Router()

chatRoute.post("/message", authUser, sendMessage)

chatRoute.get("/", authUser, getChats)

chatRoute.get("/:chatId/messages", authUser, getMessages)

chatRoute.delete("/delete/:chatId", authUser, deleteChat)


export default chatRoute