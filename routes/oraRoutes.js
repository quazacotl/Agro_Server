import Router from 'express'
import {
    getVehiclesByRegNum,
    getVehiclesById,
    getVehiclesByVin
} from '../controllers/oraControllers.js'

const oraRouter = Router()


oraRouter.post('/vehicles-reg', getVehiclesByRegNum)

oraRouter.post('/vehicles-id', getVehiclesById)

oraRouter.post('/vehicles-vin', getVehiclesByVin)



export default oraRouter