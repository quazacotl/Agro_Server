import {useEffect, useMemo} from "react";
import useOracleService from '../services/useOracleService'
import TableData from './TableData'
import { observer } from "mobx-react-lite"
import Store from "../state/Store";
import ContextMenu from "./ContextMenu";
import AddCarlistModal from "./AddCarlistModal";

const VehiclesPage = observer (() => {
    const {getVehiclesByRegNum, getVehiclesByVin, getVehiclesById } = useOracleService()


    useEffect(() => {
        if (Store.inputReg.length > 2) {
            getVehiclesByRegNum(Store.inputReg)
                .then(data => Store.setTableData(data))
        } else if (Store.inputVin.length > 2) {
            getVehiclesByVin(Store.inputVin)
                .then(data => Store.setTableData(data))
        } else if (Store.inputId.length > 2) {
            getVehiclesById(Store.inputId)
                .then(data => Store.setTableData(data))
        } else Store.setTableData([]);
    }, [Store.inputReg, Store.inputVin, Store.inputId])


    return (
        <>
            <TableData/>
            {Store.showContextMenu ? <ContextMenu posX={Store.mouseX} posY={Store.mouseY}/> : null}
            {Store.isShowCarlistModal ? <AddCarlistModal/> : null}
        </>
    );
});


export default VehiclesPage;