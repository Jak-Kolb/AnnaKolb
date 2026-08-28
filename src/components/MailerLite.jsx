import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './MailerLite.css';

const SUBSCRIBE_URL =
  'https://assets.mailerlite.com/jsonp/2582891/forms/196336509632120550/subscribe';

const SUBSCRIBED_EMAILS_KEY = 'ak-newsletter-emails';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getSubscribedEmails() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SUBSCRIBED_EMAILS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rememberEmail(email) {
  const emails = getSubscribedEmails();
  if (!emails.includes(email)) {
    localStorage.setItem(
      SUBSCRIBED_EMAILS_KEY,
      JSON.stringify([...emails, email])
    );
  }
}

function parseSubscribeResponse(text) {
  if (!text) return { success: true };
  try {
    return JSON.parse(text);
  } catch {
    const match = String(text).match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return { success: true };
      }
    }
  }
  return { success: true };
}

function isAlreadySubscribed(data) {
  const blob = JSON.stringify(data || {}).toLowerCase();
  return (
    data?.already_subscribed === true ||
    /already (been )?(taken|subscribed|exists)/.test(blob)
  );
}

function subscribeJsonp(params) {
  return new Promise((resolve, reject) => {
    const callbackName = `mlJsonp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
    const script = document.createElement('script');
    let settled = false;

    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('Signup timed out'));
    }, 15000);

    window[callbackName] = (data) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanup();
      resolve(data || { success: true });
    };

    script.src = `${SUBSCRIBE_URL}?${params.toString()}&callback=${callbackName}`;
    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanup();
      reject(new Error('Signup failed'));
    };
    document.body.appendChild(script);
  });
}

async function subscribe(form) {
  const params = new URLSearchParams(new FormData(form));

  try {
    const res = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = parseSubscribeResponse(await res.text());
    if (!res.ok && data.success === false && !isAlreadySubscribed(data)) {
      throw new Error('Signup failed');
    }
    return data;
  } catch (err) {
    if (err.message === 'Signup failed') throw err;
    return subscribeJsonp(params);
  }
}

export function MailerLiteForm() {
  const [status, setStatus] = useState('form');
  const [error, setError] = useState('');
  const lockRef = useRef(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (lockRef.current) return;

    const form = event.currentTarget;
    const email = normalizeEmail(form.elements['fields[email]']?.value);
    if (!email) return;

    lockRef.current = true;

    if (getSubscribedEmails().includes(email)) {
      setStatus('already');
      return;
    }

    setError('');
    setStatus('submitting');

    try {
      const data = await subscribe(form);
      rememberEmail(email);
      setStatus(isAlreadySubscribed(data) ? 'already' : 'success');
    } catch {
      lockRef.current = false;
      setStatus('form');
      setError('Something went wrong. Please try again.');
    }
  };

  if (status === 'success' || status === 'already') {
    return (
      <div className="nl-form">
        <div className="nl-form-success">
          <h2>
            {status === 'already' ? "You're already signed up" : 'Thank you!'}
          </h2>
          <p>
            {status === 'already'
              ? 'This email is already on the subscriber list.'
              : 'You have successfully joined our subscriber list.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="nl-form">
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
        <form onSubmit={handleSubmit}>
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
          {error ? <p className="nl-form-error">{error}</p> : null}
          <button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>
      </div>
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
