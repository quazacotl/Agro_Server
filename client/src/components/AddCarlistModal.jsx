import Store from "../state/Store";
import {observer, useLocalObservable} from "mobx-react-lite"
import {useLockBodyScroll} from "../hooks/useLockBodyScroll";
import {useEffect} from "react";


const AddCarlistModal = observer(() => {
    useLockBodyScroll()

    const carlistState = useLocalObservable(() => ({
        valueInput: '',
        setValueInput(value) {
            this.valueInput = value
        },
        idInput: '',
        setIdInput(value) {
            this.idInput = value
        },
        textAreaInput: '',
        setTextAreaInput(text) {
            this.textAreaInput = text
        },
        resultAreaInput: '',
        setResultAreaInput(text) {
            this.resultAreaInput = text
        },
        error: false,
        setError(bool) {
            this.error = bool
        }
    }))


    useEffect(() => {
        return () => carlistState.setError(false)
    },[])

    // const hideModal = (e) => {
    //     if(e.target === e.currentTarget) {
    //         Store.setIsShowCarlistModal(false)
    //     }
    // }

    const convertTare = (tareList, tareString) => {
        if (tareList[tareList.length - 1] === '0') {
            for (let i = 1; i < tareList.length; i = i + 2) {
                if (tareList[i] === '0') {
                    tareString = `${tareString}${tareList[i]},`
                    tareString = `${tareString}${tareList[i-1]}`
                } else {
                    tareString = `${tareString}${tareList[i]},`
                    tareString = `${tareString}${tareList[i-1]},,`
                }
            }
            return tareString
        } else {
            carlistState.setError(true)
            return 'Ошибка во входящих данных!'
        }
    }

    const onChange = (value) => {
        carlistState.setTextAreaInput(value)
        if (value === '') {
            carlistState.setError(false)
            carlistState.setResultAreaInput('')
            carlistState.setValueInput('- - -')
        } else {
            carlistState.setError(false)
            try {
                const re = /[\n]+/
                let tares = value.trim().split(re)
                let tare1list = []
                let tare2list = []
                tares.forEach(item => {
                    if (item.startsWith('\t\t')) {
                        const list = item.match(/[\d]+/g)
                        tare2list.push(list[0])
                        tare2list.push(list[1])
                    } else if (item.endsWith('\t\t')) {
                        const list = item.match(/[\d]+/g)
                        tare1list.push(list[0])
                        tare1list.push(list[1])
                    } else {
                        const list = item.match(/[\d]+/g)
                        if (list.length > 2) {
                            tare1list.push(list[0])
                            tare1list.push(list[1])
                            tare2list.push(list[2])
                            tare2list.push(list[3])
                        } else {
                            tare1list.push(list[0])
                            tare1list.push(list[1])
                        }
                    }
                })

                tare1list.reverse()
                tare2list.reverse()

                if (tare2list.length > 0) {
                    carlistState.setResultAreaInput(convertTare(tare1list,'LLS1Tare=') + '\n' + convertTare(tare2list,'LLS2Tare='))
                    carlistState.setValueInput(+tare1list[1] + +tare2list[1])
                } else {
                    carlistState.setResultAreaInput(convertTare(tare1list,'LLS1Tare='))
                    carlistState.setValueInput(+tare1list[1])
                }
            } catch (e) {
                carlistState.setError(true)
                carlistState.setResultAreaInput('Ошибка во входящих данных!')
            }
        }

    }

    const textAreaClasses = carlistState.error ? 'w-[300px] h-[350px] text-sm rounded-lg border-red-500 shadow-form-sh bg-white focus:outline-none resize-none' : 'w-[300px] h-[350px] text-sm rounded-lg border-blue-300 shadow-form-sh bg-white focus:outline-none resize-none'


    return (
        <>
            <h2 className={'text-center text-lg font-semibold text-teal-600'}>Выбранная техника: {Store.currentRequest ? Store.currentRequest.VehicleRegNum : Store.currentVehicle.REG_NOM}</h2>
            <div className={'flex mt-6'}>
                <textarea
                    className={textAreaClasses}
                    placeholder={'Вставить данные'}
                    value={carlistState.textAreaInput}
                    onChange={(e) => onChange(e.currentTarget.value)}
                    >
                </textarea>
                <textarea
                    className={'w-[300px] h-[350px] text-sm rounded-lg shadow-form-sh border-blue-300 bg-white focus:outline-none resize-none ml-6'}
                    placeholder={'Результат'}
                    readOnly
                    value={carlistState.resultAreaInput}
                    >
                </textarea>
                <div className={'flex flex-col ml-6'}>
                    <div className={'flex flex-col'}>
                        <label className={'text-md text-slate-900'} htmlFor="volume">Объём бака, л</label>
                        <input
                            className={'w-28 h-6 px-1 rounded bg-white mt-2 border-blue-300 shadow-form-sh focus:outline-none'}
                            type="text"
                            id={'volume'}
                            readOnly
                            placeholder={'- - -'}
                            value={carlistState.valueInput}
                        />
                    </div>
                    <div className={'flex flex-col mt-6'}>
                        <label className={'text-md text-slate-900'} htmlFor="id-nav">Навигатор</label>
                        <input
                            className={'w-28 h-6 px-1 rounded bg-white mt-2 border-blue-300 shadow-form-sh focus:outline-none'}
                            type="text"
                            id={'id-nav'}
                            readOnly
                            placeholder={'- - -'}
                            value={Store.vehiclePageLocation ? Store.currentVehicle.NAV_ID : (Store.currentRequest.VehicleId ? Store.currentRequest.VehicleId :  '- - -')}
                        />
                    </div>
                </div>
            </div>
        </>
    );
});

export default AddCarlistModal;