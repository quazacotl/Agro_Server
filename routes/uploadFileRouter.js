import Router from 'express'
import {uploadAct, uploadTare} from '../controllers/uploadFile.js'
import multer from "multer";
import { existsSync, mkdirSync } from 'fs'
import {DateTime} from "luxon";
const mongoRouter = Router()


const actStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = process.env.ACT_BASE_PATH

        if (req.body.region) {
            switch (req.body.region) {
                case 'Воронеж': path = `${path}/Воронеж`
                    break
                case 'Курск': path = `${path}/Курск`
                    break
                case 'Орел': path = `${path}/Орел`
                    break
                case 'Липецк': path = `${path}/Липецк`
                    break
                case 'Белгород': path = `${path}/Белгород`
                    break
                case 'Тула': path = `${path}/Тула`
                    break
                default: break
            }
        } else {path = `${path}/Другое`}
        switch (req.body.type) {
            case 'tractor': path = `${path}/Трактора`
                break
            case 'harvester': path = `${path}/Комбайны`
                break
            case 'cargo': path = `${path}/Грузовые`
                break
            case 'light': path = `${path}/Легковой`
                break
            case 'scales': path = `${path}/Весы`
                break
            case 'meteo': path = `${path}/Метеостанции`
                break
            case 'airplane': path = `${path}/Самолёты`
                break
            case 'fuel': path = `${path}/Заправщики`
                break
            case 'sprayer': path = `${path}/Опрыскиватели`
                break
            case 'taho': path = `${path}/Тахографы`
                break
            case 'seeder': path = `${path}/Сеялки`
                break
            case 'rum': path = `${path}/РУМы`
                break
            case 'signal': path = `${path}/Сигнализация`
                break
            case 'other': path = `${path}/Другое`
                break
            default: break
        }
        if (!existsSync(path)) mkdirSync(path, { recursive: true })
        cb(null, path)
    },
    filename: function (req, file, cb) {
        let name
        const time = DateTime.now()
        if (req.body.vehicle) {
            name = `${time.toLocaleString({day: 'numeric', month: 'numeric', year: 'numeric'})} ${time.hour}-${time.minute} ${req.body.vehicle} акт ${file.originalname.match('\\.[^.]*$')}`
        } else {
            name = `${time.toLocaleString({day: 'numeric', month: 'numeric', year: 'numeric'})} ${time.hour}-${time.minute} акт ${file.originalname}`
        }
        cb(null, name)
    }
})

const tareStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = process.env.TARE_BASE_PATH
        switch (req.body.type) {
            case 'tractor': path = `${path}/Трактора/Тарировки`
                break
            case 'harvester': path = `${path}/Комбайны/Тарировки`
                break
            case 'cargo': path = `${path}/Грузовики/Тарировки`
                break
            case 'fuel': path = `${path}/Заправщики/Тарировки`
                break
            default: break
        }
        if (!existsSync(path)) mkdirSync(path, { recursive: true })
        cb(null, path)
    },
    filename: function (req, file, cb) {
        const time = DateTime.now()
        const name = `${time.toLocaleString(DateTime.DATE_SHORT)} ${time.hour}-${time.minute} ${req.body.vehicle} тар ${file.originalname.match('\\.[^.]*$')}`
        cb(null, name)
    }
})

const uploadActMult = multer({ storage: actStorage })
const uploadTareMult = multer({ storage: tareStorage })

mongoRouter.post('/upload-act', uploadActMult.single('act'), uploadAct)

mongoRouter.post('/upload-tare', uploadTareMult.single('tare'), uploadTare)

export default mongoRouter