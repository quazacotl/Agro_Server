
import {findLastMessages, sendEmail} from "../outlookFuncs/outlookFuncs.js";

export const getLastMessages = async function (req, res) {
    try {
        const messages = await findLastMessages()
        res.status(200).json(messages)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка outlook сервера: ${e}`})
    }
}


export const sendMail = async function (req, res) {
    const result = await sendEmail(req.body.subject, req.body.text, req.body.recipient, req.body.files)
    if (result.ResponseMessages.CreateItemResponseMessage.ResponseCode === 'NoError') {
        res.status(200).json({message: 'Успешно отправлено'})
    } else {
        res.status(500).json({message: `Не удалось отправить сообщение`})
    }
}
