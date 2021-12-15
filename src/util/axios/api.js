import instance from './instance'

let api = {
    get: (endpoint, token) => {
        return instance.get(endpoint, {headers: {'Authorization': 'Bearer ' + token}})
    },
    post: (endpoint, data, token) => {
        return instance.post(endpoint, data, {headers: {'Authorization': 'Bearer ' + token}})
    },
}
export default api