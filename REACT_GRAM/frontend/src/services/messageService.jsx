import {api, requestConfig} from "../utils/config"

const getAllContacts = async (id, token) => {
    const config = requestConfig("GET", null, token)

    try {
        const res = await fetch(api + "/messages/" + id, config)
        .then((res) => res.json())
        .catch((err) => err)

        return res;
    } catch (error) {
        console.log(error)
    }
}

const sendMessage = async (data, id, token) => {
    const config = requestConfig("POST", data, token)

    try {
        
        const res = await fetch(api + "/messages/sendmessage/" + id , config)
            .then((res) => res.json())
            .catch((err) => err)

            return res;
    } catch (error) {
        console.log(error)
    }
}   


const getMessageId = async (id, token) => {
    const config = requestConfig("GET", null, token)

    try {
        const res = await fetch(api + "/messages/chat/" + id, config)
            .then((res) => res.json())
            .catch((err) => err)

            return res;
    } catch (error) {
        console.log(error)
    }
}


const deleteMessage = async (id, token) => {
    const config = requestConfig("DELETE", null, token)

    try {
        const res = await fetch(api + "/messages/" + id, config)
            .then((res) => res.json())
            .catch((err) => err)

            return res;
    } catch (error) {
        console.log(error)
    }
}

const messageService = {
    getAllContacts,
    getMessageId,
    sendMessage,
    deleteMessage
}

export default messageService 