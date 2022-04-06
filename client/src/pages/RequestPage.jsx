import MenuTabs from '../components/MenuTabs'
import Requests from '../components/Requests'
import Store from "../state/Store";
import RequestContextMenu from "../components/RequestContextMenu";
import {observer} from "mobx-react-lite";
import CheckVehicleStatusModal from "../components/CheckVehicleStatusModal";
import RequestEditModal from "../components/RequestEditModal";
import AddFileModal from "../components/AddFileModal";
import SendMessageModal from "../components/SendMessageModal";
import AddCarlistModal from "../components/AddCarlistModal";


const RequestPage = observer(() => {

    const closeContextMenu = (e) => {
        e.stopPropagation()
        if (e.target.tagName !== 'LI') Store.setContextMenu(false)
    }

    return (
        <div className={'min-h-screen relative'} onClick={e => closeContextMenu(e)}>
            <MenuTabs />
            <Requests />
            {Store.showContextMenu ? <RequestContextMenu posX={Store.mouseX} posY={Store.mouseY}/> : null}
            {Store.isCheckStatusModalShow ? <CheckVehicleStatusModal/> : null}
            {Store.isShowEditRequestModal ? <RequestEditModal/> : null}
            {Store.showAddFileModal ? <AddFileModal/> : null}
            {Store.isShowSendMessageModal ? <SendMessageModal/> : null}
            {Store.isShowCarlistModal ? <AddCarlistModal/> : null}
        </div>
    )
    
})

export default RequestPage;