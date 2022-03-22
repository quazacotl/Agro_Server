import Router from 'express'
import {getLastMessages, sendMail} from "../controllers/outlookControllers.js";

const outlookRouter = Router()

outlookRouter.get('/messages', getLastMessages)

outlookRouter.post('/send-message', sendMail)

export default outlookRouter