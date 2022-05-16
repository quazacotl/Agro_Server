import {useDropzone} from 'react-dropzone'
import {IconContext} from "react-icons";
import {BiFile} from "react-icons/bi";
import Store from "../state/Store";
import axios from "axios";
import {Config} from "../config";
import {observer} from "mobx-react-lite";
import {useState} from "react";

interface MyDropzoneProps {
    text: string
    actType: string | null
    actfile?: string | null
    tarefile?: string | null
    dropType: string
    changeActFile?: (file: string)=>void
    changeTareFile?: (file: string)=>void
    updateFiles: ()=> void
}

const MyDropzone = observer((props: MyDropzoneProps) => {
    const {text, actType, dropType, updateFiles} = props
    const [entered, setEntered] = useState(false)


    const onDrop = (acceptedFiles: File[]) => {
        setEntered(false)
        acceptedFiles.forEach( async (file) =>{

            // Для распознавания дополнительных данных body, кроме файла, на бэке, важен порядок записи данных в formData. Файл надо писать последним
            const formData = new FormData()
            formData.append('type', actType ? actType : '')
            formData.append('region', Store.currentRequest?.Region ? Store.currentRequest.Region : '')
            formData.append('id', Store.currentRequest?._id ? Store.currentRequest._id : '')
            if (Store.currentRequest?.VehicleRegNum) {
                formData.append('vehicle', Store.currentRequest.VehicleRegNum)
            }

            if (dropType === 'act') {
                formData.append('act', file)
                try {
                    await axios.post(`${Config.baseRoute}/upload-act`, formData)
                    await updateFiles()
                } catch (e) {
                    console.log(e)
                }
            }
            else if (dropType === 'tare') {
                formData.append('tare', file)
                try {
                    await axios.post(`${Config.baseRoute}/upload-tare`, formData)
                    await updateFiles()
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }

    const isDisabled = (actType: string, dropType: string) => {
        let disableState = true
        if (dropType === 'tare') {
            switch (actType) {
                case 'tractor': disableState = false
                    break
                case 'harvester': disableState = false
                    break
                case 'fuel': disableState = false
                    break
                case 'cargo': disableState = false
                    break
                default: disableState = true
            }
        }
        if (dropType === 'act') {
            actType ? disableState = false : disableState = true
        }
        return disableState
    }

    const classesObj = {
        wrapperClasses: 'h-24 w-40 xl:h-28 xl:h-28 flex flex-col text-md xl:text-lg p-1 mt-2 border border-dashed border-amber-400 rounded-lg bg-white cursor-no-drop',
        inputClasses: 'w-12 h-12 m-auto p-1 mt-2 bg-white text-gray-500 pointer-events-none'
    }

    const activeClassesObj = {
        activeWrapper: 'h-24 w-40 xl:h-28 xl:h-28 flex flex-col text-md xl:text-lg p-1 mt-2 border-2 border-dashed border-red-400 rounded-lg bg-white cursor-copy'

    }

    classesObj.wrapperClasses = !isDisabled(actType ? actType : '', dropType) ?  'h-24 w-40 xl:h-28 xl:h-28 flex flex-col text-md xl:text-lg p-1 mt-2 border border-dashed border-amber-400 rounded-lg bg-white cursor-pointer' : classesObj.wrapperClasses

    classesObj.inputClasses = !isDisabled(actType ? actType : '', dropType) ? 'w-12 h-12 m-auto p-1 mt-2 bg-white text-green-500 pointer-events-none' : classesObj.inputClasses


    const onDragEnter = () => setEntered(true)
    const onDragLeave = () => setEntered(false)




    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        onDragEnter,
        onDragLeave,
        noDragEventsBubbling: true,
        disabled: isDisabled(actType ? actType : '', dropType),
        multiple: false
    })


    return (
        <div className={entered ? activeClassesObj.activeWrapper : classesObj.wrapperClasses} {...getRootProps()}>
            <input {...getInputProps()}/>
            <h3 className={'text-center text-slate-700 leading-5 pointer-events-none'}>{text}</h3>
            <IconContext.Provider value={{className: classesObj.inputClasses}}>
                <BiFile/>
            </IconContext.Provider>
        </div>
    )
})

export default MyDropzone