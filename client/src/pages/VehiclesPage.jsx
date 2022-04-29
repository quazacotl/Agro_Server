import SearchInputs from "../components/SearchInputs"
import Store from "../state/Store"
import { observer } from "mobx-react-lite"
import {useEffect} from "react"
import VehiclesTable from "../components/VehiclesTable"
import ContextMenu from "../components/ContextMenu"
import { motion } from "framer-motion"
import {pageMotion} from "../funcs/funcs";

const VehiclesPage = observer(() => {

    // Определение нахождения на странице техники
    useEffect(() => {
        Store.setVehiclePageLocation(true)
        return () => Store.setVehiclePageLocation(false)
    }, [])

    const classes = Store.showRequestModal ? 'flex flex-col h-full relative overflow-hidden selection:bg-cyan-200 selection:text-stone-800' : 'flex flex-col relative h-full selection:bg-cyan-200 selection:text-stone-800'


    const closeContextMenu = (e) => {
        e.stopPropagation()
        if (e.target.tagName !== 'LI') Store.setContextMenu(false)
    }


    return (
        <motion.div
            className={classes}
            onClick={e => closeContextMenu(e)}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageMotion()}
        >
            <SearchInputs/>
            <VehiclesTable/>
            {Store.showContextMenu ? <ContextMenu posX={Store.mouseX} posY={Store.mouseY}/> : null}
        </motion.div>
    )
})

export default VehiclesPage;