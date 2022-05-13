import { Map, Overlay  } from "pigeon-maps"
import useMongoService from "../services/useMongoService"
import {observer, useLocalObservable} from "mobx-react-lite"
import {useEffect} from "react"
import useGetDistance from "../hooks/useGetDistance"
import {FcAutomotive, FcHome, FcLowPriority} from "react-icons/fc"
import {IconContext} from "react-icons"
import { motion } from "framer-motion"
import {pageMotion} from "../funcs/funcs"

const MapPage = observer(() => {
    const {getCoordsForRequests, getCoordsForExecs} = useGetDistance()
    const {getAllUnexecutedRequestsWithId, getExecId, getBases} = useMongoService()

    const mapState = useLocalObservable(() => ({
        execData: null,
        setExecData(value) {
            this.execData = value
        },
        activeExecutor: false,
        setActiveExecutor(id) {
            this.activeExecutor = id
        },
        requestsData: null,
        setRequestsData(data) {
            this.requestsData = data
        },
        activeRequest: false,
        setActiveRequest(id) {
            this.activeRequest = id
        },
        basesData: null,
        setBasesData(data) {
            this.basesData = data
        },
        activeBase: null,
        setActiveBase(base) {
            this.activeBase = base
        }
    }))

    const updateExecCoords = async () => {
        const execData = await getExecId()
                const execDataWithCoords = await getCoordsForExecs(execData)

        mapState.setExecData(execDataWithCoords)
    }

    const updateRequestCoords = async () => {
        const unexRequests = await getAllUnexecutedRequestsWithId()
        const unexRequestsWithCoords = await getCoordsForRequests(unexRequests)
        mapState.setRequestsData(unexRequestsWithCoords)
    }

    const updateBasesCoords = async () => {
        const bases = await getBases()
        mapState.setBasesData(bases)
    }



    useEffect(() => {
        const execInterval = setInterval(async () => await updateExecCoords(), 30000);
        (async () => {
            await updateExecCoords()
            await updateRequestCoords()
            await updateBasesCoords()
        })()
        return () => {
            clearInterval(execInterval)
            mapState.setExecData(null)
            mapState.setRequestsData(null)
        }
    }, [])

    return (
        <motion.div
            key='map'
            animate={'visible'}
            initial={'hidden'}
            exit={'hidden'}
            variants={pageMotion()}
            className={'flex flex-col h-[950px] relative'}>
            <div className={'w-[90%] h-[80%] mx-auto mt-10 rounded-3xl overflow-hidden cursor-pointer bg-amber-400'}>
                <Map defaultCenter={[52.1352, 37.6666]} defaultZoom={7} attribution={false}>
                    {mapState.basesData && mapState.basesData.map(item => (
                        <Overlay key={item._id}  color anchor={[item.lat, item.lon]}>
                            <div>
                                <h3 className={'h-5 font-sm'}>{mapState.activeBase && item._id === mapState.activeBase._id ? item.name : ''}</h3>

                                <IconContext.Provider  value={{className: 'text-xl'}}>
                                    <FcHome
                                        onMouseEnter={() => mapState.setActiveBase(item)}
                                        onMouseLeave={() => mapState.setActiveBase(null)}
                                    />
                                </IconContext.Provider>

                            </div>
                        </Overlay>
                    ))}
                    {mapState.execData && mapState.execData.map(item => (
                        <Overlay key={item._id}  color anchor={[item.lat, item.lon]}>
                            <div>
                                <h3 className={'h-5 font-sm'}>{mapState.activeExecutor === item._id ? item.name : ''}</h3>

                                <IconContext.Provider  value={{className: 'text-2xl'}}>
                                    <FcAutomotive
                                        onMouseEnter={() => mapState.setActiveExecutor(item._id)}
                                        onMouseLeave={() => mapState.setActiveExecutor(null)}
                                    />
                                </IconContext.Provider>

                            </div>
                        </Overlay>
                    ))}
                    {mapState.requestsData && mapState.requestsData.map(item => (
                        <Overlay key={item._id} color anchor={[item.lat, item.lon]}>
                            <div>
                                <h3 className={'h-5 font-sm'}>{mapState.activeRequest === item._id ? `${item.VehicleRegNum} ${item.Description}` : ''}</h3>
                                <IconContext.Provider  value={{className: 'text-2xl'}}>
                                    <FcLowPriority
                                        onMouseEnter={() => mapState.setActiveRequest(item._id)}
                                        onMouseLeave={() => mapState.setActiveRequest(null)}
                                    />
                                </IconContext.Provider>

                            </div>
                        </Overlay>
                    ))}

                </Map>
            </div>
        </motion.div>
    )
})

export default MapPage;