import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntervalQuizComponent } from './interval-quiz/interval-quiz.component';
import { ChordQuizComponent } from './chord-quiz/chord-quiz.component';
import { NoteIdentificationQuizComponent } from './note-identification-quiz/note-identification-quiz.component';
import { ChordIdentificationQuizComponent } from './chord-identification-quiz/chord-identification-quiz.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FreatboardComponent } from './freatboard/freatboard.component';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    IntervalQuizComponent,
    ChordQuizComponent,
    NoteIdentificationQuizComponent,
    ChordIdentificationQuizComponent,
    FreatboardComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  exports: [FreatboardComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
