import {observer} from "mobx-react-lite";
import Store from "../state/Store";
import {useCallback, useEffect, useMemo} from "react";
import { FixedSizeList } from 'react-window';
import {useTable, useBlockLayout, Column} from "react-table";
import Loading from "./Loading";
import useOutlookService from "../services/useOutlookService";
import {dateFromIsoToLocal} from "../funcs/funcs";
import {outlookMessagesInterface} from "../interfaces/interfaces";

interface MailViewProps {
    height: number
}

const MailView = observer((props: MailViewProps) => {
    const {getLastMails} = useOutlookService()

    const updateMails = async () => {
        const mails = await getLastMails(Store.mailOffset)
        Store.setLastMails(mails)
    }

    useEffect(() => {
        (async () => {
            try {
                await updateMails()
            }
            catch (e) {console.log(e)}

        })()
        return () => Store.resetMailOffset()
    }, [])

    const data = useMemo(() => Store.lastMails, [Store.lastMails])


    const setReqChosenMail = (value: outlookMessagesInterface): void => {
        const { senderEmail, senderName, sentDate} = value
        Store.setReqChosenMail({ senderEmail, senderName, sentDate})
    }


    const LoadNextButton = observer(() => {
        return (
            <button
                disabled={Store.mailsLoading}
                className={'text-lg text-sky-600 disabled:text-stone-500 hover:text-amber-500'}
                onClick={async () => {
                    Store.increaseMailOffset(10)
                    await updateMails()
                }}
            >
                &dArr; Сдедующие &dArr;
            </button>
        )
    })

    const LoadPreviousButton = observer(() => {
        return (
            <button
                disabled={Store.mailsLoading || Store.mailOffset === 0}
                className={'text-lg text-sky-600 disabled:text-stone-500 hover:text-amber-500'}
                onClick={async () => {
                    Store.increaseMailOffset(-10)
                    await updateMails()
                }}
            >
                &uArr; Предыдущие &uArr;
            </button>
        )
    })

    const columns = useMemo<Column<outlookMessagesInterface>[]>(
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
                    width: 180,
                    Footer: <LoadNextButton/>
                },
                {
                    Header: 'Тема',
                    accessor: 'subject',
                    width: 305,
                    Footer: <LoadPreviousButton/>
                },
                {
                    Header: 'Адрес почты',
                    accessor: 'senderEmail'
                }
           ],
        []
    )


    const initialState = { hiddenColumns: ['senderEmail'] };


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        totalColumnsWidth,
        footerGroups,
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
                    onClick={() => setReqChosenMail(row.values as outlookMessagesInterface)}
                >
                    {row.cells.map((cell) => {
                        return (
                            <div {...cell.getCellProps()} className="p-1 line-clamp-1 border">
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
                    height={props.height}
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
                <img className={'object-contain w-32 m-auto'} src="/icons8-error-cloud-96.png" alt="error-message"/>
                <h2 className={'text-center text-lg text-black'}>Не удалось загрузить письма</h2>
            </div>
        )
    }

    const loadingView = Store.mailsLoading ? <Loading/> : null
    const errView = Store.mailsError ? <ErrorMessages/> : null
    const view = !(Store.mailsLoading || Store.mailsError)  ? <LoadedMessages/> : null
    const heightClass = `${String(props.height)}px`
    return (
        <div  className="table-auto rounded-xl overflow-hidden table-fixed position:relative border-collapse mx-auto border-hidden bg-gray-100 shadow-form-sh mt-2" {...getTableProps()}>
            <div className="bg-amber-200/80 text-center text-slate-900 text-lg py-1">
                {headerGroups.map((headerGroup) => (
                        <div {...headerGroup.getHeaderGroupProps()} >
                            {headerGroup.headers.map((column) => (
                                    <div {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </div>
                                ))}
                        </div>
                    ))}
            </div>
            <div className={`relative`} style={{height: heightClass}}>
                {loadingView}
                {errView}
                {view}
            </div>
            <div>
                {footerGroups.map(group => (
                    <div {...group.getFooterGroupProps()}>
                        {group.headers.map(column => (
                            <div
                                className={'text-center text-lg'}
                                {...column.getFooterProps()}
                            >
                                {column.render('Footer')}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )})



export default MailView

