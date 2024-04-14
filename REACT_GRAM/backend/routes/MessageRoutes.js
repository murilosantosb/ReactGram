const express = require('express')
const router = express.Router()

// Controllers
const {sendMessage, deleteMessage, getAllContacts, getMessageId} = require("../controllers/MessageController")


// Middlewares
const authGuard = require("../middlewares/authGuard")
const {sendMessageValidation} = require("../middlewares/messageValidation")

// Routes
router.post("/sendmessage/:id", authGuard, sendMessageValidation(), sendMessage )
router.get("/:id", authGuard, getAllContacts)
router.delete("/:id", authGuard, deleteMessage)
router.get("/chat/:id", authGuard, getMessageId)

module.exports = router