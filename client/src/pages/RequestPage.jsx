import {observer} from "mobx-react-lite"
import RequestsControls from "../components/RequestsControls"
import RequestsTable from "../components/RequestsTable"
import BubbleContext from "../components/BubbleContext"
import Store from "../state/Store"
import { motion } from "framer-motion"
import {pageMotion} from "../funcs/funcs"
import {useEffect} from "react"



const RequestPage = observer(() => {
    useEffect(() => () => Store.setShowRequestContextMenu(false),[])

    const closeContextMenu = (e) => {
        e.stopPropagation()
        if (e.target.tagName !== 'LI') {
            Store.setShowRequestContextMenu(false)
            Store.setIsConfirmation(false)
        }
    }


    return (
        <motion.div
            className={'flex flex-col h-full relative overflow-x-hidden'}
            onClick={e => closeContextMenu(e)}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageMotion()}
        >
            <RequestsControls/>
            <RequestsTable/>
            {Store.isBubbleContextShow && <BubbleContext/>}

        </motion.div>
    )
    
})

export default RequestPage;