'use client';

import { makeObservable, observable, action, computed } from 'mobx';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  mistakes: number;
  timeElapsed: number;
  isComplete: boolean;
}

export class TypingStore {
  input: string = '';
  startTime: number | null = null;
  isStarted: boolean = false;
  isFinished: boolean = false;
  stats: TypingStats = {
    wpm: 0,
    accuracy: 100,
    mistakes: 0,
    timeElapsed: 0,
    isComplete: false,
  };

  private readonly AVERAGE_WORD_LENGTH = 5;
  private timerRef: NodeJS.Timeout | null = null;

  constructor() {
    makeObservable(this, {
      // Observable state
      input: observable,
      startTime: observable,
      isStarted: observable,
      isFinished: observable,
      stats: observable,

      // Actions
      startTyping: action,
      stopTyping: action,
      reset: action,
      setInput: action,

      // Computed
      timeLeft: computed,
      progress: computed,
    });
  }

  // Actions
  startTyping = () => {
    this.isStarted = true;
    this.startTime = Date.now();
    this.input = '';
    this.resetStats();
    this.startTimer();
  };

  stopTyping = () => {
    this.isFinished = true;
    this.clearTimer();
  };

  reset = () => {
    this.isStarted = false;
    this.isFinished = false;
    this.input = '';
    this.startTime = null;
    this.clearTimer();
    this.resetStats();
  };

  setInput = (newInput: string) => {
    if (!this.isStarted || this.isFinished) return;
    this.input = newInput;
    this.updateStats();
  };

  // Computed
  get timeLeft(): number {
    return Math.max(
      0,
      this.timeLimit - Math.floor(this.stats.timeElapsed / 1000)
    );
  }

  get progress(): number {
    return (this.input.length / this.text.length) * 100;
  }

  // Protected methods to be implemented by child stores
  protected get text(): string {
    throw new Error('text getter must be implemented by child store');
  }

  protected get timeLimit(): number {
    throw new Error('timeLimit getter must be implemented by child store');
  }

  // Private methods
  private resetStats = () => {
    this.stats = {
      wpm: 0,
      accuracy: 100,
      mistakes: 0,
      timeElapsed: 0,
      isComplete: false,
    };
  };

  private startTimer = () => {
    this.clearTimer();
    this.timerRef = setInterval(() => {
      this.updateStats();
      if (this.timeLeft <= 0) {
        this.stopTyping();
      }
    }, 1000);
  };

  private clearTimer = () => {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  };

  private updateStats = () => {
    if (!this.startTime) return;

    const timeElapsed = Date.now() - this.startTime;
    const timeInMinutes = timeElapsed / 60000;
    const { accuracy, mistakes } = this.calculateAccuracy();
    const wpm = this.calculateWPM(timeInMinutes);

    this.stats = {
      wpm,
      accuracy,
      mistakes,
      timeElapsed,
      isComplete: this.input.length === this.text.length,
    };
  };

  private calculateWPM = (timeInMinutes: number): number => {
    const words = this.input.length / this.AVERAGE_WORD_LENGTH;
    return Math.round(words / timeInMinutes);
  };

  private calculateAccuracy = () => {
    if (!this.input.length) return { accuracy: 100, mistakes: 0 };

    let mistakes = 0;
    for (let i = 0; i < this.input.length; i++) {
      if (this.input[i] !== this.text[i]) {
        mistakes++;
      }
    }
    const accuracy = ((this.input.length - mistakes) / this.input.length) * 100;
    return { accuracy: Math.round(accuracy), mistakes };
  };
}
