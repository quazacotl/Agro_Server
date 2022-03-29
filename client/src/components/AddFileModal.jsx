import {observer, useLocalObservable } from "mobx-react-lite";
import {useCallback, useEffect, useMemo} from "react";
import Store from "../state/Store";
import useMongoService from "../services/useMongoService";
import fileDownload from 'js-file-download'
import MyDropzone from "./DropZone";


const AddFileModal = observer(() => {
    const { getActNames, getAct, getTare, getTareNames} = useMongoService()

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
        (async () => {
            document.body.style.overflow = 'hidden';
            await updateFiles()
        })()
        return () => {
            document.body.style.overflow = 'auto'
            formState.changeActType(null)
        }
    }, [])

    useEffect(() => {
        (async () => {
            const actNames = await getActNames({id: Store.currentRequest._id})
            const tareNames = await getTareNames({id: Store.currentRequest._id})
            await formState.setPreviousActs(actNames)
            await formState.setPreviousTares(tareNames)
        })()
    }, [useMemo(() => formState.previousTares, []), useMemo(() => formState.previousActs, []) ])


    const hideModal = (e) => {
        if(e.target === e.currentTarget) {
            Store.setShowAddFileModal(false)
        }
    }

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


    return (
        <div
            onMouseDown={hideModal}
            className={'absolute left-0 w-screen h-screen flex justify-center items-center bg-neutral-700/50'}
            style={{top: Store.offsetY}}
        >
            <div className={'min-w-[600px] min-h-[400px] p-4 bg-blue-50 rounded-xl border border-amber-400 select-none'}>
                <h2 className={'text-center text-xl'}>Тип заявки</h2>
                <div className={'flex gap-3 w-[600px] p-4 flex-wrap mt-3 bg-gray-50 border border-blue-500/50 rounded-xl'}>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="tractor">Трактор</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'tractor'} name={'acttype'} value={'tractor'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                       <label className={'py-2 px-2 grow text-lg'} htmlFor="harvester">Комбайн</label>
                       <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'harvester'} name={'acttype'} value={'harvester'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="cargo">Грузовой</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'cargo'} name={'acttype'} value={'cargo'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="light">Легковой</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'light'} name={'acttype'} value={'light'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="rum">РУМы</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'rum'} name={'acttype'} value={'rum'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="fuel">Заправщики</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'fuel'} name={'acttype'} value={'fuel'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="seeder">Сеялки</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'seeder'} name={'acttype'} value={'seeder'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="sprayer">Опрыскиватели</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'sprayer'} name={'acttype'} value={'sprayer'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="airplane">Самолёт</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'airplane'} name={'acttype'} value={'airplane'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="scales">Весы</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'scales'} name={'acttype'} value={'scales'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="meteo">Метеостанции</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'meteo'} name={'acttype'} value={'meteo'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="taho">Тахографы</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'taho'} name={'acttype'} value={'taho'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="signal">Сигнализация</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'signal'} name={'acttype'} value={'signal'}/>
                    </div>
                    <div className={'flex w-44 bg-white relative items-center border border-dotted border-amber-400 rounded-xl'}>
                        <label className={'py-2 px-2 grow text-lg'} htmlFor="other">Другое</label>
                        <input className={'absolute right-4'} onChange={onChangeRadio} type="radio" id={'other'} name={'acttype'} value={'other'}/>
                    </div>
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

            </div>
        </div>
    );
});

export default AddFileModal;