import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../../api/auth.api.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [devToken, setDevToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMsg(res.message || 'Check your email for the reset link');
      if (res.data?.devToken) setDevToken(res.data.devToken);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-sm animate-fadeUp">
        <h1 className="font-display text-2xl font-bold text-center">Forgot password?</h1>
        <p className="text-sm text-slate-400 text-center mt-1 mb-6">
          Enter your email and we will send a reset token.
        </p>

        <div className="card">
          {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm animate-shake">{error}</div>}
          {msg && <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm animate-popIn">{msg}</div>}
          {devToken && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 text-xs">
              <b>Dev mode:</b> email service not configured. Your reset token:
              <div className="mt-1 font-mono break-all select-all">{devToken}</div>
              <Link to={'/reset-password?token=' + devToken} className="text-primary-600 font-semibold underline mt-1 inline-block">
                Click here to reset now
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Token'}</button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          <Link to="/login" className="text-primary-600 font-semibold">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}