import {regions} from "../interfaces/interfaces";
import Store from "../state/Store";
import useMongoService from "../services/useMongoService";


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

    const updateAfterRequestEdit = () => {
        switch (Store.currentRegionSelected) {
            case regions.all: {
                Store.isShowUnexecuted ?
                    getAllRequests().then(data => Store.setRequestsData(data)) :
                    getAllUnexecutedRequests().then(data => Store.setRequestsData(data))
            }
                break
            case regions.kur: {
                Store.isShowUnexecuted ?
                    getKurRequests().then(data => Store.setRequestsData(data)) :
                    getKurUnexecutedRequests().then(data => Store.setRequestsData(data))
            }
                break
            case regions.vor: {
                Store.isShowUnexecuted ?
                    getVorRequests().then(data => Store.setRequestsData(data)) :
                    getVorUnexecutedRequests().then(data => Store.setRequestsData(data))
            }
                break
            case regions.ore: {
                Store.isShowUnexecuted ?
                    getOreRequests().then(data => Store.setRequestsData(data)) :
                    getOreUnexecutedRequests().then(data => Store.setRequestsData(data))
            }
                break
            case regions.tul: {
                Store.isShowUnexecuted ?
                    getTulRequests().then(data => Store.setRequestsData(data)) :
                    getTulUnexecutedRequests().then(data => Store.setRequestsData(data))
            }
                break
            case regions.bel: {
                Store.isShowUnexecuted ?
                    getBelRequests().then(data => Store.setRequestsData(data)) :
                    getBelUnexecutedRequests().then(data => Store.setRequestsData(data))
            }
                break
            case regions.lip: {
                Store.isShowUnexecuted ?
                    getLipRequests().then(data => Store.setRequestsData(data)) :
                    getLipUnexecutedRequests().then(data => Store.setRequestsData(data))
            }
                break
            case regions.orereg: {
                Store.isShowUnexecuted ?
                    getOreRegRequests().then(data => Store.setRequestsData(data)) :
                    getOreRegUnexecutedRequests().then(data => {
                        Store.setRequestsData(data)
                    })
            }
                break
            case regions.vorreg: {
                Store.isShowUnexecuted ?
                    getVorRegRequests().then(data => Store.setRequestsData(data)) :
                    getVorRegUnexecutedRequests().then(data => Store.setRequestsData(data))
            }
                break
            default: {
                Store.isShowUnexecuted ?
                    getAllRequests().then(data => Store.setRequestsData(data)) :
                    getAllUnexecutedRequests().then(data => Store.setRequestsData(data))
            }
        }
    }

    return {updateAfterRequestEdit}
}

export default useUpdateAfterEdit