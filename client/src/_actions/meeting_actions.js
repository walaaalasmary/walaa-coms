import axios from "axios";
import { GET_DEPARTMENTS, REMOVE_MEETING } from "./types";
import { MEETING_SERVER } from "../Config.js";
import qs from "qs";
export function meetings(params) {
  const request = axios
    .get(`${MEETING_SERVER}/?${qs.stringify(params)}`)
    .then((response) => response.data);

  return {
    type: GET_DEPARTMENTS,
    payload: request,
  };
}
export function createMeeting(params) {
  const request = axios
    .post(`${MEETING_SERVER}/`, params)
    .then((response) => response.data);

  return {
    type: GET_DEPARTMENTS,
    payload: request,
  };
}
export function reportMeeting(id, params) {
  const request = axios
    .post(`${MEETING_SERVER}/${id}/report`, params)
    .then((response) => response.data);

  return {
    type: GET_DEPARTMENTS,
    payload: request,
  };
}
export function removeMeeting(id) {
  const request = axios
    .delete(`${MEETING_SERVER}/${id}`)
    .then((response) => response.data);

  return {
    type: REMOVE_MEETING,
    payload: request,
  };
}
