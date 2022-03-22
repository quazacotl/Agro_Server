import { useHttpHooks } from "../hooks/usehttp.hooks"
import {Config} from "../config";

const useOracleService = () => {
    const {request} = useHttpHooks()


    const getVehiclesByRegNum = async (regNum) => {
        return  await request(`${Config.baseRoute}/vehicles-reg`, 'POST', JSON.stringify({regNum}))
    }

    const getVehiclesByVin = async (vin) => {
        return  await request(`${Config.baseRoute}/vehicles-vin`, 'POST', JSON.stringify({vin}))
    }

    const getVehiclesById = async (id) => {
        return  await request(`${Config.baseRoute}/vehicles-id`, 'POST', JSON.stringify({id}))
    }

    return {getVehiclesByRegNum, getVehiclesByVin, getVehiclesById}
}

export default useOracleService