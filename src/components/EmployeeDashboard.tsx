import { Trophy, TrendingUp, Flame, Star, Award } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function EmployeeDashboard() {
  const { currentUser, achievements, userAchievements, transactions } =
    useApp();

  if (!currentUser) return null;

  const unlockedAchievementIds = (userAchievements || [])
    .filter((ua) => {
      const uaUserId =
        typeof ua.userId === "string" ? ua.userId : ua.userId?.toString();
      return uaUserId === currentUser.id;
    })
    .map((ua) => ua.achievementId);

  const unlockedAchievements = (achievements || []).filter((a) =>
    unlockedAchievementIds.includes(a.id)
  );

  const recentTransactions = (transactions || [])
    .filter((t) => {
      const tUserId =
        typeof t.userId === "string" ? t.userId : t.userId?.toString();
      return tUserId === currentUser.id;
    })
    .slice(0, 5);

  const nextLevelPoints = currentUser.level * 100;
  const currentLevelProgress = currentUser.totalPointsEarned % 100;
  const progressPercentage = (currentLevelProgress / 100) * 100;

  const rarityColors = {
    common: "from-gray-400 to-gray-500",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-500",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border-b-2 sm:border-b-4 border-blue-500">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-wide break-words">
          {currentUser.fullName}
        </h1>
        <p className="text-slate-300 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Dashboard</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <span className="text-2xl sm:text-3xl font-black">{currentUser.level}</span>
          </div>
          <p className="text-blue-100 font-semibold text-xs sm:text-sm">Current Level</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <span className="text-2xl sm:text-3xl font-black">{currentUser.points}</span>
          </div>
          <p className="text-orange-100 font-semibold text-xs sm:text-sm">
            Available Points
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <span className="text-2xl sm:text-3xl font-black">
              {currentUser.totalPointsEarned}
            </span>
          </div>
          <p className="text-green-100 font-semibold text-xs sm:text-sm">Total Earned</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <span className="text-2xl sm:text-3xl font-black">
              {currentUser.streakDays}
            </span>
          </div>
          <p className="text-pink-100 font-semibold text-xs sm:text-sm">Day Streak</p>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Level Progress</h3>
          <span className="text-xs sm:text-sm font-semibold text-gray-500">
            Level {currentUser.level} → {currentUser.level + 1}
          </span>
        </div>
        <div className="relative h-6 sm:h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 sm:pr-4"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 20 && (
              <span className="text-white font-bold text-xs sm:text-sm">
                {currentLevelProgress}/{100} XP
              </span>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {100 - currentLevelProgress} points until next level!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
        {/* <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">
              Recent Achievements
            </h3>
          </div>
          {unlockedAchievements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No achievements yet. Keep working to unlock your first one!
            </p>
          ) : (
            <div className="space-y-3">
              {unlockedAchievements.slice(0, 4).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:scale-105 transition-transform"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                      rarityColors[achievement.rarity]
                    } flex items-center justify-center shadow-lg`}
                  >
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-yellow-600">
                      +{achievement.pointsReward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Activity</h3>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
              No recent activity. Start earning points!
            </p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction._id || index}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border gap-2 sm:gap-0 ${
                    transaction.amount >= 0
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                      : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                      {transaction.description}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-lg sm:text-xl font-bold self-end sm:self-center ${
                      transaction.amount >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.amount >= 0 ? "+" : ""}
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
