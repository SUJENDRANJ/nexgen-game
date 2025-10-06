export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  points: number;
  totalPointsEarned: number;
  level: number;
  streakDays: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsReward: number;
  category: 'compliance' | 'teamwork' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  awardedBy?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  pointsCost: number;
  category: 'time_off' | 'perks' | 'swag' | 'experiences';
  stockQuantity?: number;
  isAvailable: boolean;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  pointsSpent: number;
  status: 'pending' | 'approved' | 'fulfilled' | 'rejected';
  redeemedAt: Date;
  fulfilledAt?: Date;
  fulfilledBy?: string;
  notes?: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'achievement' | 'admin_award' | 'redemption' | 'bonus';
  description: string;
  awardedBy?: string;
  createdAt: Date;
}

export interface OfficeRule {
  id: string;
  title: string;
  description: string;
  pointsValue: number;
  category: string;
  isActive: boolean;
}
