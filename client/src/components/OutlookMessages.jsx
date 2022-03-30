import {observer} from "mobx-react-lite";
import Store from "../state/Store";
import {useCallback, useEffect, useMemo} from "react";
import { FixedSizeList } from 'react-window'
import {useTable, useBlockLayout} from "react-table";
import Loading from "./Loading";
import useOutlookService from "../services/useOutlookService";
import {dateFromIsoToLocal} from "../funcs/funcs";

const MailView = observer(() => {
    const {getLastMails} = useOutlookService()

    useEffect(() => {
        (async () => {
            try {
                const mails = await getLastMails()
                Store.setLastMails(mails)
            }
            catch (e) {console.log(e)}
        })()
    }, [])

    const data = useMemo(() => Store.lastMails, [Store.lastMails])


    const setReqChosenMail = (value) => {
        Store.setReqChosenMail({
            changeKey: value.changeKey,
            id: value.id,
            senderEmail: value.senderEmail,
            senderName: value.senderName,
            sentDate: value.sentDate,
            subject: value.subject
        })
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Прислал',
                accessor: 'senderName',
                width: 270
            },
            {
                Header: 'Дата',
                accessor: 'sentDate',
                Cell: ({value}) => value ? dateFromIsoToLocal(value) : null,
                width: 180
            },
            {
                Header: 'Тема',
                accessor: 'subject',
                width: 305
            },
            {
                Header: 'Адрес почты',
                accessor: 'senderEmail'
            },
            {
                Header: 'ID',
                accessor: 'id'
            },
            {
                Header: 'ChangeKey',
                accessor: 'changeKey'
            }
        ],
        []
    )


    const initialState = { hiddenColumns: ['senderEmail', 'id', 'changeKey'] };


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
            initialState,
        },
        useBlockLayout
    )



    const RenderRow = useCallback(
        ({ index, style }) => {
            const row = rows[index]
            prepareRow(row)
            return (
                <div
                    {...row.getRowProps({
                        style,
                    })}
                    className={'text-center text-black hover:bg-cyan-100 bg-white cursor-pointer'}
                    onClick={() => setReqChosenMail(row.values)}
                >
                    {row.cells.map((cell, i) => {
                        return (
                            <div  key={i} {...cell.getCellProps()} className="p-1 line-clamp-1 border">
                                {cell.render('Cell')}
                            </div>
                        )
                    })}
                </div>
            )
        },
        [prepareRow, rows]
    )

    const LoadedMessages = () => {
        return (
            <div {...getTableBodyProps()}>
                <FixedSizeList
                    height={245}
                    itemCount={rows.length}
                    itemSize={35}
                    width={totalColumnsWidth }
                >
                    {RenderRow}
                </FixedSizeList>
            </div>
        )
    }

    const ErrorMessages = () => {
        return (
            <div className={'flex flex-col'}>
                <img src="/icons8-error-cloud-96.png" alt="error-message"/>
                <h2 className={'text-center text-lg text-black'}>Не удалось загрузить письма</h2>
            </div>
        )
    }

    const loadingView = Store.mailsLoading ? <Loading/> : null
    const errView = Store.mailsError ? <ErrorMessages/> : null
    const view = !(Store.mailsLoading || Store.mailsError)  ? <LoadedMessages/> : null

    return (
        <div  className="table-auto rounded-xl overflow-hidden table-fixed position:relative border-collapse mx-auto border-hidden  shadow-xl shadow-around bg-gray-100 shadow-md mt-2 shadow-stone-700" {...getTableProps()}>
            <div className="bg-amber-200/80 text-center text-slate-900 text-lg py-1">
            {// Loop over the header rows
                headerGroups.map((headerGroup, i) => (
                    // Apply the header row propsS
                    <div key={i}  {...headerGroup.getHeaderGroupProps()} >
                        {// Loop over the headers in each row
                            headerGroup.headers.map((column, i) => (
                                // Apply the header cell props
                                <div key={i}  {...column.getHeaderProps()}>
                                    {// Render the header
                                        column.render('Header')}
                                </div>
                            ))}
                    </div>
                ))}
            </div>
            <div className={'h-[245px] relative'}>
                {loadingView}
                {errView}
                {view}
            </div>

        </div>
    )})



export default MailView

