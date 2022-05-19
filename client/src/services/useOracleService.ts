import {Config} from "../config";
import axios from "axios";
import {TableDataInterface} from "../interfaces/interfaces";


const useOracleService = () => {
    const getVehiclesByRegNum = async (regNum: string): Promise<TableDataInterface[]> => {
        const res = await axios.post(`${Config.baseRoute}/vehicles-reg`, {regNum})
        return res.data
    }

    const getVehiclesByVin = async (vin: string): Promise<TableDataInterface[]> => {
        const res =  await axios.post(`${Config.baseRoute}/vehicles-vin`, {vin})
        return res.data
    }

    const getVehiclesById = async (id: string): Promise<TableDataInterface[]> => {
        const res =  await axios.post(`${Config.baseRoute}/vehicles-id`, {id})
        return res.data
    }

    const getVehiclesByOraId = async (id: number): Promise<TableDataInterface[]> => {
        const res =  await axios.post(`${Config.baseRoute}/vehicles-ora-id`, {id})
        return res.data
    }


    return {getVehiclesByRegNum, getVehiclesByVin, getVehiclesById, getVehiclesByOraId}
}

export default useOracleService