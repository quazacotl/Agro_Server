import {observer} from "mobx-react-lite"
import MenuTabs from '../components/MenuTabs'
import RequestContextMenu from "../components/RequestContextMenu"
import CheckVehicleStatusModal from "../components/CheckVehicleStatusModal"
import RequestEditModal from "../components/RequestEditModal"
import AddFileModal from "../components/AddFileModal"
import SendMessageModal from "../components/SendMessageModal"
import AddCarlistModal from "../components/AddCarlistModal"
import RequestsControls from "../components/RequestsControls"
import RequestsTable from "../components/RequestsTable"
import BubbleContext from "../components/BubbleContext"
import Store from "../state/Store"



const RequestPage = observer(() => {

    const closeContextMenu = (e) => {
        e.stopPropagation()
        if (e.target.tagName !== 'LI') Store.setContextMenu(false)
    }

    return (
        <div className={'flex flex-col min-h-screen relative'} onClick={e => closeContextMenu(e)}>
            <MenuTabs />
            <RequestsControls/>
            <RequestsTable/>
            {Store.showContextMenu && <RequestContextMenu posX={Store.mouseX} posY={Store.mouseY}/>}
            {Store.isCheckStatusModalShow && <CheckVehicleStatusModal/>}
            {Store.isShowEditRequestModal && <RequestEditModal/>}
            {Store.showAddFileModal && <AddFileModal/>}
            {Store.isShowSendMessageModal && <SendMessageModal/>}
            {Store.isShowCarlistModal && <AddCarlistModal/>}
            {Store.isBubbleContextShow && <BubbleContext/>}
        </div>
    )
    
})

export default RequestPage;