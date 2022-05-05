import {AnimatePresence, motion} from "framer-motion";
import {observer} from "mobx-react-lite";
import {useMemo} from "react";
import Store from "../state/Store";
import useMongoService from "../services/useMongoService";
import useUpdateAfterEdit from "../hooks/useUpdateAfterRequstEdit";

const Confirmation = observer(({isVisible}) => {
    const {closeRequest, deleteRequest} = useMongoService()
    const {updateAfterRequestEdit} = useUpdateAfterEdit()


    const animation = useMemo(() => ({
        visible: {
            left: 'calc(100vw - 207px)',
            transition: {
                type: "spring",
                duration: .2,
            },
        },
        hidden: {
            left: '100vw',
            transition: {
                type: "spring",
                duration: .2,
            },
        }
    }),[])

    const onYesClick = async () => {
        switch (Store.confirmationType) {
            case 'delete':
                Store.setShowRequestContextMenu(false)
                const res = await deleteRequest({id: Store.currentRequest._id})
                Store.setNotificationText(res.message)
                Store.showNotification()
                await updateAfterRequestEdit()
                Store.setConfirmationType('')
                Store.setIsConfirmation(false)
                break
            case 'close':
                try {
                    const res = await closeRequest({id: Store.currentRequest._id, Auditor: Store.currentUser});
                    Store.setShowRequestContextMenu(false)
                    await updateAfterRequestEdit()
                    Store.setNotificationText(res.message);
                    Store.showNotification();
                    Store.setConfirmationType('')
                    Store.setIsConfirmation(false)
                } catch (e) {
                    console.log(e)
                }
                break
            default: return
        }
    }

    return (
        <AnimatePresence exitBeforeEnter>
            {isVisible && (
                <motion.div
                    className={'absolute flex flex-col gap-5 top-confirm-h'}
                    key='confirmation'
                    animate={'visible'}
                    initial={'hidden'}
                    exit={'hidden'}
                    variants={animation}
                >
                    <div className={'flex gap-6 justify-center'}>
                        <button
                            onClick={onYesClick}
                            className={'px-4 py-2 w-20 bg-amber-500 text-lg font-semibold rounded-lg text-white active:outline-none focus:ring active:bg-amber-400'}
                        >
                            Да
                        </button>
                        <button
                            onClick={() => Store.setIsConfirmation(false)}
                            className={'px-4 py-2 w-20 bg-amber-500 text-lg font-semibold rounded-lg text-white active:outline-none focus:ring active:bg-amber-400'}
                        >
                            Нет
                        </button>
                    </div>
                    <img className={'w-52'} src="./hop.png" alt="toasty"/>
                </motion.div>
            )}
        </AnimatePresence>

    )
})

export default Confirmation