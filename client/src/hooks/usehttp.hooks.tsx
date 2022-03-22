import {useCallback} from "react";
import Store from '../state/Store'

export const useHttpHooks = (loading: boolean = true) => {
    const {setLoading, setError, error} = Store

    const request = useCallback (async (url, method='GET', body=null, responseType=null, headers={'Content-Type': 'Application/json'}) => {
        if (error) setError(false)
        if (loading) setLoading(true)

        try {
            const response = await fetch(url, {method, body, headers})
            const data = await response.json()
            
            if (!response.ok) {
                setError(true)
                throw new Error(`Couldn't fetch ${url}, status: ${response.status}, message: ${data.message || 'Server Error'}`)
                 
            }

            if (loading) setLoading(false)
            return data
        } catch (err) {
            if (loading) setLoading(false)
            if (err instanceof Error) {
                setError(true)
            }
            throw err
        }
    }, [])


    return {request}

}