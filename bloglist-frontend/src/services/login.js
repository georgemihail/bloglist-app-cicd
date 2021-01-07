const axios = require('axios')
const baseUrl = '/api/login'

const login = credentials => {
    const response = axios.post(baseUrl, credentials)
    return response.then(result => result.data)
}

export default {login}