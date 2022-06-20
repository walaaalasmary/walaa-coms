import { GET_COLLEGES } from "../_actions/types";

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = {}, action) {
  switch (action.type) {
    case GET_COLLEGES:
      return { ...state, userData: action.payload };
    default:
      return state;
  }
}
