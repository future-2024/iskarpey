import React, {useEffect} from 'react';
import './App.css';

import Dashboard from './view/Dashboard';

import Header from './components/layout/Header';
import Alert from './components/Alert';
import SuccessModal from './components/modal/SuccessModal';
import Routes from './routes';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { LOGOUT } from './actions/types';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser, setTverify } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import {createWeb3ReactRoot, Web3ReactProvider} from '@web3-react/core';

import {getLibrary} from './utils/getLibrary';

const NetworkContextName = `${new Date().getTime()}-NETWORK`;
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function App() {
	useEffect(() => {
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());

    if (localStorage.getItem('transactionverify') === 'true') {
      store.dispatch(setTverify(true));
    } else {
      store.dispatch(setTverify(false));
    }

    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);

  return (
  	<Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
  	  	<Provider store={store}>
  		    <Router>
            <Alert />
            <SuccessModal />
            <Header />
  		      <Switch>
  		        <Route exact path="/" component={Dashboard} />

              <Route component={Routes} />
  		      </Switch>
  		    </Router>
  		  </Provider>
      </Web3ProviderNetwork>
		</Web3ReactProvider>
  );
}

export default App;
