import SearchInputs from "../components/SearchInputs"
import Store from "../state/Store"
import { observer } from "mobx-react-lite"
import {useEffect} from "react"
import VehiclesTable from "../components/VehiclesTable"
import { motion } from "framer-motion"
import {pageMotion} from "../funcs/funcs";

const VehiclesPage = observer(() => {

    // Определение нахождения на странице техники
    useEffect(() => {
        Store.setVehiclePageLocation(true)
        return () => {
            Store.setVehiclePageLocation(false)
            Store.setShowVehiclesContextMenu(false)
        }
    }, [])

    const classes = Store.showRequestModal ? 'flex flex-col h-full relative overflow-hidden selection:bg-cyan-200 selection:text-stone-800' : 'flex flex-col relative h-full selection:bg-cyan-200 selection:text-stone-800'


    const closeContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if ((e.target as HTMLDivElement).tagName !== 'LI') Store.setShowVehiclesContextMenu(false)
    }


    return (
        <motion.div
            className={classes}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => closeContextMenu(e)}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageMotion()}
        >
            <SearchInputs/>
            <VehiclesTable/>
        </motion.div>
    )
})

export default VehiclesPage;