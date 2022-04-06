import ExecutorModel from '../models/executor.js'
import UserModel from '../models/user.js'
import RequestModel from '../models/request.js'
import RegionModel from "../models/region.js"
import RequestTypes from "../models/requestsTypes.js"
import { DateTime } from "luxon"

export const getAllRequests = async function (req, res) {
    try {
       const requests = await RequestModel.find().limit(Number(process.env.REQUESTS_LIMIT)).sort(({ _id: -1 }))
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getAllUnexecutedRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find().sort(({ _id: -1 })).where({isExecuted: false})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

// Simple

export const getVorRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be8295008'}).limit(Number(process.env.REQUESTS_LIMIT)).sort(({ _id: -1 }))
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getVorUnexecutedRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be8295008'}).sort(({ _id: -1 })).where({isExecuted: false})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getKurRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be8295009'}).sort(({ _id: -1 })).limit(Number(process.env.REQUESTS_LIMIT))
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getKurUnexecutedRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be8295009'}).sort(({ _id: -1 })).where({isExecuted: false})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getOreRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be829500a'}).sort(({ _id: -1 })).limit(Number(process.env.REQUESTS_LIMIT))
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getOreUnexecutedRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be829500a'}).sort(({ _id: -1 })).where({isExecuted: false})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getLipRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be829500b'}).sort(({ _id: -1 })).limit(Number(process.env.REQUESTS_LIMIT))
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getLipUnexecutedRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be829500b'}).sort(({ _id: -1 })).where({isExecuted: false})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getBelRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be829500c'}).sort(({ _id: -1 })).limit(Number(process.env.REQUESTS_LIMIT))
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getBelUnexecutedRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be829500c'}).sort(({ _id: -1 })).where({isExecuted: false})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getTulRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be829500d'}).sort(({ _id: -1 })).limit(Number(process.env.REQUESTS_LIMIT))
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getTulUnexecutedRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': '61e17003a257b49be829500d'}).sort(({ _id: -1 })).where({isExecuted: false})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

// Complex

