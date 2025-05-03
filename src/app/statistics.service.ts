import { Injectable } from '@angular/core';

export interface QuizStatistic {
  quizName: string;
  score: number;
  timeTakenInSeconds: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly storageKey = 'quiz-statistics';

  save(stat: QuizStatistic): void {
    const existing: QuizStatistic[] = JSON.parse(
      localStorage.getItem(this.storageKey) || '[]'
    );
    existing.push(stat);
    localStorage.setItem(this.storageKey, JSON.stringify(existing));
  }

  getAll(): QuizStatistic[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  getByQuiz(quizName: string): QuizStatistic[] {
    return this.getAll().filter((stat) => stat.quizName === quizName);
  }
}
