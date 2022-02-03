import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from './layout/Spinner';
import { setAlert } from '../actions/alert';

import {useWeb3React} from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
})

function PrivateRoute ({setAlert, component: Component, auth: { isAuthenticated, user, loading }, ...rest}) {
  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <Spinner />
        ) : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {setAlert})(PrivateRoute);
