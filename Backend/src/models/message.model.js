import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chats',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    role: {
        type: String,
        enum: ['user', 'ai'],
        required: [true, 'Role is required']
    }
}, {
    timestamps: true
})

const messageModel = mongoose.model('Messages', messageSchema)
export default messageModel