import {Config} from "../config";
import axios from "axios";


const useOracleService = () => {
    const getVehiclesByRegNum = async (regNum) => {
       const res = await axios.post(`${Config.baseRoute}/vehicles-reg`, {regNum})
        return res.data
    }

    const getVehiclesByVin = async (vin) => {
        const res =  await axios.post(`${Config.baseRoute}/vehicles-vin`, {vin})
        return res.data
    }

    const getVehiclesById = async (id) => {
        const res =  await axios.post(`${Config.baseRoute}/vehicles-id`, {id})
        return res.data
    }

    const getVehiclesByOraId = async (id) => {
        const res =  await axios.post(`${Config.baseRoute}/vehicles-ora-id`, {id})
        return res.data
    }


    return {getVehiclesByRegNum, getVehiclesByVin, getVehiclesById, getVehiclesByOraId}
}

export default useOracleService