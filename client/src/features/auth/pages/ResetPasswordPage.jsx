import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../../api/auth.api.js';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(params.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-sm animate-fadeUp">
        <h1 className="font-display text-2xl font-bold text-center">Set a new password</h1>
        <p className="text-sm text-slate-400 text-center mt-1 mb-6">Choose something strong this time.</p>

        <div className="card">
          {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm animate-shake">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input font-mono text-xs" placeholder="Reset token" value={token} onChange={(e) => setToken(e.target.value)} required />
            <input className="input" type="password" placeholder="New password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <input className="input" type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          <Link to="/login" className="text-primary-600 font-semibold">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}