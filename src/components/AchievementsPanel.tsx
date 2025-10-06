import { Trophy, Lock, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AchievementsPanel() {
  const { currentUser, achievements, userAchievements } = useApp();

  const unlockedAchievementIds = (userAchievements || [])
    .filter((ua) => {
      const uaUserId =
        typeof ua.userId === "string" ? ua.userId : ua.userId?.toString();
      return uaUserId === currentUser?.id;
    })
    .map((ua) => ua.achievementId);

  const rarityColors = {
    common: "from-gray-400 to-gray-500",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-500",
  };

  const rarityBorders = {
    common: "border-gray-300",
    rare: "border-blue-300",
    epic: "border-purple-300",
    legendary: "border-yellow-300",
  };

  const categoryColors = {
    compliance: "bg-green-100 text-green-800",
    teamwork: "bg-blue-100 text-blue-800",
    milestone: "bg-purple-100 text-purple-800",
    special: "bg-orange-100 text-orange-800",
  };

  const unlockedCount = unlockedAchievementIds.length;
  const totalCount = (achievements || []).length;
  const completionPercentage =
    totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-10 h-10" />
          <h2 className="text-3xl font-black">Achievements</h2>
        </div>
        <p className="text-orange-100 text-lg mb-6">
          Unlock achievements and earn bonus points!
        </p>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white">Progress</span>
            <span className="font-bold text-white">
              {unlockedCount}/{totalCount}
            </span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(achievements || []).map((achievement) => {
          const isUnlocked = unlockedAchievementIds.includes(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                isUnlocked
                  ? "hover:scale-105 ring-2 ring-green-400"
                  : "opacity-60"
              } border-4 ${rarityBorders[achievement.rarity]}`}
            >
              <div
                className={`h-32 bg-gradient-to-br ${
                  rarityColors[achievement.rarity]
                } relative flex items-center justify-center`}
              >
                {isUnlocked ? (
                  <>
                    <Trophy className="w-16 h-16 text-white" />
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <Lock className="w-16 h-16 text-white opacity-50" />
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 mb-1">
                      {achievement.title}
                    </h4>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        categoryColors[achievement.category]
                      }`}
                    >
                      {achievement.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {achievement.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-xl font-black text-gray-800">
                      +{achievement.pointsReward}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${
                      rarityColors[achievement.rarity]
                    } text-white`}
                  >
                    {achievement.rarity}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Achievement Tips
        </h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Complete daily tasks to unlock compliance achievements</li>
          <li>• Help teammates to earn teamwork badges</li>
          <li>• Legendary achievements give the most points</li>
          <li>
            • Check with your manager to see which achievements you can unlock
            next
          </li>
        </ul>
      </div>
    </div>
  );
}
