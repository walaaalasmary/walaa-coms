import axios from "axios";
import {
  LOGIN_USER,
  REGISTER_USER,
  CREATE_USER,
  AUTH_USER,
  LOGOUT_USER,
  GET_DEANS,
  UPDATE_USER,
  GET_USERS,
  RESET_USER,
  CHANGE_PASS_USER,
  REMOVE_USER,
} from "./types";
import { USER_SERVER } from "../Config.js";
import qs from "qs";

/**
 * register user dispatch
 * @param dataToSubmit - the data that will be sent to the server
 * @returns A promise.
 */
export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}
/**
 * register user dispatch
 * @param dataToSubmit - the data that will be sent to the server
 * @returns A promise.
 */
export function createUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: CREATE_USER,
    payload: request,
  };
}
export function updateUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/${dataToSubmit._id}`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: UPDATE_USER,
    payload: request,
  };
}

/**
 * login user dispatch
 * @param dataToSubmit - the data that will be sent to the server
 * @returns A promise.
 */
export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}
export function changePass(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/change-password`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: CHANGE_PASS_USER,
    payload: request,
  };
}
export function resetPassword(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/reset-password`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: RESET_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get(`${USER_SERVER}/auth`)
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}
/**
 * logout user dispatch
 * @returns A promise.
 */
export function logoutUser() {
  const request = axios
    .get(`${USER_SERVER}/logout`)
    .then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}
export function deans() {
  const request = axios
    .get(`${USER_SERVER}/deans`)
    .then((response) => response.data);

  return {
    type: GET_DEANS,
    payload: request,
  };
}
export function users(params) {
  const request = axios
    .get(`${USER_SERVER}/?${qs.stringify(params)}`)
    .then((response) => response.data);

  return {
    type: GET_USERS,
    payload: request,
  };
}
export function removeUser(id) {
  const request = axios
    .delete(`${USER_SERVER}/${id}`)
    .then((response) => response.data);

  return {
    type: REMOVE_USER,
    payload: request,
  };
}
