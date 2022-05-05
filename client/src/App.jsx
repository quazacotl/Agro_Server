import {BrowserRouter as Router,} from "react-router-dom"
import { useEffect, useRef} from "react"
import Store from "./state/Store"
import useMongoService from "./services/useMongoService"
import {observer} from "mobx-react-lite"
import {CSSTransition } from "react-transition-group"
import RequestCreationModal from "./components/RequestCreationModal"
import ModalWrapper from "./components/ModalWrapper"
import AddCarlistModal from "./components/AddCarlistModal"
import CheckVehicleStatusModal from "./components/CheckVehicleStatusModal"
import RequestEditModal from "./components/RequestEditModal"
import AddFileModal from "./components/AddFileModal"
import SendMessageModal from "./components/SendMessageModal"
import AnimatedRoutes from "./components/AnimatedRoutes"
import MenuTabs from "./components/MenuTabs"
import RequestContextMenu from "./components/RequestContextMenu"
import ContextMenu from "./components/ContextMenu"
import Confirmation from "./components/Confirmation";


const App = observer(() => {
    const {getAllExecutors, getAllRequestTypes, getAllRegions, getCurrentUsers} = useMongoService()

    const clearForms = () => {
        document.body.style.overflow = 'auto'
        Store.setCurrentExecutors([])
        Store.setRequestsTypes([])
        Store.setCurrentRegions([])
        Store.setCurrentUsers([])
    }

    const nodeRef = useRef(null)



    useEffect(() => {
        (async () => {
            const executors = await getAllExecutors();
            const types = await getAllRequestTypes();
            const regions = await getAllRegions();
            const users = await getCurrentUsers();
            Store.setCurrentExecutors(executors)
            Store.setRequestsTypes(types)
            Store.setCurrentRegions(regions)
            Store.setCurrentUsers(users)
        })();
        return () => clearForms()
    }, [])


  return (
    <Router>
        <MenuTabs />
        <AnimatedRoutes/>
        <ModalWrapper isVisible={Store.showRequestModal} hideFunction={Store.setShowRequestModal}>
            <RequestCreationModal/>
        </ModalWrapper>
        <ModalWrapper isVisible={Store.isShowCarlistModal} hideFunction={Store.setIsShowCarlistModal}>
            <AddCarlistModal/>
        </ModalWrapper>
        <ModalWrapper isVisible={Store.isCheckStatusModalShow} hideFunction={Store.setIsCheckStatusModalShow}>
            <CheckVehicleStatusModal/>
        </ModalWrapper>
        <ModalWrapper isVisible={Store.isShowEditRequestModal} hideFunction={Store.setIsShowEditRequestModal}>
            <RequestEditModal/>
        </ModalWrapper>
        <ModalWrapper isVisible={Store.showAddFileModal} hideFunction={Store.setShowAddFileModal}>
            <AddFileModal/>
        </ModalWrapper>
        <ModalWrapper isVisible={Store.isShowSendMessageModal} hideFunction={Store.setIsShowSendMessageModal}>
            <SendMessageModal/>
        </ModalWrapper>
        {Store.showRequestContextMenu && <RequestContextMenu posX={Store.mouseX} posY={Store.mouseY}/>}
        {Store.showVehiclesContextMenu && <ContextMenu posX={Store.mouseX} posY={Store.mouseY}/>}
        <Confirmation isVisible={Store.isConfirmation}/>
        <CSSTransition
            in={Store.isShowNotification}
            timeout={{
                enter: 3000,
                exit: 3000
            }}
            classNames="notification"
            mountOnEnter
            unmountOnExit
            nodeRef={nodeRef}
            onEntered={Store.hideNotification}
            onExited={() => Store.setNotificationText('')}
        >
            <div ref={nodeRef} className={'absolute shadow-around shadow-amber-500 px-6 py-4 right-40 top-20 bg-white text-xl text-center text-stone-700 rounded-xl'}>
                {Store.notificationText}
            </div>
        </CSSTransition>
    </Router>
  );
})

export default App;
