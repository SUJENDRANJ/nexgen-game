import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User, Achievement, Reward } from "../types";
import { api } from "../lib/api";
import { connectSocket, getSocket, disconnectSocket } from "../lib/socket";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  achievements: Achievement[];
  rewards: Reward[];
  redemptions: any[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  awardAchievement: (userId: string, achievementId: string) => void;
  redeemReward: (rewardId: string) => void;
  createAchievement: (achievement: any) => void;
  createReward: (reward: any) => void;
  deleteAchievement: (achievementId: string) => void;
  deleteReward: (rewardId: string) => void;
  awardPoints: (
    userId: string,
    points: number,
    description: string
  ) => Promise<void>;
  deleteEmployee: (userId: string) => Promise<void>;
  updateRedemption: (
    redemptionId: string,
    status: string,
    notes?: string
  ) => Promise<void>;
  showCelebration: boolean;
  celebrationMessage: string;
  triggerCelebration: (message: string) => void;
  userAchievements: any[];
  transactions: any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achievementsData, rewardsData, leaderboardData] =
          await Promise.all([
            api.achievements.getAll(),
            api.rewards.getAll(),
            api.leaderboard.get(),
          ]);

        setAchievements(
          achievementsData.map((a: any) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            icon: a.icon,
            pointsReward: a.points,
            category: a.category || "milestone",
            rarity: a.rarity || "common",
          }))
        );

        setRewards(
          rewardsData.map((r: any) => ({
            id: r.id,
            title: r.name,
            description: r.description,
            pointsCost: r.cost,
            category: r.category || "perks",
            imageUrl: r.imageUrl,
            stockQuantity: r.stock,
          }))
        );

        setUsers(
          leaderboardData.map((u: any) => ({
            id: u.id,
            email: u.email,
            fullName: u.name,
            role: "employee",
            points: u.points,
            totalPointsEarned: u.totalPointsEarned || 0,
            level: u.level,
            streakDays: u.streakDays || 0,
          }))
        );

        if (currentUser?.id) {
          if (currentUser.role === "admin") {
            const [allUserAchievementsData, redemptionsData, allTransactions] =
              await Promise.all([
                api.achievements.getAllUserAchievements(),
                api.rewards.getRedemptions(),
                api.transactions.getAll(),
              ]);
            setUserAchievements(allUserAchievementsData);
            setRedemptions(redemptionsData);
            setTransactions(allTransactions);
          } else {
            const [userAchievementsData, userTransactions] = await Promise.all([
              api.achievements.getUserAchievements(currentUser.id),
              api.transactions.getByUserId(currentUser.id),
            ]);
            setUserAchievements(userAchievementsData);
            setTransactions(userTransactions);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const socket = connectSocket();

    socket.on("achievementCreated", (achievement: any) => {
      setAchievements((prev) => {
        const exists = prev.some((a) => a.id === achievement.id);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            pointsReward: achievement.points,
            category: achievement.category || "milestone",
            rarity: achievement.rarity || "common",
          },
        ];
      });
    });

    socket.on("rewardCreated", (reward: any) => {
      setRewards((prev) => [
        ...prev,
        {
          id: reward.id,
          title: reward.name,
          description: reward.description,
          pointsCost: reward.cost,
          category: reward.category || "perks",
          imageUrl: reward.imageUrl,
          stockQuantity: reward.stock,
        },
      ]);
    });

    socket.on(
      "achievementAwarded",
      async ({ userId, achievementId, user }: any) => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  points: user.points,
                  level: user.level,
                  totalPointsEarned: user.totalPointsEarned || 0,
                }
              : u
          )
        );

        setUserAchievements((prev) => {
          const exists = prev.some(
            (ua) => ua.userId === userId && ua.achievementId === achievementId
          );
          if (exists) return prev;
          return [...prev, { userId, achievementId }];
        });

        if (currentUser?.id === userId) {
          setCurrentUser((prev) =>
            prev
              ? {
                  ...prev,
                  points: user.points,
                  level: user.level,
                  totalPointsEarned: user.totalPointsEarned || 0,
                }
              : null
          );
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...currentUser,
              points: user.points,
              level: user.level,
              totalPointsEarned: user.totalPointsEarned || 0,
            })
          );

          try {
            const userTransactions = await api.transactions.getByUserId(userId);
            setTransactions(userTransactions);
          } catch (error) {
            console.error("Error fetching transactions:", error);
          }
        } else if (currentUser?.role === "admin") {
          try {
            const allTransactions = await api.transactions.getAll();
            setTransactions(allTransactions);
          } catch (error) {
            console.error("Error fetching transactions:", error);
          }
        }
      }
    );

    socket.on("rewardPurchased", async ({ userId, user, rewardId, reward }: any) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                points: user.points,
              }
            : u
        )
      );

      if (reward && rewardId) {
        setRewards((prev) =>
          prev.map((r) =>
            r.id === rewardId
              ? {
                  ...r,
                  stockQuantity: reward.stock !== undefined ? reward.stock : r.stockQuantity,
                }
              : r
          )
        );
      }

      if (currentUser?.id === userId) {
        setCurrentUser((prev) =>
          prev
            ? {
                ...prev,
                points: user.points,
              }
            : null
        );
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...currentUser,
            points: user.points,
          })
        );

        try {
          const userTransactions = await api.transactions.getByUserId(userId);
          setTransactions(userTransactions);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      } else if (currentUser?.role === "admin") {
        try {
          const allTransactions = await api.transactions.getAll();
          setTransactions(allTransactions);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      }
    });

    socket.on("redemptionCreated", (redemption: any) => {
      setRedemptions((prev) => [redemption, ...prev]);
    });

    socket.on("redemptionUpdated", (redemption: any) => {
      setRedemptions((prev) =>
        prev.map((r) => (r.id === redemption.id ? redemption : r))
      );
    });

    socket.on("achievementDeleted", (achievementId: string) => {
      setAchievements((prev) => prev.filter((a) => a.id !== achievementId));
    });

    socket.on("rewardDeleted", (rewardId: string) => {
      setRewards((prev) => prev.filter((r) => r.id !== rewardId));
    });

    socket.on(
      "pointsAwarded",
      async ({ userId, points, description, user }: any) => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  points: user.points,
                  level: user.level,
                  totalPointsEarned:
                    user.totalPointsEarned ||
                    user.totalPointsEarned ||
                    u.totalPointsEarned,
                }
              : u
          )
        );

        if (currentUser?.id === userId) {
          setCurrentUser((prev) =>
            prev
              ? {
                  ...prev,
                  points: user.points,
                  level: user.level,
                  totalPointsEarned:
                    user.totalPointsEarned || prev.totalPointsEarned,
                }
              : null
          );
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...currentUser,
              points: user.points,
              level: user.level,
              totalPointsEarned:
                user.totalPointsEarned || currentUser.totalPointsEarned,
            })
          );
          try {
            const userTransactions = await api.transactions.getByUserId(userId);
            setTransactions(userTransactions);
          } catch (error) {
            console.error("Error fetching transactions:", error);
          }
        } else if (currentUser?.role === "admin") {
          try {
            const allTransactions = await api.transactions.getAll();
            setTransactions(allTransactions);
          } catch (error) {
            console.error("Error fetching transactions:", error);
          }
        }
      }
    );

    socket.on("userDeleted", (userId: string) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    });

    return () => {
      disconnectSocket();
    };
  }, [currentUser?.id]);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await api.auth.login(email, password);
      const mappedUser: User = {
        id: user.id,
        email: user.email,
        fullName: user.name,
        role: user.isAdmin ? "admin" : "employee",
        points: user.points,
        totalPointsEarned: user.totalPointsEarned || 0,
        level: user.level,
        streakDays: user.streakDays || 0,
      };
      setCurrentUser(mappedUser);
      localStorage.setItem("currentUser", JSON.stringify(mappedUser));
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const { user } = await api.auth.register(email, password, fullName);
      const mappedUser: User = {
        id: user.id,
        email: user.email,
        fullName: user.name,
        role: user.isAdmin ? "admin" : "employee",
        points: user.points,
        totalPointsEarned: user.totalPointsEarned || 0,
        level: user.level,
        streakDays: user.streakDays || 0,
      };
      setCurrentUser(mappedUser);
      localStorage.setItem("currentUser", JSON.stringify(mappedUser));
    } catch (error: any) {
      throw new Error(error.message || "Signup failed");
    }
  };

  const logout = () => {
    api.auth.logout();
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const triggerCelebration = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const awardAchievement = async (userId: string, achievementId: string) => {
    try {
      await api.achievements.award(achievementId, userId);
      const achievement = achievements.find((a) => a.id === achievementId);
      if (achievement && userId === currentUser?.id) {
        triggerCelebration(`Achievement unlocked: ${achievement.title}`);
      }
    } catch (error) {
      console.error("Error awarding achievement:", error);
    }
  };

  const redeemReward = async (rewardId: string) => {
    try {
      await api.rewards.purchase(rewardId);
      const reward = rewards.find((r) => r.id === rewardId);
      if (reward) {
        triggerCelebration(`Reward redeemed: ${reward.title}`);
      }
    } catch (error: any) {
      alert(error.message || "Failed to redeem reward");
    }
  };

  const createAchievement = async (achievementData: {
    title: string;
    description: string;
    icon: string;
    points: number;
    category?: string;
    rarity?: string;
  }) => {
    const response = await api.achievements.create(achievementData);
    setAchievements((prev) => {
      const exists = prev.some((a) => a.id === response.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: response.id,
          title: response.title,
          description: response.description,
          icon: response.icon,
          pointsReward: response.points,
          category: response.category || "milestone",
          rarity: response.rarity || "common",
        },
      ];
    });
  };

  const createReward = async (reward: any) => {
    try {
      await api.rewards.create(reward);
    } catch (error) {
      console.error("Error creating reward:", error);
    }
  };

  const deleteAchievement = async (achievementId: string) => {
    try {
      await api.achievements.delete(achievementId);
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  const deleteReward = async (rewardId: string) => {
    try {
      await api.rewards.delete(rewardId);
    } catch (error) {
      console.error("Error deleting reward:", error);
    }
  };

  const awardPoints = async (
    userId: string,
    points: number,
    description: string
  ) => {
    try {
      await api.users.awardPoints(userId, points, description);
    } catch (error: any) {
      throw new Error(error.message || "Failed to award points");
    }
  };

  const deleteEmployee = async (userId: string) => {
    try {
      await api.users.delete(userId);
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete employee");
    }
  };

  const updateRedemption = async (
    redemptionId: string,
    status: string,
    notes?: string
  ) => {
    try {
      await api.rewards.updateRedemption(redemptionId, status, notes);
    } catch (error: any) {
      throw new Error(error.message || "Failed to update redemption");
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        achievements,
        rewards,
        redemptions,
        login,
        signup,
        logout,
        awardAchievement,
        redeemReward,
        createAchievement,
        createReward,
        deleteAchievement,
        deleteReward,
        awardPoints,
        deleteEmployee,
        updateRedemption,
        showCelebration,
        celebrationMessage,
        triggerCelebration,
        userAchievements,
        transactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
