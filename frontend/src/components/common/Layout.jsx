import React from 'react'
import Header from '@/components/common/Header.jsx';
import Footer from '@/components/common/Footer.jsx';



const Layout = ({children}) => {
  return (
<>

<Header/>   

{children}

<Footer/>


</>
  )
}

export default Layout
