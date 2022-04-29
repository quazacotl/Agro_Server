import {Route, Routes, useLocation} from "react-router-dom"
import RequestPage from "../pages/RequestPage"
import VehiclesPage from "../pages/VehiclesPage"
import StatisticPage from "../pages/StatisticPage"
import MapPage from "../pages/MapPage"
import {AnimatePresence} from "framer-motion"

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<RequestPage/>}/>
                <Route path="/monitor" element={<VehiclesPage/>}/>
                <Route path="/statistic" element={<StatisticPage/>}/>
                <Route path="/map" element={<MapPage/>}/>
            </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes