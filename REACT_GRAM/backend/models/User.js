const mongoose = require('mongoose')
const { Schema } = mongoose // Esquema

const userSchema = new Schema(
    {
        name: String,
        email: String,
        password: String,
        profileImage: String,
        bio: String ,
        posts: Array,
        followers: Array,
        following: Array,
        lastSeen: Date,
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

module.exports = User