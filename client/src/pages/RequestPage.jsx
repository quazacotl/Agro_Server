import {observer} from "mobx-react-lite"
import RequestContextMenu from "../components/RequestContextMenu"
import RequestsControls from "../components/RequestsControls"
import RequestsTable from "../components/RequestsTable"
import BubbleContext from "../components/BubbleContext"
import Store from "../state/Store"
import { motion } from "framer-motion"
import {pageMotion} from "../funcs/funcs";



const RequestPage = observer(() => {

    const closeContextMenu = (e) => {
        e.stopPropagation()
        if (e.target.tagName !== 'LI') Store.setContextMenu(false)
    }


    return (
        <motion.div
            className={'flex flex-col min-h-screen relative'}
            onClick={e => closeContextMenu(e)}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageMotion()}
        >
            <RequestsControls/>
            <RequestsTable/>
            {Store.showContextMenu && <RequestContextMenu posX={Store.mouseX} posY={Store.mouseY}/>}
            {Store.isBubbleContextShow && <BubbleContext/>}
        </motion.div>
    )
    
})

export default RequestPage;