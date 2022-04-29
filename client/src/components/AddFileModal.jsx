import {observer, useLocalObservable } from "mobx-react-lite";
import {useCallback, useEffect, useMemo} from "react";
import Store from "../state/Store";
import useMongoService from "../services/useMongoService";
import fileDownload from 'js-file-download'
import MyDropzone from "./DropZone";
import {useLockBodyScroll} from "../hooks/useLockBodyScroll";


const AddFileModal = observer(() => {
    const { getActNames, getAct, getTare, getTareNames} = useMongoService()
    useLockBodyScroll()

    const formState = useLocalObservable(() => ({
        actfile: null,
        changeActFile(file) {
            this.actfile = file
        },
        tareFile: null,
        changeTareFile(file) {
            this.tareFile = file
        },
        actType: null,
        changeActType(type) {
            this.actType = type
        },
        previousActs: [],
        setPreviousActs(data) {
            this.previousActs = data
        },
        previousTares: [],
        setPreviousTares(data) {
            this.previousTares = data
        }
    }))

    const updateFiles = useCallback(async () => {
            const actNames = await getActNames({id: Store.currentRequest._id})
            const tareNames = await getTareNames({id: Store.currentRequest._id})
            await formState.setPreviousActs(actNames)
            await formState.setPreviousTares(tareNames)
        }, []
    )

    useEffect(() => {
        (async () => {await updateFiles()})()
        return () => formState.changeActType(null)
    }, [])

    useEffect(() => {
        (async () => {
            const actNames = await getActNames({id: Store.currentRequest._id})
            const tareNames = await getTareNames({id: Store.currentRequest._id})
            await formState.setPreviousActs(actNames)
            await formState.setPreviousTares(tareNames)
        })()
    }, [useMemo(() => formState.previousTares, []), useMemo(() => formState.previousActs, []) ])


    const onChangeRadio = e => {
        formState.changeActType(e.target.value)
    }

    const onActOpen = async (fileName) => {
        const res = await getAct({name: fileName})
        fileDownload(res.data, fileName.match('[^\\/]+$'))
    }

    const onTareOpen = async (fileName) => {
        const res = await getTare({name: fileName})
        fileDownload(res.data, fileName.match('[^\\/]+$'))
    }

    const PreviousActs = (props) => {
        const filenames = props.formState.previousActs.map((fileName, i) => {
            return <h3 key={i} className={'cursor-pointer text-sky-700 text-center'} onDoubleClick={() => onActOpen(fileName)}>{fileName.match('[^\\/]+$')}</h3>
        })
        return (
            <>
                {filenames}
            </>
        )
    }

    const PreviousTares = (props) => {
        const filenames = props.formState.previousTares.map((fileName, i) => {
            return <h3 key={i} className={'cursor-pointer text-sky-700 text-center'} onDoubleClick={() => onTareOpen(fileName)}>{fileName.match('[^\\/]+$')}</h3>
        })
        return (
            <>
                {filenames}
            </>
        )
    }

    const actTypes = [
        {
            name: 'Трактор',
            id: 'tractor'
        },
        {
            name: 'Комбайн',
            id: 'harvester'
        },
        {
            name: 'Грузовой',
            id: 'cargo'
        },
        {
            name: 'Легковой',
            id: 'light'
        },
        {
            name: 'Заправщики',
            id: 'fuel'
        },
        {
            name: 'РУМы',
            id: 'rum'
        },
        {
            name: 'Сеялки',
            id: 'seeder'
        },
        {
            name: 'Опрыскиватели',
            id: 'sprayer'
        },
        {
            name: 'Самолёт',
            id: 'airplane'
        },
        {
            name: 'Весы',
            id: 'scales'
        },
        {
            name: 'Метеостанции',
            id: 'meteo'
        },
        {
            name: 'Тахографы',
            id: 'taho'
        },
        {
            name: 'Сигнализация',
            id: 'signal'
        },
        {
            name: 'Другое',
            id: 'other'
        },
    ]



    return (
        <>
            <h2 className={'text-center text-lg xl:text-xl' }>Тип заявки</h2>
            <div className={'flex justify-center w-[540px] xl:w-[600px] gap-1 md:gap-2 xl:gap-3 p-2 xl:p-4 flex-wrap mt-3 bg-gray-50 border border-blue-500/50 rounded-xl'}>
                {actTypes.map(item => {
                    return (
                        <div
                            key={item.id}
                            className={'flex w-40 xl:w-44  bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}
                        >
                            <label
                                className={'py-1 px-1 xl:py-2 xl:px-2 grow text-md xl:text-lg'}
                                htmlFor={item.id}
                            >
                                {item.name}
                            </label>
                            <input
                                className={'absolute right-4 text-amber-300 focus:ring-0 focus:ring-offset-0'}
                                onChange={onChangeRadio}
                                type="radio"
                                id={item.id}
                                name={'acttype'}
                                value={item.id}
                            />
                        </div>
                    )
                })}
            </div>
            <div className={'flex gap-4 mt-3'}>
                <MyDropzone
                    text={'Загрузить акт'}
                    actType={formState.actType}
                    actfile={formState.actfile}
                    changeActFile={formState.changeActFile}
                    dropType={'act'}
                    updateFiles={updateFiles}
                />
                <div className={'flex grow flex-col'}>
                    <h2 className={'text-lg text-center'}>Загруженные акты</h2>
                    <div>
                        {formState.previousActs.length > 0 ?
                            <PreviousActs formState={formState}/> :
                            <div className={'text-center text-orange-400 mt-6'}>Пока нет загруженных актов</div>
                        }
                    </div>
                </div>
            </div>
            <div className={'flex gap-4 mt-3'}>
                <MyDropzone
                    text={'Загрузить тарировку'}
                    actType={formState.actType}
                    tarefile={formState.tareFile}
                    changeTareFile={formState.changeTareFile}
                    dropType={'tare'}
                    updateFiles={updateFiles}
                />
                <div className={'flex grow flex-col'}>
                    <h2 className={'text-lg text-center'}>Загруженные тарировки</h2>
                    <div>
                        {formState.previousTares.length > 0 ?
                            <PreviousTares formState={formState}/> :
                            <div className={'text-center text-orange-400 mt-6'}>Пока нет загруженных тарировок</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
})

export default AddFileModal