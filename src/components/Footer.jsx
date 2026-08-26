import React from 'react';
import { useLocation } from 'react-router-dom';
import { MailerLitePopupButton } from './MailerLite';
import './Footer.css';

function Footer() {
  const { pathname } = useLocation();
  const showNewsletterCta = pathname !== '/newsletter';

  return (
    <footer className="footer">
      {showNewsletterCta && (
        <div className="footer-newsletter">
          <p>Sign up for updates on new pieces and commission spots.</p>
          <MailerLitePopupButton>Join the newsletter</MailerLitePopupButton>
        </div>
      )}
      <p className="footer-copy">&copy; 2025 Anna Kolb. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
