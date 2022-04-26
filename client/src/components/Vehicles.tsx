import {useEffect, useMemo} from "react";
import useOracleService from '../services/useOracleService'
import TableData from './TableData'
import {observer, useLocalObservable} from "mobx-react-lite"
import Store from "../state/Store";
import ContextMenu from "./ContextMenu";
import AddCarlistModal from "./AddCarlistModal";
import axios from "axios";
import {Config} from "../config";

const VehiclesPage = observer (() => {
    const {getVehiclesByRegNum, getVehiclesByVin, getVehiclesById } = useOracleService()

    const vehiclesState = useLocalObservable(() => ({
            loading: false,
            setLoading(bool: boolean) {
                this.loading = bool
            },
            error: false,
            setError(bool: boolean) {
                this.error = bool
            }
        }
    ))


    useEffect(() => {

        (async () => {
            if (Store.inputReg.length > 2) {
                vehiclesState.setLoading(true)
                const res = await getVehiclesByRegNum()
                console.log(res)
                vehiclesState.setLoading(false)

                // try {
                //     const response = await axios.post(
                //         `${Config.baseRoute}/vehicles-reg`, {Store.inputReg}
                //     );
                //     Store.setTableData(response.data)
                // } catch (err) {
                //     vehiclesState.setError(true)
                //     console.log(err)
                // } finally {
                //     vehiclesState.setLoading(false);
                // }
            }
        })()

        if (Store.inputReg.length > 2) {
            getVehiclesByRegNum(Store.inputReg)
                // .then(data => Store.setTableData(data.data))
                .then(data => console.log(data))
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