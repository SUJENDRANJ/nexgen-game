import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { slideIn } from '../lib/animations';

export default function Leaderboard({ currentUserId }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, points, role')
        .eq('role', 'employee')
        .order('points', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-200 to-gray-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Leaderboard</h2>
        <p className="text-gray-600">Top performers ranked by points earned</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {employees.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No employees found.</p>
          </div>
        ) : (
          employees.map((employee, index) => {
            const rank = index + 1;
            const rankIcon = getRankIcon(rank);
            const isCurrentUser = employee.id === currentUserId;

            return (
              <div
                key={employee.id}
                className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all ${
                  isCurrentUser ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ ...slideIn, animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${getRankColor(rank)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                    {rankIcon || `#${rank}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {employee.name}
                      </h3>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          You
                        </span>
                      )}
                      {employee.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{employee.email}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      {employee.points}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {employees.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🏆</span>
            <h3 className="font-semibold text-gray-800">Leaderboard Stats</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {employees.length}
              </div>
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {employees[0]?.points || 0}
              </div>
              <div className="text-sm text-gray-600">Top Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(employees.reduce((sum, e) => sum + e.points, 0) / employees.length) || 0}
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
