import {useEffect, useMemo} from "react";
import RequestsTable from "./RequestsTable";
import Store from "../state/Store";
import { observer } from "mobx-react-lite"
import Loading from "./Loading";
import RequestsControls from "./RequestsControls";
import BubbleContext from "./BubbleContext";
import useUpdateAfterEdit from "../hooks/useUpdateAfterRequstEdit";



const Requests = observer(() => {
    const {updateAfterRequestEdit} =  useUpdateAfterEdit()

    useEffect(()=> {
        updateAfterRequestEdit()
    }, [Store.currentRegionSelected, Store.isShowUnexecuted])

    const isLoading = useMemo(() => Store.loading, [])

    return (
        <>
            <RequestsControls/>
            {isLoading ? <Loading/> : <RequestsTable/>}
            {Store.isBubbleContextShow ? <BubbleContext/> : null}
        </>
    )
})
 
export default Requests;