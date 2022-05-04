import {Config} from "../config";
import axios from "axios";


const useMongoService = () => {

    const transformRequestData = requestData => {
        const newData = requestData.map((item) => {
            let executors = []
            if (item.Executor) {
                item.Executor.forEach(item => {
                    executors.push(item.name)
                })
            }

            return (
                {
                    ...item,
                    Creator: item.Creator ? item.Creator.name : null,
                    Auditor: item.Auditor ? item.Auditor.name : null,
                    Executor: item.Executor ? executors : null,
                    Region: item.Region ? item.Region.name : null,
                    RequestType: item.RequestType ? item.RequestType.description : null,
                }
            );
        })
        return newData
    }


    const getAllRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-all`)
        return transformRequestData(res.data)
    }

    const getAllUnexecutedRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-all-unex`)
        return transformRequestData(res.data)
    }

    const getAllUnexecutedRequestsWithId = async () => {
        const res =  await axios.get(`${Config.baseRoute}/requests-all-unex-id`)
        return transformRequestData(res.data)
    }

    const getVorRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-vor`)
        return transformRequestData(res.data)
    }

    const getVorUnexecutedRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-vor-unex`)
        return transformRequestData(res.data)
    }

    const getKurRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-kur`)
        return transformRequestData(res.data)
    }

    const getKurUnexecutedRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-kur-unex`)
        return transformRequestData(res.data)
    }

    const getOreRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-ore`)
        return transformRequestData(res.data)
    }

    const getOreUnexecutedRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-ore-unex`)
        return transformRequestData(res.data)
    }

    const getBelRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-bel`)
        return transformRequestData(res.data)
    }

    const getBelUnexecutedRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-bel-unex`)
        return transformRequestData(res.data)
    }

    const getLipRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-lip`)
        return transformRequestData(res.data)
    }

    const getLipUnexecutedRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-lip-unex`)
        return transformRequestData(res.data)
    }

    const getTulRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-tul`)
        return transformRequestData(res.data)
    }

    const getTulUnexecutedRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-tul-unex`)
        return transformRequestData(res.data)
    }

    const getVorRegRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-vor-reg`)
        return transformRequestData(res.data)
    }

    const getVorRegUnexecutedRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-vor-reg-unex`)
        return transformRequestData(res.data)
    }

    const getOreRegRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-ore-reg`)
        return transformRequestData(res.data)
    }

    const getOreRegUnexecutedRequests = async () => {
        const res = await axios.get(`${Config.baseRoute}/requests-ore-reg-unex`)
        return transformRequestData(res.data)
    }

    const searchRequests = async (body) => {
        const res = await axios.post(`${Config.baseRoute}/search-requests`, body)
        return transformRequestData(res.data)
    }


    const getAllExecutors = async () => {
        const res = await axios.get(`${Config.baseRoute}/executors`)
        return res.data
    }

    const getAllRegions = async () => {
        const res =  await axios.get(`${Config.baseRoute}/regions`)
        return res.data
    }

    const getAllRequestTypes = async () => {
        const res =  await axios.get(`${Config.baseRoute}/request-type`)
        return res.data
    }

    const getCurrentUsers = async () => {
        const res =  await axios.get(`${Config.baseRoute}/current-users`)
        return res.data
    }

    const writeNewRequest = async (body) => {
        const res =  await axios.post(`${Config.baseRoute}/request-write`, body )
        return res.data
    }

    const getRequestsByOraId = async (body) => {
        const res = await axios.post(`${Config.baseRoute}/request-ora-id`, body)
        return transformRequestData(res.data)
    }

    const editRequest = async (body) => {
        const res =  await axios.post(`${Config.baseRoute}/request-edit`, body)
        return res.data
    }

    const closeRequest = async (body) => {
        const res =  await axios.post(`${Config.baseRoute}/request-close`, body)
        return res.data
    }

    const deleteRequest = async (body) => {
        const res =  await axios.post(`${Config.baseRoute}/request-delete`, body)
        return res.data
    }

    const addFile = async (body) => {
        const res =  await axios.post(`${Config.baseRoute}/add-file`, body)
        return res.data
    }

    const getActNames = async (body) => {
        const res =  await axios.post(`${Config.baseRoute}/get-act-names`, body)
        return res.data
    }

    const getTareNames = async (body) => {
        const res =  await axios.post(`${Config.baseRoute}/get-tare-names`, body)
        return res.data
    }

    const getAct = async (body) => {
        const res =  await await axios.post(`${Config.baseRoute}/get-act`, body, { responseType: 'blob' })
        return res.data
    }

    const getTare = async (body) => {
        const res =  await await axios.post(`${Config.baseRoute}/get-tare`, body, { responseType: 'blob' })
        return res.data
    }

    const getStatistics = async (body) => {
        const res =  await axios.post(`${Config.baseRoute}/get-statistics`, body)
        return res.data
    }

    const updateRequest = async (body) => {
        const res =  await axios.post(`${Config.baseRoute}/update-request`, body)
        return res.data
    }


    const getExecId = async () => {
        const res =  await axios.get(`${Config.baseRoute}/executors-id`)
        return res.data
    }

    const getBases = async () => {
        const res =  await axios.get(`${Config.baseRoute}/get-bases`)
        return res.data
    }


    return {writeNewRequest, getBases, getAllUnexecutedRequestsWithId, getExecId, updateRequest, getStatistics, searchRequests, deleteRequest, getTareNames, getAct, getTare, getActNames, addFile, closeRequest, editRequest, getRequestsByOraId, getCurrentUsers, getAllExecutors, getAllRequestTypes, getAllRegions, getAllRequests, getAllUnexecutedRequests, getVorRequests, getVorUnexecutedRequests, getKurRequests, getKurUnexecutedRequests, getOreRequests, getOreUnexecutedRequests, getBelRequests, getBelUnexecutedRequests, getLipRequests, getLipUnexecutedRequests, getTulRequests, getTulUnexecutedRequests, getVorRegRequests, getVorRegUnexecutedRequests, getOreRegRequests, getOreRegUnexecutedRequests}
}

export default useMongoService