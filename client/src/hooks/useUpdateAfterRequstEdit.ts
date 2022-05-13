import {regionsEnum, RequestDataInterface} from "../interfaces/interfaces";
import Store from "../state/Store";
import useMongoService from "../services/useMongoService";
import {sortRequest} from "../funcs/funcs";


const useUpdateAfterEdit = () => {
    const {searchRequests} = useMongoService()
    const {getAllRequests,
        getAllUnexecutedRequests,
        getKurRequests,
        getBelRequests,
        getLipRequests,
        getOreRequests,
        getTulRequests,
        getVorRequests,
        getOreRegRequests,
        getVorRegRequests,
        getBelUnexecutedRequests,
        getKurUnexecutedRequests,
        getLipUnexecutedRequests,
        getTulUnexecutedRequests,
        getOreUnexecutedRequests,
        getVorUnexecutedRequests,
        getOreRegUnexecutedRequests,
        getVorRegUnexecutedRequests,
    } = useMongoService()

    const makeRequest = async (generalRequestFn: ()=>Promise<RequestDataInterface[]>, partialRequestFn: ()=>Promise<RequestDataInterface[]>) => {
        if (Store.isShowUnexecuted) {
            const res = await generalRequestFn()
            Store.setRequestsData(res)
            sortRequest(Store.sortBy)
        } else {
            const res = await partialRequestFn()
            Store.setRequestsData(res)
            sortRequest(Store.sortBy)
        }
    }

    const updateAfterRequestEdit = async (): Promise<void> => {
        if (Store.searchInputValue.length > 2) {
            const res = await searchRequests({regNum: Store.searchInputValue})
            Store.setRequestsData(res)
        } else {
            switch (Store.currentRegionSelected) {
                case regionsEnum.all: await makeRequest(getAllRequests, getAllUnexecutedRequests)
                    break
                case regionsEnum.kur: await makeRequest(getKurRequests, getKurUnexecutedRequests)
                    break
                case regionsEnum.vor: await makeRequest(getVorRequests, getVorUnexecutedRequests)
                    break
                case regionsEnum.ore: await makeRequest(getOreRequests, getOreUnexecutedRequests)
                    break
                case regionsEnum.tul: await makeRequest(getTulRequests, getTulUnexecutedRequests)
                    break
                case regionsEnum.bel: await makeRequest(getBelRequests, getBelUnexecutedRequests)
                    break
                case regionsEnum.lip: await makeRequest(getLipRequests, getLipUnexecutedRequests)
                    break
                case regionsEnum.orereg: await makeRequest(getOreRegRequests, getOreRegUnexecutedRequests)
                    break
                case regionsEnum.vorreg: await makeRequest(getVorRegRequests, getVorRegUnexecutedRequests)
                    break
                default: await makeRequest(getAllRequests, getAllUnexecutedRequests)
            }
        }
    }

    return {updateAfterRequestEdit}
}

export default useUpdateAfterEdit