import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const getInitial = () => {
    if (user?.displayName) return user.displayName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return '?';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo-link">
          <img
            src="/logo1.png"
            alt="Codify Logo"
            className="navbar-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Link>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/profile">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                referrerPolicy="no-referrer"
                alt="Profile"
                className="navbar-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="navbar-initial">{getInitial()}</div>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
