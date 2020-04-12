import axios from 'axios'
const baseURL = "http://localhost:3000"

export function getTables() {
    return axios({
        method: 'get',
        url: baseURL + '/tables/'
    });
}

export function getTable(schema, name) {
    return axios({
        method: 'get',
        url: baseURL + `/tables/${schema}/${name}`,
    });
}

export function getTags() {
    return axios({
        method: 'get',
        url: baseURL + '/tags/'
    });
}

export function refresh() {
    return axios({
        method: 'get',
        url: baseURL + '/refresh'
    });
}

export function updateTable(tableData) {
    return axios({
        method: 'put',
        data: tableData,
        url: baseURL + '/table',
    });
}