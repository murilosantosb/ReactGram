const mongoose = require("mongoose")
const { Schema } = mongoose



const MessageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    sender: { // Quem está enviando a mensagem
        type: Schema.Types.ObjectId,
        required: true
    },
    recipient: { // Quem está recebendo a mensagem
        type: Schema.Types.ObjectId,
        required: true
    },
    timestamp: String,
    status: {
        type: String, // status da mensagem "enviado, entregue e lido"
        enum: ["sent", "delivered", "read"], 
        default: "sent"
    },
    deleted : {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
)

const Message = mongoose.model("Message", MessageSchema)

module.exports = Message