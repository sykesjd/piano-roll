# piano-roll

This repository stores experiments in creating an in-browser piano roll from a MIDI file. It contains the following things of import:

## MIDItoJSON.js

MIDItoJSON is a NodeJS script to convert a MIDI file into a JSON file readable by the roll page. It is executed by providing the MIDI file as a command line argument like so:

```
node MIDItoJSON.js <name_of_midi_file>

# for example
node MIDItoJSON.js BWV552.mid
```

You will be prompted to provide the name of the work, the composer of the work, and the type of roll with which the piece will be represented, where the roll type is denoted as an integer like so:

* 0: *Voice roll* - each track in the piece is treated as a voice in a fugue and is assigned a color to represent the voice
* 1: *Song roll* - the first and second tracks are treated as melody and counter-melody and are given piano roll bars, while all other tracks are treated as accompaniment and are given diamond notes instead
* 2: *Solo roll* - the color of the note depends on its pitch rather than its voice; good for works where voices are not clear-cut and a melody-accompaniment structure is not definable
* 3: *Orchestra roll* - each track is treated like an instrument in an orchestra and given a different _shape_ depending on the type of instrument; color depends on pitch

The output will be a JSON file where each track has an assigned number, instrument type, and list of note objects.

The script requires the `midifile` and `jsonfile` packages to be installed via npm.

## EditRoll

EditRoll is an optional stage in finalizing the JSON file for the roll page in which the user add motif/subject indications and lyrics to the piece. A roll is printed on the screen and is open to editing in two modes selected in the bottom left:
- *Motify*: notes are selected/deselected with mouse clicks and arrow keys, with an indication as to which motifs the note belongs via the select box in the bottom left
- *Lyricize*: a note is selected with a mouse click and successive notes are selected/deselected with space/tab (forward) or return (backward); the user enters lyrics into the input field at the bottom left, which are added to selected notes via pressing the aforementioned keys (press esc to clear the lyrics in a note)

Upon finishing adding all motifs and lyrics, the user then clicks on the "Get JSON" button, opening the edited JSON in a new tab which the user can save to replace the existing JSON file. The new JSON will be the same as the old JSON except each note object will also contain a list of motifs of which it is a part and a lyric field (empty if no lyric).

## Roll Page

The roll page takes the JSON representation of a MIDI file and draws a piano roll onto the screen which animates with its accompanying MP3. The style of the roll depends on the mode taken (see above). If applicable, notes that are part of one or more motifs are highlighted, with each motif receiving a different color.

---

This work is still in progress; future changes will include:

* More pieces, of course
* Matching MIDI to real performance: currently, the MIDI and MP3 files are coming from the same source; in the future, I would like to be able to align a MIDI file to an external performance - because MIDI Wagner clearly doesn't cut it
    * This task is beyond the scope of this project, I fear. A program such as http://www.ee.columbia.edu/ln/rosa/matlab/alignmidi/ provides the means to perform such alignment separate from this project.
