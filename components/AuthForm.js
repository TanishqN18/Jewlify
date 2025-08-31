'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, googleProvider } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully!');
      } else {
        if (password !== confirm) {
          toast.error("Passwords don't match");
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Signup successful!');
      }

      router.push('/');
    } catch (err) {
      console.error(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google!');
      router.push('/');
    } catch (err) {
      toast.error('Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-md w-full mx-auto animate-fadeIn"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-3 px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {!isLogin && (
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-3 px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-2 rounded mb-3 transition"
      >
        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
      </button>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center gap-2 bg-white border dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white w-full py-2 rounded transition"
      >
        <FaGoogle /> Continue with Google
      </button>
    </form>
  );
}
