import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [employeesRes, requestsRes] = await Promise.all([
        supabase
          .from('users')
          .select('*')
          .eq('role', 'employee')
          .order('name', { ascending: true }),
        supabase
          .from('reward_requests')
          .select('*, users(name, email), rewards(name, cost)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
      ]);

      if (employeesRes.data) setEmployees(employeesRes.data);
      if (requestsRes.data) setPendingRequests(requestsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (request) => {
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

  const handleAwardPoints = async () => {
    if (!selectedEmployee || !pointsToAdd || pointsToAdd <= 0) {
      alert('Please select an employee and enter valid points');
      return;
    }

    try {
      const employee = employees.find((e) => e.id === selectedEmployee);
      const newPoints = employee.points + parseInt(pointsToAdd);

      const { error } = await supabase
        .from('users')
        .update({ points: newPoints })
        .eq('id', selectedEmployee);

      if (error) throw error;

      alert(`Successfully awarded ${pointsToAdd} points!`);
      setSelectedEmployee(null);
      setPointsToAdd('');
      loadData();
    } catch (error) {
      alert('Error awarding points: ' + error.message);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Award Points</h2>
        <div style={styles.awardCard}>
          <div style={styles.awardForm}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Employee</label>
              <select
                value={selectedEmployee || ''}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                style={styles.select}
              >
                <option value="">Choose employee...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.points} pts)
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Points to Award</label>
              <input
                type="number"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(e.target.value)}
                min="1"
                style={styles.input}
                placeholder="Enter points"
              />
            </div>

            <button onClick={handleAwardPoints} style={styles.awardButton}>
              Award Points
            </button>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Pending Requests ({pendingRequests.length})
        </h2>
        <div style={styles.requestsList}>
          {pendingRequests.length === 0 ? (
            <p style={styles.emptyText}>No pending requests</p>
          ) : (
            pendingRequests.map((request) => (
              <div key={request.id} style={styles.requestCard}>
                <div style={styles.requestInfo}>
                  <h3 style={styles.requestReward}>{request.rewards.name}</h3>
                  <p style={styles.requestEmployee}>
                    Requested by: {request.users.name}
                  </p>
                  <p style={styles.requestCost}>Cost: {request.rewards.cost} points</p>
                  <p style={styles.requestDate}>
                    {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>
                <div style={styles.requestActions}>
                  <button
                    onClick={() => handleApproveRequest(request)}
                    style={styles.approveButton}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    style={styles.rejectButton}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>All Employees</h2>
        <div style={styles.employeesGrid}>
          {employees.map((emp) => (
            <div key={emp.id} style={styles.employeeCard}>
              <h3 style={styles.employeeName}>{emp.name}</h3>
              <p style={styles.employeeEmail}>{emp.email}</p>
              <p style={styles.employeePoints}>{emp.points} points</p>
            </div>
          ))}
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
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '16px',
  },
  awardCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  awardForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '16px',
    alignItems: 'end',
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
  select: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  input: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
  },
  awardButton: {
    padding: '12px 24px',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    height: 'fit-content',
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  requestCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestInfo: {
    flex: 1,
  },
  requestReward: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  requestEmployee: {
    fontSize: '14px',
    color: '#4a5568',
    marginBottom: '4px',
  },
  requestCost: {
    fontSize: '14px',
    color: '#667eea',
    fontWeight: '600',
    marginBottom: '4px',
  },
  requestDate: {
    fontSize: '12px',
    color: '#a0aec0',
  },
  requestActions: {
    display: 'flex',
    gap: '12px',
  },
  approveButton: {
    padding: '10px 20px',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  rejectButton: {
    padding: '10px 20px',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  employeesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
  },
  employeeCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  employeeName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  employeeEmail: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '8px',
  },
  employeePoints: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
  },
  emptyText: {
    textAlign: 'center',
    color: '#a0aec0',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
};
