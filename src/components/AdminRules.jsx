import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { slideIn } from '../lib/animations';

export default function AdminRules({ user }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 0
  });
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (err) {
      setError('Failed to load rules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingRule) {
        const { error } = await supabase
          .from('rules')
          .update({
            title: formData.title,
            description: formData.description,
            points: parseInt(formData.points)
          })
          .eq('id', editingRule.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('rules')
          .insert([{
            title: formData.title,
            description: formData.description,
            points: parseInt(formData.points),
            created_by: user.id
          }]);

        if (error) throw error;
      }

      setFormData({ title: '', description: '', points: 0 });
      setShowForm(false);
      setEditingRule(null);
      fetchRules();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      title: rule.title,
      description: rule.description,
      points: rule.points
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      const { error } = await supabase
        .from('rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRules();
    } catch (err) {
      setError('Failed to delete rule');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', points: 0 });
    setEditingRule(null);
    setShowForm(false);
    setError('');
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Rules</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add New Rule
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md" style={slideIn}>
          <h3 className="text-xl font-semibold mb-4">
            {editingRule ? 'Edit Rule' : 'Create New Rule'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Early Arrival"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Describe the rule and how to earn points..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter point value"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {rules.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No rules created yet. Add your first rule!</p>
          </div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              style={slideIn}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{rule.title}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      +{rule.points} pts
                    </span>
                  </div>
                  <p className="text-gray-600">{rule.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Created {new Date(rule.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
