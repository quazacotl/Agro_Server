import {useEffect, useState} from "react"
import {observer, useLocalObservable} from "mobx-react-lite"
import DatePicker, { registerLocale } from "react-datepicker"
import ru from 'date-fns/locale/ru'
import axios from "axios"
import {IconContext} from "react-icons"
import {HiMinus, HiPlus} from "react-icons/hi"
import {DateTime} from "luxon"
import useMongoService from "../services/useMongoService"
import useUpdateAfterEdit from "../hooks/useUpdateAfterRequstEdit"
import {useLockBodyScroll} from "../hooks/useLockBodyScroll"
import useGetDistance from "../hooks/useGetDistance"
import {Config} from "../config"
import Store from "../state/Store"
import "react-datepicker/dist/react-datepicker.css"
import MailView from "./OutlookMessages"
import CurrentVehicle from "./CurrentVehicle"
import {execData} from "../interfaces/interfaces"


registerLocale("ru", ru)


const RequestEditModal = observer(() => {
    const [isMultipleExecutors, setIsMultipleExecutors] = useState(false)
    const {updateAfterRequestEdit} = useUpdateAfterEdit()
    const {getDistance} = useGetDistance()
    const {editRequest, getExecId} = useMongoService()
    useLockBodyScroll()

    // Здесь храним исполнителей, отсортированных по близости
    interface execState {
        execData: execData[] | null
        setExecData: (data: execData[] | null) => void
    }

    const execState = useLocalObservable(() => ({
            execData: null,
            setExecData(data) {
                this.execData = data
            }
        } as execState)
    )

    useEffect(() => {
        (async () => {
            if (Store.currentRequest?.SentFromName) {
                const chosenMail = {
                    senderName: Store.currentRequest.SentFromName,
                    senderEmail: Store.currentRequest.SentFromEmail,
                    sentDate: Store.currentRequest.SentFromDate
                }
                Store.setReqChosenMail(chosenMail)
            }
            if (Store.currentRequest?.VehicleId) {
                const execData = await getExecId();
                const vehicles = await axios.post(`${Config.baseRoute}/vehicles-id`, {id: String(Store.currentRequest.VehicleId)})
                const vehicle = vehicles.data[0]
                const coords = await getDistance(execData, {lat: vehicle.LAST_LAT, lon: vehicle.LAST_LON})
                coords.sort((a, b) => a.distance! - b.distance!)
                execState.setExecData(coords)
            }
        })()
        return () => {
            Store.setCurrentRequest(null)
            Store.setReqChosenMail(null)
        }
    }, [])


    // Изменить значения инпутов заявки
    const setRequestField = (e:  React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement> , field: string) => {
        if (Store.currentRequest) {
            Store.setCurrentRequest({
                ...Store.currentRequest,
                [field]: e.target.value
            });
        }

    }

    const onChangeDate = (date:Date |  null) => {
        if (Store.currentRequest && date) {
            Store.setCurrentRequest({
                ...Store.currentRequest,
                PlannedDate: date
            })
        }

    }

    const onReset = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (Store.currentRequest) {
            Store.setCurrentRequest({
                ...Store.currentRequest,
                PlannedDate: undefined
            })
        }

    }

    const onSetDate = (e: React.MouseEvent<HTMLButtonElement>, date: Date) => {
        e.preventDefault()
        if (Store.currentRequest) {
            Store.setCurrentRequest({
                ...Store.currentRequest,
                PlannedDate: date
            })
        }

    }

    const onMinusExecutor = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsMultipleExecutors(false)
        if (Store.currentRequest && Store.currentRequest.Executor) {
            Store.setCurrentRequest({
                ...Store.currentRequest,
                Executor: [Store.currentRequest.Executor[0]]
            })
        }

    }

    const onPlusExecutor = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsMultipleExecutors(true)
    }

    const onChangeExecutor = (e: React.ChangeEvent<HTMLSelectElement>, number: number) => {
        if (Store.currentRequest?.Executor) {
            switch (Store.currentRequest.Executor.length) {
                case 0:
                    Store.setCurrentRequest({
                        ...Store.currentRequest,
                        Executor: [e.target.value]
                    });
                    break;
                case 1:
                    if (number === 1) {
                        Store.setCurrentRequest({
                            ...Store.currentRequest,
                            Executor: [e.target.value]
                        })
                    }
                    else if (number === 2) {
                        Store.setCurrentRequest({
                            ...Store.currentRequest,
                            Executor: [Store.currentRequest.Executor[0], e.target.value]
                        })
                    }
                    break;
                case 2:
                    if (number === 1) {
                        Store.setCurrentRequest({
                            ...Store.currentRequest,
                            Executor: [e.target.value, Store.currentRequest.Executor[1]]
                        })
                    }
                    else if (number === 2) {
                        Store.setCurrentRequest({
                            ...Store.currentRequest,
                            Executor: [Store.currentRequest.Executor[0], e.target.value]
                        })
                    }
            }
        } else {
            if (Store.currentRequest) {
                Store.setCurrentRequest({
                    ...Store.currentRequest,
                    Executor: [e.target.value]
                });
            }

        }

    }

    // Сохранить изменённую заявку
    const editMongoRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (Store.currentRequest) {
            let editedRequest = {
                id: Store.currentRequest._id,
                Executor: Store.currentRequest.Executor ? Store.currentRequest.Executor : null,
                Description: Store.currentRequest.Description,
                RequestType: Store.currentRequest.RequestType,
                Region: Store.currentRequest.Region,
                PlannedDate: Store.currentRequest.PlannedDate,
                SentFromName: Store.reqChosenMail ? Store.reqChosenMail.senderName : null,
                SentFromEmail: Store.reqChosenMail ? Store.reqChosenMail.senderEmail : null,
                SentFromDate: Store.reqChosenMail ? Store.reqChosenMail.sentDate : undefined,
            };
            await editRequest(editedRequest)
            Store.setIsShowEditRequestModal(false)
            await updateAfterRequestEdit()
            Store.setNotificationText('Заявка отредактирована')
            Store.showNotification()
        }

    }


    const Executor2View = observer(() => {
        return (
            <div className={'flex justify-between items-center mt-5'}>
                <select
                    defaultValue={Store.currentRequest?.Executor && Store.currentRequest.Executor.length > 1 ? Store.currentRequest.Executor[1] : 'DEFAULT'}
                    className={'w-[80%] rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                    name="executor2"
                    id="executor2"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChangeExecutor(e, 2)}
                >
                    <option disabled value="DEFAULT" > -- выбрать исполнителя -- </option>
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
                <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => onMinusExecutor(e)}
                    className={'w-[10%] h-full rounded-lg bg-white shadow-form-sh  hover:bg-amber-50 active:bg-green-300 active:shadow-none disabled:bg-stone-300 disabled:shadow-none'}>
                    <IconContext.Provider value={{className: 'text-amber-500 text-xl m-auto'}}>
                        <HiMinus/>
                    </IconContext.Provider>
                </button>
            </div>
        )
    })

    return (
        <div className={'flex flex-col'}>
            {Store.currentRequest && Store.currentRequest.VehicleId ? <CurrentVehicle currentRequest={Store.currentRequest}/> : null}
            <form className="flex flex-col">
                <div className={'flex justify-between gap-6'}>
                    <div className={'flex flex-col gap-4'}>
                        <div className={'flex flex-col w-[400px] gap-2'}>
                            <label className={'text-xl'} htmlFor="executor">Исполнитель</label>
                            <div className={'flex justify-between items-center'}>
                                <select
                                    defaultValue={Store.currentRequest?.Executor && Store.currentRequest.Executor.length > 0 ? Store.currentRequest.Executor[0] : "DEFAULT"}
                                    className={'w-[80%] rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                                    name="executor"
                                    id="executor"
                                    onChange={e => onChangeExecutor(e, 1)}

                                >
                                    <option disabled value="DEFAULT" > -- выбрать исполнителя -- </option>
                                    <option value={''}>{'Сбросить'}</option>
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
                                <button
                                    onClick={(e) => onPlusExecutor(e)}
                                    disabled={(Store.currentRequest && Store.currentRequest.Executor && Store.currentRequest.Executor.length < 1) || isMultipleExecutors}
                                    className={'w-[10%] h-full rounded-lg bg-white shadow-form-sh  hover:bg-amber-50 active:bg-green-300 active:shadow-none disabled:bg-stone-300 disabled:shadow-none'}>
                                    <IconContext.Provider value={{className: 'text-amber-500 text-xl m-auto'}}>
                                        <HiPlus/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            {isMultipleExecutors || (Store.currentRequest?.Executor && Store.currentRequest.Executor.length > 1) ? <Executor2View/> : null}
                        </div>
                        <div className={'flex flex-col w-[400px] gap-2'}>
                            <label className={'text-xl'} htmlFor="type">Тип заявки</label>
                            <select
                                defaultValue={Store.currentRequest?.RequestType ? Store.currentRequest.RequestType : ''}
                                className={'rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                                name="type"
                                id="type"
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRequestField(e, 'RequestType')}
                            >
                                <option disabled value="DEFAULT"> -- выбрать тип заявки -- </option>
                                {Store.currentRequestTypes.map(item => (
                                    <option key={item._id} value={item.description}>{item.description}</option>
                                ))}
                            </select>
                        </div>
                        <div className={'flex flex-col w-[400px] gap-2'}>
                            <label className={'text-xl'} htmlFor="region">Регион</label>
                            <select
                                defaultValue={Store.currentRequest?.Region ? Store.currentRequest.Region : ''}
                                className={'rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                                name="region"
                                id="region"
                                onChange={(e) => setRequestField(e, 'Region')}

                            >
                                <option disabled value="DEFAULT"> -- выбрать регион -- </option>
                                {Store.currentRegions.map(item => (
                                    <option key={item._id} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={'flex flex-col w-[400px] gap-2'}>
                            <h2 className={'text-xl'}>Дата исполнения</h2>
                            <DatePicker
                                className={'w-full rounded-lg shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                                selected={Store.currentRequest?.PlannedDate ? new Date(Store.currentRequest.PlannedDate) : new Date(Date.now())}
                                onChange={(date) => {onChangeDate(date)}}
                                dateFormat="dd.MM.yy"
                                locale="ru"
                                tabIndex={-1}
                                placeholderText="Выбрать дату"
                            />
                            <div className={'flex items-center mt-2'}>
                                <button
                                    className={' w-20 px-1 py-0.5 mr-3 rounded bg-orange-400 text-sm text-white active:bg-orange-600 shadow-form-sh'}
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => onSetDate(e, DateTime.now().toJSDate())}
                                >
                                    Сегодня
                                </button>
                                <button
                                    className={'w-20 px-1 py-0.5 mr-3 rounded bg-orange-400 text-sm text-white active:bg-orange-600 shadow-form-sh'}
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => onSetDate(e, DateTime.now().plus({days: 1}).toJSDate())}
                                >
                                    Завтра
                                </button>
                                <button
                                    className={'w-20 px-1 py-0.5 rounded bg-pink-400 text-sm text-white active:bg-orange-600 shadow-form-sh'}
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => onReset(e)}
                                >
                                    Сбросить
                                </button>
                            </div>
                        </div>
                        <div className={'flex flex-col w-[400px] gap-2'}>
                            <h2 className={'text-xl'}>Прислал письмо</h2>
                            <div className={'rounded-lg h-[32px] py-1 px-2 shadow-form-sh  text-md border-stone-300 bg-white line-clamp-1'}>
                                {Store.reqChosenMail && Store.reqChosenMail.sentDate ?
                                    `${Store.reqChosenMail.senderName}, ${new Date(Store.reqChosenMail.sentDate).toLocaleString()}` :
                                    <h2> -- выберите письмо --</h2>}
                            </div>
                        </div>
                    </div>
                    <div className={'relative'}>
                        <h2 className={'text-center text-slate-900 text-xl'}>Последние письма</h2>
                        <MailView height={350}/>
                    </div>
                </div>

                <div className={'flex mt-6 gap-16'}>
                    <div className={'flex flex-col w-full'}>
                        <label className={'text-xl'} htmlFor="comment">Комментарий</label>
                        <input
                            value={Store.currentRequest?.Description ? Store.currentRequest.Description : ''}
                            type="text"
                            name={'comment'}
                            id={'comment'}
                            className={'rounded-lg h-[40px] mt-2 shadow-form-sh py-1 text-md border-stone-300 focus:border-stone-300 focus:outline-offset-0 focus:outline-amber-400'}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestField(e, 'Description')}
                        />
                    </div>
                    <button
                        type={'submit'}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>)=> editMongoRequest(e)}
                        className={'h-full shadow-form-sh  rounded-lg text-center text-lg text-white px-2 py-2 shadow-shadow-form-sh bg-button-gradient active:bg-button-gradient-invert active:shadow-none focus:outline-none focus:shadow-input-focus'}
                    >Редактировать заявку</button>
                </div>
            </form>
        </div>
    )
});

export default RequestEditModal