import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Tone from 'tone';

interface ChordDefinition {
  type: string;
  intervals: number[]; // Semitones from the root
}

interface Note {
  name: string;
  value: number;
}

interface ChordOption {
  notes: string[];
}

@Component({
  selector: 'app-chord-quiz',
  templateUrl: './chord-quiz.component.html',
  styleUrls: ['./chord-quiz.component.scss']
})
export class ChordQuizComponent implements OnInit, OnDestroy {
  showHint = false;
  chordDefinitions: ChordDefinition[] = [
    { type: 'major', intervals: [0, 4, 7] },
    { type: 'minor', intervals: [0, 3, 7] }
    // Add more chord types if you like
  ];

  notes: Note[] = [
    { name: 'C', value: 0 }, { name: 'C#', value: 1 }, { name: 'D', value: 2 }, { name: 'D#', value: 3 },
    { name: 'E', value: 4 }, { name: 'F', value: 5 }, { name: 'F#', value: 6 }, { name: 'G', value: 7 },
    { name: 'G#', value: 8 }, { name: 'A', value: 9 }, { name: 'A#', value: 10 }, { name: 'B', value: 11 }
  ];

  currentRootNote: Note | undefined;
  currentChordDefinition: ChordDefinition | undefined;
  chordOptions: ChordOption[] = [];
  userAnswer: ChordOption | undefined;
  score: number = 0;
  message: string = '';
  synth: Tone.PolySynth | undefined;

  ngOnInit(): void {
    this.synth = new Tone.PolySynth().toDestination();
    this.nextQuestion();
  }

  ngOnDestroy(): void {
    if (this.synth) {
      this.synth.dispose();
    }
  }

  nextQuestion(): void {
    this.currentRootNote = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.currentChordDefinition = this.chordDefinitions[Math.floor(Math.random() * this.chordDefinitions.length)];
    this.chordOptions = this.generateChordOptions(this.currentRootNote, this.currentChordDefinition);
    this.userAnswer = undefined;
    this.message = '';
  }

  generateChordOptions(rootNote: Note, correctChordDef: ChordDefinition): ChordOption[] {
    const correctNotes = this.calculateChordNotes(rootNote, correctChordDef);
    const options: ChordOption[] = [{ notes: correctNotes }];

    while (options.length < 4) {
      const incorrectNotes = this.generateIncorrectChord(rootNote, correctChordDef);
      if (!options.some(option => JSON.stringify(option.notes.sort()) === JSON.stringify(incorrectNotes.sort()))) {
        options.push({ notes: incorrectNotes });
      }
    }

    return this.shuffleArray(options);
  }

  calculateChordNotes(root: Note, chordDef: ChordDefinition): string[] {
    return chordDef.intervals.map(interval => {
      const noteValue = (root.value + interval) % 12;
      return this.notes.find(note => note.value === noteValue)!.name;
    }).sort();
  }

  generateIncorrectChord(rootNote: Note, correctChordDef: ChordDefinition): string[] {
    const incorrectIntervals = correctChordDef.intervals.map(interval => {
      let newInterval = interval + Math.floor(Math.random() * 3) - 1; // Slightly alter the intervals (-1, 0, or +1 semitone)
      if (newInterval < 0) newInterval = 0;
      return newInterval;
    });
    return incorrectIntervals.map(interval => {
      const noteValue = (rootNote.value + interval) % 12;
      return this.notes.find(note => note.value === noteValue)!.name;
    }).sort();
  }

  playChord(chordNotes: string[]): void {
    if (this.synth && this.currentRootNote) {
      const notesToPlay = chordNotes.map(note => note + '4');
      this.synth.triggerAttackRelease(notesToPlay, '0.5');
    }
  }

  selectAnswer(option: ChordOption): void {
    this.userAnswer = option;
    this.playChord(option.notes);
  }

  submitAnswer(): void {
    const correctNotes = this.calculateChordNotes(this.currentRootNote!, this.currentChordDefinition!);
    if (this.userAnswer && JSON.stringify(this.userAnswer.notes.sort()) === JSON.stringify(correctNotes)) {
      this.message = 'Correct!';
      this.score++;
    } else {
      this.message = `Incorrect. The correct notes for ${this.currentRootNote?.name} ${this.currentChordDefinition?.type} were: ${correctNotes.join(', ')}.`;
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