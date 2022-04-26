import { useHttpHooks } from "../hooks/usehttp.hooks"
import {Config} from "../config";
import axios from "axios";


const useOracleService = () => {
    const {request} = useHttpHooks()


    const getVehiclesByRegNum = async (regNum) => {

        const res = await axios.post(`${Config.baseRoute}/vehicles-reg`, {regNum})
        console.log(res)
        return res

        // return await request(`${Config.baseRoute}/vehicles-reg`, 'POST', JSON.stringify({regNum}))
    }

    const getVehiclesByVin = async (vin) => {
        return await request(`${Config.baseRoute}/vehicles-vin`, 'POST', JSON.stringify({vin}))
    }

    const getVehiclesById = async (id) => {
        return await request(`${Config.baseRoute}/vehicles-id`, 'POST', JSON.stringify({id}))
    }

    const getVehiclesByOraId = async (id) => {
        return await request(`${Config.baseRoute}/vehicles-ora-id`, 'POST', JSON.stringify({id}))
    }


    return {getVehiclesByRegNum, getVehiclesByVin, getVehiclesById, getVehiclesByOraId}
}

export default useOracleService