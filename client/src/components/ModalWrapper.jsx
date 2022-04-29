import Store from "../state/Store"
import {observer} from "mobx-react-lite";
import {AnimatePresence, motion} from "framer-motion";
import {useMemo} from "react";


const ModalWrapper = observer(({isVisible, hideFunction, children}) => {
    const hideModal = (e) => {
        if(e.target === e.currentTarget) {
            hideFunction(false)
        }
    }


    const animationWrapper = useMemo(() => ({
        visible: {
            opacity: 1,
                transition: {
                duration: .15,
            },
        },
        hidden: {
            opacity: 0,
                transition: {
                duration: .15,
            },
        }
    }),[])


    const animationChildren = useMemo(() => ({
        hidden: {
            scale: .5,
            opacity: 0,
            transition: {
                type: 'spring',
                duration: .2,
            }
        },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: 'spring',
                duration: .2,
            }
        }
    }), [])


    return (
        <AnimatePresence exitBeforeEnter>
            {isVisible && (
                <motion.div
                    key='carlistwrapper'
                    animate={'visible'}
                    initial={'hidden'}
                    exit={'hidden'}
                    variants={animationWrapper}
                    className={'fixed left-0 w-screen h-full flex bg-neutral-700/50'}
                    style={{top: Store.offsetY}}
                    onMouseDown={(e) => hideModal(e)}
                >
                    <motion.div
                        key={'carlistmodal'}
                        className={'m-auto p-5 bg-blue-50 rounded-xl transition-all'}
                        variants={animationChildren}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
})

export default ModalWrapper