import { User, Achievement, Reward, OfficeRule, UserAchievement } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@gmail.com',
    fullName: 'Admin User',
    role: 'admin',
    points: 0,
    totalPointsEarned: 0,
    level: 1,
    streakDays: 0
  },
  {
    id: '2',
    email: 'john@example.com',
    fullName: 'John Smith',
    role: 'employee',
    points: 450,
    totalPointsEarned: 1250,
    level: 13,
    streakDays: 7
  },
  {
    id: '3',
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    role: 'employee',
    points: 380,
    totalPointsEarned: 980,
    level: 10,
    streakDays: 5
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first task',
    icon: 'star',
    pointsReward: 50,
    category: 'milestone'
  },
  {
    id: '2',
    title: 'Team Player',
    description: 'Help 5 colleagues',
    icon: 'users',
    pointsReward: 100,
    category: 'social'
  },
  {
    id: '3',
    title: 'Speed Demon',
    description: 'Complete a task in under 1 hour',
    icon: 'zap',
    pointsReward: 75,
    category: 'performance'
  }
];

export const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Extra Day Off',
    description: 'Enjoy an additional vacation day',
    pointsCost: 500,
    category: 'time_off',
    imageUrl: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg',
    stockQuantity: 10
  },
  {
    id: '2',
    title: 'Premium Parking Spot',
    description: 'Reserved parking spot for one month',
    pointsCost: 300,
    category: 'perks',
    imageUrl: 'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg',
    stockQuantity: 5
  },
  {
    id: '3',
    title: 'Company Hoodie',
    description: 'Premium branded hoodie in your size',
    pointsCost: 250,
    category: 'swag',
    imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    stockQuantity: 20
  },
  {
    id: '4',
    title: 'Team Lunch',
    description: 'Catered lunch for your entire team',
    pointsCost: 400,
    category: 'experiences',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    stockQuantity: 8
  },
  {
    id: '5',
    title: 'Half Day Off',
    description: 'Leave early or come in late',
    pointsCost: 250,
    category: 'time_off',
    imageUrl: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg',
    stockQuantity: 15
  },
  {
    id: '6',
    title: 'Coffee Subscription',
    description: 'One month premium coffee delivery',
    pointsCost: 200,
    category: 'perks',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    stockQuantity: 12
  }
];

export const mockOfficeRules: OfficeRule[] = [
  {
    id: '1',
    title: 'Respect working hours',
    description: 'Keep noise levels down during focus time',
    category: 'etiquette',
    icon: 'clock'
  },
  {
    id: '2',
    title: 'Clean shared spaces',
    description: 'Leave kitchen and meeting rooms tidy',
    category: 'cleanliness',
    icon: 'sparkles'
  }
];

export const mockUserAchievements: UserAchievement[] = [
  {
    id: '1',
    userId: '2',
    achievementId: '1',
    unlockedAt: new Date('2024-01-15')
  }
];
