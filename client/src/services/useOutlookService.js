import Store from '../state/Store'
import {Config} from "../config";
import {useCallback} from "react";
import axios from "axios";



const useOutlookService = () => {

    const {mailsError, setMailsError, setMailsLoading} = Store
    const request = useCallback (async (url, method='GET', body=null, headers={'Content-Type': 'Application/json'}) => {
        if (mailsError) setMailsError(false)
        setMailsLoading(true)
        try {
            const response = await fetch(url, {method, body, headers})
            const data = await response.json()

            if (!response.ok) {
                setMailsError(true)
                throw new Error(`Couldn't fetch ${url}, status: ${response.status}, message: ${data.message || 'Server Error'}`)
            }
            setMailsLoading(false)
            return data
        } catch (err) {
            setMailsLoading(false)
            if (err instanceof Error) {
                setMailsError(true)
            }
            throw err
        }
    }, [])

    const getLastMails = async (offset) => {
        return await request(`${Config.baseRoute}/messages`, 'POST', JSON.stringify({offset}))
    }

    const sendMessage = async (body) => {
        return await axios.post(`${Config.baseRoute}/send-message`, body)
    }

    return {getLastMails, sendMessage}
}

export default useOutlookService