import axios from "axios";
import {
  GET_DEPARTMENTS,
  UPDATE_DEPARTMENTS,
  CREATE_DEPARTMENT,
  REMOVE_DEPARTMENT,
} from "./types";
import { DEPARTMENT_SERVER } from "../Config.js";
import qs from "qs";
export function departments(params) {
  const request = axios
    .get(`${DEPARTMENT_SERVER}/?${qs.stringify(params)}`)
    .then((response) => response.data);

  return {
    type: GET_DEPARTMENTS,
    payload: request,
  };
}
export function createDepartment(params) {
  const request = axios
    .post(`${DEPARTMENT_SERVER}/`, params)
    .then((response) => response.data);

  return {
    type: CREATE_DEPARTMENT,
    payload: request,
  };
}
export function updateDepartment(params) {
  const request = axios
    .post(`${DEPARTMENT_SERVER}/${params._id}`, params)
    .then((response) => response.data);

  return {
    type: UPDATE_DEPARTMENTS,
    payload: request,
  };
}
export function removeDepartment(id) {
  const request = axios
    .delete(`${DEPARTMENT_SERVER}/${id}`)
    .then((response) => response.data);

  return {
    type: REMOVE_DEPARTMENT,
    payload: request,
  };
}
