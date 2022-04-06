import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {toJS} from "mobx";
import {observer} from "mobx-react-lite";
import Store from "../state/Store";

const StatisticChart = observer(() => {

    const data = toJS(Store.currentStat.result)

    const TypeView = observer((props) => {
        return (
            <div className={'flex items-center gap-4 text-lg text-white'}>
                <div className={'w-4 h-4 rounded-full bg-amber-300'}/>
                <div className={'mr-4'}>{props.name}</div>
                <div className={'ml-auto'}>{props.count}</div>
            </div>
        )
    })


    return (
        <div className={'flex mx-auto my-12 justify-center items-center gap-8'}>
            <div className={'text-lg text-white'}>
                {Object.keys(Store.currentStat.totalCounts).map((item, i) => {
                    return <TypeView  key={i} name={item} count={Store.currentStat.totalCounts[item]}/>
                })}
            </div>
                <BarChart
                    width={1200}
                    height={670}
                    data={data}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="Исполнитель"
                        tick={{stroke: 'white'}}
                        angle={270}
                        height={130}
                        interval={0}
                        orientation={'top'}
                        tickMargin={65}
                    />
                    <YAxis  tick={{stroke: 'white'}}/>
                    <Tooltip />
                    <Legend/>
                    <Bar dataKey="Весы" stackId="a" fill="#f9a8d4" />
                    <Bar dataKey="Работы с топливом" stackId="a" fill="#6ee7b7" />
                    <Bar dataKey="Ремонт/установка системы учета зерна/удобрений" stackId="a" fill="#cbd5e1" />
                    <Bar dataKey="Отсутствие сигнала GPS" stackId="a" fill="#fdba74" />
                    <Bar dataKey="Установка Автограф+ДУТ" stackId="a" fill="#5eead4" />
                    <Bar dataKey="Установка автографа" stackId="a" fill="#a5b4fc" />
                    <Bar dataKey="Прочее" stackId="a" fill="#c4b5fd" />
                    <Bar dataKey="Ремонт/установка системы учета на опрыскивателе" stackId="a" fill="#f0abfc" />
                    <Bar dataKey="Планшеты" stackId="a" fill="#fda4af" />
                    <Bar dataKey="Тахограф" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="ППО" stackId="a" fill="#fde047" />
                    <Bar dataKey="Метеостанция" stackId="a" fill="#fca5a5" />
                    <Bar dataKey="Сигнализация" stackId="a" fill="#fcd34d" />
                    <Bar dataKey="Обороты" stackId="a" fill="#7dd3fc" />
                </BarChart>
        </div>
    )
})

export default StatisticChart