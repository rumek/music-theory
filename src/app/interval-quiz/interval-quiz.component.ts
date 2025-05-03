import { Component, OnInit } from '@angular/core';
import * as Tone from 'tone';

interface Interval {
  name: string;
  semitones: number;
}

interface Note {
  name: string;
  value: number; // Representing a numerical value for calculation
}

@Component({
  selector: 'app-interval-quiz',
  templateUrl: './interval-quiz.component.html',
  styleUrls: ['./interval-quiz.component.scss'],
})
export class IntervalQuizComponent implements OnInit {
  synth: Tone.Synth | undefined;
  showHint = false;
  intervals: Interval[] = [
    { name: 'sekunda mała', semitones: 1 },
    { name: 'sekunda wielka', semitones: 2 },
    { name: 'tercja mała', semitones: 3 },
    { name: 'tercja wielka', semitones: 4 },
    { name: 'kwarta czysta', semitones: 5 },
    { name: 'tryton', semitones: 6 },
    { name: 'kwinta czysta', semitones: 7 },
    { name: 'seksta mała', semitones: 8 },
    { name: 'seksta wielka', semitones: 9 },
    { name: 'septyma mała', semitones: 10 },
    { name: 'septyma wielka', semitones: 11 },
  ];

  notes: Note[] = [
    { name: 'C', value: 0 },
    { name: 'C#', value: 1 },
    { name: 'D', value: 2 },
    { name: 'D#', value: 3 },
    { name: 'E', value: 4 },
    { name: 'F', value: 5 },
    { name: 'F#', value: 6 },
    { name: 'G', value: 7 },
    { name: 'G#', value: 8 },
    { name: 'A', value: 9 },
    { name: 'A#', value: 10 },
    { name: 'B', value: 11 },
  ];

  guitarStrings: string[] = ['E', 'B', 'G', 'D', 'A', 'E']; // Corrected standard tuning (low to high E)
  frets: number[] = Array.from({ length: 12 }, (_, i) => i); // Display first 12 frets

  currentInterval: Interval | undefined;
  note1: Note | undefined;
  note2: Note | undefined;
  options: Interval[] = [];
  userAnswer: Interval | undefined;
  score: number = 0;
  message: string = '';

  ngOnInit(): void {
    this.synth = new Tone.Synth().toDestination(); // Create a synthesizer
    this.nextQuestion();
  }

  nextQuestion(): void {
    this.currentInterval =
      this.intervals[Math.floor(Math.random() * this.intervals.length)];
    const rootNoteIndex = Math.floor(Math.random() * this.notes.length);
    this.note1 = this.notes[rootNoteIndex];
    const note2Value = (this.note1.value + this.currentInterval.semitones) % 12;
    this.note2 = this.notes.find((note) => note.value === note2Value);

    // Generate random options, including the correct answer
    this.options = this.generateOptions(this.currentInterval);
    this.userAnswer = undefined;
    this.message = '';
  }

  generateOptions(correctAnswer: Interval): Interval[] {
    const options = [correctAnswer];
    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * this.intervals.length);
      const randomInterval = this.intervals[randomIndex];
      if (!options.some((option) => option.name === randomInterval.name)) {
        options.push(randomInterval);
      }
    }
    // Shuffle the options
    return this.shuffleArray(options);
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  playNote(noteName: string): void {
    if (this.synth) {
      this.synth.triggerAttackRelease(noteName + '4', '0.5'); // Play the note at octave 4 for 0.5 seconds
    }
  }

  selectAnswer(interval: Interval): void {
    this.userAnswer = interval;
    if (this.note1) {
      this.playNote(this.note1.name);
    }
    if (this.note2) {
      // Calculate the actual second note based on the selected interval
      const note2Value = (this.note1!.value + interval.semitones) % 12;
      const actualNote2 = this.notes.find((note) => note.value === note2Value);
      if (actualNote2) {
        this.playNote(actualNote2.name);
      }
    }
  }

  submitAnswer(): void {
    if (
      this.userAnswer &&
      this.currentInterval &&
      this.userAnswer.name === this.currentInterval.name
    ) {
      this.message = 'Correct!';
      this.score++;
    } else {
      this.message = `Incorrect. The correct interval was ${this.currentInterval?.name}.`;
    }
    setTimeout(() => this.nextQuestion(), 1500);
  }
}
