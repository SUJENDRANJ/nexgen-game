import { ShoppingBag, Clock, Gift, Sparkles, Star, Check, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Reward } from "../types";
import { useState } from "react";

export default function RewardsMarketplace() {
  const { currentUser, rewards, redeemReward } = useApp();
  const [redeeming, setRedeeming] = useState<string | null>(null);

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
    if (!currentUser) return false;
    if (reward.stockQuantity !== undefined && reward.stockQuantity !== null && reward.stockQuantity <= 0) {
      return false;
    }
    return currentUser.points >= reward.pointsCost;
  };

  const handleRedeem = async (reward: Reward) => {
    if (!currentUser || !canAfford(reward) || redeeming) {
      return;
    }

    if (!confirm(`Redeem ${reward.title} for ${reward.pointsCost} points?`)) {
      return;
    }

    try {
      setRedeeming(reward.id);
      await redeemReward(reward.id);
    } catch (error) {
      console.error('Failed to redeem reward:', error);
    } finally {
      setRedeeming(null);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
          <h2 className="text-2xl sm:text-3xl font-black">Rewards Marketplace</h2>
        </div>
        <p className="text-pink-100 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
          Exchange your hard-earned points for awesome rewards!
        </p>
        <div className="flex items-center gap-2 bg-white/20 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm w-fit">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
          <span className="text-xl sm:text-2xl font-black">
            {currentUser?.points || 0}
          </span>
          <span className="text-pink-100 font-semibold text-sm sm:text-base">points available</span>
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
              className={`bg-gradient-to-r ${gradient} rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-md`}
            >
              <div className="flex items-center gap-2 text-white">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                <h3 className="text-lg sm:text-xl font-bold capitalize">
                  {category.replace("_", " ")}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categoryRewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-all ${
                    canAfford(reward) && !redeeming ? "hover:scale-105 hover:shadow-2xl" : ""
                  } ${!canAfford(reward) ? "opacity-75" : ""} ${redeeming === reward.id ? "opacity-90" : ""}`}
                >
                  <div
                    className={`h-32 sm:h-40 lg:h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
                  >
                    {reward.imageUrl ? (
                      <img
                        src={reward.imageUrl}
                        alt={reward.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-80" />
                    )}
                  </div>

                  <div className="p-4 sm:p-6">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                      {reward.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {reward.description}
                    </p>

                    {reward.stockQuantity !== undefined && reward.stockQuantity !== null && (
                      <div className="mb-3 sm:mb-4">
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

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        <span className="text-xl sm:text-2xl font-black text-gray-800">
                          {reward.pointsCost}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford(reward) || redeeming !== null}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all flex items-center gap-2 text-sm sm:text-base ${
                          canAfford(reward) && !redeeming
                            ? `bg-gradient-to-r ${gradient} text-white hover:shadow-lg hover:scale-105`
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        } ${redeeming === reward.id ? "opacity-80" : ""}`}
                      >
                        {redeeming === reward.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Redeeming...</span>
                          </>
                        ) : reward.stockQuantity !== undefined && reward.stockQuantity !== null && reward.stockQuantity <= 0 ? (
                          "Out of Stock"
                        ) : canAfford(reward) ? (
                          "Redeem"
                        ) : (
                          "Not Enough"
                        )}
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
