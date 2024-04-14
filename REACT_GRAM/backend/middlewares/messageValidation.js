const { body } = require("express-validator")

const sendMessageValidation = () => {
    return [
        body("message")
            .isString()
            .withMessage("A mensagem é obrigatória.")
            .notEmpty(),
        body("sender")    
            .notEmpty(),
        body("recipient")
            .notEmpty()    
    ]
}


module.exports = {
    sendMessageValidation,
}