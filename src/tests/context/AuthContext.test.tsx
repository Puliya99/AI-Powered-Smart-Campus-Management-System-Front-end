/**
 * Unit tests for AuthContext / AuthProvider / useAuth hook.
 *
 * react-router-dom and react-hot-toast are mocked so the context
 * can be rendered in isolation without a real router or toast DOM.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../services/auth.service', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

// ── Imports ───────────────────────────────────────────────────────────────────
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';
import { AuthProvider, useAuth } from '../../context/AuthContext';

const mockAuth = authService as unknown as {
  login: ReturnType<typeof vi.fn>;
  register: ReturnType<typeof vi.fn>;
  getCurrentUser: ReturnType<typeof vi.fn>;
};

// ── Test helpers ──────────────────────────────────────────────────────────────
const mockUser = {
  id: 'u1',
  email: 'john@example.com',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  role: 'student',
  registrationNumber: 'REG20260001',
};

/** Renders a component inside AuthProvider (wrapped in MemoryRouter). */
function renderWithAuth(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
}

/** Minimal consumer component for probing context state. */
function AuthConsumer() {
  const auth = useAuth();
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [registerError, setRegisterError] = React.useState<string | null>(null);
  return (
    <div>
      <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="loading">{String(auth.isLoading)}</span>
      <span data-testid="user-email">{auth.user?.email ?? 'none'}</span>
      <span data-testid="login-error">{loginError ?? ''}</span>
      <span data-testid="register-error">{registerError ?? ''}</span>
      <button
        onClick={async () => {
          try {
            await auth.login('john@example.com', 'Password1');
          } catch (e: any) {
            setLoginError(e.message);
          }
        }}
      >
        Login
      </button>
      <button
        onClick={async () => {
          try {
            await auth.register({
              username: 'johndoe',
              email: 'john@example.com',
              password: 'Password1',
              firstName: 'John',
              lastName: 'Doe',
            });
          } catch (e: any) {
            setRegisterError(e.message);
          }
        }}
      >
        Register
      </button>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('AuthProvider — initial state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // getCurrentUser is called during init; default to throwing so no stale token issues
    mockAuth.getCurrentUser.mockRejectedValue(new Error('No token'));
  });

  it('starts with isAuthenticated=false and no user when localStorage is empty', async () => {
    renderWithAuth(<AuthConsumer />);

    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false'),
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-email').textContent).toBe('none');
  });

  it('restores user from localStorage on mount when token is valid', async () => {
    localStorage.setItem('token', 'stored.token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    mockAuth.getCurrentUser.mockResolvedValue(mockUser);

    renderWithAuth(<AuthConsumer />);

    await waitFor(() =>
      expect(screen.getByTestId('user-email').textContent).toBe('john@example.com'),
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('true');
  });

  it('clears state when token verification fails on mount', async () => {
    localStorage.setItem('token', 'expired.token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    mockAuth.getCurrentUser.mockRejectedValue(new Error('Token expired'));

    renderWithAuth(<AuthConsumer />);

    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false'),
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });
});

describe('AuthProvider — login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockAuth.getCurrentUser.mockRejectedValue(new Error('No token'));
  });

  it('sets user and token in state and localStorage on success', async () => {
    mockAuth.login.mockResolvedValue({ user: mockUser, token: 'new.jwt.token' });

    renderWithAuth(<AuthConsumer />);

    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false'),
    );

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    await waitFor(() =>
      expect(screen.getByTestId('authenticated').textContent).toBe('true'),
    );

    expect(localStorage.getItem('token')).toBe('new.jwt.token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    expect(toast.success).toHaveBeenCalledWith('Welcome back!');
  });

  it('navigates to the role-specific dashboard after login', async () => {
    mockAuth.login.mockResolvedValue({ user: mockUser, token: 'tok' });

    renderWithAuth(<AuthConsumer />);
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false'),
    );

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    // navigation is deferred via setTimeout(100ms)
    await waitFor(
      () => expect(mockNavigate).toHaveBeenCalledWith('/student/dashboard'),
      { timeout: 500 },
    );
  });

  it('shows a toast error and surfaces the message when login fails', async () => {
    mockAuth.login.mockRejectedValue(new Error('Invalid email or password'));

    renderWithAuth(<AuthConsumer />);
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false'),
    );

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    // toast.error is called inside the async catch block — wait for it
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Invalid email or password'),
    );
    // error is surfaced in state by AuthConsumer's catch wrapper
    expect(screen.getByTestId('login-error').textContent).toBe('Invalid email or password');
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });
});

describe('AuthProvider — register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockAuth.getCurrentUser.mockRejectedValue(new Error('No token'));
  });

  it('sets user and token after successful registration', async () => {
    mockAuth.register.mockResolvedValue({ user: mockUser, token: 'reg.tok' });

    renderWithAuth(<AuthConsumer />);
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false'),
    );

    await act(async () => {
      await userEvent.click(screen.getByText('Register'));
    });

    await waitFor(() =>
      expect(screen.getByTestId('authenticated').textContent).toBe('true'),
    );

    expect(localStorage.getItem('token')).toBe('reg.tok');
    expect(toast.success).toHaveBeenCalledWith('Account created successfully!');
  });

  it('shows toast error and surfaces the message when registration fails', async () => {
    mockAuth.register.mockRejectedValue(new Error('Email already registered'));

    renderWithAuth(<AuthConsumer />);
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false'),
    );

    await act(async () => {
      await userEvent.click(screen.getByText('Register'));
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Email already registered'),
    );
    expect(screen.getByTestId('register-error').textContent).toBe('Email already registered');
  });
});

describe('AuthProvider — logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockAuth.getCurrentUser.mockRejectedValue(new Error('No token'));
  });

  it('clears state and localStorage on logout', async () => {
    mockAuth.login.mockResolvedValue({ user: mockUser, token: 'tok' });

    renderWithAuth(<AuthConsumer />);
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false'),
    );

    // Login first
    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });
    await waitFor(() =>
      expect(screen.getByTestId('authenticated').textContent).toBe('true'),
    );

    // Then logout
    await act(async () => {
      await userEvent.click(screen.getByText('Logout'));
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-email').textContent).toBe('none');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

describe('useAuth hook', () => {
  it('throws when used outside an AuthProvider', () => {
    // Suppress the expected React error output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<AuthConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider',
    );

    spy.mockRestore();
  });
});
