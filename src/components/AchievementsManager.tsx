import { useState } from "react";
import { Plus, Trophy, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AchievementsManager() {
  const { achievements, createAchievement, deleteAchievement } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "star",
    pointsReward: 50,
    category: "milestone",
    rarity: "common",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "compliance", label: "Compliance" },
    { value: "teamwork", label: "Teamwork" },
    { value: "milestone", label: "Milestone" },
    { value: "special", label: "Special" },
  ];

  const rarities = [
    { value: "common", label: "Common", color: "from-gray-400 to-gray-500" },
    { value: "rare", label: "Rare", color: "from-blue-400 to-blue-600" },
    { value: "epic", label: "Epic", color: "from-purple-400 to-purple-600" },
    {
      value: "legendary",
      label: "Legendary",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createAchievement({
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        points: formData.pointsReward,
        category: formData.category,
        rarity: formData.rarity,
      });

      setFormData({
        title: "",
        description: "",
        icon: "star",
        pointsReward: 50,
        category: "milestone",
        rarity: "common",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating achievement:", error);
      alert("Failed to create achievement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      await deleteAchievement(id);
    } catch (error) {
      console.error("Error deleting achievement:", error);
      alert("Failed to delete achievement");
    }
  };

  const rarityColors = {
    common: "from-gray-400 to-gray-500",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Achievements Manager
          </h2>
          <p className="text-gray-600">
            Create and manage achievements for all users
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? "Cancel" : "New Achievement"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                  placeholder="Achievement name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Points Reward
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.pointsReward}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pointsReward: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                rows={3}
                placeholder="What is this achievement for?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Rarity
                </label>
                <select
                  value={formData.rarity}
                  onChange={(e) =>
                    setFormData({ ...formData, rarity: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                >
                  {rarities.map((rarity) => (
                    <option key={rarity.value} value={rarity.value}>
                      {rarity.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Achievement"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all border-2 border-gray-200"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                  rarityColors[achievement.rarity]
                } flex items-center justify-center flex-shrink-0`}
              >
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {achievement.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    {achievement.category}
                  </span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                    +{achievement.pointsReward} pts
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                      achievement.rarity === "legendary"
                        ? "bg-yellow-100 text-yellow-700"
                        : achievement.rarity === "epic"
                        ? "bg-purple-100 text-purple-700"
                        : achievement.rarity === "rare"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {achievement.rarity}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(achievement.id)}
              className="w-full mt-3 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {achievements.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Achievements Yet
          </h3>
          <p className="text-gray-600">
            Create your first achievement to get started!
          </p>
        </div>
      )}
    </div>
  );
}
