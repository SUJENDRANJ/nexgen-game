import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createConfetti, createSparkles } from '../lib/animations';
import AdminRules from './AdminRules';
import Leaderboard from './Leaderboard';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickAwardPoints, setQuickAwardPoints] = useState({});
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [employeesRes, requestsRes, allUsersRes] = await Promise.all([
        supabase
          .from('users')
          .select('*')
          .eq('role', 'employee')
          .order('points', { ascending: false }),
        supabase
          .from('reward_requests')
          .select('*, users(name, email), rewards(name, cost)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('users')
          .select('*', { count: 'exact' })
      ]);

      if (employeesRes.data) setEmployees(employeesRes.data);
      if (requestsRes.data) setPendingRequests(requestsRes.data);
      if (allUsersRes.count !== null) setTotalUsers(allUsersRes.count);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (request, buttonRef) => {
    try {
      const employee = employees.find((e) => e.id === request.employee_id);

      if (employee.points < request.rewards.cost) {
        alert('Employee does not have enough points!');
        return;
      }

      const newPoints = employee.points - request.rewards.cost;

      const [updateRequest, updateUser] = await Promise.all([
        supabase
          .from('reward_requests')
          .update({ status: 'approved', updated_at: new Date().toISOString() })
          .eq('id', request.id),
        supabase
          .from('users')
          .update({ points: newPoints })
          .eq('id', request.employee_id),
      ]);

      if (updateRequest.error) throw updateRequest.error;
      if (updateUser.error) throw updateUser.error;

      if (buttonRef) {
        createSparkles(buttonRef);
      }

      alert('Request approved successfully!');
      loadData();
    } catch (error) {
      alert('Error approving request: ' + error.message);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('reward_requests')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      alert('Request rejected');
      loadData();
    } catch (error) {
      alert('Error rejecting request: ' + error.message);
    }
  };

  const handleQuickAward = async (employeeId, points, buttonRef) => {
    if (!points || points === '' || points === 0) return;

    try {
      const employee = employees.find((e) => e.id === employeeId);
      const pointsToAdd = parseInt(points);
      const newPoints = Math.max(0, employee.points + pointsToAdd);

      const { error } = await supabase
        .from('users')
        .update({ points: newPoints })
        .eq('id', employeeId);

      if (error) throw error;

      if (buttonRef && pointsToAdd > 0) {
        createConfetti(document.body);
        createSparkles(buttonRef);
      }

      setQuickAwardPoints((prev) => ({ ...prev, [employeeId]: '' }));
      loadData();
    } catch (error) {
      alert('Error updating points: ' + error.message);
    }
  };

  const handleRemoveUser = async (employeeId) => {
    if (!confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;

      alert('User removed successfully!');
      loadData();
    } catch (error) {
      alert('Error removing user: ' + error.message);
    }
  };

  const quickAwardButtons = [
    { label: '+10', value: 10, color: '#4CAF50', icon: '⭐' },
    { label: '+25', value: 25, color: '#2196F3', icon: '✨' },
    { label: '+50', value: 50, color: '#FF9800', icon: '🌟' },
    { label: '+100', value: 100, color: '#E91E63', icon: '💎' },
    { label: '-10', value: -10, color: '#F44336', icon: '⬇️' },
    { label: '-25', value: -25, color: '#D32F2F', icon: '⬇️' },
  ];

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👑 Admin Control Center</h1>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'overview' ? styles.tabButtonActive : {}),
          }}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'rules' ? styles.tabButtonActive : {}),
          }}
        >
          📋 Manage Rules
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'leaderboard' ? styles.tabButtonActive : {}),
          }}
        >
          🏆 Leaderboard
        </button>
      </div>

      {activeTab === 'rules' && (
        <div style={styles.tabContent}>
          <AdminRules user={user} />
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div style={styles.tabContent}>
          <Leaderboard currentUserId={user.id} />
        </div>
      )}

      {activeTab === 'overview' && (
        <div style={styles.tabContent}>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <p style={styles.statLabel}>Total Users</p>
            <h3 style={styles.statValue}>{totalUsers}</h3>
          </div>
        </div>
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)' }}>
          <div style={styles.statIcon}>⏳</div>
          <div>
            <p style={styles.statLabel}>Pending Requests</p>
            <h3 style={styles.statValue}>{pendingRequests.length}</h3>
          </div>
        </div>
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' }}>
          <div style={styles.statIcon}>⭐</div>
          <div>
            <p style={styles.statLabel}>Total Points Awarded</p>
            <h3 style={styles.statValue}>{employees.reduce((sum, e) => sum + e.points, 0)}</h3>
          </div>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            🔔 Pending Requests
            <span style={styles.badge}>{pendingRequests.length}</span>
          </h2>
          <div style={styles.requestsList}>
            {pendingRequests.map((request) => (
              <div key={request.id} style={styles.requestCard}>
                <div style={styles.requestLeft}>
                  <div style={styles.requestIcon}>🎁</div>
                  <div>
                    <h3 style={styles.requestReward}>{request.rewards.name}</h3>
                    <p style={styles.requestEmployee}>
                      <strong>{request.users.name}</strong>
                    </p>
                    <p style={styles.requestCost}>⭐ {request.rewards.cost} points</p>
                    <p style={styles.requestDate}>
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div style={styles.requestActions}>
                  <button
                    onClick={(e) => handleApproveRequest(request, e.currentTarget)}
                    style={styles.approveButton}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    style={styles.rejectButton}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🏆 Employee Leaderboard</h2>
        <div style={styles.employeesGrid}>
          {employees.map((emp, index) => (
            <div
              key={emp.id}
              style={{
                ...styles.employeeCard,
                ...(index < 3 ? { borderTop: `4px solid ${['#FFD700', '#C0C0C0', '#CD7F32'][index]}` } : {}),
              }}
            >
              <div style={styles.employeeHeader}>
                <div style={styles.employeeRank}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div style={styles.employeeInfo}>
                  <h3 style={styles.employeeName}>{emp.name}</h3>
                  <p style={styles.employeeEmail}>{emp.email}</p>
                </div>
              </div>
              <div style={styles.employeePoints}>
                <span style={styles.pointsLabel}>⭐ {emp.points}</span>
                <span style={styles.pointsText}>points</span>
              </div>
              <div style={styles.quickAwardSection}>
                <p style={styles.quickAwardLabel}>Manage Points:</p>
                <div style={styles.quickAwardButtons}>
                  {quickAwardButtons.map((btn) => (
                    <button
                      key={btn.value}
                      onClick={(e) => handleQuickAward(emp.id, btn.value, e.currentTarget)}
                      style={{
                        ...styles.quickAwardBtn,
                        backgroundColor: btn.color,
                      }}
                      title={`${btn.value > 0 ? 'Add' : 'Remove'} ${Math.abs(btn.value)} points`}
                    >
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>
                <div style={styles.customAwardSection}>
                  <input
                    type="number"
                    value={quickAwardPoints[emp.id] || ''}
                    onChange={(e) =>
                      setQuickAwardPoints((prev) => ({
                        ...prev,
                        [emp.id]: e.target.value,
                      }))
                    }
                    placeholder="Custom (+/-)"
                    style={styles.customInput}
                  />
                  <button
                    onClick={(e) =>
                      handleQuickAward(emp.id, quickAwardPoints[emp.id], e.currentTarget)
                    }
                    disabled={!quickAwardPoints[emp.id] || quickAwardPoints[emp.id] == 0}
                    style={{
                      ...styles.customAwardBtn,
                      ...((!quickAwardPoints[emp.id] || quickAwardPoints[emp.id] == 0) && styles.disabledBtn),
                    }}
                  >
                    🎯 Update
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveUser(emp.id)}
                  style={styles.removeUserBtn}
                >
                  🗑️ Remove User
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    borderBottom: '2px solid rgba(255,255,255,0.2)',
    paddingBottom: '12px',
  },
  tabButton: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)',
    border: 'none',
    borderRadius: '12px 12px 0 0',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabButtonActive: {
    background: 'rgba(255,255,255,0.95)',
    color: '#667eea',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
  },
  tabContent: {
    background: 'rgba(255,255,255,0.95)',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#fff',
    gap: '16px',
  },
  spinner: {
    fontSize: '48px',
    animation: 'spin 2s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  logoutButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    padding: '24px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  statIcon: {
    fontSize: '48px',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
  },
  statLabel: {
    fontSize: '14px',
    color: '#fff',
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  badge: {
    backgroundColor: '#FF6B6B',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  requestCard: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    transition: 'transform 0.2s ease',
  },
  requestLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flex: 1,
  },
  requestIcon: {
    fontSize: '48px',
  },
  requestReward: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '4px',
  },
  requestEmployee: {
    fontSize: '16px',
    color: '#4a5568',
    marginBottom: '4px',
  },
  requestCost: {
    fontSize: '16px',
    color: '#667eea',
    fontWeight: '700',
    marginBottom: '4px',
  },
  requestDate: {
    fontSize: '13px',
    color: '#a0aec0',
  },
  requestActions: {
    display: 'flex',
    gap: '12px',
  },
  approveButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 187, 106, 0.4)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  rejectButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(239, 83, 80, 0.4)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  employeesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  employeeCard: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
  },
  employeeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  employeeRank: {
    fontSize: '32px',
    fontWeight: '800',
    minWidth: '50px',
    textAlign: 'center',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '4px',
  },
  employeeEmail: {
    fontSize: '14px',
    color: '#718096',
  },
  employeePoints: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#F7FAFC',
    borderRadius: '12px',
  },
  pointsLabel: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#667eea',
  },
  pointsText: {
    fontSize: '14px',
    color: '#718096',
    fontWeight: '600',
  },
  quickAwardSection: {
    borderTop: '2px solid #E2E8F0',
    paddingTop: '16px',
  },
  quickAwardLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#4a5568',
    marginBottom: '12px',
  },
  quickAwardButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '12px',
  },
  quickAwardBtn: {
    padding: '10px',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  customAwardSection: {
    display: 'flex',
    gap: '8px',
  },
  customInput: {
    flex: 1,
    padding: '10px',
    border: '2px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  customAwardBtn: {
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  disabledBtn: {
    background: '#CBD5E0',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  removeUserBtn: {
    marginTop: '12px',
    padding: '10px',
    background: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(239, 83, 80, 0.4)',
    transition: 'all 0.3s ease',
    width: '100%',
  },
};
