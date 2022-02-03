import React from 'react';

import Jobs from './Jobs';
import News from './News';
import ServerFeature from './ServerFeature';
import Banner from '../../components/layout/Banner';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function Dashboard() {
  return (
    <>
    	{/*<Header />*/}
    	<Banner />
    	<News />
    	<ServerFeature />
    	<Jobs />
    	<Footer />
    </>
  );
}
