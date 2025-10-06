const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let token: string | null = localStorage.getItem("token");

export const setAuthToken = (newToken: string | null) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem("token", newToken);
  } else {
    localStorage.removeItem("token");
  }
};

const getHeaders = () => {
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAuthToken(data.token);
      return data;
    },
    register: async (email: string, password: string, name: string) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAuthToken(data.token);
      return data;
    },
    logout: () => {
      setAuthToken(null);
    },
  },
  achievements: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/achievements`);
      return response.json();
    },
    getAllUserAchievements: async () => {
      const response = await fetch(`${API_URL}/api/achievements/all-users`, {
        headers: getHeaders(),
      });
      return response.json();
    },
    getUserAchievements: async (userId: string) => {
      const response = await fetch(
        `${API_URL}/api/achievements/user/${userId}`
      );
      return response.json();
    },
    create: async (achievement: any) => {
      const response = await fetch(`${API_URL}/api/achievements`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(achievement),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create achievement");
      return data;
    },
    award: async (achievementId: string, userId: string) => {
      const response = await fetch(
        `${API_URL}/api/achievements/award/${achievementId}`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to award achievement");
      return data;
    },
    delete: async (achievementId: string) => {
      const response = await fetch(
        `${API_URL}/api/achievements/${achievementId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete achievement");
      return data;
    },
  },
  rewards: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/rewards`);
      return response.json();
    },
    create: async (reward: any) => {
      const response = await fetch(`${API_URL}/api/rewards`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(reward),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create reward");
      return data;
    },
    purchase: async (rewardId: string) => {
      const response = await fetch(
        `${API_URL}/api/rewards/purchase/${rewardId}`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    delete: async (rewardId: string) => {
      const response = await fetch(`${API_URL}/api/rewards/${rewardId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete reward");
      return data;
    },
    getRedemptions: async () => {
      const response = await fetch(`${API_URL}/api/rewards/redemptions`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch redemptions");
      return data;
    },
    updateRedemption: async (
      redemptionId: string,
      status: string,
      notes?: string
    ) => {
      const response = await fetch(
        `${API_URL}/api/rewards/redemptions/${redemptionId}`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ status, notes }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update redemption");
      return data;
    },
  },
  leaderboard: {
    get: async () => {
      const response = await fetch(`${API_URL}/api/leaderboard`);
      return response.json();
    },
  },
  users: {
    awardPoints: async (
      userId: string,
      points: number,
      description: string
    ) => {
      const response = await fetch(`${API_URL}/api/users/award-points`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ userId, points, description }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    delete: async (userId: string) => {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch users");
      return data;
    },
  },
  transactions: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/transactions/all`, {
        headers: getHeaders(),
      });
      return response.json();
    },
    getByUserId: async (userId: string) => {
      const response = await fetch(
        `${API_URL}/api/transactions/user/${userId}`
      );
      return response.json();
    },
  },
};
