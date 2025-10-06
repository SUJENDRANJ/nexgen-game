import { ShoppingBag, Clock, Gift, Sparkles, Star, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Reward } from "../types";

export default function RewardsMarketplace() {
  const { currentUser, rewards, redeemReward } = useApp();

  const categoryIcons = {
    special_card: Clock,
    premium_card: Sparkles,
    normal_card: Gift,
    // experiences: Star,
  };

  const categoryColors = {
    special_card: "from-blue-500 to-blue-700",
    premium_card: "from-pink-500 to-pink-700",
    normal_card: "from-orange-500 to-red-600",
  };

  const canAfford = (reward: Reward) => {
    return currentUser && currentUser.points >= reward.pointsCost;
  };

  const handleRedeem = (reward: Reward) => {
    if (currentUser && canAfford(reward)) {
      if (confirm(`Redeem ${reward.title} for ${reward.pointsCost} points?`)) {
        redeemReward(reward.id);
      }
    }
  };

  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="w-10 h-10" />
          <h2 className="text-3xl font-black">Rewards Marketplace</h2>
        </div>
        <p className="text-pink-100 text-lg mb-4">
          Exchange your hard-earned points for awesome rewards!
        </p>
        <div className="flex items-center gap-2 bg-white/20 rounded-xl px-6 py-3 backdrop-blur-sm w-fit">
          <Star className="w-6 h-6 text-yellow-300" />
          <span className="text-2xl font-black">
            {currentUser?.points || 0}
          </span>
          <span className="text-pink-100 font-semibold">points available</span>
        </div>
      </div>

      {Object.entries(groupedRewards).map(([category, categoryRewards]) => {
        const Icon =
          categoryIcons[category as keyof typeof categoryIcons] || Gift;
        const gradient =
          categoryColors[category as keyof typeof categoryColors] ||
          "from-yellow-400 to-orange-600";

        return (
          <div key={category}>
            <div
              className={`bg-gradient-to-r ${gradient} rounded-xl p-4 mb-4 shadow-md`}
            >
              <div className="flex items-center gap-2 text-white">
                <Icon className="w-6 h-6" />
                <h3 className="text-xl font-bold capitalize">
                  {category.replace("_", " ")}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryRewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:scale-105 ${
                    canAfford(reward) ? "hover:shadow-2xl" : "opacity-75"
                  }`}
                >
                  <div
                    className={`h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
                  >
                    {reward.imageUrl ? (
                      <img
                        src={reward.imageUrl}
                        alt={reward.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-16 h-16 text-white opacity-80" />
                    )}
                  </div>

                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {reward.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {reward.description}
                    </p>

                    {reward.stockQuantity !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Stock</span>
                          <span className="font-semibold text-gray-800">
                            {reward.stockQuantity} left
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all`}
                            style={{
                              width: `${Math.min(
                                (reward.stockQuantity / 10) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-2xl font-black text-gray-800">
                          {reward.pointsCost}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford(reward)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          canAfford(reward)
                            ? `bg-gradient-to-r ${gradient} text-white hover:shadow-lg hover:scale-105`
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {canAfford(reward) ? "Redeem" : "Not Enough"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
