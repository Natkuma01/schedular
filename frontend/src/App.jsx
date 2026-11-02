import { useEffect, useState } from 'react';
import PlannerApp from './PlannerApp.jsx';
import { Cat } from './components/Icons.jsx';
import { api, hasSession, login, logout, register } from './lib/api.js';
import './auth.css';

function Login({ onAuthenticated }) {
  const [signup, setSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async event => {
    event.preventDefault(); setBusy(true); setError('');
    try { if (signup) await register(username, email, password); else await login(username, password); await onAuthenticated(); }
    catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  };
  return <main className="login-page"><form className="login-card" onSubmit={submit}>
    <div className="login-mascot"><Cat /></div><h1>{signup ? 'Create your account' : 'Welcome back'}</h1><p>{signup ? 'Start planning your week in a few seconds.' : 'Sign in to open your planner.'}</p>
    {error && <div className="login-error" role="alert">{error}</div>}
    <label htmlFor="username">Username</label><input id="username" autoComplete="username" autoFocus value={username} onChange={e => setUsername(e.target.value)} />
    {signup && <><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></>}
    <label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
    <button className="login-submit" disabled={busy || !username || !password || (signup && !email)}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button>
    <button type="button" className="auth-switch" onClick={() => { setSignup(value => !value); setError(''); }}>{signup ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>
  </form></main>;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [plannerState, setPlannerState] = useState(null);
  const [loading, setLoading] = useState(true);
  const authenticate = async () => { const state = await api('/planner/'); setUser(state.user); setPlannerState(state); setLoading(false); };
  useEffect(() => { if (hasSession()) authenticate().catch(() => setLoading(false)); else setLoading(false); }, []);
  if (loading) return <main className="login-page"><div className="login-card"><div className="login-mascot"><Cat /></div><h1>Loading…</h1></div></main>;
  if (!user) return <Login onAuthenticated={authenticate} />;
  return <><PlannerApp initialState={plannerState} /><button className="logout-button" onClick={async () => { await logout(); setUser(null); setPlannerState(null); }}>Sign out</button></>;
}
