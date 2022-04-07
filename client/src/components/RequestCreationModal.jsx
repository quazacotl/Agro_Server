import {useEffect, useState} from "react";
import useMongoService from "../services/useMongoService";
import Store from "../state/Store";
import { observer } from "mobx-react-lite"
import MailView from "./OutlookMessages";
import {regions} from "../interfaces/interfaces";
import PreviousRequests from "./PreviousRequests";
import BubbleContext from "./BubbleContext";
import {dateFromIsoToLocal} from "../funcs/funcs";
import { HiPlus } from "react-icons/hi"
import {IconContext} from "react-icons";



const RequestCreationModal = observer(() => {
    const [addExecutor, setAddExecutor] = useState(false)

    const {writeNewRequest, getAllUnexecutedRequests, getRequestsByRegNom} = useMongoService(false)


    useEffect(() => {
        (async () => {
            if (Store.currentVehicle) {
                const previousRequests = await getRequestsByRegNom({regNom: Store.currentVehicle.REG_NOM})
                await Store.setPreviousRequestsData(previousRequests)
                Store.setReqChosenRegion(Store.currentVehicle.REGION)
            }
            document.body.style.overflow = 'hidden';
        })()
        return () => {
            document.body.style.overflow = 'auto'
            Store.setLastMails([])
            Store.setReqChosenMail(null)
            Store.setReqChosenComment('')
            Store.setReqChosenExecutors([])
            Store.setReqChosenRegion(null)
            Store.setPreviousRequestsData([])
            Store.setCurrentVehicle(null)
        }
    }, [])



    const hideModal = (e) => {
        if(e.target === e.currentTarget) {
            Store.setShowRequestModal(false)
        }
    }


    const setReqChosenType = (e) => {
        Store.setReqChosenType(e.target.value)
        if (Store.currentVehicle) {
            switch (e.target.value) {
                case 'Отсутствие сигнала GPS': Store.setReqChosenComment(`Нет с ${dateFromIsoToLocal(Store.currentVehicle.LAST_DATE)}`)
                    break
                case 'Установка Автограф+ДУТ': Store.setReqChosenComment(`Установка автограф + дут`)
                    break
                case 'Установка автографа': Store.setReqChosenComment(`Установка автографа`)
                    break
                default: Store.setReqChosenComment('')
            }
        }
    }

    const setReqChosenRegion = (e) => {
        Store.setReqChosenRegion(e.target.value)
    }

    const setReqChosenExecutor = (e, number) => {
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

    const setReqChosenComment = (e) => {
        Store.setReqChosenComment(e.target.value)
    }

    const saveRequest = async () => {
        let executors = []
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
            SentFromDate: Store.reqChosenMail ? Store.reqChosenMail.sentDate : null,
            mailId: Store.reqChosenMail ? Store.reqChosenMail.id : null,
            mailChangeKey: Store.reqChosenMail ? Store.reqChosenMail.changeKey : null,
            Region: Store.currentVehicle ? Store.currentVehicle.REGION : Store.reqChosenRegion,
            RequestType: Store.reqChosenType,
            ObjName: Store.currentVehicle ? Store.currentVehicle.OBJ_NAME : null,
            BaseName: Store.currentVehicle ? Store.currentVehicle.BASES_NAME : null,
            VehicleType: Store.currentVehicle ? Store.currentVehicle.NODE_NAME : null,
            VehicleRegNum: Store.currentVehicle ? Store.currentVehicle.REG_NOM : null,
            VehicleId: Store.currentVehicle ? Store.currentVehicle.NAV_ID : null,
        }
        await writeNewRequest(newRequest)
        Store.setShowRequestModal(false)
        const allUnexReq = await getAllUnexecutedRequests()
        Store.setRequestsData(allUnexReq)
        Store.setCurrentRegionSelected(regions.all)
        Store.setNotificationText('Заявка создана')
        Store.showNotification()
    }

    const CurrentVehicle = () => {
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
        }
    }

    const RegionSelectView = () => {
        return (
            <div className={'flex flex-col gap-2'}>
                <label className={'text-xl'} htmlFor="region">Область</label>
                <select
                    defaultValue={Store.reqChosenRegion ? Store.reqChosenRegion : 'DEFAULT'}
                    className={'rounded-lg shadow-form-sh py-1  text-md border-stone-300 focus:outline-amber-200'}
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
    }

    const Executor2View = () => {
        return (
            <select
                defaultValue={'DEFAULT'}
                className={'w-full rounded-lg shadow-form-sh py-1 mt-5  text-md border-stone-300 focus:outline-amber-200'}
                name="executor2"
                id="executor2"
                onChange={e => setReqChosenExecutor(e, 2)}
            >
                <option disabled value="DEFAULT" > -- выбрать исполнителя -- </option>
                {Store.currentExecutors.map(item => (
                    <option key={item._id} value={item.name}>{item.name}</option>
                ))}
            </select>
        )
    }

    const onPlusExecutor = (e) => {
        e.preventDefault()
        setAddExecutor(true)
    }

    return (
        <div onMouseDown={hideModal} className={'absolute top-0 left-0 w-screen h-screen flex bg-neutral-700/50'}>
            <div className={'flex min-w-[900px] m-auto p-6 bg-blue-50 rounded-xl'}>
                <div className={'flex flex-col'}>
                    {Store.vehiclePageLocation ? <CurrentVehicle/> : null}
                    <div className="flex gap-6 text-stone-900 w-full mt-5">
                        <form className="flex flex-col gap-4">
                            <div className={'flex flex-col gap-2'}>
                                <label className={'text-xl'} htmlFor="executor1">Исполнители</label>
                                <div className={'flex justify-between items-center'}>
                                    <select
                                        defaultValue={'DEFAULT'}
                                        className={'w-[80%] rounded-lg shadow-form-sh py-1  text-md border-stone-300 focus:outline-amber-200'}
                                        name="executor1"
                                        id="executor1"
                                        onChange={e => setReqChosenExecutor(e, 1)}
                                    >
                                        <option disabled value="DEFAULT" > -- выбрать исполнителя -- </option>
                                        {Store.currentExecutors.map(item => (
                                            <option key={item._id} value={item.name}>{item.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={onPlusExecutor}
                                        disabled={addExecutor || Store.reqChosenExecutors.length === 0}
                                        className={'w-[10%] h-full rounded-lg bg-white shadow-form-sh  hover:bg-amber-50 active:bg-green-300 active:shadow-none disabled:bg-stone-300 disabled:shadow-none'}>
                                        <IconContext.Provider value={{className: 'text-amber-500 text-xl m-auto'}}>
                                            <HiPlus/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                                {addExecutor ? <Executor2View/> : null}
                            </div>
                            <div className={'flex flex-col gap-2'}>
                                <label className={'text-xl'} htmlFor="type">Тип заявки</label>
                                <select
                                    defaultValue={'DEFAULT'}
                                    className={'rounded-lg shadow-form-sh py-1  text-md border-stone-300 focus:outline-amber-200'}
                                    name="type"
                                    id="type"
                                    onChange={setReqChosenType}
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
                                <div className={'rounded-lg h-[32px] py-1 px-2 shadow-form-sh  text-md border-stone-300 bg-white'}>
                                    {Store.reqChosenMail ?
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
                                className={'rounded-lg h-[32px] py-1 shadow-form-sh  text-md border-stone-300 focus:outline-amber-200 mt-2'}
                                onChange={setReqChosenComment}
                            />
                        </div>
                        <button
                            onClick={saveRequest}
                            className={'h-full bg-button-gradient font-semibold shadow-form-sh  rounded-lg text-center text-lg text-white px-2 py-2 shadow-form-sh bg-button-gradient active:bg-button-gradient-invert active:shadow-none focus:outline-none focus:shadow-input-focus'}
                        >Создать заявку</button>
                    </div>
                </div>
            </div>
            {Store.isBubbleContextShow ? <BubbleContext/> : null}
        </div>
    )
})

export default RequestCreationModal