export const getVorRegRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': {$in: ['61e17003a257b49be8295008', '61e17003a257b49be829500c', '61e17003a257b49be829500b']}}).sort(({ _id: -1 })).limit(Number(process.env.REQUESTS_LIMIT))
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getVorRegUnexecutedRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': {$in: ['61e17003a257b49be8295008', '61e17003a257b49be829500c', '61e17003a257b49be829500b']}}).sort(({ _id: -1 })).where({isExecuted: false})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getOreRegRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': {$in: ['61e17003a257b49be829500a', '61e17003a257b49be829500d']}}).sort(({ _id: -1 })).limit(Number(process.env.REQUESTS_LIMIT))
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getOreRegUnexecutedRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({'Region': {$in: ['61e17003a257b49be829500a', '61e17003a257b49be829500d']}}).sort(({ _id: -1 })).where({isExecuted: false})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getRequestsByRegNom = async function (req, res) {
    try {
        const requests = await RequestModel.find({'VehicleRegNum': req.body.regNom}).sort({CreateDate: -1})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getAllExecutors = async function (req, res) {
    try {
        const requests = await ExecutorModel.find({ _id: {$nin: ['61e17dc4749a917e0a0a62f1', '61e17e04749a917e0a0a62f2', '61e17e80749a917e0a0a62f3', '61e17e93749a917e0a0a62f4']}}).sort({name: 'asc'}).select('name')
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getAllRegions = async function (req, res) {
    try {
        const requests = await RegionModel.find().select('name')
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getAllRequestTypes = async function (req, res) {
    try {
        const requests = await RequestTypes.find().select('description')
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getCurrentUsers = async function (req, res) {
    try {
        const requests = await UserModel.find({ _id: {$nin: ['61e14e76749a917e0a0a62bf', '61e14e98749a917e0a0a62c0']}}).sort({name: 'asc'})
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

const getExecutors = async (executorsList) => {
    if (executorsList) {
        let Executor = [];
        for (const item of executorsList) {
            const execId = await ExecutorModel.findOne({name: item}).select('_id')
            Executor.push(execId)
        }
        return Executor
    }
    return null
}

export const writeNewRequest = async function (req, res) {

    try {
        const Executor = await getExecutors(req.body.Executor)
        const Region = await RegionModel.findOne({name: req.body.Region}).select('_id')
        const RequestType = await RequestTypes.findOne({description: req.body.RequestType}).select('_id')
        const Creator = await UserModel.findOne({name: req.body.Creator}).select('_id')
        const request = new RequestModel({
            ...req.body,
            CreateDate: DateTime.now().toISO(),
            Region,
            RequestType,
            Executor,
            Creator
        })
        await request.save()
        res.status(200).json({message: "Заявка сохранена"})
    }
    catch (e) {
        res.status(500).json({message: `Не удалось записать заявку: ${e}`})
    }
}

export const editRequest = async function (req, res) {
    try {
        const Executor = await getExecutors(req.body.Executor)
        const RequestType = await RequestTypes.findOne({description: req.body.RequestType}).select('_id')
        await RequestModel.findOneAndUpdate({_id: req.body.id}, {
            Description: req.body.Description,
            Executor,
            RequestType,
            PlannedDate: req.body.PlannedDate ? req.body.PlannedDate : null,
        })
        res.status(200).json({message: "Заявка отредактирована"})
    }
    catch (e) {
        res.status(500).json({message: `Не удалось отредактировать заявку: ${e}`})
    }
}

export const closeRequest = async function (req, res) {
    try {
        const Auditor = await UserModel.findOne({name: req.body.Auditor}).select('_id')
        await RequestModel.findOneAndUpdate({_id: req.body.id}, {
            isExecuted: true,
            ExecuteDate: Date.now(),
            PlannedDate: null,
            Auditor})
        res.status(200).json({message: "Заявка закрыта"})
    }
    catch (e) {
        res.status(500).json({message: `Не удалось закрыть заявку: ${e}`})
    }
}

export const deleteRequest = async function (req, res) {
    try {
        await RequestModel.findOneAndDelete({_id: req.body.id})
        res.status(200).json({message: "Заявка удалена"})
    }
    catch (e) {
        res.status(500).json({message: `Не удалось удалить заявку: ${e}`})
    }
}

export const getActNames = async function (req, res) {
    try {
        const acts = await RequestModel.findOne({_id: req.body.id}).select('Acts')
        res.status(200).json(acts.Acts)
    }
    catch (e) {
        res.status(500).json({message: `Не удалось найти акты: ${e}`})
    }
}

export const getTareNames = async function (req, res) {
    try {
        const acts = await RequestModel.findOne({_id: req.body.id}).select('Tares')
        res.status(200).json(acts.Tares)
    }
    catch (e) {
        res.status(500).json({message: `Не удалось найти тарировки: ${e}`})
    }
}

export const getAct = async function (req, res) {
    try {
        const filename = process.env.ACT_BASE_PATH + req.body.name
        res.status(200).sendFile(filename)
    }
    catch (e) {
        res.status(500).json({message: `Не удалось открыть файл`})
    }
}

export const getTare = async function (req, res) {
    try {
        const filename = process.env.TARE_BASE_PATH + req.body.name
        res.status(200).sendFile(filename)
    }
    catch (e) {
        res.status(500).json({message: `Не удалось открыть файл`})
    }
}


export const searchRequests = async function (req, res) {
    try {
        const requests = await RequestModel.find({VehicleRegNum: {$regex: req.body.regNum.trim()}}).sort(({ _id: -1 })).limit(15)
        res.status(200).json(requests)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}

export const getStatistics = async function (req, res) {
    try {
        const executors = await ExecutorModel.find({_id: {$nin: ['61e17dc4749a917e0a0a62f1', '61e17e04749a917e0a0a62f2', '61e17e80749a917e0a0a62f3', '61e17e93749a917e0a0a62f4', '61d744d647a4f92e864356cd']}}).select('_id').select('name')
        let result = []
        let totalCounts = {}

        for await (const executor of executors) {
            const requests = await RequestModel.find({Executor:  executor._id, ExecuteDate: {$gte: req.body.dateFrom, $lt: req.body.dateTill}})
            totalCounts[executor.name] = requests.length
            let requestCounts = {"Исполнитель": executor.name}
            requests.forEach(request => {
                if (request.RequestType) {
                    const type = request.RequestType.description
                    requestCounts[type] ? requestCounts[type] += 1 : requestCounts[type] = 1
                }

            })
            result.push(requestCounts)
        }

        res.status(200).json({totalCounts: totalCounts, result: result})
    }
    catch (e) {
        res.status(500).json({message: `Ошибка монго сервера: ${e}`})
    }
}