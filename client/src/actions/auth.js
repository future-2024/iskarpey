import api from '../utils/api';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  GET_SUBACCOUNT,
  EMAIL_VERIFYED,
  TRANSACTINO_VERIFYED,
  SET_VLOAD
} from './types';

// Load User
export const loadUser = () => async dispatch => {
  try {
    const res = await api.get('/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = formData => async dispatch => {
  try {
    const res = await api.post('/users', formData);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(setAlert('Register succefully.', 'success'))
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Register Sub User
export const registerSubaccount = formData => async dispatch => {
  try {
    const res = await api.post('/users/subaccount', formData);
    dispatch({
      type: GET_SUBACCOUNT,
      payload: res.data
    });
    dispatch(setAlert('Register Subaccount succefully.', 'success'))
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Get sub users
export const getSubaccounts = () => async dispatch => {
  try {
    const res = await api.get('/users/subaccount');

    dispatch({
      type: GET_SUBACCOUNT,
      payload: res.data
    });
  } catch (err) {
    let errors
    if(err.response)
      if(err.response.data)
        errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email, password, history) => async dispatch => {
  const body = { email, password };

  try {
    const res = await api.post('/auth', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(setAlert('Login succefully.', 'success'))
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Email Verify
export const emailverify = (code, history) => async dispatch => {
  try {
    const res = await api.post('/auth/verifyemail', { code });

    if(res.data == true) {
      dispatch(setAlert('Verify your email succefully.', 'success'))
      dispatch(loadUser());
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Transaction Verify
export const transactionverify = (code, history) => async dispatch => {
  try {
    dispatch({
      type: SET_VLOAD,
      payload: true
    });
    const res = await api.post('/auth/verifyemail', { code });

    if(res.data == true) {
      dispatch(setAlert('Verify your email succefully.', 'success'))
      dispatch(setTverify(true));
      // history.goBack();
      window.location.reload();;
    } else {
      dispatch(setAlert('Verify Code was not matched. Please confirm again.', 'warning'))
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

export const setTverify = (value) => async dispatch => {
  localStorage.setItem('transactionverify', value);
  dispatch({
    type: TRANSACTINO_VERIFYED,
    payload: value
  });
}

export const resend = () => async dispatch => {
  try {
    const res = await api.get('/auth/resendcode');
  } catch (err) {
    let errors;
    if(err.response) {
      if(err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const walletuser = (wallet, history) => async dispatch => {
  try {
    const res = await api.get('/auth/wallet/'+wallet);

    if(res.data) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      dispatch(loadUser());
    } else {
      history.push('/register');
    }
  } catch (err) {
    let errors;

    if(err.response)
      if(err.response.data)
        errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    history.push('/');
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Change User
export const changeUser = (userid) => async dispatch => {
  try {
    const res = await api.post('/auth/updateuser', {userid});

    dispatch(setAlert('Succefully changed.', 'success'))
    dispatch(loadUser());
  } catch (err) {
    let errors;
    if(err.response) {
      if(err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

// Change UserID
export const changeEmail = (email) => async dispatch => {
  try {
    const res = await api.post('/auth/email', {email});

    dispatch(setAlert('Succefully changed. You need to verify you email again.', 'success'))
    dispatch(loadUser());
  } catch (err) {
    let errors;
    if(err.response) {
      if(err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

// Change Password
export const changePassword = (data) => async dispatch => {
  try {
    const res = await api.post('/auth/changePassword', data);

    dispatch(setAlert('Succefully changed.', 'success'))
    dispatch(loadUser());
  } catch (err) {
    let errors;
    if(err.response) {
      if(err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

export const forgotpassword = (searchkey) => async dispatch => {
  try {
    const res = await api.post('/auth/forgotpassword', searchkey);

    dispatch(setAlert('You will receive new password on your email.', 'success'))
    // dispatch(loadUser());
  } catch (err) {
    let errors;
    if(err.response) {
      if(err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

// Logout
export const logout = (history) => dispatch => {
  dispatch({ type: LOGOUT })
  // history.push('/');
};
