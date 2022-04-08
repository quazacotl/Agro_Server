import {useCallback, useMemo} from "react"
import { useTable, useBlockLayout } from 'react-table'
import Store from "../state/Store";
import { observer } from "mobx-react-lite"
import {FixedSizeList} from "react-window";
import ErrorPage from "./ErrorPage";
import Loading from "./Loading";
import {dateFromIsoToLocal, getClassesForRow} from "../funcs/funcs";
import reactStringReplace from 'react-string-replace'


const TableData = observer(() => {

    const data = useMemo(() => Store.tableData, [Store.tableData])

    const columns = useMemo(
        () => [
            {
                Header: 'Хозяйство',
                accessor: 'OBJ_NAME',
                width: 240
            },
            {
                Header: 'База',
                accessor: 'BASES_NAME',
                width: 210
            },
            {
                Header: 'Регион',
                accessor: 'REGION',
                width: 130
            },
            {
                Header: 'Техника',
                accessor: 'NODE_NAME',
                width: 415

            },
            {
                Header: 'Рег номер',
                accessor: 'REG_NOM',
                width: 210,
                Cell: ({value}) => {
                    if (Store.inputReg) {
                        value = reactStringReplace(value, Store.inputReg, (match, i) => <span key={i} className={'bg-cyan-300'}>{Store.inputReg}</span>)
                    }
                    return value
                }
            },
            {
                Header: 'VIN',
                accessor: 'ATTR_VALUE',
                width: 230,
                Cell: ({value}) => {
                    if (Store.inputVin) {
                        value = reactStringReplace(value, Store.inputVin, (match, i) => <span key={i} className={'bg-cyan-300'}>{Store.inputVin}</span>)
                    }
                    return value
                }
            },
            {
                Header: 'ID',
                accessor: 'NAV_ID',
                width: 110,
                Cell: ({value}) => {
                    if (Store.inputId) {
                        value = reactStringReplace(String(value), Store.inputId, (match, i) => <span key={i} className={'bg-cyan-300'}>{Store.inputId}</span>)
                    }
                    return value
                }
            },
            {
                Header: 'Последний пакет',
                accessor: `LAST_DATE`,
                Cell: ({value}) => value ? dateFromIsoToLocal(value) : null,
                width: 210
            },
            {
                Header: 'Latitude',
                accessor: 'LAST_LAT'
            },
            {
                Header: 'Longitude',
                accessor: 'LAST_LON'
            }
        ],
        []
      )

    const onRightClick = (e, rowValue) => {
        e.preventDefault()
        Store.setCurrentVehicle(rowValue)
        Store.setPosX(e)
        Store.setPosY(e)
        Store.setContextMenu(true)
    }

    const initialState = { hiddenColumns: ['LAST_LAT', 'LAST_LON'] };

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


    const RenderRow = observer(useCallback(
        ({ index, style }) => {
            const row = rows[index]
            prepareRow(row)
            return (
                <div onContextMenu={(e) => onRightClick(e, row.values)}
                    className={getClassesForRow(row, Store.currentVehicle)}
                    {...row.getRowProps({
                        style,
                    })}
                >
                    {row.cells.map((cell, i) => {
                        return (
                            <div key={i} className="p-2 border " {...cell.getCellProps()}>
                                {cell.render('Cell')}
                            </div>
                        )
                    })}
                </div>
            )
        },
        [prepareRow, rows]
    ))

    const SearchPlaceholder = () => {
        return (
            <>
                <h2 className={'mt-20 text-indigo-200 text-center text-5xl'}>Введите номер для поиска</h2>
                <img className={'m-auto w-[150px] mt-9'} src="./search2.png" alt="search"/>
            </>
        )
    }

    const NotFoundPlaceholder = () => {
        return (
            <>
                <h2 className={'mt-20 text-indigo-200 text-center text-5xl'}>Ничего не найдено</h2>
                <img className={'m-auto w-[350px] mt-9'} src="./not found.png" alt="search"/>
            </>
        )
    }

    const RowsView = observer(() => {
        return (
            <div {...getTableBodyProps()}>
                {(Store.inputVin.length < 3 && Store.inputReg.length < 3 && Store.inputId.length < 3)
                    ?
                    <SearchPlaceholder/>
                    : (((Store.inputVin.length >= 3 || Store.inputReg.length >= 3 || Store.inputId.length >= 3) && Store.tableData.length === 0) ?
                        <NotFoundPlaceholder/> :
                    <FixedSizeList
                        height={630}
                        itemCount={rows.length}
                        itemSize={35}
                        width={totalColumnsWidth +12}
                    >
                        {RenderRow}
                    </FixedSizeList>)
                }

            </div>
        )
    })

    const setSelectedText = () => {
        Store.setSelectedText(window.getSelection().toString())
    }

    const loadingView = Store.loading ? <Loading/> : null
    const errView = Store.error ? <ErrorPage errorText={'Не удалось достучаться до базы данных'}/> : null
    const view = !(Store.error || Store.loading)  ? <RowsView/> : null


    return (
        <div
            onMouseUp={setSelectedText}
            className="mt-2 cursor-pointer rounded-xl overflow-hidden position:relative border-collapse mx-auto border-hidden w-[1767px] vehicle-table mt-2"
            {...getTableProps()}
        >
            <div className="bg-indigo-200 text-center text-slate-900 text-xl py-1">
                {// Loop over the header rows
                    headerGroups.map(headerGroup => (
                        // Apply the header row propsS
                        <div  {...headerGroup.getHeaderGroupProps()} >
                            {// Loop over the headers in each row
                                headerGroup.headers.map((column, i) => (
                                    // Apply the header cell props
                                    <div key={i} className={'py-2'} {...column.getHeaderProps()}>
                                        {// Render the header
                                            column.render('Header')}
                                    </div>
                                ))}
                        </div>
                    ))}
            </div>
            {loadingView}
            {errView}
            {view}
        </div>
    )
})

export default TableData