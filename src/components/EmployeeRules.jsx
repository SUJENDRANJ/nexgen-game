import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { slideIn } from '../lib/animations';

export default function EmployeeRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rules')
        .select('*')
        .order('points', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (err) {
      setError('Failed to load rules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">How to Earn Points</h2>
        <p className="text-gray-600">Complete these activities to earn points and redeem rewards</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {rules.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No rules available yet. Check back soon!</p>
          </div>
        ) : (
          rules.map((rule, index) => (
            <div
              key={rule.id}
              className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.01] cursor-default"
              style={{ ...slideIn, animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                  +{rule.points}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{rule.title}</h3>
                  <p className="text-gray-600">{rule.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {rule.points} points
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {rules.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Tips:</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Complete tasks consistently to build up your points</li>
            <li>• Higher point activities offer greater rewards</li>
            <li>• Check the rewards catalog to see what you can redeem</li>
          </ul>
        </div>
      )}
    </div>
  );
}
