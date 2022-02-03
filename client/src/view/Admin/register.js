import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReCaptchaV2 from 'react-google-recaptcha'

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import Modal from '@mui/material/Modal';

import { Redirect } from 'react-router-dom';

import { FaFacebookSquare, FaDiscord, FaTwitter, FaTelegramPlane } from "react-icons/fa";

import { styled, alpha } from '@mui/material/styles';

import {useWeb3React} from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import { useHistory } from "react-router-dom";

import { setAlert } from '../../actions/alert';
import { register, login, logout } from '../../actions/auth';

import Sidebar from './adminSidebar';
import Footer from '../../components/layout/Footer';

import { AuthWrapper, AdminBody, AdminTextField, AuthButton, formstyle } from '../../components/adminlayout/LayoutItem';
import AdminHeader from '../../components/adminlayout/AdminHeader';

import { recaptcha } from '../../config';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
})

const RegisterBody = styled(Stack)(({ theme }) => ({
  height: '100%'
}));

const style2 = {
  minWidth: 400,
  width: '40%',
  mx: 'auto',
  py: 4,
  px: {
    sm: 4,
    xs: 1
  },
  borderRadius: '10px',
  border: '1px solid #fff',
  backgroundImage: 'url(/userpanel/bsc.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right',
  backgroundSize: 'contain',
};

const modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Register({auth, setAlert, register, login}) {
  const {account, activate, deactivate, active} = useWeb3React();
  const { user, isAuthenticated } = auth;

  const [loginmodal, setLoginmodal] = React.useState(false);
  const [registermodal, setRegistermodal] = React.useState(false);

  const handleLoginOpen = () => setLoginmodal(true);
  const handleLoginClose = () => setLoginmodal(false);

  const handleRegisterOpen = () => setRegistermodal(true);
  const handleRegisterClose = () => setRegistermodal(false);

  const history= useHistory();

  const [formData, setFormData] = useState({
    userid: '',
    email: '',
    password: '',
    password2: '',
    token: null
  });

  const { userid, email, password, password2, token } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleToken = (token) => {
    setFormData((currentForm) => {
      return {...currentForm, token }
    })
  }

  const handleExpire = () => {
    setFormData((currentForm) => {
      return {...currentForm, token: null }
    })
  }

  async function connect() { // connect to wallet
    try {
      await activate(injected)
    } catch (ex) {
      console.log("ex", ex)
    }
  }

  const accountEllipsis = account ? account : null;

  const onRegister = async (e) => {// register with email and password
    e.preventDefault();
    if (password !== password2) {
      // setAlert('Passwords do not match', 'danger');
      setAlert('Passwords do not match', 'warning')
    } else {
      if(token) {
        register({ userid, email, password, wallet: account });
      } else {
        setAlert('Are you Bot?', 'warning');
      }
    }
  };

  const onLogin = async (e) => {// login with email and password
    e.preventDefault();
    if (!account) {
      // setAlert('Passwords do not match', 'danger');
      setAlert('Please connect your wallet to login.', 'warning')
    } else {
      login(userid, password, history);
    }
  };

  // if (isAuthenticated) {
  //   return <Redirect to="/create_sub" />;
  // }

  if (isAuthenticated) {
    if(user) {
      if(user.verify === 0) {
        return <Redirect to="/emailverification" />;
      }
    }
  }

  if(!account) {
    return <Redirect to="/login" />;
    connect()
  }

  return (
    <>
      {/*<AdminHeader />*/}
      <AuthWrapper>
        <AdminBody direction='row'>
          {/*<Sidebar />*/}
        	<Box sx={{width: '100%'}}>
            <RegisterBody justifyContent='center'>
              <Box sx={formstyle}>
                <Typography id="keep-mounted-modal-title" variant="h5" color='#000'>
                  Create Main Account
                </Typography>
                <Grid container sx={{mt: 1}}>
                  <Stack alignItems={{xs: 'center', width: '100%'}}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "70px", width: "400px", fontSize: "14px", backgroundColor: "#f6eb15" }} className = "accountEllipsis">
                      {accountEllipsis}
                    </span>
                  </Stack>
                </Grid>
                <form onSubmit={onRegister}>
                  <Grid container>
                    <Grid item xs={12}>
                      <AdminTextField fullWidth label="Username" size='small' name="userid" value={userid} onChange={onChange} disabled={!account} />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12}>
                      <AdminTextField fullWidth label="Email" size='small' type='email' name="email" value={email} onChange={onChange} disabled={!account} />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12}>
                      <AdminTextField fullWidth label="Password" size='small' type='password' name="password" value={password} onChange={onChange} disabled={!account} />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12}>
                      <AdminTextField fullWidth label="Confirm Password" size='small' type='password' disabled={!account} name="password2" value={password2} onChange={onChange} />
                    </Grid>
                    <ReCaptchaV2
                      sitekey={recaptcha}
                      onChange={handleToken}
                      onExpire={handleExpire}
                    />
                    <Stack alignItems={{xs: 'center', width: '100%'}}>
                      <AuthButton type='submit' fullWidth disabled={!account}>
                        Register
                      </AuthButton>
                    </Stack>
                  </Grid>
                </form>
              </Box>
            </RegisterBody>
        	</Box>
        </AdminBody>
        {/*<Footer />*/}

        {/*<Modal
          keepMounted
          open={registermodal}
          onClose={handleRegisterClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={modalstyle}>
            <form onSubmit={onRegister}>
              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' color='#242735' fontWeight={600} variant="h6" component="h3">
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Username" size='small' name="userid" value={userid} onChange={onChange} disabled={!account} />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' color='#242735' fontWeight={600} variant="h6" component="h3">
                    Email
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Email" size='small' type='email' name="email" value={email} onChange={onChange} disabled={!account} />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' color='#242735' fontWeight={600} variant="h6" component="h3">
                    Password
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Password" size='small' type='password' name="password" value={password} onChange={onChange} disabled={!account} />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' color='#242735' fontWeight={600} variant="h6" component="h3">
                    Confirm
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Confirm Password" size='small' type='password' disabled={!account} name="password2" value={password2} onChange={onChange} />
                </Grid>
                <ReCaptchaV2
                  sitekey={recaptcha}
                  onChange={handleToken}
                  onExpire={handleExpire}
                />
                <Stack alignItems={{xs: 'center', width: '100%'}}>
                  <AuthButton type='submit' sx={{backgroundColor: '#242735', mt: 2}} fullWidth variant="outlined" disabled={!account}>
                    Register
                  </AuthButton>
                </Stack>
              </Grid>
            </form>
          </Box>
        </Modal>*/}
    	</AuthWrapper>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { setAlert, register, logout, login })(Register);