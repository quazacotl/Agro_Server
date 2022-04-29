import {observer} from "mobx-react-lite";

const CurrentVehicle = observer((currentRequest) => {
    if (currentRequest && currentRequest.VehicleId) {
        return (
            <div className={'mb-6'}>
                <h2 className={'text-xl text-center text'}>Выбранная техника</h2>
                <div className={'flex justify-between text-md bg-white mt-2 rounded-lg shadow-form-sh'}>
                    <div className={'px-2 py-1'}>{currentRequest.ObjName}</div>
                    <div className={'px-2 py-1'}>{currentRequest.BaseName}</div>
                    <div className={'px-2 py-1'}>{currentRequest.VehicleType}</div>
                    <div className={'px-2 py-1'}>{currentRequest.Region}</div>
                    <div className={'px-2 py-1'}>{currentRequest.VehicleRegNum}</div>
                    <div className={'px-2 py-1'}>{currentRequest.VehicleId}</div>
                </div>
            </div>
        )
    }
    return null
})

export default CurrentVehicle