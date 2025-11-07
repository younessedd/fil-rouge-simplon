import React, { useContext, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState('home');

  const renderPage = () => {
    if (!user) {
      if (page === 'login') return <Login setPage={setPage} />;
      if (page === 'register') return <Register setPage={setPage} />;
      return <Home />;
    }
    if (user.role === 'admin') {
      if (page === 'adminDashboard') return <AdminDashboard />;
      if (page === 'products') return <Products />;
      if (page === 'categories') return <Categories />;
      if (page === 'users') return <Users />;
      if (page === 'orders') return <Orders />;
    } else {
      if (page === 'userDashboard') return <UserDashboard />;
      if (page === 'products') return <Products />;
      if (page === 'orders') return <Orders />;
    }
    return <Home />;
  };

  return (
    <div className="app">
      <Navbar setPage={setPage} />
      <div className="main">
        {user?.role === 'admin' && <Sidebar setPage={setPage} />}
        <div className="content">{renderPage()}</div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
