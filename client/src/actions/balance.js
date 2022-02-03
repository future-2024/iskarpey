import api from '../utils/api';
import { setAlert } from './alert';
import { getLogs } from './logs';
import {
  GET_BALANCES,
  GET_BALANCE,
  UPDATE_BALANCE
} from './types';

// Get Balances
export const get_balances = () => async dispatch => {
  // try {
  //   const res = await api.get('/balance/list');
  //   dispatch({
  //     type: GET_BALANCES,
  //     payload: res.data
  //   });
  // } catch (err) {
  //   dispatch({
  //     type: AUTH_ERROR
  //   });
  // }
};

// Get Balance of current user
export const getBalance = (account_id) => async dispatch => {
  try {
    const res = await api.get('/balance/'+account_id);

    dispatch({
      type: GET_BALANCE,
      payload: res.data
    });
  } catch (err) {
    console.log(err)
  }
};

// Update Temp Balance
export const updateTempBalance = (data, account_id) => async dispatch => {
  try {
    const res = await api.post('/balance/updatetempbalance', data);

    dispatch(getBalance(account_id));
    dispatch(getLogs(account_id));

    // dispatch(setAlert('Succefully withdrawed', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Update Temp Balance
export const updateBalance = (data, account_id) => async dispatch => {
  try {
    const res = await api.post('/balance/updatebalance', data);

    dispatch(getBalance(account_id));
    dispatch(getLogs(account_id));

    // dispatch(setAlert('Succefully withdrawed', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};