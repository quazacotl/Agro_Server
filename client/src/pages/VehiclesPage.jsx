import MenuTabs from '../components/MenuTabs'
import SearchInputs from "../components/SearchInputs";
import Store from "../state/Store";
import { observer } from "mobx-react-lite"
import {useEffect} from "react";
import VehiclesTable from "../components/VehiclesTable";
import ContextMenu from "../components/ContextMenu";

const VehiclesPage = observer(() => {

    // Определение нахождения на странице техники
    useEffect(() => {
        Store.setVehiclePageLocation(true)
        return () => Store.setVehiclePageLocation(false)
    }, [])

    const classes = Store.showRequestModal ? 'flex flex-col min-h-screen relative overflow-hidden selection:bg-cyan-200 selection:text-stone-800' : 'flex flex-col relative min-h-screen selection:bg-cyan-200 selection:text-stone-800'


    const closeContextMenu = (e) => {
        e.stopPropagation()
        if (e.target.tagName !== 'LI') Store.setContextMenu(false)
    }

    return (
        <div className={classes} onClick={e => closeContextMenu(e)}>
            <MenuTabs/>
            <SearchInputs/>
            <VehiclesTable/>
            {Store.showContextMenu ? <ContextMenu posX={Store.mouseX} posY={Store.mouseY}/> : null}
        </div>
    )
})

export default VehiclesPage;