import {useDropzone} from 'react-dropzone'
import {useMemo} from "react";
import {IconContext} from "react-icons";
import {BiFile} from "react-icons/bi";
import Store from "../state/Store";
import axios from "axios";
import {Config} from "../config";
import {observer} from "mobx-react-lite";

const MyDropzone = observer((props) => {
    const {text, actType, dropType, updateFiles} = props


    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach( async (file) =>{

            // Для распознавания дополнительных данных body, кроме файла, на бэке, важен порядок записи данных в formData. Файл надо писать последним
            const formData = new FormData()
            formData.append('type', actType)
            formData.append('region', Store.currentRequest.Region)
            formData.append('id', Store.currentRequest._id)
            if (Store.currentRequest.VehicleRegNum) {
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

    const isDisabled = (actType, dropType) => {
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

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        noDragEventsBubbling: true,
        disabled: isDisabled(actType, dropType),
        multiple: false
    })


    const classesObj = {
        wrapperClasses: !isDisabled(actType, dropType) ? 'h-24 w-40 xl:h-28 xl:h-28 flex flex-col text-md xl:text-lg p-1 mt-2 border border-dashed rounded-lg border-amber-400 bg-white cursor-pointer' : 'h-24 w-40 xl:h-28 flex flex-col text-md xl:text-lg p-1 mt-2 border border-dashed rounded-lg border-amber-400 bg-white cursor-no-drop',
        inputClasses: !isDisabled(actType, dropType) ? "text-xl m-auto w-10 h-10 text-green-500"  : "text-xl m-auto w-10 h-10 text-gray-500"
    }

    const classes = useMemo (() => classesObj, [actType])

    return (
        <div className={classes.wrapperClasses} {...getRootProps()}>
            <input {...getInputProps()}/>
            <h3 className={'text-center text-slate-700 leading-5'}>{text}</h3>
            <IconContext.Provider value={{className: classes.inputClasses}}>
                <BiFile/>
            </IconContext.Provider>
        </div>
    )
})

export default MyDropzone