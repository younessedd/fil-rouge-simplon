import React from 'react';


// in here we use alias 


import "@/assets/css/style.scss";



import LatestProducts from "@/components/common/latestProducts.jsx";
import FeaturedProducts from "@/components/common/FeaturedProducts.jsx";
import Header from './common/Header';
import Footer from './common/Footer';
import Hero from './common/Hero';
import Layout from './common/Layout';




const Home = () => {
  return (
 <>
      


      <Layout>

        


            <Hero />
            <LatestProducts />
            <FeaturedProducts />


      </Layout>



 </>
  )
}

export default Home
