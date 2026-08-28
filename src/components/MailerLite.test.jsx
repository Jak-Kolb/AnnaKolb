import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MailerLiteForm } from './MailerLite';

const SUBSCRIBED_EMAILS_KEY = 'ak-newsletter-emails';

async function fillAndSubmit(email = 'pat@example.com') {
  userEvent.type(screen.getByLabelText('Email'), email);
  userEvent.type(screen.getByLabelText('Last name'), 'Kolb');
  userEvent.type(screen.getByLabelText('First name'), 'Pat');
  userEvent.type(screen.getByLabelText('Phone'), '555-0100');
  userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
}

describe('MailerLiteForm', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ success: true })),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows a thank-you message after a new signup', async () => {
    render(<MailerLiteForm />);

    await fillAndSubmit();

    expect(
      await screen.findByRole('heading', { name: 'Thank you!' })
    ).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem(SUBSCRIBED_EMAILS_KEY))).toEqual([
      'pat@example.com',
    ]);
  });

  test('does not submit the same email twice', async () => {
    const { unmount } = render(<MailerLiteForm />);

    await fillAndSubmit('Pat@Example.com');
    expect(
      await screen.findByRole('heading', { name: 'Thank you!' })
    ).toBeInTheDocument();
    unmount();

    render(<MailerLiteForm />);
    await fillAndSubmit('pat@example.com');

    expect(
      await screen.findByRole('heading', { name: "You're already signed up" })
    ).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('ignores a second click while the first request is in flight', async () => {
    let resolveFetch;
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<MailerLiteForm />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Signing up…' })).toBeDisabled();
    });
    userEvent.click(screen.getByRole('button', { name: 'Signing up…' }));
    expect(global.fetch).toHaveBeenCalledTimes(1);

    resolveFetch({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ success: true })),
    });

    expect(
      await screen.findByRole('heading', { name: 'Thank you!' })
    ).toBeInTheDocument();
  });
});
