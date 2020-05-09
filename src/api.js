import axios from "axios";
const baseURL = process.env.VUE_APP_API_URL;
let authHeader = {
  'Authorization': `Basic ${localStorage.getItem('token')}`
};

export function getTables() {
  return axios({
    method: "get",
    url: baseURL + "api/tables/",
    headers: authHeader
  });
}

export function getTable(schema, name) {
  return axios({
    method: "get",
    url: baseURL + `api/tables/${schema}/${name}`,
    headers: authHeader
  });
}

export function getTags() {
  return axios({
    method: "get",
    url: baseURL + "api/tags/",
    headers: authHeader
  });
}

export function refresh() {
  return axios({
    method: "get",
    url: baseURL + "api/refresh",
    headers: authHeader
  });
}

export function updateTable(tableData) {
  return axios({
    method: "put",
    data: tableData,
    url: baseURL + "api/table",
    headers: authHeader
  });
}

export function login(credentials) {
  return axios({
    method: "post",
    data: credentials,
    url: baseURL + "login"
  });
}
