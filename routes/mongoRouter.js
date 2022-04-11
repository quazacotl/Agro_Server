import Router from 'express'
import {
    getAllRequests, getAllUnexecutedRequests,
    getBelRequests, getBelUnexecutedRequests,
    getKurRequests, getKurUnexecutedRequests,
    getLipRequests, getLipUnexecutedRequests, getOreRegRequests, getOreRegUnexecutedRequests,
    getOreRequests, getOreUnexecutedRequests,
    getTulRequests, getTulUnexecutedRequests, getVorRegRequests, getVorRegUnexecutedRequests,
    getVorRequests, getVorUnexecutedRequests,
    getAllExecutors, getAllRegions, getAllRequestTypes, writeNewRequest, getCurrentUsers, getRequestsByVinReg,
    editRequest, closeRequest, getActNames,
    getAct, getTare, getTareNames, deleteRequest, searchRequests, getStatistics,
} from '../controllers/mongoControllers.js'

const mongoRouter = Router()


mongoRouter.get('/requests-all', getAllRequests)

mongoRouter.get('/requests-all-unex', getAllUnexecutedRequests)

mongoRouter.get('/requests-vor', getVorRequests)

mongoRouter.get('/requests-vor-unex', getVorUnexecutedRequests)

mongoRouter.get('/requests-lip', getLipRequests)

mongoRouter.get('/requests-lip-unex', getLipUnexecutedRequests)

mongoRouter.get('/requests-kur', getKurRequests)

mongoRouter.get('/requests-kur-unex', getKurUnexecutedRequests)

mongoRouter.get('/requests-ore', getOreRequests)

mongoRouter.get('/requests-ore-unex', getOreUnexecutedRequests)

mongoRouter.get('/requests-bel', getBelRequests)

mongoRouter.get('/requests-bel-unex', getBelUnexecutedRequests)

mongoRouter.get('/requests-tul', getTulRequests)

mongoRouter.get('/requests-tul-unex', getTulUnexecutedRequests)

mongoRouter.get('/requests-vor-reg', getVorRegRequests)

mongoRouter.get('/requests-vor-reg-unex', getVorRegUnexecutedRequests)

mongoRouter.get('/requests-ore-reg', getOreRegRequests)

mongoRouter.get('/requests-ore-reg-unex', getOreRegUnexecutedRequests)

mongoRouter.post('/search-requests', searchRequests)

mongoRouter.get('/executors', getAllExecutors)

mongoRouter.get('/regions', getAllRegions)

mongoRouter.get('/request-type', getAllRequestTypes)

mongoRouter.get('/current-users', getCurrentUsers)

mongoRouter.post('/request-write', writeNewRequest)

mongoRouter.post('/request-vin', getRequestsByVinReg)

mongoRouter.post('/request-edit', editRequest)

mongoRouter.post('/request-delete', deleteRequest)

mongoRouter.post('/request-close', closeRequest)

mongoRouter.post('/get-act-names', getActNames)

mongoRouter.post('/get-tare-names', getTareNames)

mongoRouter.post('/get-act', getAct)

mongoRouter.post('/get-tare', getTare)

mongoRouter.post('/get-statistics', getStatistics)



export default mongoRouter