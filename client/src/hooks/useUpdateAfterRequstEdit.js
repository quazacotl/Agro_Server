import {regionsEnum} from "../interfaces/interfaces";
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

    const updateAfterRequestEdit = async () => {
        if (Store.searchInputValue.length > 2) {
            const res = await searchRequests({regNum: Store.searchInputValue})
            Store.setRequestsData(res)
        } else {
            switch (Store.currentRegionSelected) {
                case regionsEnum.all: makeRequest(getAllRequests, getAllUnexecutedRequests)
                    break
                case regionsEnum.kur: makeRequest(getKurRequests, getKurUnexecutedRequests)
                    break
                case regionsEnum.vor: makeRequest(getVorRequests, getVorUnexecutedRequests)
                    break
                case regionsEnum.ore: makeRequest(getOreRequests, getOreUnexecutedRequests)
                    break
                case regionsEnum.tul: makeRequest(getTulRequests, getTulUnexecutedRequests)
                    break
                case regionsEnum.bel: makeRequest(getBelRequests, getBelUnexecutedRequests)
                    break
                case regionsEnum.lip: makeRequest(getLipRequests, getLipUnexecutedRequests)
                    break
                case regionsEnum.orereg: makeRequest(getOreRegRequests, getOreRegUnexecutedRequests)
                    break
                case regionsEnum.vorreg: makeRequest(getVorRegRequests, getVorRegUnexecutedRequests)
                    break
                default: makeRequest(getAllRequests, getAllUnexecutedRequests)
            }
        }

    }

    return {updateAfterRequestEdit}
}

export default useUpdateAfterEdit