import Store from "../state/Store";
import useMongoService from "../services/useMongoService";
import useUpdateAfterEdit from "../hooks/useUpdateAfterRequstEdit";
import {useEffect} from "react";
import { observer } from "mobx-react-lite"
import copy from 'copy-to-clipboard'
import {
    MdOutgoingMail,
    MdSms,
    MdOutlineEdit,
    MdAttachFile,
    MdOutlineDelete,
    MdOutlineClose, MdContentCopy, MdListAlt
} from "react-icons/md"
import {IconContext} from "react-icons";
import {calculatePosition} from "../funcs/funcs";



const RequestContextMenu = observer((props) => {

    useEffect(() => {
        if (Store.isShowEditRequestModal )
        return () => Store.setCurrentRequest(null)
    }, [])

    const {closeRequest, deleteRequest} = useMongoService()
    const {updateAfterRequestEdit} = useUpdateAfterEdit()

    const copyText = async () => {
        if (Store.selectedText.length > 0) {
            copy(Store.selectedText)
            Store.setShowRequestContextMenu(false)
            Store.setNotificationText('Скопировано')
            Store.showNotification()
        }
    }

    const onCloseRequest = async () => {
        try {
            const res = await closeRequest({id: Store.currentRequest._id, Auditor: Store.currentUser});
            Store.setShowRequestContextMenu(false)
            await updateAfterRequestEdit()
            Store.setNotificationText(res.message);
            Store.showNotification();
        } catch (e) {
            console.log(e)
        }
    }

    const onEdit = async () => {
        Store.setShowRequestContextMenu(false)
        Store.setIsShowEditRequestModal(true)
    }

    const onDelete = async () => {
        Store.setShowRequestContextMenu(false)
        const res = await deleteRequest({id: Store.currentRequest._id})
        Store.setNotificationText(res.message)
        Store.showNotification()
        await updateAfterRequestEdit()
    }

    const onAddFile = async () => {
        Store.setShowRequestContextMenu(false)
        Store.setShowAddFileModal(true)
    }

    const onAddCarlist = async () => {
        document.body.style.overflow = 'hidden';
        Store.setShowRequestContextMenu(false)
        Store.setIsShowCarlistModal(true)
    }

    const onSendMessage = async () => {
        if (Store.currentRequest.SentFromName) {
            Store.setShowRequestContextMenu(false)
            Store.setIsShowSendMessageModal(true)
            await closeRequest({id: Store.currentRequest._id, Auditor: Store.currentUser})
            updateAfterRequestEdit()
        } else {
            Store.setShowRequestContextMenu(false)
            Store.setNotificationText('Не указан адресат в заявке')
            Store.showNotification()
        }

    }

    const onTextSms = async () => {
        if (Store.currentRequest.VehicleRegNum) {
            copy(`${Store.currentRequest.BaseName} ${Store.currentRequest.VehicleType} ${Store.currentRequest.VehicleRegNum} ${Store.currentRequest.Description}`)
            Store.setShowRequestContextMenu(false)
            Store.setNotificationText('Скопировано')
            Store.showNotification()
        } else {
            Store.setShowRequestContextMenu(false)
            copy(`${Store.currentRequest.Description}`)
            Store.setNotificationText('Скопировано')
            Store.showNotification()
        }

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

    const CloseRequestMenuItem = () => {
        return (
            <li
                onClick={onCloseRequest}
                className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50 cursor-pointer'}

            >
                <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                    <MdOutlineClose/>
                </IconContext.Provider>
                Закрыть заявку
            </li>
        )
    }

    const AddCarlistMenuItem = () => {
        return (
            <li
                onClick={onAddCarlist}
                className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50  cursor-pointer'}
            >
                <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                    <MdListAlt/>
                </IconContext.Provider>
                Carlist
            </li>
        )
    }

    const ContextMenuView = observer(() => {
        return (
            <>
                <li
                    className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50 hover:rounded-t-xl cursor-pointer'}
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

                {Store.currentRequest.VehicleRegNum ? <AddCarlistMenuItem/> : null}
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
                {Store.selectedText.length > 0 ? <CopyContextMenuItem/> : null}
                {!Store.currentRequest.isExecuted ? <CloseRequestMenuItem/> : null}
                <li
                    onClick={onDelete}
                    className={'px-4 py-1 flex items-center hover:bg-blue-50 hover:rounded-b-xl cursor-pointer'}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                        <MdOutlineDelete/>
                    </IconContext.Provider>
                    Удалить заявку
                </li>
            </>
        )
    })


    return (
        <ul
            className={'absolute w-64 text-md min-h-[170px] rounded-xl bg-white border border-amber-300'}
            style={calculatePosition(props.posX, props.posY, 256, 302)}
        >
            <ContextMenuView/>
        </ul>
    );
})

export default RequestContextMenu;