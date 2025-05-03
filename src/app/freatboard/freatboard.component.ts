import { Component, Input } from '@angular/core';
interface Note {
  name: string;
  value: number; // Representing a numerical value for calculation
}

@Component({
  selector: 'app-freatboard',
  templateUrl: './freatboard.component.html',
  styleUrls: ['./freatboard.component.scss']
})
export class FreatboardComponent {   
  showFretboard = false;
  showAllNotes = false; 
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

  @Input()
  highlightedNotes: Note[] = []; // Array of highlighted notes

  getNoteOnFret(stringNote: string, fret: number): string {
    const stringNoteValue = this.notes.find(note => note.name === stringNote)!.value;
    const noteValue = (stringNoteValue + fret) % 12;
    return this.notes.find(note => note.value === noteValue)!.name;
  }

  isHighlighted(stringNote: string, fret: number): boolean {
    const noteOnFret = this.getNoteOnFret(stringNote, fret);
    return this.highlightedNotes.some(x => x.name === noteOnFret);
  }


}
