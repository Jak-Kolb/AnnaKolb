import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MailerLite.css';

const ACCOUNT_ID = '2582891';
const FORM_ID = 'vsENsa';

export function MailerLiteForm() {
  useEffect(() => {
    if (typeof window.ml === 'function') {
      window.ml('account', ACCOUNT_ID);
    }
  }, []);

  return (
    <div className="mailerlite-embed">
      <div className="ml-embedded" data-form={FORM_ID} />
    </div>
  );
}

export function MailerLitePopupButton({ children = 'Join the newsletter' }) {
  return (
    <Link to="/newsletter" className="newsletter-btn">
      {children}
    </Link>
  );
}
