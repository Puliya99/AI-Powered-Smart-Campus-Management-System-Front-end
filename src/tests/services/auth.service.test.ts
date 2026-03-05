/**
 * Unit tests for AuthService (Front-end/src/services/auth.service.ts).
 *
 * axiosInstance is mocked so no real HTTP calls are made.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock axios instance ───────────────────────────────────────────────────────
vi.mock('../../services/api/axios.config', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}))

// ── Imports ───────────────────────────────────────────────────────────────────
import axiosInstance from '../../services/api/axios.config'
import authService from '../../services/auth.service'

const mockAxios = axiosInstance as unknown as {
  post: ReturnType<typeof vi.fn>
  get: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
}

// ── Fixtures ──────────────────────────────────────────────────────────────────
const mockUser = {
  id: 'u1',
  email: 'john@example.com',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  role: 'STUDENT',
  registrationNumber: 'REG20260001',
}

const mockAuthResponse = { user: mockUser, token: 'mock.jwt.token' }

// ── login ─────────────────────────────────────────────────────────────────────
describe('AuthService.login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns user and token on successful login', async () => {
    mockAxios.post.mockResolvedValue({
      data: { status: 'success', data: mockAuthResponse },
    })

    const result = await authService.login({
      email: 'john@example.com',
      password: 'Password1',
    })

    expect(result.user.email).toBe('john@example.com')
    expect(result.token).toBe('mock.jwt.token')
    expect(mockAxios.post).toHaveBeenCalledOnce()
  })

  it('throws when the API returns a non-success status', async () => {
    mockAxios.post.mockResolvedValue({
      data: { status: 'error', message: 'Invalid email or password' },
    })

    await expect(
      authService.login({ email: 'john@example.com', password: 'wrong' }),
    ).rejects.toThrow('Invalid email or password')
  })

  it('throws the response error message when the request fails with 401', async () => {
    mockAxios.post.mockRejectedValue({
      response: { data: { message: 'Invalid email or password' } },
    })

    await expect(
      authService.login({ email: 'john@example.com', password: 'wrong' }),
    ).rejects.toThrow('Invalid email or password')
  })

  it('throws a fallback message when no error message is provided', async () => {
    mockAxios.post.mockRejectedValue(new Error('Network Error'))

    await expect(
      authService.login({ email: 'john@example.com', password: 'any' }),
    ).rejects.toThrow('Network Error')
  })
})

// ── register ─────────────────────────────────────────────────────────────────
describe('AuthService.register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const registerData = {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'Password1',
    firstName: 'John',
    lastName: 'Doe',
  }

  it('returns user and token on successful registration', async () => {
    mockAxios.post.mockResolvedValue({
      data: { status: 'success', data: mockAuthResponse },
    })

    const result = await authService.register(registerData)

    expect(result.user.username).toBe('johndoe')
    expect(result.token).toBe('mock.jwt.token')
  })

  it('throws when the email is already registered', async () => {
    mockAxios.post.mockRejectedValue({
      response: { data: { message: 'Email already registered' } },
    })

    await expect(authService.register(registerData)).rejects.toThrow(
      'Email already registered',
    )
  })

  it('throws a fallback "Registration failed" message on unknown error', async () => {
    mockAxios.post.mockRejectedValue({})

    await expect(authService.register(registerData)).rejects.toThrow(
      'Registration failed',
    )
  })
})

// ── getCurrentUser ────────────────────────────────────────────────────────────
describe('AuthService.getCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the user from the /me endpoint', async () => {
    mockAxios.get.mockResolvedValue({
      data: { status: 'success', data: { user: mockUser } },
    })

    const user = await authService.getCurrentUser()

    expect(user.id).toBe('u1')
    expect(user.email).toBe('john@example.com')
  })

  it('throws when the request fails', async () => {
    mockAxios.get.mockRejectedValue({
      response: { data: { message: 'Token has expired' } },
    })

    await expect(authService.getCurrentUser()).rejects.toThrow(
      'Token has expired',
    )
  })
})

// ── updateProfile ─────────────────────────────────────────────────────────────
describe('AuthService.updateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns updated user and stores it in localStorage', async () => {
    const updatedUser = { ...mockUser, firstName: 'Updated' }
    mockAxios.put.mockResolvedValue({
      data: { status: 'success', data: { user: updatedUser } },
    })

    const result = await authService.updateProfile({ firstName: 'Updated' })

    expect(result.firstName).toBe('Updated')
    expect(localStorage.getItem('user')).toBe(JSON.stringify(updatedUser))
  })

  it('throws on API error', async () => {
    mockAxios.put.mockRejectedValue({
      response: { data: { message: 'Profile update failed' } },
    })

    await expect(authService.updateProfile({})).rejects.toThrow(
      'Profile update failed',
    )
  })
})

// ── helper methods ────────────────────────────────────────────────────────────
describe('AuthService helpers', () => {
  it('isAuthenticated returns true when token is in localStorage', () => {
    localStorage.setItem('token', 'some.token')
    expect(authService.isAuthenticated()).toBe(true)
  })

  it('isAuthenticated returns false when token is absent', () => {
    localStorage.removeItem('token')
    expect(authService.isAuthenticated()).toBe(false)
  })

  it('getToken returns the stored token', () => {
    localStorage.setItem('token', 'abc')
    expect(authService.getToken()).toBe('abc')
  })

  it('getUser returns the parsed user object', () => {
    localStorage.setItem('user', JSON.stringify(mockUser))
    expect(authService.getUser()).toEqual(mockUser)
  })

  it('getUser returns null when no user is stored', () => {
    localStorage.removeItem('user')
    expect(authService.getUser()).toBeNull()
  })

  it('clearAuth removes token and user from localStorage', () => {
    localStorage.setItem('token', 'x')
    localStorage.setItem('user', '{}')
    authService.clearAuth()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })
})
