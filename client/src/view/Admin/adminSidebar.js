import * as React from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import ArrowRight from '@mui/icons-material/ArrowRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Home from '@mui/icons-material/Home';
import Settings from '@mui/icons-material/Settings';
import People from '@mui/icons-material/People';
import PermMedia from '@mui/icons-material/PermMedia';
import Dns from '@mui/icons-material/Dns';
import Public from '@mui/icons-material/Public';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';

import {useWeb3React} from '@web3-react/core';

import { logout } from '../../actions/auth';

import { Link } from "react-router-dom";

const data = [
  { icon: <DashboardIcon />, label: 'Dashboard', url: '/dashboard' },
  { icon: <AssignmentIcon />, label: 'Activities', url: '/activities' },
  { icon: <SettingsIcon />, label: 'Account Management', url: '/manageaccount' },
];

const FireNav = styled(List)({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

const AdminListItemText = styled(ListItemText)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

const AdminListItemButton = styled(ListItemButton)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    paddingRight: '15px !important',
    paddingLeft: '15px !important'
  },
}))

const AdminListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginRight: '0 !important'
  },
}))

function Sidebar({logout, auth }) {
  const {account} = useWeb3React();

  const [open, setOpen] = React.useState(true);

  const { user } = auth;

  const accountEllipse = account ? account.substring(0, 4)+'...'+account.substring(account.length - 4) : '';

  return (
    <Box sx={{ display: 'flex', position: 'fixed' }}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {
            mode: 'dark',
            primary: { main: 'rgb(102, 157, 246)' },
            background: { paper: '#242735' },
          },
        })}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 256,
            height: 'calc(100vh - 100px)',
            borderRight: '1px solid #F5F6F9'
          }}
        >
          <FireNav component="nav" disablePadding>
            <Divider />
            <ListItem component="div" sx={{borderBottom: '1px solid #F5F6F9'}} disablePadding>
              <Link to='/'>
                <AdminListItemButton sx={{ height: 70 }}>
                  <Stack alignItems='center'>
                    <Stack direction='row' alignItems='center' sx={{mt: 2}}>
                      <AdminListItemIcon>
                        <Home color="#F5F6F9" />
                      </AdminListItemIcon>
                      <AdminListItemText
                        primary={user ? user.email : ''}
                        primaryTypographyProps={{
                          color: '#F5F6F9',
                          fontWeight: 'medium',
                          variant: 'body2',
                        }}
                        sx={{
                          '& span': {
                            width: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      />
                    </Stack>
                    <AdminListItemText
                      primary={'Wallet: ' + accountEllipse}
                      primaryTypographyProps={{
                        color: '#F5F6F9',
                        fontWeight: 'medium',
                        variant: 'body2',
                      }}
                      sx={{

                        '& span': {
                          width: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}
                    />
                  </Stack>
                </AdminListItemButton>
              </Link>
            </ListItem>
            <Box
              sx={{
                bgcolor: open ? 'rgba(71, 98, 130, 0.2)' : null,
                pb: open ? 2 : 0,
              }}
            >
              <AdminListItemButton
                alignItems="flex-start"
                onClick={() => setOpen(!open)}
                sx={{
                  px: 3,
                  pt: 2.5,
                  pb: open ? 0 : 2.5,
                  '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
                }}
              >
                <AdminListItemText
                  primary="Build"
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: 'medium',
                    lineHeight: '20px',
                    mb: '2px',
                  }}
                  secondary="Account Account Settings"
                  secondaryTypographyProps={{
                    noWrap: true,
                    fontSize: 12,
                    lineHeight: '16px',
                    color: open ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.5)',
                  }}
                  sx={{ my: 0 }}
                />
                <KeyboardArrowDown
                  sx={{
                    mr: -1,
                    opacity: 0,
                    transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                    transition: '0.2s',
                  }}
                />
              </AdminListItemButton>
              {open &&
                data.map((item, i) => (
                  <Link to={item.url} key={i}>
                    <AdminListItemButton
                      key={item.label}
                      sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                    >
                      <AdminListItemIcon sx={{ color: 'inherit' }}>
                        {item.icon}
                      </AdminListItemIcon>
                      <AdminListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                      />
                    </AdminListItemButton>
                  </Link>
                ))}
            </Box>
          </FireNav>
        </Paper>
      </ThemeProvider>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Sidebar);