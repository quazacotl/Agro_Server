import {Config} from "../config";
import axios from "axios";


const useOracleService = () => {
    const getVehiclesByRegNum = async (regNum) => {
        return await axios.post(`${Config.baseRoute}/vehicles-reg`, {regNum})
    }

    const getVehiclesByVin = async (vin) => {
        return await axios.post(`${Config.baseRoute}/vehicles-vin`, {vin})
    }

    const getVehiclesById = async (id) => {
        return await axios.post(`${Config.baseRoute}/vehicles-id`, {id})
    }

    const getVehiclesByOraId = async (id) => {
        return await axios.post(`${Config.baseRoute}/vehicles-ora-id`, {id})
    }


    return {getVehiclesByRegNum, getVehiclesByVin, getVehiclesById, getVehiclesByOraId}
}

export default useOracleService