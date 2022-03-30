import {useEffect, useState} from "react";
import useMongoService from "../services/useMongoService";
import Store from "../state/Store";
import { observer } from "mobx-react-lite"
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import useUpdateAfterEdit from "../hooks/useUpdateAfterRequstEdit";
import {DateTime} from "luxon";
import {IconContext} from "react-icons";
import {HiMinus, HiPlus} from "react-icons/hi";




const RequestEditModal = observer(() => {
    const [isMultipleExecutors, setIsMultipleExecutors] = useState(false)

    const {updateAfterRequestEdit} = useUpdateAfterEdit()
    const {editRequest} = useMongoService(false)

    useEffect(() => {
        (async () => {
            document.body.style.overflow = 'hidden';
        })()
        return () => {
            document.body.style.overflow = 'auto'
            Store.setCurrentRequest(null)
        }
    }, [])



    const hideModal = (e) => {
        if(e.target === e.currentTarget) {
            Store.setShowEditRequestModal(false)
        }
    }

    // Изменить значения инпутов заявки
    const setRequestField = (e, field) => {
        Store.setCurrentRequest({
            ...Store.currentRequest,
            [field]: e.target.value
        })
    }

    const onChangeDate = (date) => {
        Store.setCurrentRequest({
            ...Store.currentRequest,
            PlannedDate: date
        })
    }

    const onReset = (e) => {
        e.preventDefault()
        Store.setCurrentRequest({
            ...Store.currentRequest,
            PlannedDate: null
        })
    }

    const onSetDate = (e, date) => {
        e.preventDefault()
        Store.setCurrentRequest({
            ...Store.currentRequest,
            PlannedDate: date
        })
    }

    const onMinusExecutor = (e) => {
        e.preventDefault()
        setIsMultipleExecutors(false)
        Store.setCurrentRequest({
            ...Store.currentRequest,
            Executor: [Store.currentRequest.Executor[0]]
        })
    }

    const onPlusExecutor = (e) => {
        e.preventDefault()
        setIsMultipleExecutors(true)
    }

    const onChangeExecutor = (e, number) => {
        if (Store.currentRequest.Executor) {
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
            Store.setCurrentRequest({
                ...Store.currentRequest,
                Executor: [e.target.value]
            });
        }

    }

    // Сохранить изменённую заявку
    const editMongoRequest = async (e) => {
        e.preventDefault()
        let editedRequest = {
            id: Store.currentRequest._id,
            Executor: Store.currentRequest.Executor,
            Description: Store.currentRequest.Description,
            RequestType: Store.currentRequest.RequestType,
            Region: Store.currentRequest.Region,
            PlannedDate: Store.currentRequest.PlannedDate,
        }
        await editRequest(editedRequest)
        Store.setShowEditRequestModal(false)
        await updateAfterRequestEdit()
        Store.setNotificationText('Заявка отредактирована')
        Store.showNotification()
    }

    const CurrentVehicle = () => {
        if (Store.currentRequest && Store.currentRequest.VehicleId) {
            return (
                <div className={'mb-6'}>
                    <h2 className={'text-xl text-center text'}>Выбранная техника</h2>
                    <div className={'flex justify-between text-md bg-white mt-2 rounded-lg shadow-md shadow-stone-700'}>
                        <div className={'px-2 py-1'}>{Store.currentRequest.ObjName}</div>
                        <div className={'px-2 py-1'}>{Store.currentRequest.BaseName}</div>
                        <div className={'px-2 py-1'}>{Store.currentRequest.VehicleType}</div>
                        <div className={'px-2 py-1'}>{Store.currentRequest.Region}</div>
                        <div className={'px-2 py-1'}>{Store.currentRequest.VehicleRegNum}</div>
                        <div className={'px-2 py-1'}>{Store.currentRequest.VehicleId}</div>
                    </div>
                </div>
            )
        }
    }

    const Executor2View = observer(() => {
        return (
            <div className={'flex justify-between items-center mt-5'}>
                <select
                    defaultValue={Store.currentRequest.Executor && Store.currentRequest.Executor.length > 1 ? Store.currentRequest.Executor[1] : 'DEFAULT'}
                    className={'w-[80%] rounded-lg shadow-md py-1  shadow-stone-700 text-md border-stone-300 focus:outline-amber-200'}
                    name="executor2"
                    id="executor2"
                    onChange={e => onChangeExecutor(e, 2)}
                >
                    <option disabled value="DEFAULT" > -- выбрать исполнителя -- </option>
                    {Store.currentExecutors.map(item => (
                        <option key={item._id} value={item.name}>{item.name}</option>
                    ))}
                </select>
                <button
                    onClick={(e) => onMinusExecutor(e)}
                    className={'w-[10%] h-full rounded-lg bg-white shadow-md shadow-stone-700 hover:bg-amber-50 active:bg-green-300 active:shadow-none disabled:bg-stone-300 disabled:shadow-none'}>
                    <IconContext.Provider value={{className: 'text-amber-500 text-xl m-auto'}}>
                        <HiMinus/>
                    </IconContext.Provider>
                </button>
            </div>
        )
    })


    return (
        <div
            onMouseDown={hideModal}
            className={'absolute left-0 w-screen h-screen flex bg-neutral-700/50'}
            style={{top: Store.offsetY}}
        >
            <div className={'flex m-auto p-6 bg-blue-50 rounded-xl'}>
                <div className={'flex flex-col'}>
                    {Store.currentRequest && Store.currentRequest.VehicleId ? <CurrentVehicle/> : null}
                        <form className="flex flex-col">
                            <div className={'flex justify-between gap-6'}>
                                <div className={'flex flex-col w-[380px] gap-2'}>
                                    <label className={'text-xl'} htmlFor="executor">Исполнитель</label>
                                    <div className={'flex justify-between items-center'}>
                                        <select
                                            defaultValue={Store.currentRequest.Executor && Store.currentRequest.Executor.length > 0 ? Store.currentRequest.Executor[0] : "DEFAULT"}
                                            className={'w-[80%] rounded-lg shadow-md py-1 shadow-stone-700 text-md border-stone-300 focus:outline-amber-200'}
                                            name="executor"
                                            id="executor"
                                            onChange={e => onChangeExecutor(e, 1)}

                                        >
                                            <option disabled value="DEFAULT" > -- выбрать исполнителя -- </option>
                                            {Store.currentExecutors.map(item => (
                                                <option key={item._id} value={item.name}>{item.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={(e) => onPlusExecutor(e)}
                                            disabled={Store.currentRequest.Executor < 1 || isMultipleExecutors}
                                            className={'w-[10%] h-full rounded-lg bg-white shadow-md shadow-stone-700 hover:bg-amber-50 active:bg-green-300 active:shadow-none disabled:bg-stone-300 disabled:shadow-none'}>
                                            <IconContext.Provider value={{className: 'text-amber-500 text-xl m-auto'}}>
                                                <HiPlus/>
                                            </IconContext.Provider>
                                        </button>
                                    </div>
                                    {isMultipleExecutors || (Store.currentRequest.Executor && Store.currentRequest.Executor.length > 1) ? <Executor2View/> : null}
                                </div>
                                <div className={'flex flex-col w-[380px] gap-2'}>
                                    <label className={'text-xl'} htmlFor="type">Тип заявки</label>
                                    <select
                                        defaultValue={Store.currentRequest.RequestType}
                                        className={'rounded-lg shadow-md py-1 shadow-stone-700 text-md border-stone-300 focus:outline-amber-200'}
                                        name="type"
                                        id="type"
                                        onChange={(e) => setRequestField(e, 'RequestType')}
                                    >
                                        <option disabled value="DEFAULT"> -- выбрать тип заявки -- </option>
                                        {Store.currentRequestTypes.map(item => (
                                            <option key={item._id} value={item.description}>{item.description}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={'flex justify-between  gap-6 mt-6'}>
                                <div className={'flex flex-col w-[380px] gap-2'}>
                                    <label className={'text-xl'} htmlFor="region">Регион</label>
                                    <select
                                        defaultValue={Store.currentRequest.Region}
                                        className={'rounded-lg shadow-md py-1 shadow-stone-700 text-md border-stone-300 focus:outline-amber-200'}
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
                                <div className={'flex flex-col w-[380px] gap-2'}>
                                    <h2 className={'text-xl'}>Дата исполнения</h2>
                                    <DatePicker
                                        className={'rounded-lg shadow-md py-1 shadow-stone-700 w-full text-md border-stone-300 focus:outline-amber-200'}
                                        selected={Store.currentRequest.PlannedDate ? new Date(Store.currentRequest.PlannedDate) : ''}
                                        onChange={(date) => {onChangeDate(date)}}
                                        dateFormat="dd.MM.yy"
                                        tabIndex={-1}
                                        placeholderText="Выбрать дату"
                                    />
                                    <div className={'flex items-center mt-2'}>
                                        <button
                                            className={' w-20 px-1 py-0.5 mr-3 rounded bg-orange-400 text-sm text-white active:bg-orange-600 shadow-form-sh'}
                                            onClick={(e) => onSetDate(e, DateTime.now().toJSDate())}
                                        >
                                            Сегодня
                                        </button>
                                        <button
                                            className={'w-20 px-1 py-0.5 mr-3 rounded bg-orange-400 text-sm text-white active:bg-orange-600 shadow-form-sh'}
                                            onClick={(e) => onSetDate(e, DateTime.now().plus({days: 1}).toJSDate())}
                                        >
                                            Завтра
                                        </button>
                                        <button
                                            className={'w-20 px-1 py-0.5 rounded bg-orange-400 text-sm text-white active:bg-orange-600 shadow-form-sh'}
                                            onClick={(e) => onReset(e)}
                                        >
                                            Сбросить
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={'flex mt-6 gap-16'}>
                                <div className={'flex flex-col w-full'}>
                                    <label className={'text-xl'} htmlFor="comment">Комментарий</label>
                                    <input
                                        value={Store.currentRequest.Description}
                                        type="text"
                                        name={'comment'}
                                        id={'comment'}
                                        className={'rounded-lg h-[40px] py-1 shadow-md shadow-stone-700 text-md border-stone-300 focus:outline-amber-200 mt-2'}
                                        onChange={(e) => setRequestField(e, 'Description')}

                                    />
                                </div>
                                <button
                                    onClick={editMongoRequest}
                                    className={'h-full shadow-md shadow-stone-700 rounded-lg text-center text-lg text-white px-2 py-2 shadow-form-sh bg-button-gradient active:bg-button-gradient-invert active:shadow-none focus:outline-none focus:shadow-input-focus'}
                                >Редактировать заявку</button>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    );
});

export default RequestEditModal;