'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import zxcvbn from 'zxcvbn'
import { auth } from '@/lib/firebase'

type View = 'login' | 'register' | 'forgot'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-[#4A7A50]']

const authErrors: Record<string, string> = {
  'auth/invalid-credential': 'Incorrect email or password',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
}

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultView?: 'login' | 'register'
}

export function AuthModal({ open, onOpenChange, defaultView = 'register' }: AuthModalProps) {
  const router = useRouter()
  const [view, setView] = useState<View>(defaultView)
  const [resetSent, setResetSent] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [firebaseError, setFirebaseError] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [googleError, setGoogleError] = useState('')

  useEffect(() => {
    if (open) {
      setView(defaultView)
      setFirebaseError('')
      setResetSent(false)
      setRegistered(false)
      setPasswordValue('')
      setGoogleError('')
    }
  }, [open, defaultView])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  const strength = passwordValue.length > 0 ? zxcvbn(passwordValue).score : -1

  function onSuccess() {
    onOpenChange(false)
    router.push('/dashboard')
  }

  function switchView(v: View) {
    setView(v)
    setFirebaseError('')
    setResetSent(false)
    setRegistered(false)
    setPasswordValue('')
    setGoogleError('')
  }

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  async function handleLogin(data: z.infer<typeof loginSchema>) {
    setFirebaseError('')
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      onSuccess()
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setFirebaseError(authErrors[code] ?? 'Sign-in failed. Try again.')
    }
  }

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  })

  async function handleRegister(data: z.infer<typeof registerSchema>) {
    setFirebaseError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
      await updateProfile(cred.user, { displayName: data.name })
      await sendEmailVerification(cred.user)
      setRegistered(true)
      await new Promise((r) => setTimeout(r, 2000))
      onSuccess()
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setFirebaseError(authErrors[code] ?? 'Registration failed. Try again.')
    }
  }

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
  })

  async function handleForgot(data: z.infer<typeof forgotSchema>) {
    setFirebaseError('')
    try {
      await sendPasswordResetEmail(auth, data.email)
      setResetSent(true)
    } catch {
      setFirebaseError('Could not send reset email. Check the address and try again.')
    }
  }

  async function handleGoogle() {
    setGoogleError('')
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      onSuccess()
    } catch {
      setGoogleError('Google sign-in failed. Please try again.')
    }
  }

  const titles: Record<View, string> = {
    login: 'Welcome back',
    register: 'Create your account',
    forgot: 'Reset your password',
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
          aria-label="Close"
        >
          ✕ Close
        </button>

        <div className="text-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="Arkoura" className="w-10 h-10 mx-auto mb-2" />
          <h2 className="font-[var(--font-manrope)] text-2xl font-bold text-white tracking-tight">
            {titles[view]}
          </h2>
        </div>

        <div
          className="bg-white rounded-3xl p-8"
          style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.04), 0 4px 16px rgba(28,43,30,0.06)' }}
        >
          {/* ── LOGIN ── */}
          {view === 'login' && (
            <div className="space-y-4">
              <div>
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#1C2B1E] hover:bg-[#F4F6F2] transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                {googleError && <p className="text-xs text-red-500 text-center mt-2">{googleError}</p>}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-gray-400">or</span></div>
              </div>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-3">
                <div>
                  <input
                    {...loginForm.register('email')}
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl text-sm text-[#1C2B1E] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...loginForm.register('password')}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl text-sm text-[#1C2B1E] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => switchView('forgot')} className="text-xs text-[#4A7A50] hover:underline">
                    Forgot password?
                  </button>
                </div>
                {firebaseError && <p className="text-xs text-red-500 text-center">{firebaseError}</p>}
                <button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
                >
                  {loginForm.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400">
                Don&apos;t have an account?{' '}
                <button onClick={() => switchView('register')} className="text-[#4A7A50] font-medium hover:underline">
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* ── REGISTER ── */}
          {view === 'register' && (
            <div className="space-y-4">
              {registered ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-[#E8F2E6] rounded-full flex items-center justify-center mx-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7A50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#1C2B1E]">Account created!</p>
                  <p className="text-xs text-gray-500">Check your email to verify. Redirecting...</p>
                </div>
              ) : (
                <>
                  <div>
                    <button
                      type="button"
                      onClick={handleGoogle}
                      disabled={registerForm.formState.isSubmitting}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#1C2B1E] hover:bg-[#F4F6F2] transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                    {googleError && <p className="text-xs text-red-500 text-center mt-2">{googleError}</p>}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                    <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-gray-400">or</span></div>
                  </div>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-3">
                    <div>
                      <input
                        {...registerForm.register('name')}
                        type="text"
                        placeholder="Full name"
                        className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl text-sm text-[#1C2B1E] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
                      />
                      {registerForm.formState.errors.name && (
                        <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <input
                        {...registerForm.register('email')}
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl text-sm text-[#1C2B1E] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <input
                        {...registerForm.register('password')}
                        type="password"
                        placeholder="Password (min 8 characters)"
                        onChange={(e) => setPasswordValue(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl text-sm text-[#1C2B1E] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
                      />
                      {passwordValue.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  i <= strength ? strengthColors[strength] : 'bg-gray-100'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-400">
                            {['Weak', 'Fair', 'Good', 'Strong'][strength] ?? ''}
                          </p>
                        </div>
                      )}
                      {registerForm.formState.errors.password && (
                        <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div>
                      <input
                        {...registerForm.register('confirmPassword')}
                        type="password"
                        placeholder="Confirm password"
                        className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl text-sm text-[#1C2B1E] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                    {firebaseError && <p className="text-xs text-red-500 text-center">{firebaseError}</p>}
                    <button
                      type="submit"
                      disabled={registerForm.formState.isSubmitting}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                      style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
                    >
                      {registerForm.formState.isSubmitting ? 'Creating account...' : 'Create account'}
                    </button>
                  </form>
                  <p className="text-center text-xs text-gray-400">
                    Already have an account?{' '}
                    <button onClick={() => switchView('login')} className="text-[#4A7A50] font-medium hover:underline">
                      Sign in
                    </button>
                  </p>
                </>
              )}
            </div>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {view === 'forgot' && (
            <div className="space-y-4">
              {resetSent ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-[#E8F2E6] rounded-full flex items-center justify-center mx-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7A50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#1C2B1E]">Check your email</p>
                  <p className="text-xs text-gray-500">
                    If an account exists, you&apos;ll receive a reset link shortly.
                  </p>
                  <button onClick={() => switchView('login')} className="text-xs text-[#4A7A50] font-medium hover:underline">
                    Back to sign in
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500 text-center">
                    Enter your email and we&apos;ll send a reset link.
                  </p>
                  <form onSubmit={forgotForm.handleSubmit(handleForgot)} className="space-y-3">
                    <div>
                      <input
                        {...forgotForm.register('email')}
                        type="email"
                        placeholder="Email address"
                        className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl text-sm text-[#1C2B1E] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
                      />
                      {forgotForm.formState.errors.email && (
                        <p className="text-xs text-red-500 mt-1">{forgotForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    {firebaseError && <p className="text-xs text-red-500 text-center">{firebaseError}</p>}
                    <button
                      type="submit"
                      disabled={forgotForm.formState.isSubmitting}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                      style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
                    >
                      {forgotForm.formState.isSubmitting ? 'Sending...' : 'Send reset link'}
                    </button>
                  </form>
                  <p className="text-center">
                    <button onClick={() => switchView('login')} className="text-xs text-[#4A7A50] font-medium hover:underline">
                      ← Back to sign in
                    </button>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
