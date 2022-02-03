import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import balance from './balance';
import logs from './logs';
import modal from './modal';

export default combineReducers({
  alert,
  auth,
  balance,
  logs,
  modal
});
