import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Tone from 'tone';

interface Note {
  name: string;
  value: number;
}

@Component({
  selector: 'app-note-identification-quiz',
  templateUrl: './note-identification-quiz.component.html',
  styleUrls: ['./note-identification-quiz.component.scss']
})
export class NoteIdentificationQuizComponent implements OnInit, OnDestroy {
  notes: Note[] = [
    { name: 'C', value: 0 }, { name: 'C#', value: 1 }, { name: 'D', value: 2 }, { name: 'D#', value: 3 },
    { name: 'E', value: 4 }, { name: 'F', value: 5 }, { name: 'F#', value: 6 }, { name: 'G', value: 7 },
    { name: 'G#', value: 8 }, { name: 'A', value: 9 }, { name: 'A#', value: 10 }, { name: 'B', value: 11 }
  ];

  currentNote: Note | undefined;
  options: Note[] = [];
  userAnswer: Note | undefined;
  score: number = 0;
  message: string = '';
  synth: Tone.Synth | undefined;

  ngOnInit(): void {
    this.synth = new Tone.Synth().toDestination();
    this.nextQuestion();
  }

  ngOnDestroy(): void {
    if (this.synth) {
      this.synth.dispose();
    }
  }

  nextQuestion(): void {
    this.currentNote = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.options = this.generateOptions(this.currentNote);
    this.userAnswer = undefined;
    this.message = '';
    this.playCurrentNote();
  }

  generateOptions(correctNote: Note): Note[] {
    const options = [correctNote];
    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * this.notes.length);
      const randomNote = this.notes[randomIndex];
      if (!options.some(option => option.name === randomNote.name)) {
        options.push(randomNote);
      }
    }
    return this.shuffleArray(options);
  }

  playCurrentNote(): void {
    if (this.synth && this.currentNote) {
      this.synth.triggerAttackRelease(this.currentNote.name + '4', '0.7');
    }
  }

  selectAnswer(note: Note): void {
    this.userAnswer = note;
  }

  submitAnswer(): void {
    if (this.userAnswer && this.currentNote && this.userAnswer.name === this.currentNote.name) {
      this.message = 'Correct!';
      this.score++;
    } else {
      this.message = `Incorrect. The correct note was ${this.currentNote?.name}.`;
    }
    setTimeout(() => this.nextQuestion(), 1500);
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}