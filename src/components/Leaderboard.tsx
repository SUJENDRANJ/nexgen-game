import {
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  Flame,
  Star,
  Award,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Leaderboard() {
  const { users, currentUser } = useApp();

  const rankedUsers = [...users]
    .filter((u) => u.role === "employee")
    .sort((a, b) => b.totalPointsEarned - a.totalPointsEarned)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  const currentUserRank = rankedUsers.find((u) => u.id === currentUser?.id);
  const topThree = rankedUsers.slice(0, 3);
  const restOfUsers = rankedUsers.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-10 h-10 text-yellow-300 drop-shadow-lg" />;
      case 2:
        return <Medal className="w-9 h-9 text-slate-300 drop-shadow-lg" />;
      case 3:
        return <Medal className="w-8 h-8 text-amber-600 drop-shadow-lg" />;
      default:
        return null;
    }
  };

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return "h-64";
      case 2:
        return "h-52";
      case 3:
        return "h-44";
      default:
        return "h-0";
    }
  };

  const getPodiumGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 via-yellow-500 to-amber-600";
      case 2:
        return "from-slate-300 via-slate-400 to-slate-500";
      case 3:
        return "from-amber-500 via-amber-600 to-amber-700";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yellow-500 p-4 rounded-2xl shadow-lg">
              <Trophy className="w-12 h-12 text-slate-900" />
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tight">
                Leaderboard
              </h2>
              <p className="text-blue-200 text-lg font-semibold">
                Hall of Champions
              </p>
            </div>
          </div>
          <p className="text-slate-300 text-base max-w-2xl">
            Compete with colleagues, earn achievements, and rise to the top of
            the leaderboard!
          </p>
        </div>
      </div>

      {currentUserRank && (
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl border-2 border-blue-400 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-2 border-white/30">
                <span className="text-2xl sm:text-4xl font-black">
                  #{currentUserRank.rank}
                </span>
              </div>
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-bold uppercase tracking-wider">
                  Your Rank
                </p>
                <p className="text-lg sm:text-2xl font-black mt-1">
                  {currentUserRank.fullName}
                </p>
                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-semibold">
                      Level {currentUserRank.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-300" />
                    <span className="text-sm font-semibold">
                      {currentUserRank.streakDays} day streak
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-blue-100 text-xs sm:text-sm font-bold uppercase tracking-wider">
                Total Earned
              </p>
              <div className="flex items-center gap-2 justify-center sm:justify-end mt-1">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                <p className="text-2xl sm:text-4xl font-black">
                  {currentUserRank.totalPointsEarned}
                </p>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm font-semibold mt-1">
                {currentUserRank.points} available
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
          <h3 className="text-xl sm:text-2xl font-black text-slate-800">
            Top 3 Champions
          </h3>
        </div>

        <div className="flex items-end justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {topThree.length >= 2 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="absolute inset-0 bg-slate-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 rounded-full p-3 sm:p-4 lg:p-6 shadow-xl border-2 sm:border-4 border-white">
                  {getRankIcon(2)}
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-slate-700 text-white rounded-full w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center font-black text-sm sm:text-lg shadow-lg">
                  2
                </div>
              </div>
              <div
                className={`bg-gradient-to-b ${getPodiumGradient(
                  2
                )} h-32 sm:h-44 lg:${getPodiumHeight(
                  2
                )} w-24 sm:w-32 lg:w-40 rounded-t-2xl sm:rounded-t-3xl shadow-2xl flex flex-col items-center justify-start pt-3 sm:pt-4 lg:pt-6 px-2 sm:px-3 lg:px-4 border-t-2 sm:border-t-4 border-white transition-all hover:scale-105`}
              >
                <p className="text-white font-black text-xs sm:text-sm lg:text-lg text-center mb-1 sm:mb-2">
                  {topThree[1]?.fullName}
                </p>
                <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <p className="text-white font-black text-lg sm:text-xl lg:text-2xl">
                    {topThree[1]?.totalPointsEarned}
                  </p>
                </div>
                <p className="text-white/80 text-[10px] sm:text-xs font-semibold">
                  Level {topThree[1]?.level}
                </p>
              </div>
            </div>
          )}

          {topThree.length >= 1 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-full p-4 sm:p-6 lg:p-8 shadow-2xl border-2 sm:border-4 border-white">
                  {getRankIcon(1)}
                </div>
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center font-black text-base sm:text-xl shadow-xl border-2 border-white">
                  1
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-900 px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black shadow-lg">
                  CHAMPION
                </div>
              </div>
              <div
                className={`bg-gradient-to-b ${getPodiumGradient(
                  1
                )} h-40 sm:h-52 lg:${getPodiumHeight(
                  1
                )} w-28 sm:w-36 lg:w-44 rounded-t-2xl sm:rounded-t-3xl shadow-2xl flex flex-col items-center justify-start pt-3 sm:pt-4 lg:pt-6 px-2 sm:px-3 lg:px-4 border-t-2 sm:border-t-4 border-white transition-all hover:scale-105`}
              >
                <p className="text-white font-black text-sm sm:text-base lg:text-xl text-center mb-2 sm:mb-3">
                  {topThree[0]?.fullName}
                </p>
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  <p className="text-white font-black text-xl sm:text-2xl lg:text-3xl">
                    {topThree[0]?.totalPointsEarned}
                  </p>
                </div>
                <p className="text-white/90 text-xs sm:text-sm font-semibold">
                  Level {topThree[0]?.level}
                </p>
                <div className="flex items-center gap-1 mt-1 sm:mt-2">
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  <p className="text-white/80 text-[10px] sm:text-xs font-bold">
                    {topThree[0]?.streakDays} days
                  </p>
                </div>
              </div>
            </div>
          )}

          {topThree.length >= 3 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="absolute inset-0 bg-amber-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 rounded-full p-3 sm:p-4 lg:p-5 shadow-xl border-2 sm:border-4 border-white">
                  {getRankIcon(3)}
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-amber-800 text-white rounded-full w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center font-black text-sm sm:text-lg shadow-lg">
                  3
                </div>
              </div>
              <div
                className={`bg-gradient-to-b ${getPodiumGradient(
                  3
                )} h-28 sm:h-36 lg:${getPodiumHeight(
                  3
                )} w-24 sm:w-32 lg:w-40 rounded-t-2xl sm:rounded-t-3xl shadow-2xl flex flex-col items-center justify-start pt-3 sm:pt-4 lg:pt-6 px-2 sm:px-3 lg:px-4 border-t-2 sm:border-t-4 border-white transition-all hover:scale-105`}
              >
                <p className="text-white font-black text-xs sm:text-sm lg:text-lg text-center mb-1 sm:mb-2">
                  {topThree[2]?.fullName}
                </p>
                <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <p className="text-white font-black text-lg sm:text-xl lg:text-2xl">
                    {topThree[2]?.totalPointsEarned}
                  </p>
                </div>
                <p className="text-white/80 text-[10px] sm:text-xs font-semibold">
                  Level {topThree[2]?.level}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {restOfUsers.length > 0 && (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b-2 sm:border-b-4 border-slate-600">
            <div className="flex items-center gap-2 sm:gap-3">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white">
                All Competitors
              </h3>
            </div>
          </div>

          <div className="p-3 sm:p-4 lg:p-6">
            <div className="space-y-2 sm:space-y-3">
              {restOfUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl transition-all hover:scale-[1.02] hover:shadow-lg ${
                    user.id === currentUser?.id
                      ? "bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-400 shadow-md"
                      : "bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-1 w-full">
                    <div
                      className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl font-black text-lg sm:text-xl ${
                        user.id === currentUser?.id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      #{user.rank}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1">
                        <h4
                          className={`text-base sm:text-lg font-black truncate ${
                            user.id === currentUser?.id
                              ? "text-blue-900"
                              : "text-slate-800"
                          }`}
                        >
                          {user.fullName}
                        </h4>
                        {user.id === currentUser?.id && (
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-600 text-white text-[10px] sm:text-xs font-black rounded-full shadow-sm flex-shrink-0">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-600">
                            Level {user.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              user.streakDays > 0
                                ? "text-orange-500"
                                : "text-slate-400"
                            }`}
                          />
                          <span className="text-xs sm:text-sm font-semibold text-slate-600">
                            {user.streakDays} days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right mt-2 sm:mt-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 justify-end mb-1">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                      <span
                        className={`text-xl sm:text-2xl font-black ${
                          user.id === currentUser?.id
                            ? "text-blue-900"
                            : "text-slate-800"
                        }`}
                      >
                        {user.totalPointsEarned}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500">
                      {user.points} available
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xl">Pro Tips</h3>
          </div>
          <ul className="space-y-2 text-emerald-50">
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-black">•</span>
              <span className="font-semibold">
                Complete achievements to earn big point bonuses
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-black">•</span>
              <span className="font-semibold">
                Maintain your daily streak for consistent progress
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-black">•</span>
              <span className="font-semibold">
                The more points you earn, the higher you climb!
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
