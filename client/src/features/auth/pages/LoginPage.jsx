import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

const QUICK = [
  { label: 'TPO', email: 'tpo@college.edu' },
  { label: 'Student', email: 'student2@college.edu' },
  { label: 'Recruiter', email: 'hr@infosys.com' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="bg-gradient-to-br from-primary-600 to-purple-600 text-white p-6 sm:p-10 lg:p-12 lg:w-[55%] flex flex-col justify-between">
        <div className="flex items-center gap-2 text-lg sm:text-xl font-display font-bold">
          <span className="text-2xl sm:text-3xl">🎓</span> PlacementHub
        </div>
        <div className="py-8 lg:py-0">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            From campus to career, simplified.
          </h1>
          <p className="mt-3 text-white/80 text-sm sm:text-base">One platform for students, placement cell and recruiters.</p>
          <div className="mt-6 lg:mt-8 flex gap-6 sm:gap-10">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold">26</div>
              <div className="text-xs sm:text-sm text-white/70">Accounts ready</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold">5</div>
              <div className="text-xs sm:text-sm text-white/70">Companies</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold">100%</div>
              <div className="text-xs sm:text-sm text-white/70">Paperless</div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block text-sm text-white/60">Placement Cell · Batch 2026</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-sm animate-fadeUp">
          <h2 className="font-display text-xl sm:text-2xl font-bold">Welcome back 👋</h2>
          <p className="text-sm text-slate-400 mt-1 mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" type="email" placeholder="College email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div>
              <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className="text-right mt-1"><Link to="/forgot-password" className="text-xs text-primary-600 font-semibold">Forgot password?</Link></div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-500">
            New here? <Link to="/register" className="text-primary-600 font-semibold">Create an account</Link>
          </div>

          <div className="mt-5 text-xs text-slate-400">Demo accounts - password: password123</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {QUICK.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => { setEmail(q.email); setPassword('password123'); }}
                className="px-2 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:border-primary-600 hover:text-primary-600 transition"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}