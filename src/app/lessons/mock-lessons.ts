export interface LessonPassingCriteria {
  minWpm: number;
  minAccuracy: number;
  maxErrors: number;
  maxTimeInSeconds: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPro: boolean;
  passingCriteria: LessonPassingCriteria;
}

export const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Home Row Basics',
    content: 'asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl;',
    difficulty: 'beginner',
    isPro: false,
    passingCriteria: {
      minWpm: 20,
      minAccuracy: 90,
      maxErrors: 5,
      maxTimeInSeconds: 120,
    },
  },
  {
    id: '2',
    title: 'Top Row Introduction',
    content: 'qwer uiop qwer uiop qwer uiop qwer uiop qwer uiop',
    difficulty: 'beginner',
    isPro: false,
    passingCriteria: {
      minWpm: 25,
      minAccuracy: 90,
      maxErrors: 5,
      maxTimeInSeconds: 120,
    },
  },
  {
    id: '3',
    title: 'Speed Building',
    content:
      'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.',
    difficulty: 'intermediate',
    isPro: true,
    passingCriteria: {
      minWpm: 40,
      minAccuracy: 95,
      maxErrors: 3,
      maxTimeInSeconds: 90,
    },
  },
  {
    id: '4',
    title: 'Common Words',
    content:
      'practice makes perfect typing speed practice makes perfect typing speed',
    difficulty: 'intermediate',
    isPro: true,
    passingCriteria: {
      minWpm: 45,
      minAccuracy: 95,
      maxErrors: 3,
      maxTimeInSeconds: 90,
    },
  },
  {
    id: '5',
    title: 'Advanced Speed',
    content:
      'The quick brown fox jumps over the lazy dog. Practice makes perfect. The quick brown fox jumps over the lazy dog.',
    difficulty: 'advanced',
    isPro: true,
    passingCriteria: {
      minWpm: 60,
      minAccuracy: 97,
      maxErrors: 2,
      maxTimeInSeconds: 60,
    },
  },
  {
    id: '6',
    title: 'Special Characters',
    content: '!@#$%^&*()_+{}|:"<>? !@#$%^&*()_+{}|:"<>? !@#$%^&*()_+{}|:"<>?',
    difficulty: 'advanced',
    isPro: true,
    passingCriteria: {
      minWpm: 50,
      minAccuracy: 95,
      maxErrors: 3,
      maxTimeInSeconds: 90,
    },
  },
];
