const qs = require('qs')

export const Api = {
    baseurl: (headPoint: string, params: any) => `${url}/${headPoint}${params ? qs.stringify(params) : ''}`,
}

const url = "https://api.nordiskyoga.dk"
