import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './MailerLite.css';

const SUBSCRIBE_URL =
  'https://assets.mailerlite.com/jsonp/2582891/forms/196336509632120550/subscribe';

export function MailerLiteForm() {
  const [status, setStatus] = useState('form');
  const submittedRef = useRef(false);

  const handleSubmit = () => {
    submittedRef.current = true;
    setStatus('submitting');
  };

  const handleFrameLoad = () => {
    if (submittedRef.current) {
      setStatus('success');
    }
  };

  return (
    <div className="nl-form">
      {status === 'success' ? (
        <div className="nl-form-success">
          <h2>Thank you!</h2>
          <p>You have successfully joined our subscriber list.</p>
        </div>
      ) : (
        <>
          <img
            className="nl-form-photo"
            src={process.env.PUBLIC_URL + '/imgs/newsletter-header.jpg'}
            alt=""
            width={800}
            height={800}
          />
          <div className="nl-form-body">
            <h2>Join my art newsletter</h2>
            <p>
              Sign up for my newsletter and be the first to know about my new
              pieces, commission spots, and more.
            </p>
            <iframe
              name="ml-subscribe-frame"
              title="MailerLite submit"
              className="nl-form-frame"
              onLoad={handleFrameLoad}
            />
            <form
              action={SUBSCRIBE_URL}
              method="post"
              target="ml-subscribe-frame"
              onSubmit={handleSubmit}
            >
              <input
                aria-label="Email"
                type="email"
                name="fields[email]"
                placeholder="Email"
                autoComplete="email"
                required
              />
              <input
                aria-label="Last name"
                type="text"
                name="fields[last_name]"
                placeholder="Last name"
                autoComplete="family-name"
                required
              />
              <input
                aria-label="First name"
                type="text"
                name="fields[name]"
                placeholder="First Name"
                autoComplete="given-name"
                required
              />
              <input
                aria-label="Phone"
                type="tel"
                name="fields[phone]"
                placeholder="Phone"
                autoComplete="tel"
                required
              />
              <input type="hidden" name="ml-submit" value="1" />
              <input type="hidden" name="anticsrf" value="true" />
              <button type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Signing up…' : 'Sign Up'}
              </button>
            </form>
          </div>
        </>
      )}
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
