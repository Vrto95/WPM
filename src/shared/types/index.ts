export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPro: boolean;
  createdAt: Date;
  lastLogin: Date;
}

export interface TypingSession {
  id: string;
  userId: string;
  wpm: number;
  accuracy: number;
  mistakes: number;
  duration: number;
  type: 'daily' | 'lesson';
  completedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPro: boolean;
}
