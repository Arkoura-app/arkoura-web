'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const authErrors: Record<string, string> = {
  'auth/invalid-credential': 'Incorrect email or password',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
}

interface LoginFormProps {
  onSuccess: () => void
  onForgotPassword: () => void
  onRegister?: () => void
}

export default function LoginForm({ onSuccess, onForgotPassword, onRegister }: LoginFormProps) {
  const [firebaseError, setFirebaseError] = useState('')
  const [googleError, setGoogleError] = useState('')

  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  async function handleLogin(data: z.infer<typeof schema>) {
    setFirebaseError('')
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      onSuccess()
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setFirebaseError(authErrors[code] ?? 'Sign-in failed. Try again.')
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

  return (
    <div className="space-y-4">
      {/* Google */}
      <div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={formState.isSubmitting}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#1C2B1E] hover:bg-[#F4F6F2] transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
        {googleError && <p className="text-xs text-red-500 text-center mt-2">{googleError}</p>}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-gray-400">or</span>
        </div>
      </div>

      {/* Email / password form */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-3">
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl text-sm text-[#1C2B1E] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
          />
          {formState.errors.email && (
            <p className="text-xs text-red-500 mt-1">{formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl text-sm text-[#1C2B1E] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
          />
          {formState.errors.password && (
            <p className="text-xs text-red-500 mt-1">{formState.errors.password.message}</p>
          )}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-[#4A7A50] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {firebaseError && (
          <p className="text-xs text-red-500 text-center">{firebaseError}</p>
        )}

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
        >
          {formState.isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {onRegister && (
        <p className="text-center text-xs text-gray-400">
          Don&apos;t have an account?{' '}
          <button
            onClick={onRegister}
            className="text-[#4A7A50] font-medium hover:underline"
          >
            Create one
          </button>
        </p>
      )}
    </div>
  )
}
