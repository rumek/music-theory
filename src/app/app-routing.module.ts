import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntervalQuizComponent } from './interval-quiz/interval-quiz.component';
import { ChordQuizComponent } from './chord-quiz/chord-quiz.component';
import { NoteIdentificationQuizComponent } from './note-identification-quiz/note-identification-quiz.component';
import { ChordIdentificationQuizComponent } from './chord-identification-quiz/chord-identification-quiz.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'interval-quiz',
    pathMatch: 'full'
  },
  {
    path: 'interval-quiz',
    component: IntervalQuizComponent
  },
  {
    path: 'chord-quiz',
    component: ChordQuizComponent
  },
  {
    path: 'chord-identitication-quiz',
    component: ChordIdentificationQuizComponent
  },
  {
    path: 'note-identitication-quiz',
    component: NoteIdentificationQuizComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
