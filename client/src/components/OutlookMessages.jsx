import {observer} from "mobx-react-lite";
import Store from "../state/Store";
import {useCallback, useEffect, useMemo} from "react";
import { FixedSizeList } from 'react-window'
import {useTable, useBlockLayout} from "react-table";
import Loading from "./Loading";
import useOutlookService from "../services/useOutlookService";
import {dateFromIsoToLocal} from "../funcs/funcs";

const MailView = observer((props) => {
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


    const LoadNextButton = observer(() => {
        return (
            <button
                disabled={Store.mailsLoading}
                className={'text-lg text-sky-600 disabled:text-stone-500 hover:text-amber-500'}
                onClick={() => {
                    Store.increaseMailOffset(10)
                    updateMails()
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
                onClick={() => {
                    Store.increaseMailOffset(-10)
                    updateMails()
                }}
            >
                &uArr; Предыдущие &uArr;
            </button>
        )
    })

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
                    onClick={() => {
                        setReqChosenMail(row.values)
                    }}
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
                {headerGroups.map((headerGroup, i) => (
                        <div key={i}  {...headerGroup.getHeaderGroupProps()} >
                            {headerGroup.headers.map((column, i) => (
                                    <div key={i}  {...column.getHeaderProps()}>
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

