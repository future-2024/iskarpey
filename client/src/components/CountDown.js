import React, { useState, useEffect } from 'react';

export default function CountDown({flag, setFlag}) {
  const [start, setStart] = React.useState(Number(new Date()));
  const [current, setCurrent] = React.useState(Number(new Date()));

  React.useEffect(() => {
    if(flag == true){
      let time = Math.ceil((current - start)/1000);

      time < 60 && setTimeout(() => setCurrent(Number(new Date())), 1000);
      if(time >= 60) {
        setFlag(false);
      }
    } else {
      setStart(Number(new Date()));
      localStorage.setItem('start', Number(new Date()))
    }
  }, [current, flag]);

  React.useEffect(() => {
    let starttime = Number(localStorage.getItem('start'));
    let time = Math.ceil((current - starttime)/1000);

    if(time < 60) {
      setStart(starttime)
      setFlag(true);
    }
  }, [])

  return (
    <p style={{margin: 0}}>{60 - Math.ceil((current - start)/1000)}</p>
  )
}
