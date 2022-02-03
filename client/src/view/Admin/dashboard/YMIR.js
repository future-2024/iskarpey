import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

import { styled } from '@mui/material/styles';

import { setAlert } from '../../../actions/alert';
import { updateTempBalance, updateBalance, getBalance } from '../../../actions/balance';
import { setTverify, transactionverify, resend } from '../../../actions/auth';
import { openModal } from '../../../actions/modal';

import { tokenaddress, RPC_url } from '../../../config';

import { useContract } from '../../../hooks/useContract';

import YMIRABI from '../../../services/abis/YMIR.json';

import { useWeb3React } from '@web3-react/core';

import { AuthButton, AdminTextField, VerifyTextfieldWrap, VerifyTextfield, VerifyButton, formstyle } from '../../../components/adminlayout/LayoutItem';
import CountDown from '../../../components/CountDown';

const DepositButton = styled(Button)(({ theme }) => ({
  height: '30px',
  fontSize: '11px',
  backgroundColor: '#242735',
  border: '1px solid #F5F6F9',
  color: 'white',
  margin: '4px 0'
}));

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

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function YMIRTransaction({
  auth,
  balance,
  setAlert,
  transactionverify,
  setTverify,
  resend,
  updateTempBalance,
  updateBalance,
  getBalance,
  openModal
}) {
  const { user, transaction_verify } = auth;
  const { value } = balance;

  const history = useHistory();

  const {library} = useWeb3React();

  let web3 = new Web3(RPC_url);

  const [val, setVal] = useState(0);
  const [code, setCode] = useState('');
  const [flag, setFlag] = useState(false);

  const [depositmodal, setDepositmodal] = React.useState(false);
  const [withdrawmodal, setWithdrawmodal] = React.useState(false);
  const [verifymodal, setVerifymodal] = React.useState(false);

  const onVerify = async (e) => {
    e.preventDefault();

    transactionverify(code, history);
  };

  const handleDepositOpen = () => {
    if(!transaction_verify) {
      localStorage.setItem('YMIR_action', 'deposit');
      localStorage.getItem(60);
      handleVerifyOpen();
      return;
    }

    setDepositmodal(true);
  }

  const handleDepositClose = () => setDepositmodal(false);

  const handleWithdrawOpen = () => {
    if(!transaction_verify) {
      localStorage.setItem('YMIR_action', 'withdraw');
      localStorage.getItem(60);
      handleVerifyOpen();
      return;
    }

    setWithdrawmodal(true);
  }

  const handleWithdrawClose = () => setWithdrawmodal(false);

  const handleVerifyOpen = () => setVerifymodal(true);
  const handleVerifyClose = () => setVerifymodal(false);

  const ymirContract = useContract(tokenaddress, YMIRABI);

  const DepositYMIR = async () => {
    if(window.confirm("You are trying to deposit "+ val+" Ymir Coin. Click confirm to proceed.")) {
      try {
        if(val <= 0) {setAlert('Please Input token Balance again.', 'warning'); return;}

        const purchase = await ymirContract.deposit((val * 1000000000000000000).toString())
        handleDepositClose()

        let transactionReceipt = null
        while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
          transactionReceipt = await web3.eth.getTransactionReceipt(purchase.hash);
          await sleep(1000)
        }
        let data = {
          token: 'YMIR',
          hash: purchase.hash
        }

        if(transactionReceipt.status === true) {
          data.newvalue = value+Number(val);
          data.message = `You attempted to deposit ${val} Ymir Coins`;
        } else {
          data.newvalue = value;
          data.message = `Your deposit attempt was failed.`;
        }

        updateBalance(data, user.account_id);
        setTverify(false);
        setVal(0);
        openModal(true, `Deposit from Metamask. ${val} Ymir Coin was successfully deposited into your game account wallet.`); // open success modal
        // history.push('/success');
      } catch(err) {
        handleDepositClose()
        console.log(err)
        setAlert('Something went wrong.', 'error');
      }
      localStorage.removeItem('YMIR_action');
    }
  }

  const withdrawYMIR = async () => {
    if(window.confirm("You are trying to deposit "+ val+" Ymir Coin. Click confirm to proceed.")) {
      try {
        if(val <= 0 || value < val) {setAlert('Please Input token Balance again.', 'warning'); return;}

        const purchase = await ymirContract.withdraw((val * 1000000000000000000).toString())
        handleWithdrawClose();

        let data = {
          token: 'YMIR',
          newvalue: Number(val) * -1,
          currentvalue: value,
          hash: purchase.hash
        }

        updateTempBalance(data, user.account_id)

        let transactionReceipt = null;
        while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
          transactionReceipt = await web3.eth.getTransactionReceipt(purchase.hash);
          await sleep(1000)
        }

        data = {
          token: 'YMIR',
          hash: purchase.hash
        }

        if(transactionReceipt.status === true) {
          data.newvalue = value - Number(val);
          data.message = `You attempted to withdraw ${val} Ymir Coins`;
        } else {
          data.newvalue = value;
          data.message = `Your withdraw attempt was failed.`;
        }

        updateBalance(data, user.account_id)
        setTverify(false);
        setVal(0);
        openModal(true, `Withdraw to Metamask. ${val} Ymir Coin was successfully withdrawn from your game account wallet.`);
      } catch(err) {
        handleWithdrawClose();
        console.log(err)
        setAlert('Something went wrong.', 'error');
      }
      localStorage.removeItem('YMIR_action');
    }
  }

  useEffect(() => {
    getBalance(user.account_id)
  }, [getBalance])

  useEffect(() => {
    let YMIR_action = localStorage.getItem('YMIR_action')
    if(transaction_verify) {
      if(YMIR_action === 'deposit')
        setDepositmodal(true);
      
      if(YMIR_action === 'withdraw')
        setWithdrawmodal(true);
    }
  }, [])

  React.useEffect(() => { // Check if counter is alive
    let starttime = Number(localStorage.getItem('start'));
    let current = Number(new Date());
    let time = Math.ceil((current - starttime)/1000);
    if(time < 60) {
      setFlag(true);
    }
  }, [])

  return (
    <Grid item md={6} xs={12} sx={{px: 1, mb: 2}}>
      <Stack
        sx={{
          p: 2,
          border: '1px solid #F5F6F9',
          borderRadius: '8px',
          backgroundImage: 'url(/userpanel/bsc.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right',
          backgroundSize: 'contain',
          height: '200px',
        }}
        justifyContent='space-between'
      >
        <Box>
          <Typography component='h5' variant='h5'>{value.toFixed(8)} YMIR COIN</Typography>
          <Typography component='p' variant='p'>0 USD</Typography>
        </Box>
        <Stack
          direction={{
            md: 'row',
            xs: 'column'
          }}
          justifyContent='space-between'
        >
          <DepositButton onClick={handleDepositOpen}>Deposit from Metamask</DepositButton>
          <DepositButton onClick={handleWithdrawOpen}>Withdraw to Metamask</DepositButton>
        </Stack>
      </Stack>
      <Modal
        keepMounted
        open={withdrawmodal}
        onClose={handleWithdrawClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={modalstyle}>
          <Grid container>
            <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
              <Typography variant='h5'>
                Withdraw to metamask
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
              <AdminTextField fullWidth label='Balance' size='small' required type='number' value={val} onChange={(e) => setVal(e.target.value)} />
            </Grid>
            <Stack alignItems={{xs: 'center', width: '100%'}} direction='row' justifyContent='space-around'>
              <AuthButton variant='outlined' fullWidth onClick={withdrawYMIR}>
                Withdraw
              </AuthButton>
            </Stack>
          </Grid>
        </Box>
      </Modal>
      <Modal
        keepMounted
        open={depositmodal}
        onClose={handleDepositClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={modalstyle}>
          <Grid container>
            <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
              <Typography variant='h5'>
                Deposit from Metamask
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
              <AdminTextField fullWidth label='Balance' size='small' required type='number' value={val} onChange={(e) => setVal(e.target.value)} />
            </Grid>
            <Stack alignItems={{xs: 'center', width: '100%'}} direction='row' justifyContent='space-around'>
              <AuthButton variant='outlined' fullWidth onClick={DepositYMIR}>
                Deposit
              </AuthButton>
            </Stack>
          </Grid>
        </Box>
      </Modal>
      <Modal
        keepMounted
        open={verifymodal}
        onClose={handleVerifyClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={formstyle}>
          <Typography id="keep-mounted-modal-title" variant="h5">
            Transaction Verify
          </Typography>
          <Grid container>
            <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}, mt: 2}}>
              <Typography variant="p" color='#333'>
                E-mail Verification code
              </Typography>
              <VerifyTextfieldWrap direction="row" alignItems="center">
                <VerifyTextfield fullWidth size="small" type="text" name="code" value={code} onChange={(e) => setCode(e.target.value)} />
                <VerifyButton
                  disabled={flag}
                  onClick={()=>{
                    resend(history);
                    setFlag(true);
                    localStorage.setItem('start', Number(new Date()))
                  }}
                >
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
              {/*{
                vloading ? (
                  <AuthButton disabled sx={{mt: 2}} fullWidth>
                    Loading...
                  </AuthButton>
                ) : (
                )
              }*/}
              <AuthButton onClick={onVerify} sx={{mt: 2}} fullWidth>
                Verify
              </AuthButton>
            </Stack>
          </Grid>
        </Box>
      </Modal>
    </Grid>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth,
  balance: state.balance
});

export default connect(mapStateToProps, { setAlert, updateTempBalance, setTverify, transactionverify, updateBalance, getBalance, resend, openModal })(YMIRTransaction);