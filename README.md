# piano-roll

This repository stores experiments in creating an in-browser piano roll from a MIDI file. It contains the following things of import:

## MIDItoJSON.py
MIDItoJSON uses a modified version of EchoNest Remix's MIDI API to convert a MIDI file into a JSON file readable by the roll page. It is executed by providing the MIDI file as a command line argument like so:

```
python MIDItoJSON.py <name_of_midi_file>

# for example
python MIDItoJSON.py BWV552.mid
```

You will be prompted to provide the name of the work, the composer of the work, and the type of roll with which the piece will be represented, where the roll type is denoted as an integer like so:

* 0: Voice roll - each track in the piece is treated as a voice in a fugue and is assigned a color to represent the voice
* 1: Song roll - the first and second tracks are treated as melody and counter-melody and are given piano roll bars, while all other tracks are treated as accompaniment and are given diamond notes instead
* 2: Solo roll - the color of the note depends on its pitch rather than its voice; good for works where voices are not clear-cut and a melody-accompaniment structure is not definable
* 3: Orchestra roll - each track is treated like an instrument in an orchestra and given a different _shape_ depending on the type of instrument (see comments in common.js); color depends on pitch

The output will be a JSON file where each track has an assigned number, instrument type, and list of note objects.

## Motify

Motify is an optional stage in finalizing the JSON file for the roll page in which the user selects the notes in the piece which are parts of motifs or subjects. A roll is printed on the screen and notes are selected/deselected with mouse clicks and arrow keys, with an indication as to which motifs the note belongs via the select box.

Upon finishing selecting all the appropriate notes, the user can then print the new JSON to the console, which the user can copy and paste over the old contents of the JSON file. The new JSON will be the same as the old JSON except each note object will also contain a list of motifs of which it is a part.

## Lyricize

Lyricize is another optional stage in finalizing the JSON file for the roll page in which the user adds lyrics to the notes in a choral work. A roll is printed on the screen, a note is selected with a mouse click, and successive notes are selected/deselected with space/tab (forward) or return (backward). The user enters lyrics into an input field at the bottom, which are then added to selected notes with the keys pressed above (press esc to clear the lyrics in a note).

Upon finishing entering all lyrics, the user can then print the new JSON to the console, which the user cna copy and paste over the old contents of the JSON file. The new JSON will be the same as the old JSON except each note object will also contain a lyric field.

## Roll Page

The roll page takes the JSON representation of a MIDI file and draws a piano roll onto the screen which animates with its accompanying MP3. The style of the roll depends on the mode taken (see above). If applicable, notes that are part of one or more motifs are highlighted, with each motif receiving a different color.

---

This work is still in progress; future changes will include:

* Matching MIDI to real performance: currently, the MIDI and MP3 files are coming from the same source; in the future, I would like to be able to align a MIDI file to an external performance - because MIDI Wagner clearly doesn't cut it
* More pieces, of course
* Moving the calculations involved in getting notes on the screen from the client to the server to remove the possibility of freezing browsers
  * I've learned the hard way that Github doesn't allow live hosting of PHP files, so this goal will have to come later
  * Perhaps a NodeJS implementation of this project would be feasible, but I will leave that task for last
