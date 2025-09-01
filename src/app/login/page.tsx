'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/auth/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="bg-white border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Admin Login</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}