import Router from 'express'
import {
    getVehiclesByRegNum,
    getVehiclesById,
    getVehiclesByVin,
    getVehiclesByOraId
} from '../controllers/oraControllers.js'

const oraRouter = Router()


oraRouter.post('/vehicles-reg', getVehiclesByRegNum)

oraRouter.post('/vehicles-id', getVehiclesById)

oraRouter.post('/vehicles-vin', getVehiclesByVin)

oraRouter.post('/vehicles-ora-id', getVehiclesByOraId)



export default oraRouter