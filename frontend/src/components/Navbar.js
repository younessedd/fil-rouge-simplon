import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ setPage }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <span className="logo" onClick={() => setPage('home')}>MyShop</span>
      <div>
        {user ? (
          <>
            <span>{user.name} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setPage('login')}>Login</button>
            <button onClick={() => setPage('register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
