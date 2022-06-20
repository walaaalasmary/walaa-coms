import axios from "axios";
import {
  GET_COLLEGES,
  CREATE_COLLEGE,
  UPDATE_COLLEGE,
  REMOVE_COLLEGE,
} from "./types";
import { COLLEGES_SERVER } from "../Config.js";
import qs from "qs";
export function colleges(params) {
  const request = axios
    .get(`${COLLEGES_SERVER}/?${qs.stringify(params)}`)
    .then((response) => response.data);

  return {
    type: GET_COLLEGES,
    payload: request,
  };
}
export function createCollege(dataToSubmit) {
  const request = axios
    .post(`${COLLEGES_SERVER}/`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: CREATE_COLLEGE,
    payload: request,
  };
}
export function updateCollege(dataToSubmit) {
  const request = axios
    .post(`${COLLEGES_SERVER}/${dataToSubmit.id}`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: UPDATE_COLLEGE,
    payload: request,
  };
}
export function removeCollege(id) {
  const request = axios
    .delete(`${COLLEGES_SERVER}/${id}`)
    .then((response) => response.data);

  return {
    type: REMOVE_COLLEGE,
    payload: request,
  };
}
