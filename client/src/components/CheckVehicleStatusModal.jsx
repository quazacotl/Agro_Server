import Store from "../state/Store";
import { useEffect, useMemo} from "react";
import {observer} from "mobx-react-lite";
import {useTable} from "react-table";
import {dateFromIsoToLocal, getClassesForRow} from "../funcs/funcs";
import Loading from "./Loading";
import {useLockBodyScroll} from "../hooks/useLockBodyScroll";

const CheckVehicleStatusModal = observer(() => {
    useLockBodyScroll()

    useEffect(() => {
        return () => {
            Store.setCurrentRequest(null)
            Store.setFoundVehiclesByRegNom([])
        }
    }, [])

    const data = useMemo(() => Store.foundVehiclesByRegNom, [Store.foundVehiclesByRegNom])

    const columns = useMemo(
        () => [
            {
                Header: 'База',
                accessor: 'BASES_NAME',
            },
            {
                Header: 'Регион',
                accessor: 'REGION',
            },
            {
                Header: 'Техника',
                accessor: 'NODE_NAME',

            },
            {
                Header: 'Рег номер',
                accessor: 'REG_NOM',
            },
            {
                Header: 'ID',
                accessor: 'NAV_ID',
            },
            {
                Header: 'Последний пакет',
                accessor: `LAST_DATE`,
                Cell: ({value}) => value ? dateFromIsoToLocal(value) : null,
            },
        ],
        []
    )

    const hideModal = (e) => {
        if(e.target === e.currentTarget) {
            Store.setIsCheckStatusModalShow(false)
        }
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data
        }
    )

    const TableView = () => {
        return (
            <table className="request-table rounded-xl overflow-hidden selection:bg-cyan-200 position:relative border-collapse mx-auto my-5 border-hidde mx-5 my-5 w-3/5 bg-white" {...getTableProps()}>
                <thead className="bg-indigo-100">
                {headerGroups.map(headerGroup => (
                        <tr  {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                    <th className="text-slate-700 text-lg h-11" {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr
                                className={getClassesForRow(row)}

                                {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                        return (
                                            <td className="p-2 border" {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <div
            onMouseDown={hideModal}
            className={'absolute left-0 w-screen h-screen flex justify-center items-center bg-neutral-700/50'}
            style={{top: Store.offsetY}}
        >
            {Store.checkStatusLoading ? <Loading/> : <TableView/>}
        </div>
    );
});

export default CheckVehicleStatusModal;