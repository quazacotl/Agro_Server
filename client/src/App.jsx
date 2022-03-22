import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import VehiclesPage from "./pages/VehiclesPage";
import RequestPage from "./pages/RequestPage";
import { useEffect, useRef} from "react";
import Store from "./state/Store";
import useMongoService from "./services/useMongoService";
import {observer} from "mobx-react-lite";
import {CSSTransition } from "react-transition-group";
import RequestCreationModal from "./components/RequestCreationModal";


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
      <Routes>
        <Route path="/" element={<RequestPage/>}/>
        <Route path="/monitor" element={<VehiclesPage/>}/>
      </Routes>
        {Store.showRequestModal ? <RequestCreationModal/> : null}
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
