import axios from "axios";
import { GET_UNIVERSITIES } from "./types";
import { UNIVERSITY_SERVER } from "../Config.js";
import qs from "qs";
export function universities(params) {
  const request = axios
    .get(`${UNIVERSITY_SERVER}/?${qs.stringify(params)}`)
    .then((response) => response.data);

  return {
    type: GET_UNIVERSITIES,
    payload: request,
  };
}
