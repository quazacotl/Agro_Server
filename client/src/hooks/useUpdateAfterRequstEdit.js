import {regions} from "../interfaces/interfaces";
import Store from "../state/Store";
import useMongoService from "../services/useMongoService";
import {sortRequest} from "../funcs/funcs";


const useUpdateAfterEdit = () => {
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
    } = useMongoService(false)

    const makeRequest = async (generalRequestFn, partialRequestFn) => {
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

    const updateAfterRequestEdit = () => {
        switch (Store.currentRegionSelected) {
            case regions.all: makeRequest(getAllRequests, getAllUnexecutedRequests)
                break
            case regions.kur: makeRequest(getKurRequests, getKurUnexecutedRequests)
                break
            case regions.vor: makeRequest(getVorRequests, getVorUnexecutedRequests)
                break
            case regions.ore: makeRequest(getOreRequests, getOreUnexecutedRequests)
                break
            case regions.tul: makeRequest(getTulRequests, getTulUnexecutedRequests)
                break
            case regions.bel: makeRequest(getBelRequests, getBelUnexecutedRequests)
                break
            case regions.lip: makeRequest(getLipRequests, getLipUnexecutedRequests)
                break
            case regions.orereg: makeRequest(getOreRegRequests, getOreRegUnexecutedRequests)
                break
            case regions.vorreg: makeRequest(getVorRegRequests, getVorRegUnexecutedRequests)
                break
            default: makeRequest(getAllRequests, getAllUnexecutedRequests)
        }
    }

    return {updateAfterRequestEdit}
}

export default useUpdateAfterEdit