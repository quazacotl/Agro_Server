import Store from "../state/Store";
import { useEffect, useMemo} from "react";
import {observer} from "mobx-react-lite";
import {useTable} from "react-table";
import {dateFromIsoToLocal, getClassesForRow} from "../funcs/funcs";

const CheckVehicleStatusModal = observer(() => {


    useEffect(() => {
        (async () => {
            document.body.style.overflow = 'hidden';
        })()
        return () => {
            document.body.style.overflow = 'auto'
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

    return (
        <div
            onMouseDown={hideModal}
            className={'absolute left-0 w-screen h-screen flex justify-center items-center bg-neutral-700/50'}
            style={{top: Store.offsetY}}
        >
            <table className="table-auto position:relative border-collapse mx-5 overflow-scroll my-5 border-hidden rounded-xl w-3/5 shadow-xl shadow-around bg-white" {...getTableProps()}>
                <thead className="bg-indigo-100">
                {// Loop over the header rows
                    headerGroups.map(headerGroup => (
                        // Apply the header row propsS
                        <tr  {...headerGroup.getHeaderGroupProps()}>
                            {// Loop over the headers in each row
                                headerGroup.headers.map(column => (
                                    // Apply the header cell props
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl text-slate-700 text-lg h-11" {...column.getHeaderProps()}>
                                        {// Render the header
                                            column.render('Header')}
                                    </th>
                                ))}
                        </tr>
                    ))}
                </thead>
                {/* Apply the table body props */}
                <tbody {...getTableBodyProps()}>
                {// Loop over the table rows
                    rows.map(row => {
                        // Prepare the row for display
                        prepareRow(row)
                        return (
                            // Apply the row props
                            <tr
                                className={getClassesForRow(row.values.LAST_DATE)}

                                {...row.getRowProps()}>
                                {// Loop over the rows cells
                                    row.cells.map(cell => {
                                        // Apply the cell props
                                        return (
                                            <td className="p-2 border " {...cell.getCellProps()}>
                                                {// Render the cell contents
                                                    cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
});

export default CheckVehicleStatusModal;