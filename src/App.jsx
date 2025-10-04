import { useState, useEffect } from 'react';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import { signIn, signUp, signOut, getCurrentUser, onAuthStateChange } from './lib/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData?.profile || null);
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (email, password, isSignUp, name) => {
    if (isSignUp) {
      const { profile } = await signUp(email, password, name);
      setUser(profile);
      return profile;
    } else {
      const { profile } = await signIn(email, password);
      setUser(profile);
      return profile;
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleAuth} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return <EmployeeDashboard user={user} onLogout={handleLogout} />;
}
