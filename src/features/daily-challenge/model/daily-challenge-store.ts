'use client';

import { makeObservable, computed, action } from 'mobx';
import { TypingStore } from '@/shared/stores/typing-store';

export class DailyChallengeStore extends TypingStore {
  private readonly DAILY_TEXT =
    'The quick brown fox jumps over the lazy dog. The early bird catches the worm. Practice makes perfect.';
  private readonly TIME_LIMIT = 60; // 60 seconds

  constructor() {
    super();
    makeObservable(this, {
      // Only mark public properties as observable
      challengeText: computed,
      challengeTimeLimit: computed,
      saveResult: action,
    });
  }

  // Public getters for UI access
  get challengeText(): string {
    return this.DAILY_TEXT;
  }

  get challengeTimeLimit(): number {
    return this.TIME_LIMIT;
  }

  // Protected getters for base class
  protected get text(): string {
    return this.DAILY_TEXT;
  }

  protected get timeLimit(): number {
    return this.TIME_LIMIT;
  }

  // Additional daily challenge specific methods
  saveResult = () => {
    if (!this.stats.isComplete) return;

    const dailyResults = JSON.parse(
      localStorage.getItem('dailyResults') || '[]'
    );
    dailyResults.push({
      date: new Date().toISOString(),
      wpm: this.stats.wpm,
      accuracy: this.stats.accuracy,
      mistakes: this.stats.mistakes,
      timeElapsed: this.stats.timeElapsed,
    });
    localStorage.setItem('dailyResults', JSON.stringify(dailyResults));
  };
}
