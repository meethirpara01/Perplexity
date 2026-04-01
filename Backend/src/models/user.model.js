import mongoose from "mongoose"
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "Username is required"],
        trim: true,
        unique: [true, "Username is already taken"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already taken"],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10)
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

const userModel = mongoose.model('Users', userSchema)
export default userModel