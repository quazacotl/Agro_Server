import {useEffect} from "react";
import Store from "../state/Store";
import {observer, useLocalObservable} from "mobx-react-lite";
import useMongoService from "../services/useMongoService";
import {BsFillCheckCircleFill} from "react-icons/bs"
import {IconContext} from "react-icons";
import useOutlookService from "../services/useOutlookService";
import {useLockBodyScroll} from "../hooks/useLockBodyScroll";

const SendMessageModal = observer(() => {
    const {sendMessage} = useOutlookService()
    const {getActNames} = useMongoService()
    useLockBodyScroll()


    const formState = useLocalObservable(() => ({
        messageText: '',
        setMessageText(text) {
            this.messageText =  text
        },
        editMessageText(text) {
            this.messageText = this.messageText + text
        },
        acts: [],
        setActs(data) {
            this.acts = data
        },
        chosenActs: {},
        setChosenAct(number) {
            this.chosenActs[number] ? this.chosenActs[number] = !this.chosenActs[number]: this.chosenActs[number] = true
        }
    }))

    const setCurrentMessageText = () => {
        switch (Store.currentRequest.RequestType) {
            case 'Весы': formState.setMessageText(`Ремонт на весах проведёны. Заявка закрыта`)
                break
            case 'Установка Автограф+ДУТ': formState.setMessageText(`Работы по установке оборудования на технике ${Store.currentRequest.VehicleType} ${Store.currentRequest.VehicleRegNum} проведены. Заявка закрыта`)
                break
            case 'Установка автографа': formState.setMessageText(`Работы по установке оборудования на технике ${Store.currentRequest.VehicleType} ${Store.currentRequest.VehicleRegNum} проведены. Заявка закрыта`)
                break
            case 'Тахограф': formState.setMessageText(`Работы с тахографом на технике ${Store.currentRequest.VehicleType} ${Store.currentRequest.VehicleRegNum} проведены. Заявка закрыта`)
                break
            case 'Прочее': formState.setMessageText(`Работы проведены. Заявка закрыта`)
                break
            case 'Установка системы учета зерна/удобрений': formState.setMessageText(`Работы по установке системы учёта на технике ${Store.currentRequest.VehicleType} ${Store.currentRequest.VehicleRegNum} проведены. Заявка закрыта`)
                break
            case 'Планшеты': formState.setMessageText(`Работы проведены. Заявка закрыта`)
                break
            case 'Метеостанция': formState.setMessageText(`Работы на метеостанции завершены. Заявка закрыта`)
                break
            case 'Сигнализация': formState.setMessageText(`Работы по ремонту сигнализации проведены. Заявка закрыта`)
                break
            default: formState.setMessageText(`Работы на технике ${Store.currentRequest.VehicleType} ${Store.currentRequest.VehicleRegNum} проведены. Заявка закрыта`)
                break
        }
    }



    useEffect(() => {
        (async () => {
            const res = await getActNames({id: Store.currentRequest._id})
            setCurrentMessageText()
            await formState.setActs(res)
        })()
        return () => {
            Store.setCurrentRequest(null)
        }
    }, [])

    const onChangeText = (e) => {
        formState.setMessageText(e.target.value)
    }

    // Формирование тела сообщения
    const setMessageBody = () => {
        let files = []
        // Проход по объекту выбранных актов и записывание выбранных актов в массив
        for (let key in formState.chosenActs ) {
            if (key) files.push(formState.acts[key])
        }

        return {
            subject: Store.currentRequest.VehicleRegNum ? `Выполненная заявка ${Store.currentRequest.VehicleRegNum}` : 'Выполненная заявка',
            text: formState.messageText,
            files,
            recipient: Store.currentRequest.SentFromEmail
        }
    }


    const sendOutlookAnswer = async () => {
        Store.setIsShowSendMessageModal(false)
        const body = setMessageBody()
        try {
            await sendMessage(body)
        } catch (e) {
            Store.setNotificationText('Не удалось отправить сообщение')
            Store.showNotification()
        }
    }


    const Acts = observer(() => {
        if (formState.acts.length === 0) {
            return <h2 className={'text-orange-500 mt-4 text-md text-center'}>Ни одного акта не загружено</h2>
        }

        const filenames = formState.acts.map((fileName, i) => {
            return (
                <div key={i}  className={'flex justify-between items-center'}>
                    <li
                        onClick={()=>formState.setChosenAct(i)}
                        className={'cursor-pointer text-sky-700'}
                    >
                        {fileName.match('[^\\/]+$')}
                    </li>
                    {formState.chosenActs[i] ?
                        <IconContext.Provider value={{className: 'text-green-500 text-xl'}}>
                            <BsFillCheckCircleFill/>
                        </IconContext.Provider> :
                        null
                    }
                </div>
            )
        })
        return (
            <>
                {filenames}
            </>
        )
    })

    return (
        <>
            <h2 className={'text-lg text-sky-600 ml-3'}>Адресат: {Store.currentRequest.SentFromName ? Store.currentRequest.SentFromName : <span className={'text-red-600'}>Не выбран адресат!</span>}</h2>
            <div className={'flex gap-4 mt-2'}>
                <button className={'px-2 py-1 rounded-lg bg-orange-400 text-white'} onClick={() => formState.editMessageText('Необходимо синхронизировать файлы в афтографе и перезапустить программу')}>Текст про автограф</button>
                <button className={'px-2 py-1 rounded-lg bg-orange-400 text-white'} onClick={() => formState.editMessageText('Контрольный слив-залив показал расхождение в пределах допустимой нормы')}>Текст про тарировку</button>
            </div>
            <textarea
                placeholder={'Текст сообщения'}
                className={'w-full h-2/3 min-h-[200px] mt-3 text-lg resize-none shadow-form-sh focus:outline-none p-3 rounded-xl border border-blue-400'}
                name={'outlook-text'}
                autoFocus
                value={formState.messageText}
                onChange={onChangeText}
            />
            <div className={'flex mt-3 gap-8'}>
                <div className={'flex grow flex-col'}>
                    <h2 className={'text-lg text-center'}>Прикрепить акт</h2>
                    <ul>
                        {<Acts/>}
                    </ul>
                </div>
                <button
                    onClick={sendOutlookAnswer}
                    className={'w-32 h-24 m-auto rounded-lg text-white uppercase font-medium shadow-form-sh bg-button-gradient active:bg-button-gradient-invert active:shadow-none focus:outline-none focus:shadow-input-focus'}>
                    Отправить письмо
                </button>
            </div>
        </>
    );
});

export default SendMessageModal;