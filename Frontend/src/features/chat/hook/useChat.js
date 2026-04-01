import { useDispatch } from "react-redux"
import { initializeSocketConnection } from "../services/chat.socket.js"
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api.js"
import { createNewChat, addNewMessage, addMessage, setChats, setCurrentChatId, setLoading, setError, setLoadingResponse } from "../chat.slice.js"

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        dispatch(setLoadingResponse(true))

        const data = await sendMessage({ message, chatId })

        const { chat, aiMessage } = data

        if (!chatId) {
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }))
        }
        dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user"
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: aiMessage.content,
            role: aiMessage.role
        }))
        dispatch(setCurrentChatId(chat._id))
        dispatch(setLoading(false))
        dispatch(setLoadingResponse(false))
    }

    async function handleGetChat() {

        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data

        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt
            }

            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChats(chatId, chats) {

        console.log(chats[chatId]?.messages.length)

        if (chats[chatId]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role
            }))

            dispatch(addMessage({
                chatId,
                messages: formattedMessages
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    function handleCreateNewChat() {
        dispatch(setCurrentChatId(null))
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChat,
        handleOpenChats,
        handleCreateNewChat
    }
}
