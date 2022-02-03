import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Redirect, Link } from 'react-router-dom';

import { FaFacebookSquare, FaDiscord, FaTwitter, FaTelegramPlane } from "react-icons/fa";

import { styled } from '@mui/material/styles';

import {useWeb3React} from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import { useHistory } from "react-router-dom";

import { setAlert } from '../../actions/alert';
import { registerSubaccount, getSubaccounts, changePassword, logout, forgotpassword } from '../../actions/auth';

import Sidebar from './adminSidebar';
import Footer from '../../components/layout/Footer';

import { AdminLayout, AdminBody, AdminMainBody } from '../../components/adminlayout/LayoutItem';
import AdminHeader from '../../components/adminlayout/AdminHeader';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
})

const SocialLink = styled('a')(({ theme }) => ({
	margin: '0 10px',
	fontSize: '20px'
}));

const AuthButton = styled(Button)(({ theme }) => ({
  marginRight: '20px',
  width: '200px',
  height: '40px',
  border: '1px solid #fff',
  backgroundColor: '#242735',
  color: 'white',
  fontWeight: 600
}));

const TableButton = styled(Button)(({ theme }) => ({
  marginRight: '20px',
  height: '30px',
  backgroundColor: '#1c4f9c',
  color: 'white',
  fontWeight: 600
}));

const style1 = {
  width: '80%',
  mx: 'auto',
  py: 4,
  px: {
    sm: 4,
    xs: 1
  },
  marginBottom: '20px',
  borderRadius: '10px',
  border: '1px solid #fff',
  marginTop: '100px'
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

function AccountManagement({auth, setAlert, registerSubaccount, getSubaccounts, changePassword, forgotpassword, isAuthenticated}) {
  const {account, activate, deactivate, active} = useWeb3React();
  const { user, users } = auth;

  const history= useHistory();

  const [formData, setFormData] = useState({
    userid: '',
    password: '',
    password2: '',
    currentpassword: '',
  });

  const [account_id, setAccountID] = useState('');

  const { userid, password, password2, currentpassword } = formData;

  const [addmodal, setAddModal] = React.useState(false);
  const [passwordmodal, setPasswordModal] = React.useState(false);
  const [forgotpass, setForgotpass] = React.useState(false);

  const handleAddOpen = () => setAddModal(true);
  const handleAddClose = () => setAddModal(false);

  const handlePasswordOpen = () => setPasswordModal(true);
  const handlePasswordClose = () => setPasswordModal(false);

  const handleForgotOpen = () => setForgotpass(true);
  const handleForgotClose = () => setForgotpass(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
    if(!account) {
      setAlert('Please connect to your wallet', 'warning')
    }
    if (password !== password2) {
      // setAlert('Passwords do not match', 'danger');
      setAlert('Passwords do not match', 'warning')
      // return;
    } else {
      registerSubaccount({ userid, password, wallet: account });
      handleAddClose();
      setFormData({
        userid: '',
        password: '',
        password2: ''
      })
    }
    setFormData({
      userid: '',
      password: '',
      password2: ''
    })
  };

  const onPassword = async (e) => {// register with email and password
    e.preventDefault();
    if (password !== password2) {
      // setAlert('Passwords do not match', 'danger');
      setAlert('Passwords do not match', 'warning')
    } else {
      changePassword({ password2, password, currentpassword, account_id });
      setFormData({
        ...formData,
        currentpassword: '',
        password: '',
        password2: ''
      })
      setAccountID('');
      handlePasswordClose()
    }
  };

  useEffect(() => {
    getSubaccounts();
  }, [getSubaccounts])

  if (isAuthenticated) {
    if(user) {
      if(user.verify === 0) {
        return <Redirect to="/emailverification" />;
      }
    }
  }

  return (
    <>
      {/*<AdminHeader />*/}
      <AdminLayout>
        <AdminBody direction='row'>
          <Sidebar />
          <AdminMainBody>
            <Box sx={style1}>
              <AuthButton
                fullWidth
                sx={{width: '150px', mb: 2}}
                onClick={handleAddOpen}
              >
                Add Account
              </AuthButton>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, textTransform: 'initial' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>UserName</TableCell>
                      <TableCell>Account ID</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell>Password</TableCell>
                      <TableCell>Manage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users && users.map((row, i) => (
                      <TableRow
                        key={i}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.userid}
                        </TableCell>
                        <TableCell>
                          {row.account_id}
                        </TableCell>
                        <TableCell>
                        </TableCell>
                        <TableCell>
                          <TableButton
                            variant="outlined"
                            sx={{width: '100px'}}
                            onClick={() =>  {setAccountID(row.account_id); handlePasswordOpen();}}
                          >
                            Change
                          </TableButton>
                        </TableCell>
                        <TableCell>
                          <TableButton
                            variant="outlined"
                            sx={{width: '100px'}}
                          >
                            Manage
                          </TableButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </AdminMainBody>
        </AdminBody>

        <Modal
          keepMounted
          open={addmodal}
          onClose={handleAddClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={modalstyle}>
            <form onSubmit={onRegister}>
              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography sx={{mr: '10px'}} align='right' color='#1c4f9c' fontWeight={600} variant="h6" component="h3">
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Username" size='small' required name="userid" value={userid} onChange={onChange} disabled={!account} />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography sx={{mr: '10px'}} align='right' color='#1c4f9c' fontWeight={600} variant="h6" component="h3">
                    Password
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Password" size='small' required type='password' name="password" value={password} onChange={onChange} disabled={!account} />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography sx={{mr: '10px'}} align='right' color='#1c4f9c' fontWeight={600} variant="h6" component="h3">
                    Confirm
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Confirm Password" size='small' required type='password' disabled={!account} name="password2" value={password2} onChange={onChange} />
                </Grid>
                <Stack alignItems={{xs: 'center', width: '100%'}} direction='row' justifyContent='space-around'>
                  <AuthButton type='submit' disabled={!account}>
                    Create Sub
                  </AuthButton>
                </Stack>
              </Grid>
            </form>
          </Box>
        </Modal>
        <Modal
          keepMounted
          open={passwordmodal}
          onClose={handlePasswordClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={modalstyle}>
            <form onSubmit={onPassword}>
              <Grid container>
                <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField
                    fullWidth
                    label='Current Password'
                    size='small'
                    type='password'
                    name='currentpassword'
                    value={currentpassword}
                    onChange={onChange}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    style={{color: '#1c4f9c', cursor: 'pointer'}}
                    onClick={() => {
                      forgotpassword({account_id});
                      handlePasswordClose();
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField
                    fullWidth
                    label='Password'
                    size='small'
                    type='password'
                    name='password'
                    value={password}
                    onChange={onChange}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField
                    fullWidth
                    label='Confirm Password'
                    size='small'
                    type='password'
                    disabled={!account}
                    name='password2'
                    value={password2}
                    onChange={onChange}
                  />
                </Grid>
                <Stack alignItems={{xs: 'center', width: '100%'}}>
                  <AuthButton type='submit' variant="outlined">
                    Change Password
                  </AuthButton>
                </Stack>
              </Grid>
            </form>
          </Box>
        </Modal>
        {/*<Footer />*/}
    	</AdminLayout>
    </>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth
});

export default connect(mapStateToProps, { setAlert, registerSubaccount, logout, getSubaccounts, changePassword, forgotpassword })(AccountManagement);