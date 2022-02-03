import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ReCaptchaV2 from "react-google-recaptcha"

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { Redirect } from "react-router-dom";

import { FaFacebookSquare, FaDiscord, FaTwitter, FaTelegramPlane } from "react-icons/fa";

import { styled, alpha } from "@mui/material/styles";

import {useWeb3React} from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

import { useHistory, Link } from "react-router-dom";

import { setAlert } from "../../actions/alert";
import { login, walletuser } from "../../actions/auth";

import { AuthWrapper, AdminBody, AuthButton, AdminTextField, formstyle } from "../../components/adminlayout/LayoutItem";
import AdminHeader from "../../components/adminlayout/AdminHeader";

import { MainChainID, recaptcha } from "../../config";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
})

const LoginBody = styled(Stack)(({ theme }) => ({
  height: "100%"
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: "20px",
  width: "100px",
  height: "40px",
  color: "black",
  border: "1px solid #999",
  width: "100%"
}));

const modalstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};

function Login({auth, login, setAlert, walletuser, isAuthenticated}) {
  const {account, activate, deactivate, active, chainId} = useWeb3React();
  const aaa = useWeb3React();
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
    email: "",
    password: "",
    token: null
  });

  const { email, password, token } = formData;

  const onLogin = async (e) => {// login with email and password
    e.preventDefault();

    if(token) {
      handleLoginClose();
      login(email, password, history);
    } else {
      setAlert("Are you Bot?", "warning");
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

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

  const accountEllipsis = account ? account : null;

  useEffect(() => { // check current wallet is exist in database
    if(account) {
      walletuser(account, history);
    }
  }, [account])

  useEffect(() => { // check current wallet is exist in database
    deactivate();
  }, [])

  useEffect(() => {
    if(chainId) {
      if( chainId !== MainChainID ) {
        setAlert("Please check your chainId. You must use BSC mainnet", "warning")
      }
    }
  }, [chainId])

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
      <AuthWrapper>
      	<AdminBody>
          <LoginBody justifyContent="center">
            <Box sx={formstyle}>
              <Typography id="keep-mounted-modal-title" variant="h5">
                Log in
              </Typography>
              <Typography variant="h6" fontSize={16} color="#777">
                Logging in with wallet is required
              </Typography>
              <Grid container sx={{mb: 2}}>
                <Stack alignItems={{xs: "center", width: "100%"}}>
                  {active ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "70px", width: "400px", fontSize: "14px", backgroundColor: "#f6eb15" }} className = "accountEllipsis">
                      {accountEllipsis}
                    </span>
                  ) : (
                    <LoginButton onClick={connect}>
                      <img src='/wallets/metamask.svg' /> Connect Metamask
                    </LoginButton>
                  )}
                </Stack>
              </Grid>
              <Typography variant="h6" align="center" fontSize={16} color="#777">
                Or login with email and password
              </Typography>
              <form onSubmit={onLogin} style={{margin: '20px 0'}}>
                <Grid container sx={{mt: 2}}>
                  <AdminTextField
                    fullWidth
                    label="Username"
                    size="small"
                    name="email"
                    value={email}
                    onChange={onChange}
                  />
                  <AdminTextField
                    fullWidth
                    label="Password"
                    size="small"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                  />
                  <ReCaptchaV2
                    sitekey={recaptcha}
                    onChange={handleToken}
                  />
                  <Stack alignItems="center" direction="row" justifyContent="space-around" sx={{width: "100%", mt: 2}}>
                    <AuthButton variant="outlined" type="submit" fullWidth>
                      Login
                    </AuthButton>
                  </Stack>
                </Grid>
              </form>
              <Divider />
              <Stack direction="row" justifyContent="center" sx={{width: "100%", my: 3}}>
                <Typography variant="h6" align="center" fontSize={16} color="#777">
                  Forgot your password?
                </Typography>
                <Link to="/forgotpassword" style={{color: "#1c4f9c", marginLeft: '10px'}}>Reset Password?</Link>
              </Stack>
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

export default connect(mapStateToProps, { setAlert, login, walletuser })(Login);