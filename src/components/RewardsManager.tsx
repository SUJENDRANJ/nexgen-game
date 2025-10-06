import { useState } from "react";
import {
  Plus,
  Gift,
  X,
  Clock,
  Star,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function RewardsManager() {
  const { rewards, createReward, deleteReward } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pointsCost: 100,
    category: "normal_card",
    imageUrl: "",
    stockQuantity: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    {
      value: "special_card",
      label: "Special Card",
      icon: Clock,
      color: "from-blue-500 to-blue-700",
    },
    // {
    //   value: "perks",
    //   label: "Perks",
    //   icon: Star,
    //   color: "from-purple-500 to-purple-700",
    // },
    {
      value: "premium_card",
      label: "Premium Card",
      icon: Gift,
      color: "from-pink-500 to-pink-700",
    },
    {
      value: "normal_card",
      label: "Normal Card",
      icon: Sparkles,
      color: "from-orange-500 to-red-600",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createReward({
        name: formData.title,
        description: formData.description,
        cost: formData.pointsCost,
        icon: "Gift",
        imageUrl: formData.imageUrl,
        category: formData.category,
        stock: formData.stockQuantity || 999,
      });

      setFormData({
        title: "",
        description: "",
        pointsCost: 100,
        category: "normal_card",
        imageUrl: "",
        stockQuantity: 10,
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating reward:", error);
      alert("Failed to create reward");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reward?")) return;

    try {
      await deleteReward(id);
    } catch (error) {
      console.error("Error deleting reward:", error);
      alert("Failed to delete reward");
    }
  };

  const categoryColors = {
    special_card: "from-blue-500 to-blue-700",
    premium_card: "from-pink-500 to-pink-700",
    normal_card: "from-orange-500 to-red-600",
  };

  const categoryIcons = {
    special_card: Clock,
    premium_card: Sparkles,
    normal_card: Gift,
    // experiences: Star,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Rewards Manager</h2>
          <p className="text-gray-600">
            Create and manage rewards for the marketplace
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? "Cancel" : "New Reward"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-200">
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:outline-none"
                  placeholder="Reward name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Points Cost
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.pointsCost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pointsCost: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:outline-none"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:outline-none"
                rows={3}
                placeholder="What is this reward?"
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:outline-none"
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
                  Stock Quantity (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:outline-none"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Reward"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => {
          const Icon =
            categoryIcons[reward.category as keyof typeof categoryIcons] ||
            Gift;
          const gradient =
            categoryColors[reward.category as keyof typeof categoryColors] ||
            "from-yellow-400 to-orange-600";

          return (
            <div
              key={reward.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-gray-200 overflow-hidden"
            >
              <div
                className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
              >
                {reward.imageUrl ? (
                  <img
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon className="w-12 h-12 text-white opacity-80" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">{reward.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {reward.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full font-semibold capitalize">
                    {reward.category.replace("_", " ")}
                  </span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                    {reward.pointsCost} pts
                  </span>
                  {reward.stockQuantity !== undefined && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      Stock: {reward.stockQuantity}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rewards.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Rewards Yet
          </h3>
          <p className="text-gray-600">
            Create your first reward to populate the marketplace!
          </p>
        </div>
      )}
    </div>
  );
}
