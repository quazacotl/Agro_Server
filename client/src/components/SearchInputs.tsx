import SearchInput from "./SearchInput";
import Store from "../state/Store";
import { observer } from "mobx-react-lite"
import {useEffect} from "react";

const SearchInputs = observer(() => {

    useEffect(() => {
        Store.clearAllInputs()
    }, [])

    return (
        <div className={'flex justify-center my-6 gap-x-5'}>
            <SearchInput inputState={Store.inputReg} clearInputs={Store.clearRegPassiveValues} inputHandler={Store.handleInputReg} attr={'рег. номеру'} id={'reg'}/>
            <SearchInput inputState={Store.inputVin} clearInputs={Store.clearVinPassiveValues} inputHandler={Store.handleInputVin} attr={'VIN'} id={'vin'}/>
            <SearchInput inputState={Store.inputId} clearInputs={Store.clearIdPassiveValues} inputHandler={Store.handleInputId} attr={'ID'} id={'id'}/>
        </div>
    )
})

export default SearchInputs