// src/app/statistics/statistics.component.ts

import { Component, OnInit } from '@angular/core';
import { StatisticsService, QuizStatistic } from '../statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  stats: QuizStatistic[] = [];

  constructor(private statsService: StatisticsService) {}

  ngOnInit(): void {
    this.stats = this.statsService
      .getAll()
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  clearStats(): void {
    if (confirm('Clear all statistics?')) {
      this.statsService.clear();
      this.stats = [];
    }
  }
}
