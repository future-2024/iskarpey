import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { Redirect } from 'react-router-dom';

import { FaFacebookSquare, FaDiscord, FaTwitter, FaTelegramPlane } from "react-icons/fa";

import { styled, alpha } from '@mui/material/styles';

import {useWeb3React} from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import { useHistory } from "react-router-dom";

import { setAlert } from '../../actions/alert';
import { emailverify, resend } from '../../actions/auth';

import Sidebar from './adminSidebar';

import { AuthLayout, AdminBody, AdminMainBody, AuthButton, AdminTextField, formstyle } from '../../components/adminlayout/LayoutItem';
import AdminHeader from '../../components/adminlayout/AdminHeader';
import CountDown from '../../components/CountDown';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
})

const VerifyBody = styled(Stack)(({ theme }) => ({
  height: '100%'
}));

const VerifyTextfieldWrap = styled(Stack)(({ theme }) => ({
  border: '1px solid #999',
  borderRadius: '5px',
  marginBottom: '5px',
  marginTop: '5px',
}));

const VerifyTextfield = styled(TextField)(({ theme }) => ({
  '& fieldset': {
    border: 0,
    color: 'black'
  },
  '& input': {
    color: 'black'
  },
}));

const VerifyButton = styled(Button)(({ theme }) => ({
  color: '#985e03',
  fontWeight: 600,
  textTransform: 'none',
  width: '110px'
}));

function Emailverification({auth, setAlert, emailverify, resend}) {
  const {account, activate, deactivate, active} = useWeb3React();
  const { user, isAuthenticated } = auth;

  const history = useHistory();

  const [code, setCode] = useState('');
  const [flag, setFlag] = useState(false);

  const onVerify = async (e) => {
    e.preventDefault();

    emailverify(code, history);
  };

  const accountEllipsis = account ? account : null;

  if (isAuthenticated) {
    if(user) {
      if(user.verify === 1) {
        return <Redirect to="/dashboard" />;
      }
    }
  }

  return (
    <>
      {/*<AdminHeader />*/}
      <AuthLayout>
        <AdminBody direction='row'>
          {/*<Sidebar />*/}
        	<Box sx={{width: '100%'}}>
            <VerifyBody justifyContent='center'>
              <Box sx={formstyle}>
                <Typography id="keep-mounted-modal-title" variant="h5">
                  Email Verify
                </Typography>
                <Grid container>
                  <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}, mt: 2}}>
                    <Typography variant="p" color='#333'>
                      E-mail Verification code
                    </Typography>
                    <VerifyTextfieldWrap direction="row" alignItems="center">
                      <VerifyTextfield fullWidth size="small" type="text" name="code" value={code} onChange={(e) => setCode(e.target.value)} />
                      <VerifyButton disabled={flag} onClick={()=>{resend(history); setFlag(true);}}>
                        {flag ? <CountDown flag={flag} setFlag={setFlag} /> : 'Get code'}
                      </VerifyButton>
                    </VerifyTextfieldWrap>
                    <Typography variant="p" color='#aaa'>
                      Enter the 6-digit code sent to  {user.email.split('@')[0].slice(0, 4)}***@{user.email.split('@')[1] }
                    </Typography>
                  </Grid>
                  <Stack alignItems={{xs: 'center', width: '100%'}} direction='row' justifyContent='space-around'>
                    {/*<AuthButton onClick={()=>resend(history)}>
                      Resend
                    </AuthButton>*/}
                    <AuthButton onClick={onVerify} sx={{mt: 2}} fullWidth>
                      Verify
                    </AuthButton>
                  </Stack>
                </Grid>
              </Box>
            </VerifyBody>
        	</Box>
        </AdminBody>
    	</AuthLayout>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { setAlert, emailverify, resend })(Emailverification);