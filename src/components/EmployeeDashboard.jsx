import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createConfetti, createSparkles } from '../lib/animations';
import EmployeeRules from './EmployeeRules';
import Leaderboard from './Leaderboard';

export default function EmployeeDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [rewards, setRewards] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rewardsRes, requestsRes, userRes, leaderboardRes] = await Promise.all([
        supabase.from('rewards').select('*').order('cost', { ascending: true }),
        supabase
          .from('reward_requests')
          .select('*, rewards(*)')
          .eq('employee_id', user.id)
          .order('created_at', { ascending: false }),
        supabase.from('users').select('*').eq('id', user.id).maybeSingle(),
        supabase
          .from('users')
          .select('*')
          .eq('role', 'employee')
          .order('points', { ascending: false })
          .limit(10),
      ]);

      if (rewardsRes.data) setRewards(rewardsRes.data);
      if (requestsRes.data) setMyRequests(requestsRes.data);
      if (userRes.data) setCurrentUser(userRes.data);
      if (leaderboardRes.data) setLeaderboard(leaderboardRes.data);
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
        return '#FFA726';
      case 'approved':
        return '#66BB6A';
      case 'rejected':
        return '#EF5350';
      default:
        return '#BDBDBD';
    }
  };

  const getLevel = (points) => {
    if (points >= 1000) return { level: 5, name: 'Legend', color: '#FFD700', icon: '👑' };
    if (points >= 500) return { level: 4, name: 'Master', color: '#E91E63', icon: '💎' };
    if (points >= 250) return { level: 3, name: 'Expert', color: '#9C27B0', icon: '🌟' };
    if (points >= 100) return { level: 2, name: 'Pro', color: '#2196F3', icon: '⚡' };
    return { level: 1, name: 'Beginner', color: '#4CAF50', icon: '🎯' };
  };

  const getNextLevelInfo = (points) => {
    const thresholds = [100, 250, 500, 1000];
    for (const threshold of thresholds) {
      if (points < threshold) {
        return { nextLevel: threshold, progress: (points / threshold) * 100 };
      }
    }
    return { nextLevel: 1000, progress: 100 };
  };

  const getBadges = (points, requestsCount) => {
    const badges = [];
    if (points >= 100) badges.push({ name: 'First Century', icon: '🏆', color: '#FFB74D' });
    if (points >= 500) badges.push({ name: 'Half K Club', icon: '🎖️', color: '#BA68C8' });
    if (requestsCount >= 5) badges.push({ name: 'Reward Hunter', icon: '🎯', color: '#4FC3F7' });
    if (requestsCount >= 10) badges.push({ name: 'Shopping Spree', icon: '🛍️', color: '#81C784' });
    return badges;
  };

  const currentLevel = getLevel(currentUser.points);
  const nextLevelInfo = getNextLevelInfo(currentUser.points);
  const userBadges = getBadges(currentUser.points, myRequests.length);
  const userRank = leaderboard.findIndex((u) => u.id === currentUser.id) + 1;

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p>Loading your game...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎮 Player Dashboard</h1>
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
          🎮 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'rules' ? styles.tabButtonActive : {}),
          }}
        >
          📄 Rules
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
          <EmployeeRules />
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div style={styles.tabContent}>
          <Leaderboard currentUserId={user.id} />
        </div>
      )}

      {activeTab === 'overview' && (
        <div style={styles.tabContent}>

      <div style={styles.topSection}>
        <div style={styles.levelCard}>
          <div style={styles.levelBadge} data-level-badge>
            <span style={{ ...styles.levelIcon, color: currentLevel.color }}>
              {currentLevel.icon}
            </span>
            <div>
              <p style={styles.levelLabel}>Level {currentLevel.level}</p>
              <p style={{ ...styles.levelName, color: currentLevel.color }}>{currentLevel.name}</p>
            </div>
          </div>

          <div style={styles.progressSection}>
            <div style={styles.progressInfo}>
              <span style={styles.progressLabel}>Next Level</span>
              <span style={styles.progressValue}>
                {currentUser.points} / {nextLevelInfo.nextLevel}
              </span>
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${nextLevelInfo.progress}%`,
                  background: `linear-gradient(90deg, ${currentLevel.color}, #FF6B6B)`,
                }}
              />
            </div>
          </div>
        </div>

        <div style={styles.pointsCard}>
          <div style={styles.pointsContent}>
            <span style={styles.pointsIcon}>⭐</span>
            <div>
              <p style={styles.pointsLabel}>Your Points</p>
              <h2 style={styles.pointsValue}>{currentUser.points}</h2>
            </div>
          </div>
          {userRank > 0 && (
            <div style={styles.rankBadge}>
              <span style={styles.rankIcon}>🏅</span>
              <span style={styles.rankText}>Rank #{userRank}</span>
            </div>
          )}
        </div>
      </div>

      {userBadges.length > 0 && (
        <div style={styles.badgesSection}>
          <h3 style={styles.badgesTitle}>🎖️ Your Badges</h3>
          <div style={styles.badgesGrid}>
            {userBadges.map((badge, index) => (
              <div key={index} style={{ ...styles.badge, borderColor: badge.color }}>
                <span style={styles.badgeIcon}>{badge.icon}</span>
                <span style={styles.badgeName}>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎁 Reward Shop</h2>
        <div style={styles.rewardsGrid}>
          {rewards.map((reward) => (
            <div key={reward.id} style={styles.rewardCard}>
              <div style={styles.rewardHeader}>
                <span style={styles.rewardEmoji}>🎁</span>
                {reward.stock <= 3 && reward.stock > 0 && (
                  <span style={styles.lowStockBadge}>Low Stock!</span>
                )}
              </div>
              <h3 style={styles.rewardName}>{reward.name}</h3>
              <p style={styles.rewardDescription}>{reward.description}</p>
              <div style={styles.rewardFooter}>
                <div style={styles.rewardInfo}>
                  <span style={styles.rewardCost}>⭐ {reward.cost} pts</span>
                  <span style={styles.rewardStock}>
                    {reward.stock > 0 ? `${reward.stock} left` : 'Out of stock'}
                  </span>
                </div>
                <button
                  onClick={() => handleRequestReward(reward)}
                  disabled={currentUser.points < reward.cost || reward.stock <= 0}
                  style={{
                    ...styles.requestButton,
                    ...(currentUser.points < reward.cost || reward.stock <= 0
                      ? styles.requestButtonDisabled
                      : styles.requestButtonEnabled),
                  }}
                >
                  {currentUser.points < reward.cost ? '🔒 Locked' : '🛒 Claim'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📋 My Requests</h2>
        <div style={styles.requestsList}>
          {myRequests.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🎯</span>
              <p style={styles.emptyText}>No requests yet. Start claiming rewards!</p>
            </div>
          ) : (
            myRequests.map((request) => (
              <div key={request.id} style={styles.requestItem}>
                <div style={styles.requestLeft}>
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
                  {request.status === 'approved' && '✅ '}
                  {request.status === 'rejected' && '❌ '}
                  {request.status === 'pending' && '⏳ '}
                  {request.status.toUpperCase()}
                </span>
              </div>
            ))
          )}
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
  topSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  levelCard: {
    background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    padding: '24px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  levelBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  levelIcon: {
    fontSize: '48px',
  },
  levelLabel: {
    fontSize: '14px',
    color: '#fff',
    fontWeight: '600',
    opacity: 0.9,
  },
  levelName: {
    fontSize: '24px',
    fontWeight: '800',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  progressSection: {
    marginTop: '16px',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  progressLabel: {
    fontSize: '14px',
    color: '#fff',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: '14px',
    color: '#fff',
    fontWeight: '700',
  },
  progressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
  },
  progressFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
  },
  pointsCard: {
    background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    padding: '24px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  pointsContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  pointsIcon: {
    fontSize: '60px',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
    animation: 'pulse 2s infinite',
  },
  pointsLabel: {
    fontSize: '16px',
    color: '#fff',
    fontWeight: '600',
    opacity: 0.9,
  },
  pointsValue: {
    fontSize: '48px',
    fontWeight: '900',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  rankBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '12px',
    alignSelf: 'flex-start',
  },
  rankIcon: {
    fontSize: '24px',
  },
  rankText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
  },
  badgesSection: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '24px',
    borderRadius: '20px',
    marginBottom: '32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  badgesTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '16px',
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
  },
  badge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '3px solid',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
  },
  badgeIcon: {
    fontSize: '36px',
  },
  badgeName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
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
  },
  rewardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  rewardCard: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  rewardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  rewardEmoji: {
    fontSize: '40px',
  },
  lowStockBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#FF6B6B',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  rewardName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
  },
  rewardDescription: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '16px',
    flex: 1,
    lineHeight: '1.5',
  },
  rewardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  rewardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  rewardCost: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#667eea',
  },
  rewardStock: {
    fontSize: '13px',
    color: '#a0aec0',
    fontWeight: '600',
  },
  requestButton: {
    padding: '12px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  requestButtonEnabled: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  requestButtonDisabled: {
    background: '#cbd5e0',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  leaderboardCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  leaderboardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
  },
  leaderboardItemHighlight: {
    backgroundColor: '#FFF9C4',
    borderLeft: '4px solid #FFD700',
  },
  leaderboardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  leaderboardRank: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#2d3748',
    minWidth: '40px',
  },
  rank1: {
    fontSize: '28px',
  },
  rank2: {
    fontSize: '26px',
  },
  rank3: {
    fontSize: '24px',
  },
  leaderboardName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
  },
  youBadge: {
    marginLeft: '8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#667eea',
  },
  leaderboardPoints: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#667eea',
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  requestItem: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
  },
  requestLeft: {
    flex: 1,
  },
  requestName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '4px',
  },
  requestDate: {
    fontSize: '13px',
    color: '#a0aec0',
    fontWeight: '500',
  },
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'white',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '60px 20px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: '16px',
  },
  emptyIcon: {
    fontSize: '64px',
  },
  emptyText: {
    textAlign: 'center',
    color: '#718096',
    fontSize: '16px',
    fontWeight: '600',
  },
};
