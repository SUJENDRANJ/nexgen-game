import { useState } from 'react';

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await onLogin(email, password, isSignUp, name);
      if (isSignUp) {
        setSuccess('Account created successfully! You can now sign in.');
        setIsSignUp(false);
        setName('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Office Gamification</h1>
        <p style={styles.subtitle}>{isSignUp ? 'Create your account' : 'Sign in to your account'}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
                placeholder="Your full name"
              />
            </div>
          )}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="your.email@company.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={styles.toggle}>
          <p style={styles.toggleText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              style={styles.toggleButton}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {!isSignUp && (
          <div style={styles.demo}>
            <p style={styles.demoTitle}>Demo Accounts:</p>
            <p style={styles.demoText}>Create a new account or use existing credentials if you have them</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#718096',
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2d3748',
  },
  input: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '8px',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    borderRadius: '8px',
    fontSize: '14px',
  },
  success: {
    padding: '12px',
    backgroundColor: '#c6f6d5',
    color: '#22543d',
    borderRadius: '8px',
    fontSize: '14px',
  },
  toggle: {
    marginTop: '16px',
    textAlign: 'center',
  },
  toggleText: {
    color: '#4a5568',
    fontSize: '14px',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  },
  demo: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    fontSize: '12px',
  },
  demoTitle: {
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  demoText: {
    color: '#4a5568',
    marginBottom: '4px',
  },
};
