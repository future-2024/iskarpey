import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import ImageSearchIcon from '@mui/icons-material/ImageSearch';

import { styled } from '@mui/material/styles';

const DateTime = styled(Typography)(({ theme }) => ({
  marginRight: '16px',
  width: '150px',
  [theme.breakpoints.down('md')]: {
    width: '100px',
  },
}));

function LogItem({logitem}) {
  let date = logitem.date.split('.')[0];

  return (
    <Stack
      direction='row'
      sx={{mb: 1}}
    >
      <Box>
        <DateTime component='p' variant='p' fontWeight={600}>{date.split('T')[0]+' '+date.split('T')[1]}</DateTime>
      </Box>
      <Box>
        <Typography component='p' variant='p' fontWeight={600}>{logitem.message}</Typography>
        <a href={'https://testnet.bscscan.com/tx/'+logitem.hash} target='_blank'>
          <Stack direction='row' alignItems='center'>
            <Typography component='p' variant='p' color='#b1b1b1' sx={{mr: 1}}>View transactions status here.</Typography>
            <ImageSearchIcon />
          </Stack>
        </a>
      </Box>
    </Stack>
  );
}

export default LogItem;