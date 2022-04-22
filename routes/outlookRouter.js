import Router from 'express'
import {getLastMessages, sendMail} from "../controllers/outlookControllers.js";

const outlookRouter = Router()

outlookRouter.post('/messages', getLastMessages)

outlookRouter.post('/send-message', sendMail)

export default outlookRouter