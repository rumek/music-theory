import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Tone from 'tone';

interface Note {
  name: string;
  value: number;
  octave: number;
  full: string; // e.g., "C#4"
}

@Component({
  selector: 'app-note-identification-quiz',
  templateUrl: './note-identification-quiz.component.html',
  styleUrls: ['./note-identification-quiz.component.scss']
})
export class NoteIdentificationQuizComponent implements OnInit, OnDestroy {
  readonly baseNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  readonly minimalSet = ['A', 'C', 'D', 'E', 'G'];

  allNotes: Note[] = [];
  selectedBaseNotes: string[] = [];
  selectedNotes: Note[] = [];

  mode: 'minimal' | 'advanced' | 'custom' = 'advanced';

  currentNote: Note | undefined;
  options: Note[] = [];
  userAnswer: Note | undefined;
  score: number = 0;
  message: string = '';
  attempts: number = 0;
  fails: number = 0;
  maxAttempts: number = 2;
  synth: Tone.Synth | undefined;

  ngOnInit(): void {
    this.synth = new Tone.Synth().toDestination();
    this.generateAllGuitarNotes();
    this.loadPreferences();
    this.nextQuestion();
  }

  ngOnDestroy(): void {
    this.synth?.dispose();
  }

  generateAllGuitarNotes(): void {
    for (let octave = 2; octave <= 4; octave++) {
      for (let i = 0; i < this.baseNotes.length; i++) {
        const name = this.baseNotes[i];
        const full = `${name}${octave}`;
        const midi = Tone.Frequency(full).toMidi();
        const low = Tone.Frequency('E2').toMidi();
        const high = Tone.Frequency('E4').toMidi();

        if (midi >= low && midi <= high) {
          this.allNotes.push({ name, value: i, octave, full });
        }
      }
    }
  }

  setMode(mode: 'minimal' | 'advanced' | 'custom'): void {
    this.mode = mode;

    if (mode === 'minimal') {
      this.selectedBaseNotes = [...this.minimalSet];
    } else if (mode === 'advanced') {
      this.selectedBaseNotes = [...this.baseNotes];
    }

    this.updateSelectedNotes();
    this.savePreferences();
  }

  toggleBaseNoteSelection(note: string): void {
    const index = this.selectedBaseNotes.indexOf(note);
    if (index >= 0) {
      if (this.selectedBaseNotes.length > 5) {
        this.selectedBaseNotes.splice(index, 1);
      } else {
        alert('At least 5 base notes must be selected.');
        return;
      }
    } else {
      this.selectedBaseNotes.push(note);
    }
    this.mode = 'custom';
    this.updateSelectedNotes();
    this.savePreferences();
  }

  updateSelectedNotes(): void {
    this.selectedNotes = this.allNotes.filter(n => this.selectedBaseNotes.includes(n.name));
  }

  isBaseNoteSelected(note: string): boolean {
    return this.selectedBaseNotes.includes(note);
  }

  nextQuestion(): void {
    this.attempts = 0;
    const pool = this.selectedNotes.length >= 5 ? this.selectedNotes : this.allNotes;
    this.currentNote = pool[Math.floor(Math.random() * pool.length)];
    this.options = this.generateOptions(this.currentNote, pool);
    this.userAnswer = undefined;
    this.message = '';
    this.playCurrentNote();
  }

  generateOptions(correctNote: Note, pool: Note[]): Note[] {
    const options = [correctNote];
    while (options.length < 4) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      if (!options.some(n => n.full === rand.full)) {
        options.push(rand);
      }
    }
    return this.shuffleArray(options);
  }

  shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  playCurrentNote(): void {
    if (this.synth && this.currentNote) {
      this.synth.triggerAttackRelease(this.currentNote.full, '0.7');
    }
  }

  playE(): void {
    this.synth?.triggerAttackRelease('E4', '0.7');
  }

  selectAnswer(note: Note): void {
    this.synth?.triggerAttackRelease(note.full, '0.7');
    this.userAnswer = note;
    this.submitAnswer();
  }

  submitAnswer(): void {
    if (!this.userAnswer || !this.currentNote) return;

    if (this.userAnswer.full === this.currentNote.full) {
      this.message = 'Correct!';
      this.score++;
      setTimeout(() => this.nextQuestion(), 1500);
    } else {
      this.attempts++;
      this.fails++;
      if (this.attempts >= this.maxAttempts) {
        this.message = `Incorrect. The correct note was ${this.currentNote.full}.`;
        setTimeout(() => this.nextQuestion(), 1500);
      } else {
        this.message = 'Try again!';
      }
    }
  }

  savePreferences(): void {
    localStorage.setItem('noteQuiz_mode', this.mode);
    localStorage.setItem('noteQuiz_baseNotes', JSON.stringify(this.selectedBaseNotes));
  }

  loadPreferences(): void {
    const savedMode = localStorage.getItem('noteQuiz_mode') as 'minimal' | 'advanced' | 'custom';
    const saved = localStorage.getItem('noteQuiz_baseNotes');

    if (savedMode) this.mode = savedMode;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.selectedBaseNotes = parsed.filter((n: string) => this.baseNotes.includes(n));
        }
      } catch {}
    }

    if (this.selectedBaseNotes.length < 5) {
      this.setMode('advanced');
    } else {
      this.updateSelectedNotes();
    }
  }
}
