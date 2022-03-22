import { useHttpHooks } from "../hooks/usehttp.hooks"
import {Config} from "../config";
import axios from "axios";


const useMongoService = (loading = true) => {
    const {request} = useHttpHooks(loading)

    const transformRequestData = requestData => {
        const newData = requestData.map((item) => {
            return (
                {
                    ...item,
                    Creator: item.Creator ? item.Creator.name : null,
                    Auditor: item.Auditor ? item.Auditor.name : null,
                    Executor: item.Executor ? item.Executor.name : null,
                    Region: item.Region ? item.Region.name : null,
                    RequestType: item.RequestType ? item.RequestType.description : null,
                }
            )
        })
        return newData
    }


    const getAllRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-all`)
        return transformRequestData(res)
    }

    const getAllUnexecutedRequests = async () => {
        const res =  await request(`${Config.baseRoute}/requests-all-unex`)
        return transformRequestData(res)
    }

    const getVorRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-vor`)
        return transformRequestData(res)
    }

    const getVorUnexecutedRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-vor-unex`)
        return transformRequestData(res)
    }

    const getKurRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-kur`)
        return transformRequestData(res)
    }

    const getKurUnexecutedRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-kur-unex`)
        return transformRequestData(res)
    }

    const getOreRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-ore`)
        return transformRequestData(res)
    }

    const getOreUnexecutedRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-ore-unex`)
        return transformRequestData(res)
    }

    const getBelRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-bel`)
        return transformRequestData(res)
    }

    const getBelUnexecutedRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-bel-unex`)
        return transformRequestData(res)
    }

    const getLipRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-lip`)
        return transformRequestData(res)
    }

    const getLipUnexecutedRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-lip-unex`)
        return transformRequestData(res)
    }

    const getTulRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-tul`)
        return transformRequestData(res)
    }

    const getTulUnexecutedRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-tul-unex`)
        return transformRequestData(res)
    }

    const getVorRegRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-vor-reg`)
        return transformRequestData(res)
    }

    const getVorRegUnexecutedRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-vor-reg-unex`)
        return transformRequestData(res)
    }

    const getOreRegRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-ore-reg`)
        return transformRequestData(res)
    }

    const getOreRegUnexecutedRequests = async () => {
        const res = await request(`${Config.baseRoute}/requests-ore-reg-unex`)
        return transformRequestData(res)
    }

    const searchRequests = async (body) => {
        const res = await request(`${Config.baseRoute}/search-requests`, 'POST', JSON.stringify(body))
        return transformRequestData(res)
    }


    const getAllExecutors = async () => {
        return await request(`${Config.baseRoute}/executors`)
    }

    const getAllRegions = async () => {
        return await request(`${Config.baseRoute}/regions`)
    }

    const getAllRequestTypes = async () => {
        return await request(`${Config.baseRoute}/request-type`)
    }

    const getCurrentUsers = async () => {
        return await request(`${Config.baseRoute}/current-users`)
    }

    const writeNewRequest = async (body) => {
        return await request(`${Config.baseRoute}/request-write`, 'POST', JSON.stringify(body) )
    }

    const getRequestsByRegNom = async (body) => {
        const res = await request(`${Config.baseRoute}/request-reg-nom`, 'POST', JSON.stringify(body))
        return transformRequestData(res)
    }

    const editRequest = async (body) => {
        return await request(`${Config.baseRoute}/request-edit`, 'POST', JSON.stringify(body))
    }

    const closeRequest = async (body) => {
        return await request(`${Config.baseRoute}/request-close`, 'POST', JSON.stringify(body))
    }

    const deleteRequest = async (body) => {
        return await request(`${Config.baseRoute}/request-delete`, 'POST', JSON.stringify(body))
    }

    const addFile = async (body) => {
        return await request(`${Config.baseRoute}/add-file`, 'POST', JSON.stringify(body))
    }

    const getActNames = async (body) => {
        return await request(`${Config.baseRoute}/get-act-names`, 'POST', JSON.stringify(body))
    }

    const getTareNames = async (body) => {
        return await request(`${Config.baseRoute}/get-tare-names`, 'POST', JSON.stringify(body))
    }

    const getAct = async (body) => {
        return await axios.post(`${Config.baseRoute}/get-act`, body, { responseType: 'blob' })
    }

    const getTare = async (body) => {
        return await axios.post(`${Config.baseRoute}/get-tare`, body, { responseType: 'blob' })
    }



    return {writeNewRequest, searchRequests, deleteRequest, getTareNames, getAct, getTare, getActNames, addFile, closeRequest, editRequest, getRequestsByRegNom, getCurrentUsers, getAllExecutors, getAllRequestTypes, getAllRegions, getAllRequests, getAllUnexecutedRequests, getVorRequests, getVorUnexecutedRequests, getKurRequests, getKurUnexecutedRequests, getOreRequests, getOreUnexecutedRequests, getBelRequests, getBelUnexecutedRequests, getLipRequests, getLipUnexecutedRequests, getTulRequests, getTulUnexecutedRequests, getVorRegRequests, getVorRegUnexecutedRequests, getOreRegRequests, getOreRegUnexecutedRequests}
}

export default useMongoService