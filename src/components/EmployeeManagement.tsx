import { useState } from "react";
import {
  Users,
  Gift,
  Trash2,
  X,
  Trophy,
  TrendingUp,
  Minus,
  Award,
  Flame,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function EmployeeManagement() {
  const {
    users,
    awardPoints,
    deleteEmployee,
    userAchievements,
    transactions,
    achievements,
    redemptions,
  } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pointAmount, setPointAmount] = useState("");
  const [pointDescription, setPointDescription] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);

  const employees = users.filter((u) => u.role === "employee");
  const selectedUser = selectedEmployee
    ? users.find((u) => u.id === selectedEmployee)
    : null;

  const handleAwardPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee && pointAmount && pointDescription) {
      awardPoints(selectedEmployee, parseInt(pointAmount), pointDescription);
      setPointAmount("");
      setPointDescription("");
      setShowAwardModal(false);
      setSelectedEmployee(null);
    }
  };

  const handleRemovePoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee && pointAmount && pointDescription) {
      awardPoints(selectedEmployee, -parseInt(pointAmount), pointDescription);
      setPointAmount("");
      setPointDescription("");
      setShowRemoveModal(false);
      setSelectedEmployee(null);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteUserId) {
      try {
        await deleteEmployee(deleteUserId);
        setShowDeleteModal(false);
        setDeleteUserId(null);
      } catch (error) {
        alert((error as Error).message || "Failed to delete employee");
      }
    }
  };

  const openAwardModal = (userId: string) => {
    setSelectedEmployee(userId);
    setShowAwardModal(true);
  };

  const openRemoveModal = (userId: string) => {
    setSelectedEmployee(userId);
    setShowRemoveModal(true);
  };

  const getUserAchievementCount = (userId: string) => {
    return (
      userAchievements &&
      userAchievements.filter((ua) => {
        const uaUserId =
          typeof ua.userId === "string" ? ua.userId : ua.userId.toString();
        return uaUserId === userId;
      }).length
    );
  };

  const getUserRecentTransactions = (userId: string) => {
    return transactions
      .filter((t) => {
        const tUserId =
          typeof t.userId === "string" ? t.userId : t.userId.toString();
        return tUserId === userId;
      })
      .slice(0, 5);
  };

  const getUserAchievements = (userId: string) => {
    const userAchIds = (userAchievements || [])
      .filter((ua) => {
        const uaUserId =
          typeof ua.userId === "string" ? ua.userId : ua.userId.toString();
        return uaUserId === userId;
      })
      .map((ua) => ua.achievementId);
    return achievements.filter((a) => userAchIds.includes(a.id));
  };

  const getUserRedemptionCount = (userId: string) => {
    return (redemptions || []).filter((r) => {
      const rUserId =
        typeof r.userId === "string" ? r.userId : r.userId.toString();
      return rUserId === userId;
    }).length;
  };

  const toggleEmployeeExpand = (userId: string) => {
    setExpandedEmployee(expandedEmployee === userId ? null : userId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-10 h-10" />
          <h2 className="text-3xl font-black">Employee Management</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Manage employees, award points, and view detailed information
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              All Employees ({employees.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Available Points
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Total Earned
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Achievements
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Streak
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => {
                const isExpanded = expandedEmployee === employee.id;
                const userAchs = getUserAchievements(employee.id);
                const recentTransactions = getUserRecentTransactions(
                  employee.id
                );
                const redemptionCount = getUserRedemptionCount(employee.id);

                return (
                  <>
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleEmployeeExpand(employee.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {employee.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full bg-blue-100 text-blue-800">
                          Level {employee.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-bold text-gray-900">
                            {employee.points}
                          </span>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-bold text-gray-900">
                            {employee.totalPointsEarned}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-bold text-gray-900">
                            {getUserAchievementCount(employee.id)}
                          </span>
                        </div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Flame
                            className={`w-4 h-4 ${
                              employee.streakDays > 0
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm font-bold text-gray-900">
                            {employee.streakDays}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openAwardModal(employee.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all hover:scale-105"
                          >
                            <Gift className="w-4 h-4" />
                            Award
                          </button>
                          <button
                            onClick={() => openRemoveModal(employee.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-all hover:scale-105"
                          >
                            <Minus className="w-4 h-4" />
                            Remove
                          </button>
                          <button
                            onClick={() => handleDeleteClick(employee.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${employee.id}-details`}>
                        <td colSpan={7} className="px-6 py-6 bg-gray-50">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                              <div className="flex items-center gap-2 mb-4">
                                <ShoppingBag className="w-5 h-5 text-green-500" />
                                <h4 className="font-bold text-gray-800">
                                  Rewards Redeemed
                                </h4>
                                <span className="ml-auto text-sm font-bold text-gray-600">
                                  {redemptionCount}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Level
                                  </p>
                                  <p className="text-xl font-black text-blue-600">
                                    {employee.level}
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Available
                                  </p>
                                  <p className="text-xl font-black text-yellow-600">
                                    {employee.points}
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Total
                                  </p>
                                  <p className="text-xl font-black text-green-600">
                                    {employee.totalPointsEarned}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 p-3 bg-red-50 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Flame className="w-5 h-5 text-red-500" />
                                  <span className="text-sm font-bold text-gray-700">
                                    Current Streak
                                  </span>
                                </div>
                                <span className="text-2xl font-black text-red-500">
                                  {employee.streakDays}
                                </span>
                              </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                              <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                <h4 className="font-bold text-gray-800">
                                  Recent Activity
                                </h4>
                              </div>
                              {recentTransactions.length > 0 ? (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {recentTransactions.map((txn: any) => (
                                    <div
                                      key={txn._id}
                                      className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200"
                                    >
                                      <div
                                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                          txn.type === "award"
                                            ? "bg-green-500"
                                            : txn.type === "purchase"
                                            ? "bg-red-500"
                                            : "bg-blue-500"
                                        }`}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-800 truncate">
                                          {txn.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                          <span
                                            className={`text-xs font-bold ${
                                              txn.amount > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                          >
                                            {txn.amount > 0 ? "+" : ""}
                                            {txn.amount} pts
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(
                                              txn.createdAt
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                  No activity yet
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>

          {employees.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No employees found</p>
            </div>
          )}
        </div>
      </div>

      {showAwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Gift className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  Award Points
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAwardModal(false);
                  setSelectedEmployee(null);
                  setPointAmount("");
                  setPointDescription("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedUser && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">
                  Awarding points to:
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedUser.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  Current: {selectedUser.points} pts
                </p>
              </div>
            )}

            <form onSubmit={handleAwardPoints} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Points Amount
                </label>
                <input
                  type="number"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  placeholder="Enter points (e.g., 50)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={pointDescription}
                  onChange={(e) => setPointDescription(e.target.value)}
                  placeholder="Why are they receiving points?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAwardModal(false);
                    setSelectedEmployee(null);
                    setPointAmount("");
                    setPointDescription("");
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                >
                  Award Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Minus className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Remove Points
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowRemoveModal(false);
                  setSelectedEmployee(null);
                  setPointAmount("");
                  setPointDescription("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedUser && (
              <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">
                  Removing points from:
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedUser.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  Current: {selectedUser.points} pts
                </p>
              </div>
            )}

            <form onSubmit={handleRemovePoints} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Points Amount
                </label>
                <input
                  type="number"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  placeholder="Enter points to remove (e.g., 50)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={pointDescription}
                  onChange={(e) => setPointDescription(e.target.value)}
                  placeholder="Why are points being removed?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRemoveModal(false);
                    setSelectedEmployee(null);
                    setPointAmount("");
                    setPointDescription("");
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                >
                  Remove Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Delete Employee
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this employee? This action
                cannot be undone.
              </p>
              {users.find((u) => u.id === deleteUserId) && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Employee:</p>
                  <p className="text-lg font-bold text-gray-900">
                    {users.find((u) => u.id === deleteUserId)?.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {users.find((u) => u.id === deleteUserId)?.email}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteUserId(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
