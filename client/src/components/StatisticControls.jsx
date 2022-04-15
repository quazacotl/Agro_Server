import DatePicker, { registerLocale } from "react-datepicker"
import {observer} from "mobx-react-lite";
import useMongoService from "../services/useMongoService";
import Store from "../state/Store";
import ru from 'date-fns/locale/ru'

registerLocale("ru", ru)

const StatisticControls = observer(() => {
    const {getStatistics} = useMongoService()

    const onChangeFromDate = async (date) => {
        Store.setDateFrom(date)
        if (Store.dateTill) {
            Store.setIsLoadingStat(true)

            const body = {
                dateFrom: Store.dateFrom,
                dateTill: Store.dateTill
            }
            try {
                const res = await getStatistics(body)
                Store.setCurrentStat(res)
                Store.setIsLoadingStat(false)
            } catch (e) {
                console.log(e)
                Store.setLoading(false)
            }
        }
    }

    const onChangeTillDate = async (date) => {
        Store.setDateTill(date)

        if (Store.dateFrom) {
            Store.setIsLoadingStat(true)
            const body = {
                dateFrom: Store.dateFrom,
                dateTill: Store.dateTill
            }
            try {
                const res = await getStatistics(body)
                Store.setCurrentStat(res)
                Store.setIsLoadingStat(false)
            } catch (e) {
                console.log(e)
                Store.setIsLoadingStat(false)
            }
        }
    }

    return (
        <div className={'flex justify-center mt-14 gap-24'}>
            <div className={'flex flex-col gap-4'}>
                <h2 className={'text-xl text-white'}>Начало</h2>
                <DatePicker
                    className={'rounded-lg py-1 text-md border-stone-300 border-none focus:border-none focus:ring-0 focus:ring-offset-0 focus:shadow-input-focus'}
                    selected={Store.dateFrom ? Store.dateFrom : ''}
                    onChange={(date) => {onChangeFromDate(date)}}
                    dateFormat="dd.MM.yy"
                    locale="ru"
                    tabIndex={-1}
                    placeholderText="Выбрать дату"
                />
            </div>
            <div className={'flex flex-col gap-4'}>
                <h2 className={'text-xl text-white'}>Конец</h2>
                <DatePicker
                    className={'rounded-lg py-1 text-md border-stone-300 border-none focus:border-none focus:ring-0 focus:ring-offset-0 focus:shadow-input-focus'}
                    selected={Store.dateTill ? Store.dateTill : ''}
                    onChange={(date) => {onChangeTillDate(date)}}
                    dateFormat="dd.MM.yy"
                    locale="ru"
                    tabIndex={-1}
                    placeholderText="Выбрать дату"
                />
            </div>
        </div>
    )
})

export default StatisticControls