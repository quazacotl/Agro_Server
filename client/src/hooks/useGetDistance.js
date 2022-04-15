import {useCallback} from "react";
import axios from "axios";
import {Config} from "../config";


const useGetDistance = () => {

    const toRad = useCallback(value => {
        return value * Math.PI / 180;
    }, [])

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    const calcCrow = useCallback((lat1, lon1, lat2, lon2) => {
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
    }, [])


    const getCoords = useCallback(async (execData, vehicleCoords) => {
        for await (const item of execData) {
            const vehicles = await axios.post(`${Config.baseRoute}/vehicles-id`, {id: String(item.navId)})
            const vehicle = vehicles.data[0]
            item.lat = vehicle.LAST_LAT
            item.lon = vehicle.LAST_LON
            item.distance = calcCrow(item.lat, item.lon, vehicleCoords.lat, vehicleCoords.lon)
        }

        return execData
    }, [])

    return {getCoords}
}

export default useGetDistance