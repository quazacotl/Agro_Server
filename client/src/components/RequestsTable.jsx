import {useCallback, useMemo} from "react"
import {useBlockLayout, useTable} from 'react-table'
import Store from "../state/Store";
import { observer } from "mobx-react-lite"
import {DateTime} from "luxon";
import {FixedSizeList} from "react-window";
import {dateFromIsoToLocal} from '../funcs/funcs'


// Классы для окрашивания ячеек с планируемой датой
const getClassesForDate = (cell) => {
    const classes = "p-2 border border-gray-300"
    if (cell.column.id === 'PlannedDate' && cell.row.values.PlannedDate) {
        if (!cell.row.values.PlannedDate) return `${classes} bg-gray-50`
        if (DateTime.now().hasSame(DateTime.fromISO(cell.row.values.PlannedDate), 'day')) return `${classes} bg-yellow-300`
        const getDateDiff = (DateTime.now().diff (DateTime.fromISO(cell.row.values.PlannedDate), 'day'))
        if (getDateDiff > 1) return `${classes} bg-red-300`
        else if (getDateDiff < 0) return `${classes} bg-green-300`
    }
    return classes
}

const RequestsTable = observer(() => {
    const data = useMemo(() => Store.requestsData, [Store.requestsData])

    const columns = useMemo(
        () => [
            {
                Header: 'Хозяйство',
                accessor: 'ObjName',
                width: 180
            },
            {
                Header: 'База',
                accessor: 'BaseName',
                width: 130
            },
            {
                Header: 'Техника',
                accessor: 'VehicleType',
                width: 170
            },
            {
                Header: 'Регион',
                accessor: 'Region',
                width: 80
            },
            {
                Header: 'Рег номер',
                accessor: 'VehicleRegNum',
                width: 160
            },
            {
                Header: 'ID',
                accessor: 'VehicleId',
                width: 80
            },
            {
                Header: 'Тип заявки',
                accessor: 'RequestType',
                width: 200
            },
            {
                Header: 'Комментарий',
                accessor: 'Description',
                width: 310
            },
            {
                Header: 'Создана',
                accessor: 'CreateDate',
                Cell: ({value}) => value ? dateFromIsoToLocal(value) : null
            },
            {
                Header: 'План',
                accessor: 'PlannedDate',
                Cell: ({value}) => value ? dateFromIsoToLocal(value) : null,
                width: 130
            },
            {
                Header: 'Закрыта',
                accessor: 'ExecuteDate',
                Cell: ({value}) => value ? dateFromIsoToLocal(value) : null
            },
            {
                Header: 'Создал',
                accessor: 'Creator'
            },
            {
                Header: 'Исполнил',
                accessor: 'Executor',
                width: 120
            },
            {
                Header: 'Закрыл',
                accessor: 'Auditor'
            },
            {
                Header: 'Прислано',
                accessor: 'SentFromName',
                width: 150
            },
            {
                Header: 'Дата письма',
                accessor: `SentFromDate`,
                Cell: ({value}) => value ? dateFromIsoToLocal(value) : null,
                width: 130
            },
            {
                Header: 'ID заявки',
                accessor: '_id'
            },
            {
                Header: 'isExecuted',
                accessor: 'isExecuted'
            },
            {
                Header: 'Acts',
                accessor: 'Acts'
            },
            {
                Header: 'mailId',
                accessor: 'mailId'
            },
            {
                Header: 'mailChangeKey',
                accessor: 'mailChangeKey'
            },
            {
                Header: 'EmailAddress',
                accessor: 'SentFromEmail'
            }
        ],
        []
    )

    const initialState = { hiddenColumns: ['_id', 'Acts', 'SentFromEmail', 'mailChangeKey', 'mailId', 'CreateDate', 'ExecuteDate', 'Creator', 'Auditor', 'isExecuted'] };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        totalColumnsWidth,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            initialState
        },
        useBlockLayout
    )

    // Показ полного комментария, имени создателя и проверяющего, даты создания и закрытия
    const showBubble = (e, cell) => {
        Store.setBubbleContextXCoord(e.clientX)
        Store.setBubbleContextYCoord(e.clientY)
        switch (cell.column.id) {
            case 'Description':
                if (e.target.innerText.length > 41) {
                    Store.setBubbleContextText(e.target.innerText);
                    Store.setIsBubbleContextShow(true)
                }
                break
            case 'RequestType':
                if (e.target.innerText.length > 24) {
                    Store.setBubbleContextText(e.target.innerText);
                    Store.setIsBubbleContextShow(true)
                }
                break
            case 'VehicleRegNum':
                if (e.target.innerText.length > 15) {
                    Store.setBubbleContextText(e.target.innerText);
                    Store.setIsBubbleContextShow(true)
                }
                break
            case 'PlannedDate':
                const text1 = cell.row.values.isExecuted ?
                    `Создана:  ${dateFromIsoToLocal(cell.row.values.CreateDate)}\nИсполнена:  ${dateFromIsoToLocal(cell.row.values.ExecuteDate)}` :
                    `Создана:  ${dateFromIsoToLocal(cell.row.values.CreateDate)}`
                Store.setIsBubbleContextShow(true)
                Store.setBubbleContextText(text1)
                break
            case 'Executor':
                const text2 = cell.row.values.Auditor ?
                    `Создал:  ${cell.row.values.Creator}\nЗакрыл:  ${cell.row.values.Auditor}` :
                    `Создал:  ${cell.row.values.Creator}`
                Store.setIsBubbleContextShow(true)
                Store.setBubbleContextText(text2)
                break
        }
    }

    const hideBubble = () => {
        if  (Store.setIsBubbleContextShow) {
            Store.setBubbleContextText('')
            Store.setIsBubbleContextShow(false)
        }
    }

    const RenderRow = useCallback(
        ({ index, style }) => {
            const row = rows[index]
            prepareRow(row)
            return (
                <div
                    onContextMenu={e => onRightClick(e, row.values)}
                     {...row.getRowProps({
                         style,
                         className: row.values.ExecuteDate ? 'text-center line-clamp-1 last:rounded-b-xl text-sm cursor-pointer hover:text-amber-500 bg-green-200' : 'text-center hover:text-amber-500 last:rounded-b-xl text-sm bg-gray-50 line-clamp-1 cursor-pointer'
                     })}
                >
                    {row.cells.map((cell, i) => {
                        return (
                            <div
                                key={i}
                                className={getClassesForDate(cell)}
                                {...cell.getCellProps({
                                onMouseEnter : (e) => showBubble(e, cell),
                                onMouseLeave: hideBubble
                            })}>
                                {cell.render('Cell')}
                            </div>
                        )
                    })}
                </div>
            )
        },
        [prepareRow, rows]
    )

    const RowsView = observer(() => {
        return (
            <div {...getTableBodyProps()}>
                <FixedSizeList
                    height={660}
                    itemCount={rows.length}
                    itemSize={33}
                    width={totalColumnsWidth +17}
                >
                    {RenderRow}
                </FixedSizeList>
            </div>
        )
    })

    const onRightClick = async (e, rowValue) => {
        console.log(rowValue)
        e.preventDefault()
        await Store.setOffsetY()
        await Store.setCurrentRequest(rowValue)
        await Store.setPosX(e)
        await Store.setPosY(e)
        await Store.setContextMenu(true)
    }

    const setSelectedText = () => {
        Store.setSelectedText(window.getSelection().toString())
    }

    // const loadingView = Store.loading ? <Loading/> : null
    // const errView = Store.error ? <ErrorPage errorText={'Не удалось достучаться до базы данных'}/> : null
    // const view = !(Store.error || Store.loading)  ? <RowsView/> : null

    return (
        <div
            onMouseUp={setSelectedText}
            className="request-table overflow-hidden selection:bg-cyan-200 position:relative border-collapse mx-auto my-5 border-hidden rounded-xl w-[1857px]"
            {...getTableProps()}
        >
            <div className="bg-indigo-200 text-center text-black text-lg py-1">
            {// Loop over the header rows
                headerGroups.map(headerGroup => (
                    // Apply the header row propsS
                    <div  {...headerGroup.getHeaderGroupProps()}>
                        {// Loop over the headers in each row
                            headerGroup.headers.map(column => (
                                // Apply the header cell props
                                <div className={'py-1'} {...column.getHeaderProps()}>
                                    {// Render the header
                                        column.render('Header')}
                                </div>
                            ))}
                    </div>
                ))}
            </div>
            <RowsView/>
        </div>
    )
})

export default RequestsTable