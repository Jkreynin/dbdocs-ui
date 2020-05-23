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

export function deleteTable(schema, name) {
  return axios({
    method: "delete",
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

export function getSchemas() {
  return axios({
    method: "get",
    url: baseURL + "api/schemas/",
    headers: authHeader
  });
}

export function getRefTable(schema, name, column) {
  return axios({
    method: "get",
    url: baseURL + `api/columns/ref/${schema}/${name}/${column}`,
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

export function saveTags(tags) {
  return axios({
    method: "put",
    data: tags,
    url: baseURL + "api/tags",
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
