import { Map, Overlay  } from "pigeon-maps"
import useMongoService from "../services/useMongoService"
import {observer, useLocalObservable} from "mobx-react-lite"
import {useEffect} from "react"
import useGetDistance from "../hooks/useGetDistance"
import { FcAutomotive, FcLowPriority } from "react-icons/fc"
import {IconContext} from "react-icons"
import { motion } from "framer-motion"
import {pageMotion} from "../funcs/funcs"

const MapPage = observer(() => {
    const {getExecId} = useMongoService(false)
    const {getCoords} = useGetDistance()
    const {getAllUnexecutedRequestsWithId} = useMongoService()

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
    }))

    const updateExecCoords = async () => {
        const execData = await getExecId()
        const execDataWithCoords = await getCoords(execData)
        mapState.setExecData(execDataWithCoords)
    }

    const updateRequestCoords = async () => {
        const unexRequests = await getAllUnexecutedRequestsWithId()
        const unexRequestsWithCoords = await getCoords(unexRequests)
        mapState.setRequestsData(unexRequestsWithCoords)
    }



    useEffect(() => {
        const execInterval = setInterval(async () => await updateExecCoords(), 30000);
        (async () => {
            await updateExecCoords()
            await updateRequestCoords()
        })()
        return () => {
            clearInterval(execInterval)
            mapState.setExecData(null)
            mapState.setRequestsData(null)
        }
    }, [])

    return (
        <motion.div
            className={'flex flex-col h-[950px] relative'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageMotion()}
        >
            <div className={'w-[90%] h-[80%] mx-auto mt-10 rounded-3xl overflow-hidden cursor-pointer bg-amber-400'}>
                <Map defaultCenter={[52.1352, 37.6666]} defaultZoom={7}>
                    {mapState.execData && mapState.execData.map(item => (
                        <Overlay key={item._id} width={60} height={60} color anchor={[item.lat, item.lon]}>
                            <div>
                                <h3 className={'h-5 text-shadow-sm'}>{mapState.activeExecutor === item._id ? item.name : ''}</h3>

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
                        <Overlay key={item._id} width={60} height={60} color anchor={[item.lat, item.lon]}>
                            <div>
                                <h3 className={'h-5 text-shadow-sm font-sm'}>{mapState.activeRequest === item._id ? `${item.VehicleRegNum} ${item.Description}` : ''}</h3>
                                <IconContext.Provider  value={{className: 'text-xl'}}>
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