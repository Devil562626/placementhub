import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../../api/auth.api.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('STUDENT');
  const [form, setForm] = useState({
    name: '', email: '', password: '', rollNo: '', branch: 'CSE',
    gradYear: '2026', cgpa: '', companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      };
      if (role === 'STUDENT') {
        body.rollNo = form.rollNo;
        body.branch = form.branch;
        body.gradYear = Number(form.gradYear);
        if (form.cgpa) body.cgpa = Number(form.cgpa);
      }
      if (role === 'RECRUITER') body.companyName = form.companyName;

      await registerUser(body);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md animate-fadeUp">
        <div className="text-center mb-6">
          <span className="text-4xl">🎓</span>
          <h1 className="font-display text-2xl font-bold mt-2">Create your account</h1>
          <p className="text-sm text-slate-400">Join PlacementHub</p>
        </div>

        <div className="card">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {['STUDENT', 'RECRUITER'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2.5 rounded-lg text-sm font-semibold transition ${role === r ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {r === 'STUDENT' ? 'Student' : 'Recruiter'}
              </button>
            ))}
          </div>

          {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm animate-shake">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" placeholder="Full name" value={form.name} onChange={set('name')} required />
            <input className="input" type="email" placeholder={role === 'STUDENT' ? 'College email (@college.edu)' : 'Work email'} value={form.email} onChange={set('email')} required />
            <input className="input" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={set('password')} required minLength={6} />

            {role === 'STUDENT' && (
              <>
                <input className="input" placeholder="Roll number (e.g. 22CSE099)" value={form.rollNo} onChange={set('rollNo')} required />
                <div className="grid grid-cols-3 gap-2">
                  <select className="input" value={form.branch} onChange={set('branch')}>
                    {['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'].map((b) => <option key={b}>{b}</option>)}
                  </select>
                  <input className="input" type="number" placeholder="Year" value={form.gradYear} onChange={set('gradYear')} required />
                  <input className="input" type="number" step="0.01" min="0" max="10" placeholder="CGPA" value={form.cgpa} onChange={set('cgpa')} />
                </div>
              </>
            )}

            {role === 'RECRUITER' && (
              <input className="input" placeholder="Company name" value={form.companyName} onChange={set('companyName')} required />
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-400">
            TPO accounts are created by the placement cell administrator.
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <Link to="/login" className="text-primary-600 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}