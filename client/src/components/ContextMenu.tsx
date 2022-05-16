import Store from "../state/Store";
import {useState} from "react";
import {MdContentCopy, MdCreate, MdListAlt, MdOutlineGpsFixed} from "react-icons/md";
import {IconContext} from "react-icons";
import {FaGoogle, FaYandex} from "react-icons/fa";
import {calculatePosition} from "../funcs/funcs";
import copy from 'copy-to-clipboard'

interface ContextMenuProps {
    posX: number | null
    posY: number | null
}

const ContextMenu = (props: ContextMenuProps) => {
    const [isShowAddMenu, setIsShowAddMenu] = useState(false)

    const onMakeRequest = () => {
        Store.setShowVehiclesContextMenu(false)
        Store.setShowRequestModal(true)
    }

    const copyYaCoords = async () => {
        const coordString = `http://maps.yandex.ru/?text=${Store.currentVehicle?.LAST_LAT},${Store.currentVehicle?.LAST_LON}&1=map`
        copy(coordString)
        Store.setShowVehiclesContextMenu(false)
        Store.setNotificationText('Координаты yandex скопированы')
        Store.showNotification()
    }

    const copyGooCoords = async () => {
        const coordString = `http://maps.google.com/?q=${Store.currentVehicle?.LAST_LAT},${Store.currentVehicle?.LAST_LON}`
        Store.setShowVehiclesContextMenu(false)
        copy(coordString)
        Store.setNotificationText('Координаты google скопированы')
        Store.showNotification()
    }

    const copyText = async () => {
        if (Store.selectedText.length > 0) {
            copy(Store.selectedText)
            Store.setShowVehiclesContextMenu(false)
            Store.setNotificationText('Скопировано')
            Store.showNotification()
        }
    }

    const onAddCarlist = async () => {
        document.body.style.overflow = 'hidden';
        Store.setShowVehiclesContextMenu(false)
        Store.setIsShowCarlistModal(true)
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

    const RightCoordMenu = () => {
        return (
            <ul className={'absolute w-40 rounded-xl text-md border border-amber-300 left-full top-0 bg-white'}>
                <li
                    className={'px-4 py-1 flex items-center hover:rounded-t-xl border-b border-b-amber-300 hover:bg-blue-50 cursor-pointer'}
                    onClick={copyYaCoords}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-lg mr-3'}}>
                        <FaYandex/>
                    </IconContext.Provider>
                    Яндекс
                </li>
                <li
                    className={'px-4 py-1 flex items-center hover:rounded-b-xl hover:bg-blue-50 cursor-pointer'}
                    onClick={copyGooCoords}
                >
                    <IconContext.Provider value={{className: 'text-green-500 text-lg mr-3'}}>
                        <FaGoogle/>
                    </IconContext.Provider>
                    Гугл
                </li>
            </ul>
        )
    }

    const handleHover = (bool: boolean) => {
        setIsShowAddMenu(bool)
    }

    return (
        <ul
            className={'absolute w-46 text-md rounded-xl bg-white border border-amber-300'}
            style={calculatePosition(props.posX, props.posY, 189, 71)}
        >
            <li
                onClick={onMakeRequest}
                className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50 hover:rounded-t-xl cursor-pointer'}
            >
                <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                    <MdCreate/>
                </IconContext.Provider>
                Заявка
            </li>
            {Store.selectedText.length > 0 ? <CopyContextMenuItem/> : null}
            <li
                onClick={onAddCarlist}
                className={'px-4 py-1 flex items-center border-b border-b-amber-300 hover:bg-blue-50  cursor-pointer'}
            >
                <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                    <MdListAlt/>
                </IconContext.Provider>
                Carlist
            </li>
            <li
                onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}
                className={'px-4 py-1 flex items-center relative hover:bg-blue-50 hover:rounded-b-xl cursor-pointer'}
            >
                <IconContext.Provider value={{className: 'text-green-500 text-xl mr-3'}}>
                    <MdOutlineGpsFixed/>
                </IconContext.Provider>
                Координаты <span className={'ml-5 text-lg text-amber-500'}>&gt;</span>
                {isShowAddMenu ? <RightCoordMenu/> : null}
            </li>
        </ul>
    );
}

export default ContextMenu;