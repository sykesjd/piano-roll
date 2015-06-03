# piano-roll

This repository stores experiments in creating an in-browser piano roll from a MIDI file. It contains the following things of import:

## MIDItoJSON.py
MIDItoJSON uses a modified version of EchoNest Remix's MIDI API to convert a MIDI file into a JSON file readable by the roll pages. It is executed by providing the MIDI file as a command line argument like so:

```
python MIDItoJSON.py <name_of_midi_file>

# for example
python MIDItoJSON.py BWV552.mid
```

You will be prompted to provide the name of the work, the composer of the work, and the type of roll with which the piece will be represented, where the roll type is denoted as an integer like so:

* 0: Voice roll - each track in the piece is treated as a voice in a fugue and is assigned a color to represent the voice
* 1: Song roll - the first and second tracks are treated as melody and counter-melody and are given piano roll bars, while all other tracks are treated as accompaniment and are given diamond notes instead
* 2: Solo roll - the color of the note depends on its pitch rather than its voice; good for works where voices are not clear-cut and a melody-accompaniment structure is not definable
* 3: Orchestra roll - each track is treated like an instrument in an orchestra and given a different _shape_ (see MIDItoJSON); color depends on pitch

If you indicate that you want an orchestra roll, in addition to being prompted for work and composer name, you will be prompted for the instrument type of each track, where the instrument type is denoted as an integer like so:

* 0: for a flute instrument, such as flute or piccolo
* 1: for a double reed instrument, such as oboe or bassoon
* 2: for a single reed instrument, such as clarinet or recorder
* 3: for a conical bore brass instrument, such as French horn or cornet
* 4: for a cylindrical bore brass instrument, such as trumpet or trombone
* 5: for a bowed string instrument, such as violin or cello
* 6: for a plucked string instrument, such as harp or guitar
* 7: for a keyboard instrument, such as piano or harpsichord
* 8: for a pitched percussion instrument, such as timpani or marimba
* 9: for an unpitched percussion instrument, such as snare or cymbal

The output will be a JSON file where each track has an assigned number, instrument type, and list of note objects.

## Roll Page

The roll page takes the JSON representation of a MIDI file and draws a piano roll onto the screen which animates with its accompanying MP3. The style of the roll depends on the mode taken (see above).

---

This work is still in progress; future changes will include:

* Moving the calculations involved in getting notes on the screen to the server from the client to remove the possibility of freezing browsers
* UI improvements for the buttons
* Lyrics on vocal notes
* Motif view: Notes that are part of a motif or subject will be given visual precedence in some manner
* Matching MIDI to real performance: currently, the MIDI and MP3 files are coming from the same source; in the future, I would like to be able to align a MIDI file to an external performance - because MIDI Wagner clearly doesn't cut it
* More pieces, of course