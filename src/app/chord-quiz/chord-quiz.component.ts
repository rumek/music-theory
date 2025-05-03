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
  correctNotes: Note[] = [];


  get highlightedNotes(): Note[] {
    return this.chordOptions.flatMap(option => option.notes.map(noteName => this.notes.find(note => note.name === noteName)!));
  }

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
  const options: ChordOption[] = [];
  const usedNoteSets = new Set<string>();

  // 1. Add correct chord
  const correctNotes = this.calculateChordNotes(rootNote, correctChordDef).sort();
  this.correctNotes = [rootNote, ...correctNotes.map(noteName => this.notes.find(note => note.name === noteName)!)];
  console.log('Correct Notes:', correctNotes);
  const correctKey = correctNotes.join(',');
  options.push({ notes: correctNotes });
  usedNoteSets.add(correctKey);

  // 2. Generate 3 unique wrong chords
  while (options.length < 4) {
    const altRoot = this.getRandomNote();
    const altChordDef = this.getRandomChordDefinition();

    const chordNotes = this.calculateChordNotes(altRoot, altChordDef).sort();
    const key = chordNotes.join(',');

    if (!usedNoteSets.has(key)) {
      usedNoteSets.add(key);
      options.push({ notes: chordNotes });
    }
  }

  return this.shuffleArray(options);
}


getRandomNote(): Note {
  return this.notes[Math.floor(Math.random() * this.notes.length)];
}

getRandomChordDefinition(): ChordDefinition {
  return this.chordDefinitions[Math.floor(Math.random() * this.chordDefinitions.length)];
}

  calculateChordNotes(root: Note, chordDef: ChordDefinition): string[] {
    return chordDef.intervals.map(interval => {
      const noteValue = (root.value + interval) % 12;
      return this.notes.find(note => note.value === noteValue)!.name;
    }).sort();
  }

generateIncorrectChord(rootNote: Note, correctChordDef: ChordDefinition): string[] {
  const correctNotes = this.calculateChordNotes(rootNote, correctChordDef);
  const incorrectNotes = [...correctNotes];

  const strategy = Math.random();

  if (strategy < 0.5) {
    // Change one note to a random note not in the chord
    const noteToChangeIndex = Math.floor(Math.random() * incorrectNotes.length);
    const availableNotes = this.notes
      .map(n => n.name)
      .filter(n => !incorrectNotes.includes(n));

    const newNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
    incorrectNotes[noteToChangeIndex] = newNote;
  } else {
    // Use a different chord definition
    let otherDef: ChordDefinition;
    do {
      otherDef = this.chordDefinitions[Math.floor(Math.random() * this.chordDefinitions.length)];
    } while (otherDef.type === correctChordDef.type);

    return this.calculateChordNotes(rootNote, otherDef);
  }

  return incorrectNotes;
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