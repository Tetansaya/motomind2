import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; 
import { useCart } from './CartContext'; 
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart(); 
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const auth = getAuth(); 
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); 
    });
    return () => unsubscribe(); 
  }, []);

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login?action=login');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/login?action=register');
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); 
      setUser(null); 
      navigate('/'); 
    } catch (error) {
      console.error('Error signing out:', error); 
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const cartItemCount = getCartItemCount();

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="company-name-link">
          <h1 className="company-name">MotoMind</h1>
        </Link>
        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/about">Nosotros</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/productos">Productos</Link>
        </nav>
      </div>
      <div className="header-right">
        <button className="cart-icon" onClick={handleCartClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </button>
        {user ? (
          <div className="user-dropdown">
            <button className="user-email">{user.email}</button>
            <div className="dropdown-content">
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login?action=register" className="register-link" onClick={handleRegisterClick}>
              Regístrate
            </Link>
            <button className="login-button" onClick={handleLoginClick}>
              Iniciar sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;