import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function EmployeeDashboard({ user, onLogout }) {
  const [rewards, setRewards] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rewardsRes, requestsRes, userRes] = await Promise.all([
        supabase.from('rewards').select('*').order('cost', { ascending: true }),
        supabase
          .from('reward_requests')
          .select('*, rewards(*)')
          .eq('employee_id', user.id)
          .order('created_at', { ascending: false }),
        supabase.from('users').select('*').eq('id', user.id).maybeSingle(),
      ]);

      if (rewardsRes.data) setRewards(rewardsRes.data);
      if (requestsRes.data) setMyRequests(requestsRes.data);
      if (userRes.data) setCurrentUser(userRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReward = async (reward) => {
    if (currentUser.points < reward.cost) {
      alert('Not enough points!');
      return;
    }

    if (reward.stock <= 0) {
      alert('Out of stock!');
      return;
    }

    try {
      const { error } = await supabase.from('reward_requests').insert({
        employee_id: user.id,
        reward_id: reward.id,
        status: 'pending',
      });

      if (error) throw error;

      alert('Reward request submitted successfully!');
      loadData();
    } catch (error) {
      alert('Error submitting request: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f6ad55';
      case 'approved':
        return '#48bb78';
      case 'rejected':
        return '#f56565';
      default:
        return '#a0aec0';
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Employee Dashboard</h1>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.pointsCard}>
        <div style={styles.pointsIcon}>⭐</div>
        <div>
          <p style={styles.pointsLabel}>Your Points</p>
          <h2 style={styles.pointsValue}>{currentUser.points}</h2>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Available Rewards</h2>
        <div style={styles.rewardsGrid}>
          {rewards.map((reward) => (
            <div key={reward.id} style={styles.rewardCard}>
              <h3 style={styles.rewardName}>{reward.name}</h3>
              <p style={styles.rewardDescription}>{reward.description}</p>
              <div style={styles.rewardFooter}>
                <div style={styles.rewardInfo}>
                  <span style={styles.rewardCost}>{reward.cost} pts</span>
                  <span style={styles.rewardStock}>Stock: {reward.stock}</span>
                </div>
                <button
                  onClick={() => handleRequestReward(reward)}
                  disabled={
                    currentUser.points < reward.cost || reward.stock <= 0
                  }
                  style={{
                    ...styles.requestButton,
                    ...(currentUser.points < reward.cost || reward.stock <= 0
                      ? styles.requestButtonDisabled
                      : {}),
                  }}
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>My Requests</h2>
        <div style={styles.requestsList}>
          {myRequests.length === 0 ? (
            <p style={styles.emptyText}>No requests yet</p>
          ) : (
            myRequests.map((request) => (
              <div key={request.id} style={styles.requestItem}>
                <div>
                  <h4 style={styles.requestName}>{request.rewards.name}</h4>
                  <p style={styles.requestDate}>
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(request.status),
                  }}
                >
                  {request.status.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    padding: '24px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#4a5568',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a202c',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  pointsCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    marginBottom: '32px',
  },
  pointsIcon: {
    fontSize: '48px',
  },
  pointsLabel: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '4px',
  },
  pointsValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#2d3748',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '16px',
  },
  rewardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  rewardCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  rewardName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  rewardDescription: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '16px',
    flex: 1,
  },
  rewardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  rewardCost: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#667eea',
  },
  rewardStock: {
    fontSize: '12px',
    color: '#a0aec0',
  },
  requestButton: {
    padding: '8px 16px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  requestButtonDisabled: {
    backgroundColor: '#cbd5e0',
    cursor: 'not-allowed',
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  requestItem: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '4px',
  },
  requestDate: {
    fontSize: '12px',
    color: '#a0aec0',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  emptyText: {
    textAlign: 'center',
    color: '#a0aec0',
    padding: '40px',
  },
};
