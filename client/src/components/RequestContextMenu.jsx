import Store from "../state/Store";
import useOracleService from "../services/useOracleService";
import useMongoService from "../services/useMongoService";
import useUpdateAfterEdit from "../hooks/useUpdateAfterRequstEdit";
import {useState} from "react";
import Loading from "./Loading";
import { observer } from "mobx-react-lite"
import {toJS} from 'mobx'
import {
    MdFlaky,
    MdOutgoingMail,
    MdSort,
    MdSms,
    MdOutlineEdit,
    MdAttachFile,
    MdOutlineDelete,
    MdOutlineClose, MdContentCopy
} from "react-icons/md"
import {IconContext} from "react-icons";
import log from "tailwindcss/lib/util/log";
import {calculatePosition} from "../funcs/funcs";



const RequestContextMenu = observer((props) => {
    const [contextLoading, setContextLoading] = useState(false)
    const [isShowAddMenu, setIsShowAddMenu] = useState(false)

    const {getVehiclesByRegNum} = useOracleService()
    const {closeRequest, deleteRequest} = useMongoService()
    const {updateAfterRequestEdit} = useUpdateAfterEdit()

    const copyText = async () => {
        if (Store.selectedText.length > 0) {
            await navigator.clipboard.writeText(Store.selectedText);
            Store.setContextMenu(false)
            Store.setNotificationText('Скопировано')
            Store.showNotification()
        }
    }

    const onCloseRequest = async () => {
        try {
            const res = await closeRequest({id: Store.currentRequest._id, Auditor: Store.currentUser});
            Store.setContextMenu(false)
            await updateAfterRequestEdit()
            Store.setNotificationText(res.message);
            Store.showNotification();
        } catch (e) {
            console.log(e)
        }
    }

    const onCheckStatus = async () => {
        if (Store.currentRequest.VehicleRegNum) {
            setContextLoading(true)
            try {
                const res = await getVehiclesByRegNum(Store.currentRequest.VehicleRegNum)
                setContextLoading(false)
                if (res.length === 0) {
                    Store.setContextMenu(false);
                    Store.setNotificationText('Не удалось найти техники с заданным номером')
                    Store.showNotification()
                } else {
                    Store.setFoundVehiclesByRegNom(res)
                    Store.setContextMenu(false);
                    Store.setIsCheckStatusModalShow(true)
                }
            }
            catch (e) {
                setContextLoading(false)
                Store.setContextMenu(false);
                Store.setNotificationText('База данных не отвечает')
                Store.showNotification()
            }
        }
        else {
            Store.setContextMenu(false);
            Store.setNotificationText('Это не техника! ъуъ!')
            Store.showNotification()
        }
    }

    const onEdit = async () => {
        Store.setContextMenu(false)
        Store.setShowEditRequestModal(true)
    }

    const onDelete = async () => {
        Store.setContextMenu(false)
        const res = await deleteRequest({id: Store.currentRequest._id})
        Store.setNotificationText(res.message)
        Store.showNotification()
        await updateAfterRequestEdit()
    }

    const onAddFile = async () => {
        Store.setContextMenu(false)
        Store.setShowAddFileModal(true)
    }

    const onSendMessage = async () => {
        await closeRequest({id: Store.currentRequest._id, Auditor: Store.currentUser})
        updateAfterRequestEdit()
        Store.setContextMenu(false)
        Store.setIsShowSendMessageModal(true)
    }

    const onTextSms = async () => {
        if (Store.currentRequest.VehicleRegNum) {
            await navigator.clipboard.writeText(`${Store.currentRequest.BaseName} ${Store.currentRequest.VehicleType} ${Store.currentRequest.VehicleRegNum} ${Store.currentRequest.Description}`);
            Store.setContextMenu(false)
            Store.setNotificationText('Скопировано')
            Store.showNotification()
        } else {
            await navigator.clipboard.writeText(`${Store.currentRequest.Description}`);
            Store.setContextMenu(false)
            Store.setNotificationText('Скопировано')
            Store.showNotification()
        }

    }


    const handleHover = (bool) => {
        setIsShowAddMenu(bool)
    }

    const onSort = (sortType) => {
        Store.setContextMenu(false)
        let newRequestData = toJS(Store.requestsData)
        newRequestData = newRequestData.sort((a, b) => (a[sortType]===null)-(b[sortType]===null) || +(a[sortType]>b[sortType])||-(a[sortType]<b[sortType]))
        Store.setRequestsData(newRequestData)
    }

    const onSortByDate = () => {
        Store.setContextMenu(false)
        let newRequestData = toJS(Store.requestsData)
        newRequestData = newRequestData.sort((a, b) =>  new Date(b.CreateDate) - new Date(a.CreateDate))
        Store.setRequestsData(newRequestData)
    }

    const CopyContextMenuItem = () => {
        return (
            <li
                className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50 cursor-pointer'}
                onClick={copyText}
            >
                <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                    <MdContentCopy/>
                </IconContext.Provider>
                Копировать
            </li>
        )
    }

    const RightSortMenu = observer(() => {
        return (
            <ul className={'absolute w-40 rounded-xl text-md border border-amber-300 left-full top-0 bg-white'}>
                <li
                    className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:rounded-t-xl hover:bg-blue-50 cursor-pointer'}
                    onClick={onSortByDate}
                >

                    По дате
                </li>
                <li
                    className={'px-4 py-1 border-b border-b-amber-300 hover:bg-blue-50 cursor-pointer'}
                    onClick={() => onSort('ObjName')}
                >
                    По хозяйству
                </li>
                <li
                    className={'px-4 py-1 hover:rounded-b-xl hover:bg-blue-50 cursor-pointer'}
                    onClick={() => onSort('RequestType')}
                >
                    По типу заявки
                </li>
            </ul>
        )
    })

    const ContextMenuView = observer(() => {
        return (
            <>
                <li
                    className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50 hover:rounded-t-xl cursor-pointer'}
                    onClick={onCheckStatus}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                        <MdFlaky/>
                    </IconContext.Provider>
                    Проверить статус
                </li>
                <li
                    className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50 cursor-pointer'}
                    onClick={onSendMessage}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                        <MdOutgoingMail/>
                    </IconContext.Provider>
                    Закрыть с ответом
                </li>
                <li
                    className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50 cursor-pointer'}
                    onClick={onTextSms}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                        <MdSms/>
                    </IconContext.Provider>
                    Текст смс
                </li>
                <li
                    className={'px-4 py-1 flex items-center relative hover:bg-blue-50 border-b border-b-amber-300 cursor-pointer'}
                    onMouseEnter={() => handleHover(true)}
                    onMouseLeave={() => handleHover(false)}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                        <MdSort/>
                    </IconContext.Provider>
                    Сортировать <span className={'ml-auto text-lg text-amber-500'}>&gt;</span>
                    {isShowAddMenu ? <RightSortMenu/> : null}
                </li>

                {Store.selectedText.length > 0 ? <CopyContextMenuItem/> : null}
                <li
                    className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50  cursor-pointer'}
                    onClick={onEdit}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                        <MdOutlineEdit/>
                    </IconContext.Provider>
                    Редактировать
                </li>
                <li
                    onClick={onAddFile}
                    className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50  cursor-pointer'}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                        <MdAttachFile/>
                    </IconContext.Provider>
                    Прикрепить файл
                </li>
                <li
                    className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50 cursor-pointer'}
                    onClick={onDelete}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                        <MdOutlineDelete/>
                    </IconContext.Provider>
                    Удалить заявку
                </li>

                <li
                    onClick={onCloseRequest}
                    className={'px-4 py-1 flex items-center hover:bg-blue-50 hover:rounded-b-xl cursor-pointer'}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                        <MdOutlineClose/>
                    </IconContext.Provider>
                    Закрыть заявку
                </li>
            </>
        )
    })


    return (
        <ul
            className={'absolute w-64 text-md min-h-[200px] rounded-xl bg-white border border-amber-300'}
            style={calculatePosition(props.posX, props.posY, 256, 302)}
        >
            {contextLoading ? <Loading/> : <ContextMenuView/>}
        </ul>
    );
})

export default RequestContextMenu;