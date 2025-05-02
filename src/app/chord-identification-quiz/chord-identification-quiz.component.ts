import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Tone from 'tone';

interface ChordDefinition {
  type: string;
  intervals: number[];
}

interface Note {
  name: string;
  value: number;
}

interface ChordOption {
  type: string;
  rootNote: string;
}

@Component({
  templateUrl: './chord-identification-quiz.component.html',
  styleUrls: ['./chord-identification-quiz.component.scss']
})
export class ChordIdentificationQuizComponent implements OnInit, OnDestroy {
  chordDefinitions: ChordDefinition[] = [
    { type: 'major', intervals: [0, 4, 7] },
    { type: 'minor', intervals: [0, 3, 7] }
  ];

  notes: Note[] = [
    { name: 'C', value: 0 }, { name: 'C#', value: 1 }, { name: 'D', value: 2 }, { name: 'D#', value: 3 },
    { name: 'E', value: 4 }, { name: 'F', value: 5 }, { name: 'F#', value: 6 }, { name: 'G', value: 7 },
    { name: 'G#', value: 8 }, { name: 'A', value: 9 }, { name: 'A#', value: 10 }, { name: 'B', value: 11 }
  ];

  currentChordDefinition: ChordDefinition | undefined;
  rootNote: Note | undefined;
  options: ChordOption[] = [];
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
    this.currentChordDefinition = this.chordDefinitions[Math.floor(Math.random() * this.chordDefinitions.length)];
    this.rootNote = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.options = this.generateOptions(this.rootNote);
    this.userAnswer = undefined;
    this.message = '';
    this.playCurrentChord();
  }

  generateOptions(currentRootNote: Note): ChordOption[] {
    const options: ChordOption[] = [];
    const majorOption: ChordOption = { type: 'major', rootNote: currentRootNote.name };
    const minorOption: ChordOption = { type: 'minor', rootNote: currentRootNote.name };

    // Ensure both major and minor of the current root are always options
    options.push(majorOption);
    options.push(minorOption);

    // Add two more options, which could be major or minor of *different* root notes
    while (options.length < 4) {
      const randomRootNote = this.notes[Math.floor(Math.random() * this.notes.length)].name;
      const randomType = this.chordDefinitions[Math.floor(Math.random() * this.chordDefinitions.length)].type;
      const newOption: ChordOption = { type: randomType, rootNote: randomRootNote };
      if (!options.some(option => option.type === newOption.type && option.rootNote === newOption.rootNote)) {
        options.push(newOption);
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

  playCurrentChord(): void {
    if (this.synth && this.rootNote && this.currentChordDefinition) {
      const chordNotes = this.calculateChordNotes(this.rootNote, this.currentChordDefinition);
      const notesToPlay = chordNotes.map(note => note + '4');
      this.synth.triggerAttackRelease(notesToPlay, '0.8');
    }
  }

  selectAnswer(option: ChordOption): void {
    this.userAnswer = option;
  }

  submitAnswer(): void {
    if (this.userAnswer && this.currentChordDefinition &&
        this.userAnswer.type === this.currentChordDefinition.type &&
        this.userAnswer.rootNote === this.rootNote?.name) {
      this.message = 'Correct!';
      this.score++;
    } else {
      this.message = `Incorrect. The correct chord was ${this.rootNote?.name} ${this.currentChordDefinition?.type}.`;
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