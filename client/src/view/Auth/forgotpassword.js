import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Redirect } from 'react-router-dom';

import { FaFacebookSquare, FaDiscord, FaTwitter, FaTelegramPlane } from "react-icons/fa";

import { styled, alpha } from '@mui/material/styles';

import {useWeb3React} from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import { useHistory, Link } from "react-router-dom";

import { setAlert } from '../../actions/alert';
import { forgotpassword, walletuser } from '../../actions/auth';

import { AuthWrapper, AdminBody, AuthButton, AdminTextField, formstyle } from '../../components/adminlayout/LayoutItem';
import AdminHeader from '../../components/adminlayout/AdminHeader';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
})

const LoginBody = styled(Stack)(({ theme }) => ({
  height: '100%'
}));

// const AuthButton = styled(Button)(({ theme }) => ({
//   marginTop: '20px',
//   height: '20px',
//   width: '100px',
//   height: '40px',
//   backgroundColor: '#1c4f9c',
//   color: 'white',
//   fontWeight: 600,
//   width: '100%'
// }));

function ForgotPassword({auth, forgotpassword, setAlert, walletuser, isAuthenticated}) {
  const {account, activate, deactivate, active, chainId} = useWeb3React();
  const { user } = auth;

  const [loginmodal, setLoginmodal] = React.useState(false);

  const handleLoginOpen = () => setLoginmodal(true);
  const handleLoginClose = () => setLoginmodal(false);

  const history = useHistory();

  async function connect() { // connect to wallet
    try {
      await activate(injected)
    } catch (ex) {
      console.log("ex", ex)
    }
  }

  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const accountEllipsis = account ? account : null;

  useEffect(() => { // check current wallet is exist in database
    if(account) {
      walletuser(account, history);
    }
  }, [account])

  useEffect(() => { // check current wallet is exist in database
    deactivate();
  }, [])

  if (isAuthenticated) {
    if(user) {
      if(user.verify === 0) 
        return <Redirect to="/emailverification" />;
      else
        return <Redirect to="/dashboard" />;
    }
  }

  return (
    <>
      {/*<AdminHeader />*/}
      <AuthWrapper>
      	<AdminBody>
          <LoginBody justifyContent='center'>
            <Box sx={formstyle}>
              <Typography id="keep-mounted-modal-title" variant="h5" component="h3">
                Forgot Password!
              </Typography>
              <Grid container sx={{mt: 1}}>
                <AdminTextField
                  fullWidth
                  label='Please Input your email address'
                  size='small'
                  name='email'
                  value={email}
                  onChange={onChange}
                />
                <Stack alignItems={{xs: 'center', width: '100%', mt: 4}}>
                  <AuthButton
                    fullWidth
                    onClick={() => {
                      forgotpassword({email})
                    }}>
                    Send Email
                  </AuthButton>
                </Stack>
              </Grid>
            </Box>
          </LoginBody>
      	</AdminBody>
    	</AuthWrapper>
    </>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth
});

export default connect(mapStateToProps, { setAlert, forgotpassword, walletuser })(ForgotPassword);