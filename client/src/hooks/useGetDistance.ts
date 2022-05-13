import axios from "axios";
import {Config} from "../config";
import {RequestDataInterface, execData} from "../interfaces/interfaces";


interface vehicleCoords {
    lat: number
    lon: number
}

const useGetDistance = () => {

    const toRad = (value: number) => {
        return value * Math.PI / 180;
    }

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    const calcCrow = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        let R = 6371; // km
        let dLat = toRad(lat2-lat1);
        let dLon = toRad(lon2-lon1);
        lat1 = toRad(lat1);
        lat2 = toRad(lat2);

        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c;
        return Math.floor(d);
    }

    const getCoordsForExecs = async (execData: execData[]): Promise<execData[]> => {
        for await (const item of execData) {
            const vehicles = await axios.post(`${Config.baseRoute}/vehicles-id`, {id: String(item.navId)})
            if (vehicles.data.length > 0) {
                const vehicle = vehicles.data[0]
                item.lat = vehicle.LAST_LAT
                item.lon = vehicle.LAST_LON
            }
        }
        return execData
    }

    const getCoordsForRequests = async (execData: RequestDataInterface[]): Promise<RequestDataInterface[]> => {
        for await (const item of execData) {
            const vehicles = await axios.post(`${Config.baseRoute}/vehicles-id`, {id: String(item.VehicleId)})
            if (vehicles.data.length > 0) {
                const vehicle = vehicles.data[0]
                item.lat = vehicle.LAST_LAT
                item.lon = vehicle.LAST_LON
            }
        }
        return execData
    }


    const getDistance = async (execData: execData[], vehicleCoords: vehicleCoords): Promise<execData[]> => {
        for await (const item of execData) {
            const vehicles = await axios.post(`${Config.baseRoute}/vehicles-id`, {id: String(item.navId)})
            const vehicle = vehicles.data[0]
            item.lat = vehicle.LAST_LAT
            item.lon = vehicle.LAST_LON
            if (item.lat && item.lon) {
                item.distance = calcCrow(item.lat, item.lon, vehicleCoords.lat, vehicleCoords.lon);
            }
        }
        return execData
    }

    return {getDistance, getCoordsForRequests, getCoordsForExecs}
}

export default useGetDistance