import {
	GET_BALANCES,
	GET_BALANCE
} from '../actions/types';

const initialState = {
	value: 0
};

function balanceReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BALANCE:
      return {
      	...state,
      	value: payload ? payload.value : 0
      };
    default:
      return state;
  }
}

export default balanceReducer;
