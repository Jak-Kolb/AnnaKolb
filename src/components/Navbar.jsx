import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AKLogo from './AKLogo';
import './Navbar.css';

// TODO: Contact may get a dropdown in a future update
const NAV_ITEMS = [
  { label: 'About', path: '/about' },
  {
    label: 'Artwork',
    path: '/artwork',
    dropdown: [
      { label: 'Animal Portraits', path: '/artwork/animal-portraits' },
      { label: 'Car Portraits', path: '/artwork/car-portraits' },
      { label: 'Miscellaneous', path: '/artwork/miscellaneous' },
    ],
  },
  {
    label: 'Abstract Art',
    path: '/abstract-art',
    dropdown: [
      { label: 'Gallery', path: '/abstract-art/gallery' },
      { label: 'Works on Canvas', path: '/abstract-art/works-on-canvas' },
    ],
  },
  { label: 'Contact', path: '/contact' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="navbar" ref={navRef}>
      <Link to="/" className="navbar-logo-link" aria-label="Home">
        <AKLogo />
      </Link>

      <button
        className={`hamburger${menuOpen ? ' open' : ''}`}
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav-menu${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
        <ul className="nav-list">
          {NAV_ITEMS.map((item) =>
            item.dropdown ? (
              <li
                key={item.label}
                className="nav-item has-dropdown"
              >
                <button
                  className="nav-link dropdown-trigger"
                  aria-haspopup="true"
                >
                  {item.label}
                  <span className="caret" aria-hidden="true">&#8964;</span>
                </button>
                <ul className="dropdown-menu" role="menu">
                  {item.dropdown.map((sub) => (
                    <li key={sub.path} role="none">
                      <Link to={sub.path} className="dropdown-link" role="menuitem">
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.label} className="nav-item">
                <Link to={item.path} className="nav-link">
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
