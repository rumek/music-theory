import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntervalQuizComponent } from './interval-quiz/interval-quiz.component';
import { ChordQuizComponent } from './chord-quiz/chord-quiz.component';
import { NoteIdentificationQuizComponent } from './note-identification-quiz/note-identification-quiz.component';
import { ChordIdentificationQuizComponent } from './chord-identification-quiz/chord-identification-quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    IntervalQuizComponent,
    ChordQuizComponent,
    NoteIdentificationQuizComponent,
    ChordIdentificationQuizComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
