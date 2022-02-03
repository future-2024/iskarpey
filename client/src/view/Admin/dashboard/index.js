import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

import { styled } from '@mui/material/styles';

import { setAlert } from '../../../actions/alert';
import { logout } from '../../../actions/auth';
import { getLogs } from '../../../actions/logs';

import Sidebar from '../adminSidebar';
import Footer from '../../../components/layout/Footer';

import { AdminLayout, AdminBody, AdminMainBody } from '../../../components/adminlayout/LayoutItem';
import AdminHeader from '../../../components/adminlayout/AdminHeader';

import YMIR from './YMIR';
import LogItem from './LogItem';

import { tokenaddress } from '../../../config';

import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
})

const DepositButton = styled(Button)(({ theme }) => ({
  height: '30px',
  fontSize: '11px',
  backgroundColor: '#242735',
  border: '1px solid #F5F6F9',
  color: 'white',
  margin: '4px 0'
}));

const DashboardBody = styled(Grid)(({ theme }) => ({
  padding: '0 20px',
  paddingTop: '26px',
  color: '#F5F6F9',
  width: '65%',
  [theme.breakpoints.down('xl')]: {
    width: '80%',
  },
  [theme.breakpoints.down('lg')]: {
    padding: '0 5px',
    paddingTop: '26px',
    width: '100%',
  },
}));

function UserDashabord({auth, logs, setAlert, getLogs}) {
  const {account, activate, active} = useWeb3React();
  const { user, isAuthenticated } = auth;
  const { loglist } = logs;

  let displaylogs = loglist.length > 3 ? loglist.slice(0, 3) : loglist;

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  useEffect(() => {
    getLogs(user.account_id);
  }, [getLogs])

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
            <DashboardBody container>
              <Grid item md={6} xs={12} sx={{px: 1}}>
                <Stack direction='row' alignItems='center' sx={{my: 2}}>
                  <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: '15px',
                      border: '1px solid #F5F6F9',
                      width: '100%'
                    }}
                  >
                    <Stack direction='row' alignItems='center' justifyContent='start'>
                      <Typography component='p' variant='p' fontSize={14}>YMIR COIN ADDRESS:</Typography>
                      <Typography
                        component='p'
                        variant='p'
                        fontSize={14}
                        sx={{
                          ml: 1,
                        }}
                      >
                        {tokenaddress.substring(0, 6)}...{tokenaddress.substring(tokenaddress.length - 6)}
                      </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center'>
                      <CopyToClipboard text={tokenaddress} onCopy={() => setAlert('Copied', 'success')}>
                        <ContentCopyIcon />
                      </CopyToClipboard>
                      <a href={'https://bscscan.com/address/'+tokenaddress} target='_blank'>
                        <ImageSearchIcon />
                      </a>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item md={6} xs={12} sx={{px: 1}}></Grid>

              <YMIR />

              <Grid item md={6} xs={12} sx={{px: 1, mb: 2}}>
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    backgroundImage: 'url(/userpanel/ymir.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right',
                    backgroundSize: 'contain',
                    height: '200px',
                  }}
                  justifyContent='space-between'
                >
                  <Box>
                    <Typography component='h5' variant='h5'>0 ROK POINTS</Typography>
                    <Typography component='p' variant='p'>0 USD</Typography>
                  </Box>
                  <Stack
                    direction={{
                      md: 'row',
                      xs: 'column'
                    }}
                    justifyContent='space-between'
                  >
                    <DepositButton>Deposit from Metamask</DepositButton>
                    <DepositButton>Withdraw to Metamask</DepositButton>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item md={3} sm={6} xs={12} sx={{px: 1, mb: 2}}
              >
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/item1.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>0</Typography>
                    <Typography component='p' variant='p' align='center'>CHARACTERS</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={3} sm={6} xs={12} sx={{px: 1, mb: 2}}
              >
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/item2.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>0</Typography>
                    <Typography component='p' variant='p' align='center'>EQUIPMENTS</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={3} sm={6} xs={12} sx={{px: 1, mb: 2}}
              >
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/item3.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>0</Typography>
                    <Typography component='p' variant='p' align='center'>COSTUMES</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={3} sm={6} xs={12} sx={{px: 1, mb: 2}}
              >
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/item4.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>0</Typography>
                    <Typography component='p' variant='p' align='center'>CARDS</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={6} xs={12} sx={{px: 1, mb: 2}}>
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/coin.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>2,100,000,000</Typography>
                    <Typography component='p' variant='p' align='center'>ZENY</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={6} xs={12} sx={{px: 1}}></Grid>
              <Grid item xs={12} sx={{px: 1}}>
                <Stack>
                  <Typography component='h5' variant='h5' sx={{mb: 1}}>Activities</Typography>
                </Stack>
                {
                  displaylogs ? displaylogs.map((item, i) => (
                    <LogItem logitem={item} key={i} />
                  )) : null
                }
              </Grid>
            </DashboardBody>
          </AdminMainBody>
        </AdminBody>
    	</AdminLayout>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  logs: state.logs
});

export default connect(mapStateToProps, { setAlert, getLogs, logout })(UserDashabord);