import {useEffect} from "react"
import {observer, useLocalObservable} from "mobx-react-lite"
import { HiPlus } from "react-icons/hi"
import {IconContext} from "react-icons"
import {useLockBodyScroll} from "../hooks/useLockBodyScroll"
import useMongoService from "../services/useMongoService"
import useGetDistance from "../hooks/useGetDistance"
import MailView from "./OutlookMessages"
import PreviousRequests from "./PreviousRequests"
import BubbleContext from "./BubbleContext"
import Store from "../state/Store"
import {dateFromIsoToLocal} from "../funcs/funcs"
import {regionsEnum, execData} from "../interfaces/interfaces"



const RequestCreationModal = observer(() => {
    useLockBodyScroll()

    const {writeNewRequest, getAllUnexecutedRequests, getRequestsByOraId, getExecId} = useMongoService()
    const {getDistance} = useGetDistance()

    interface execState {
        execData: execData[] | null
        setExecData: (data: execData[] | null)=>void
        isAddExecutor: boolean
        setIsAddExecutor: (bool: boolean)=>void
    }

    const execState = useLocalObservable(() => ({
            execData: null,
            setExecData(data) {
                this.execData = data
            },
            isAddExecutor: false,
            setIsAddExecutor(bool)  {
                this.isAddExecutor = bool
            }
        } as execState)
    )

    const setPreviousRequests = async () => {
        if (Store.currentVehicle?.TRANSP_ID) {
            const previousRequests = await getRequestsByOraId({oraId: Store.currentVehicle.TRANSP_ID})
            await Store.setPreviousRequestsData(previousRequests)
        }
    }

    const setNearestExecs = async () => {
        const execData = await getExecId()
        if (Store.currentVehicle?.LAST_LAT && Store.currentVehicle?.LAST_LON) {
            const coords = await getDistance(execData, {lat: Store.currentVehicle.LAST_LAT, lon: Store.currentVehicle.LAST_LON})
            coords.sort((a, b) => a.distance! - b.distance!)
            execState.setExecData(coords)
        }

    }

    const clearData = () => {
        Store.setLastMails([])
        Store.setReqChosenMail(null)
        Store.setReqChosenComment('')
        Store.setReqChosenExecutors([])
        Store.setReqChosenRegion('')
        Store.setPreviousRequestsData([])
        Store.setCurrentVehicle(null)
        execState.setExecData(null)
    }

    useEffect(() => {
        (async () => {
            if (Store.currentVehicle) {
                Store.setReqChosenRegion(Store.currentVehicle.REGION)
                await setPreviousRequests()
                await setNearestExecs()
            }
        })()
        return () => clearData()
    }, [])


    const setReqChosenType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        Store.setReqChosenType(e.target.value)
        if (Store.currentVehicle) {
            switch (e.target.value) {
                case 'Отсутствие сигнала GPS': Store.setReqChosenComment(`Нет с ${dateFromIsoToLocal(Store.currentVehicle.LAST_DATE)}`)
                    break
                case 'Установка Автограф+ДУТ': Store.setReqChosenComment(`Установка автограф + дут`)
                    break
                case 'Установка автографа': Store.setReqChosenComment(`Установка автографа`)
                    break
                default: Store.reqChosenComment || Store.setReqChosenComment('')
            }
        }
    }

    const setReqChosenRegion = (e: React.ChangeEvent<HTMLSelectElement>) => {
        Store.setReqChosenRegion(e.target.value)
    }

    const setReqChosenExecutor = (e: React.ChangeEvent<HTMLSelectElement>, number: number) => {
        switch (Store.reqChosenExecutors.length) {
            case 0:
                Store.setReqChosenExecutors([e.target.value])
                break
            case 1:
                if (number === 1) Store.setReqChosenExecutors([e.target.value])
                else if (number === 2) Store.setReqChosenExecutors([Store.reqChosenExecutors[0], e.target.value])
                break
            case 2:
                if (number === 1) Store.setReqChosenExecutors([e.target.value, Store.reqChosenExecutors[1]])
                else if (number === 2) Store.setReqChosenExecutors([Store.reqChosenExecutors[0], e.target.value])
        }
    }

    const setReqChosenComment = (e: React.ChangeEvent<HTMLInputElement>) => {
        Store.setReqChosenComment(e.target.value)
    }

    const saveRequest = async () => {
        let executors: string[] = []
        if (Store.reqChosenExecutors) {
            Store.reqChosenExecutors.forEach(item => {
                executors.push(item)
            })
        }
        let newRequest = {
            isExecuted: false,
            Creator: Store.currentUser,
            Executor: executors,
            Description: Store.reqChosenComment,
            SentFromName: Store.reqChosenMail ? Store.reqChosenMail.senderName : null,
            SentFromEmail: Store.reqChosenMail ? Store.reqChosenMail.senderEmail : null,
            SentFromDate: Store.reqChosenMail ? Store.reqChosenMail.sentDate : undefined,
            Region: Store.currentVehicle ? Store.currentVehicle.REGION : Store.reqChosenRegion,
            RequestType: Store.reqChosenType,
            ObjName: Store.currentVehicle ? Store.currentVehicle.OBJ_NAME : null,
            BaseName: Store.currentVehicle ? Store.currentVehicle.BASES_NAME : null,
            VehicleType: Store.currentVehicle ? Store.currentVehicle.NODE_NAME : null,
            VehicleRegNum: Store.currentVehicle ? Store.currentVehicle.REG_NOM : null,
            VehicleId: Store.currentVehicle ? Store.currentVehicle.NAV_ID : null,
            VehicleVin: Store.currentVehicle ? Store.currentVehicle.ATTR_VALUE : null,
            VehicleOraId: Store.currentVehicle ? Store.currentVehicle.TRANSP_ID : null,
        }
        await writeNewRequest(newRequest)
        Store.setShowRequestModal(false)
        const allUnexReq = await getAllUnexecutedRequests()
        Store.setRequestsData(allUnexReq)
        Store.setCurrentRegionSelected(regionsEnum.all)
        Store.setNotificationText('Заявка создана')
        Store.showNotification()
    }

    const CurrentVehicle = observer(() => {
        if (Store.currentVehicle) {
            return (
                <div>
                    <h2 className={'text-xl text-center text'}>Выбранная техника</h2>
                    <div className={'flex justify-between text-md bg-white mt-2 rounded-lg shadow-form-sh '}>
                        <div className={'px-2 py-1'}>{Store.currentVehicle.OBJ_NAME}</div>
                        <div className={'px-2 py-1'}>{Store.currentVehicle.BASES_NAME}</div>
                        <div className={'px-2 py-1'}>{Store.currentVehicle.NODE_NAME}</div>
                        <div className={'px-2 py-1'}>{Store.currentVehicle.REGION}</div>
                        <div className={'px-2 py-1'}>{Store.currentVehicle.REG_NOM}</div>
                        <div className={'px-2 py-1'}>{Store.currentVehicle.NAV_ID}</div>
                    </div>
                </div>
            )
        } else return null
    })

    const RegionSelectView = observer(() => {
        return (
            <div className={'flex flex-col gap-2'}>
                <label className={'text-xl'} htmlFor="region">Область</label>
                <select
                    defaultValue={Store.reqChosenRegion ? Store.reqChosenRegion : 'DEFAULT'}
                    className={'rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                    name="region"
                    id="region"
                    onChange={(e) => setReqChosenRegion(e)}
                >
                    <option disabled value="DEFAULT"> -- выбрать область -- </option>
                    {Store.currentRegions.map(item => (
                        <option key={item._id} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>
        )
    })

    const Executor2View = observer(() => {
        return (
            <select
                defaultValue={Store.reqChosenExecutors.length === 2 ? Store.reqChosenExecutors[1] : 'DEFAULT'}
                className={'w-full mt-2 rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                name="executor2"
                id="executor2"
                onChange={e => setReqChosenExecutor(e, 2)}
            >
                <option disabled value={"DEFAULT"}> -- выбрать исполнителя -- </option>
                {execState.execData
                    ?
                    execState.execData.map(item => (
                        <option className={'font-mono'} key={item._id} value={item.name}>{`${item.name}${Array(38 - item.name.length).fill('\xa0').join('')}~${item.distance} км`}</option>
                    ))
                    :
                    Store.currentExecutors.map(item => (
                        <option key={item._id} value={item.name}>{item.name}</option>
                    ))
                }
            </select>
        )
    })

    const onPlusExecutor = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        execState.setIsAddExecutor(true)
    }

    return (
        <div className={'flex flex-col'}>
            {Store.vehiclePageLocation ? <CurrentVehicle/> : null}
            <div className="flex gap-6 text-stone-900 w-full mt-5">
                <form className="flex flex-col gap-4">
                    <div className={'flex flex-col gap-2'}>
                        <label className={'text-xl'} htmlFor="executor1">Исполнители</label>
                        <div className={'flex justify-between items-center'}>
                            <select
                                defaultValue={'DEFAULT'}
                                className={'w-[80%] rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300   focus:outline-offset-0 focus:outline-amber-400'}
                                name="executor1"
                                id="executor1"
                                onChange={e => setReqChosenExecutor(e, 1)}
                            >
                                <option
                                    disabled={Store.currentVehicle && Store.currentVehicle.NAV_ID ? !execState.execData : false}
                                    value="DEFAULT" >
                                    -- выбрать исполнителя --
                                </option>
                                {execState.execData
                                    ?
                                    execState.execData.map(item => (
                                    <option className={'font-mono'} key={item._id} value={item.name}>{`${item.name}${Array(28 - item.name.length).fill('\xa0').join('')}~${item.distance} км`}</option>
                                    ))
                                    :
                                    Store.currentExecutors.map(item => (
                                        <option key={item._id} value={item.name}>{item.name}</option>
                                    ))
                                }
                            </select>
                            <button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => onPlusExecutor(e)}
                                disabled={execState.isAddExecutor || Store.reqChosenExecutors.length === 0}
                                className={'w-[10%] h-full rounded-lg bg-white shadow-form-sh  hover:bg-amber-50 active:bg-green-300 active:shadow-none disabled:bg-stone-300 disabled:shadow-none'}>
                                <IconContext.Provider value={{className: 'text-amber-500 text-xl m-auto'}}>
                                    <HiPlus/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        {execState.isAddExecutor ? <Executor2View/> : null}
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'text-xl'} htmlFor="type">Тип заявки</label>
                        <select
                            defaultValue={'DEFAULT'}
                            className={'rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                            name="type"
                            id="type"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReqChosenType(e)}
                        >
                            <option disabled value="DEFAULT"> -- выбрать тип заявки -- </option>
                            {Store.currentRequestTypes.map(item => (
                                <option key={item._id} value={item.description}>{item.description}</option>
                            ))}
                        </select>
                    </div>
                    {Store.currentVehicle ? null : <RegionSelectView/>}
                    <div className={'flex flex-col gap-2'}>
                        <h2 className={'text-xl'}>Прислал письмо</h2>
                        <div className={'rounded-lg h-[32px] py-1 px-2 rounded-lg shadow-form-sh py-1 text-md border-stone-300 bg-white'}>
                            {Store.reqChosenMail && Store.reqChosenMail.sentDate ?
                                `${Store.reqChosenMail.senderName}, ${new Date(Store.reqChosenMail.sentDate).toLocaleString()}` :
                                <h2> -- выберите письмо --</h2>}
                        </div>
                    </div>
                </form>
                <div className={'relative'}>
                    <h2 className={'text-center text-slate-900 text-xl'}>Последние письма</h2>
                    <MailView height={245}/>
                </div>
            </div>
            {Store.previousRequestsData.length > 0 ? <PreviousRequests/> : null}
            <div className={'flex mt-6 gap-16'}>
                <div className={'flex flex-col w-full'}>
                    <label className={'text-xl'} htmlFor="comment">Комментарий</label>
                    <input
                        value={Store.reqChosenComment}
                        type="text"
                        name={'comment'}
                        id={'comment'}
                        className={'rounded-lg mt-2 h-[32px] rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReqChosenComment(e)}
                    />
                </div>
                <button
                    onClick={saveRequest}
                    className={'h-full bg-button-gradient font-semibold shadow-form-sh  rounded-lg text-center text-lg text-white px-2 py-2 shadow-form-sh bg-button-gradient active:bg-button-gradient-invert active:shadow-none focus:outline-none focus:shadow-input-focus'}
                >Создать заявку</button>
            </div>
            {Store.isBubbleContextShow ? <BubbleContext/> : null}
        </div>
    )
})

export default RequestCreationModal