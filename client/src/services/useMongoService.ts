import {Config} from "../config";
import axios from "axios";
import {
    executors,
    RequestDataInterface,
    requestTypes,
    responseType, Statistics,
    UncutRequestDataInterface
} from "../interfaces/interfaces";


interface searchBody {
    regNum: string
}

interface getByOraIdBody {
    oraId: number
}

interface closeRequestBody {
    id: string
    auditor: string
}

interface deleteRequestBody {
    id: string
}
interface getFileNamesBody extends deleteRequestBody {}

interface getFileBody {
    name: string
}

interface statisticsBody {
    dateFrom: Date
    dateTill: Date
}

interface updateRequestBody {
    base: string
    object: string
    region: string
    vin: string
    regNum: string
    oraId: number
    id: number
}

interface getBases{
    lat: number
    lon: number
    name: string
    _id: string
}

interface getExecs extends getBases{
    distance: number
}


const useMongoService = () => {

    const transformRequestData = (requestData: UncutRequestDataInterface[]): RequestDataInterface[] => {
        const newData = requestData.map((item) => {
            let executors: string[] = []
            if (item.Executor) {
                item.Executor.forEach(item => {
                    executors.push(item.name)
                })
            }

            return (
                {
                    ...item,
                    Creator: item.Creator.name,
                    Auditor: item.Auditor ? item.Auditor.name : null,
                    Executor: item.Executor ? executors : null,
                    Region: item.Region ? item.Region.name : null,
                    RequestType: item.RequestType ? item.RequestType.description : null,
                }
            );
        })
        return newData
    }


    const getAllRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-all`)
        return transformRequestData(res.data)
    }

    const getAllUnexecutedRequests = async (): Promise<RequestDataInterface[]>  => {
        const res = await axios.get(`${Config.baseRoute}/requests-all-unex`)
        return transformRequestData(res.data)
    }

    const getAllUnexecutedRequestsWithId = async (): Promise<RequestDataInterface[]> => {
        const res =  await axios.get(`${Config.baseRoute}/requests-all-unex-id`)
        return transformRequestData(res.data)
    }

    const getVorRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-vor`)
        return transformRequestData(res.data)
    }

    const getVorUnexecutedRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-vor-unex`)
        return transformRequestData(res.data)
    }

    const getKurRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-kur`)
        return transformRequestData(res.data)
    }

    const getKurUnexecutedRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-kur-unex`)
        return transformRequestData(res.data)
    }

    const getOreRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-ore`)
        return transformRequestData(res.data)
    }

    const getOreUnexecutedRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-ore-unex`)
        return transformRequestData(res.data)
    }

    const getBelRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-bel`)
        return transformRequestData(res.data)
    }

    const getBelUnexecutedRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-bel-unex`)
        return transformRequestData(res.data)
    }

    const getLipRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-lip`)
        return transformRequestData(res.data)
    }

    const getLipUnexecutedRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-lip-unex`)
        return transformRequestData(res.data)
    }

    const getTulRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-tul`)
        return transformRequestData(res.data)
    }

    const getTulUnexecutedRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-tul-unex`)
        return transformRequestData(res.data)
    }

    const getVorRegRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-vor-reg`)
        return transformRequestData(res.data)
    }

    const getVorRegUnexecutedRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-vor-reg-unex`)
        return transformRequestData(res.data)
    }

    const getOreRegRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-ore-reg`)
        return transformRequestData(res.data)
    }

    const getOreRegUnexecutedRequests = async (): Promise<RequestDataInterface[]> => {
        const res = await axios.get(`${Config.baseRoute}/requests-ore-reg-unex`)
        return transformRequestData(res.data)
    }


    const searchRequests = async (body: searchBody): Promise<RequestDataInterface[]> => {
        const res = await axios.post(`${Config.baseRoute}/search-requests`, body)
        return transformRequestData(res.data)
    }


    const getAllExecutors = async (): Promise<executors[]> => {
        const res = await axios.get(`${Config.baseRoute}/executors`)
        return res.data
    }

    const getAllRegions = async (): Promise<executors[]> => {
        const res =  await axios.get(`${Config.baseRoute}/regions`)
        return res.data
    }

    const getAllRequestTypes = async (): Promise<requestTypes[]> => {
        const res =  await axios.get(`${Config.baseRoute}/request-type`)
        return res.data
    }

    const getCurrentUsers = async (): Promise<executors[]> => {
        const res =  await axios.get(`${Config.baseRoute}/current-users`)
        return res.data
    }

    const writeNewRequest = async (body: RequestDataInterface): Promise<responseType> => {
        const res =  await axios.post(`${Config.baseRoute}/request-write`, body )
        return res.data
    }


    const getRequestsByOraId = async (body: getByOraIdBody): Promise<RequestDataInterface[]> => {
        const res = await axios.post(`${Config.baseRoute}/request-ora-id`, body)
        return transformRequestData(res.data)
    }

    const editRequest = async (body: RequestDataInterface): Promise<responseType> => {
        const res =  await axios.post(`${Config.baseRoute}/request-edit`, body)
        return res.data
    }

    const closeRequest = async (body: closeRequestBody): Promise<responseType> => {
        const res =  await axios.post(`${Config.baseRoute}/request-close`, body)
        return res.data
    }

    const deleteRequest = async (body: deleteRequestBody): Promise<responseType> => {
        const res =  await axios.post(`${Config.baseRoute}/request-delete`, body)
        return res.data
    }

    // const addFile = async (body) => {
    //     const res =  await axios.post(`${Config.baseRoute}/add-file`, body)
    //     return res.data
    // }

    const getActNames = async (body: getFileNamesBody): Promise <string[]> => {
        const res =  await axios.post(`${Config.baseRoute}/get-act-names`, body)
        return res.data
    }

    const getTareNames = async (body: getFileNamesBody): Promise <string[]> => {
        const res =  await axios.post(`${Config.baseRoute}/get-tare-names`, body)
        return res.data
    }

    const getAct = async (body: getFileBody) => {
        const res =  await axios.post(`${Config.baseRoute}/get-act`, body, { responseType: 'blob' })
        return res.data
    }

    const getTare = async (body: getFileBody) => {
        const res = await axios.post(`${Config.baseRoute}/get-tare`, body, { responseType: 'blob' })
        return res.data
    }

    const getStatistics = async (body: statisticsBody): Promise<Statistics> => {
        const res =  await axios.post(`${Config.baseRoute}/get-statistics`, body)
        return res.data
    }

    const updateRequest = async (body: updateRequestBody): Promise<responseType> => {
        const res =  await axios.post(`${Config.baseRoute}/update-request`, body)
        return res.data
    }


    const getExecId = async (): Promise<getExecs[]> => {
        const res =  await axios.get(`${Config.baseRoute}/executors-id`)
        return res.data
    }

    const getBases = async (): Promise<getBases[]> => {
        const res =  await axios.get(`${Config.baseRoute}/get-bases`)
        return res.data
    }


    return {writeNewRequest, getBases, getAllUnexecutedRequestsWithId, getExecId, updateRequest, getStatistics, searchRequests, deleteRequest, getTareNames, getAct, getTare, getActNames, closeRequest, editRequest, getRequestsByOraId, getCurrentUsers, getAllExecutors, getAllRequestTypes, getAllRegions, getAllRequests, getAllUnexecutedRequests, getVorRequests, getVorUnexecutedRequests, getKurRequests, getKurUnexecutedRequests, getOreRequests, getOreUnexecutedRequests, getBelRequests, getBelUnexecutedRequests, getLipRequests, getLipUnexecutedRequests, getTulRequests, getTulUnexecutedRequests, getVorRegRequests, getVorRegUnexecutedRequests, getOreRegRequests, getOreRegUnexecutedRequests}
}

export default useMongoService