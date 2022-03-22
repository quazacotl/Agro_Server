import RequestModel from "../models/request.js";

export const uploadAct = async function (req, res) {
    try {
        await RequestModel.findOneAndUpdate({_id: req.body.id}, {$push: {Acts: `${req.file.destination.slice(process.env.ACT_BASE_PATH.length)}/${req.file.filename}`}})
        res.status(200).json({message: 'Файл сохранён'})
    }
    catch (e) {
        res.status(500).json({message: `Не удалось сохранить файл: ${e}`})
    }
}

export const uploadTare = async function (req, res) {
    try {
        await RequestModel.findOneAndUpdate({_id: req.body.id}, {$push: {Tares: `${req.file.destination.slice(process.env.TARE_BASE_PATH.length)}/${req.file.filename}`}})
        res.status(200).json({message: 'Файл сохранён'})
    }
    catch (e) {
        res.status(500).json({message: `Не удалось сохранить файл: ${e}`})
    }
}