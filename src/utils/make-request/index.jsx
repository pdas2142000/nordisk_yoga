/** Local Imports */
import { Api } from "../api-url/Api"

/** Main Export */
export const makeRequest = async (
    method,
    url,
    queryParams = {},
    authToken,
    bodyRequest = null,
    isFormData = false,
    tags = null
) => {
    const requestOptions = {
        ...(tags && tags?.length ? { next: { tags: tags } } : {}),
        method: method,
        headers: {
            ...(!bodyRequest || isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
            'Accept-Language': 'da',
        },
        ...(bodyRequest && method.toLowerCase() !== "GET" ? { body: isFormData ? bodyRequest : JSON.stringify(bodyRequest) } : {})
    }
    const headpoint = Api.baseurl(url, queryParams)
    try {
        const Response = await fetch(headpoint, requestOptions)
        if (!Response.ok) {
            throw new Error(`Request failed with status ${Response.status}`)
        }
        const ResponseData = await Response.json()
        return ResponseData
    } catch (error) {
        console.error(error)
    }
}