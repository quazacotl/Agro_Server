import MenuTabs from "../components/MenuTabs";
import StatisticControls from "../components/StatisticControls";
import {observer} from "mobx-react-lite";
import StatisticChart from "../components/StatisticChart";
import Loading from "../components/Loading";
import Store from "../state/Store";
import {useEffect} from "react";


const StatisticPage = observer(() => {

    useEffect(() => {
        return () => {
            Store.setDateFrom(null)
            Store.setDateTill(null)
            Store.setCurrentStat(null)
        }

    }, [])

    return (
        <div className={'flex flex-col relative h-screen'}>
            <MenuTabs/>
            <StatisticControls/>
            {!Store.currentStat && !Store.isLoadingStat ? null : (
                !Store.isLoadingStat ? <StatisticChart/> : <Loading/>
            )}
        </div>
    );
})

export default StatisticPage;