import StatisticControls from "../components/StatisticControls"
import {observer} from "mobx-react-lite"
import StatisticChart from "../components/StatisticChart"
import Loading from "../components/Loading"
import Store from "../state/Store"
import {useEffect} from "react"
import { motion } from "framer-motion"
import {pageMotion} from "../funcs/funcs"


const StatisticPage = observer(() => {

    useEffect(() => {
        return () => {
            Store.setDateFrom(null)
            Store.setDateTill(null)
            Store.setCurrentStat(null)
        }

    }, [])

    const StatPlaceholder = () => {
        return (
            <>
                <h2 className={'my-6 text-amber-500 text-3xl text-center'}>Выберите промежуток дат</h2>
                <img className={'w-5/12 mt-10 mx-auto'} src="/business-statistics.png" alt="статистика"/>
            </>
        )
    }

    return (
        <motion.div
            className={'flex flex-col relative h-full'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageMotion()}
        >
            <StatisticControls/>
            {!Store.currentStat && !Store.isLoadingStat ? <StatPlaceholder/> : (
                !Store.isLoadingStat ? <StatisticChart/> : <Loading/>
            )}
        </motion.div>
    );
})

export default StatisticPage;