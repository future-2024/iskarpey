import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from '../view/Auth/login';
import ForgotPassword from '../view/Auth/forgotpassword';

import Emailverification from '../view/Admin/emailverification';
import Register from '../view/Admin/register';
import AccountManagement from '../view/Admin/accountmanagement';
import UserDashboard from '../view/Admin/dashboard';
import UserActivities from '../view/Admin/activities';
import Transactionverify from '../view/Admin/transactionverify';
import Success from '../view/Admin/success';

import NotFound from '../components/layout/NotFound';
import PrivateRoute from '../components/PrivateRoute';

const Routes = props => {
  return (
    <>
    	<Switch>
	      <Route exact path="/login" component={Login} />

	      <Route exact path="/register" component={Register} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
	      <PrivateRoute exact path="/emailverification" component={Emailverification} />
        <PrivateRoute exact path="/manageaccount" component={AccountManagement} />
        <PrivateRoute exact path="/dashboard" component={UserDashboard} />
        <PrivateRoute exact path="/activities" component={UserActivities} />
        {/*<PrivateRoute exact path="/transactionverify" component={Transactionverify} />*/}
        {/*<PrivateRoute exact path="/success" component={Success} />*/}
	      <Route component={NotFound} />
    	</Switch>
    </>
  );
};

export default Routes;