/**
 * MIDItoJSON.js: NodeJS script converting a MIDI file to a JSON readable by the Piano Roll page
 */
'use strict';

const STOMUS = 1000000.0;
const STOPX = 60.0;
const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
const MidiEvents = require('midievents');

/*
 * Ensure MIDI file name is provided
 */
if (process.argv.length < 3 || require('path').extname(process.argv[2]) !== '.mid') {
	console.log('Usage: node MIDItoJSON.js <midiFileName>');
	process.exit(-1);
}

/*
 * Get MIDI file then convert to JSON file using user-inputed metadata
 */
require('fs').readFile(process.argv[2], (err, buffer) => {
	if (err) throw err;
	tools.getInfoFromUser((meta) => {
		let midiFile = new (require('midifile'))(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
		let trackEvents = tools.getTrackEventsObject(midiFile);
		let notesObj = tools.eventsToNotes(trackEvents);
		let jsonToWrite = tools.addMetadata(notesObj, meta);
		let fileName = 'JSON/' + process.argv[2].split('.')[0] + '.json';
		require('jsonfile').writeFile(fileName, jsonToWrite, (e) => {
			if (e) throw e;
			console.log('MIDI successfully converted to JSON at ' + fileName);
			process.exit(0);
		});
	});
});

/*
 * Helper functions for the above script
 */
const tools = {
	/*
	 * Get piece metadata from the user
	 */
	getInfoFromUser: (callback) => {
		rl.question('Enter work name: ', (workname) => {
			rl.question('Enter composer name: ', (composer) => {
				console.log('Roll types - 0: Voice; 1: Song; 2: Solo; 3: Orchestra');
				rl.question('Enter roll type number: ', (rolltype) => {
					callback({
						workName: workname,
						composer: composer,
						rollType: parseInt(rolltype)
					});
				});
			});
		});
	},
	/*
	 * Extract instrument type and note events for each track
	 */
	getTrackEventsObject: (midiFile) => {
		let teobj = {
			tracks: []
		};
		for (let i = 0; i < midiFile.header.getTracksCount(); i++) {
			teobj.tracks.push({
				number: i,
				instrumentType: 4,
				noteEvents: []
			});
		}
		let events = midiFile.getMidiEvents();
		events.forEach((midiEvent) => {
			if (midiEvent.subtype === MidiEvents.EVENT_MIDI_PROGRAM_CHANGE) {
				teobj.tracks[midiEvent.track].instrumentType = tools.instrumentType(midiEvent.param1);
			} else if (midiEvent.subtype === MidiEvents.EVENT_MIDI_NOTE_OFF || midiEvent.subtype === MidiEvents.EVENT_MIDI_NOTE_ON) {
				teobj.tracks[midiEvent.track].noteEvents.push({
					eventType: midiEvent.subtype,
					note: midiEvent.param1,
					time: midiEvent.playTime / STOMUS * STOPX
				});
			}
		});
		return teobj;
	},
	/*
	 * Convert note on and note off events into note objects
	 */
	eventsToNotes: (trackEvents) => {
		let notesObj = {
			tracks: []
		};
		trackEvents.tracks.forEach((track) => {
			notesObj.tracks.push({
				number: track.number,
				type: track.instrumentType,
				notes: []
			});
			let startTemp = {};
			track.noteEvents.forEach((noteEvent) => {
				if (noteEvent.eventType === MidiEvents.EVENT_MIDI_NOTE_ON) {
					startTemp[noteEvent.note] = {
						time: noteEvent.time
					};
				} else {
					notesObj.tracks[track.number].notes.push({
						start: startTemp[noteEvent.note].time,
						end: noteEvent.time,
						pitch: noteEvent.note
					});
					delete startTemp[noteEvent.note];
				}
			});
		});
		return notesObj;
	},
	/*
	 * Add user-inputed metadata to JSON to write to file
	 */
	addMetadata: (notesObj, meta) => {
		return {
			name: meta.workName,
			composer: meta.composer,
			rolltype: meta.rollType,
			allnotes: notesObj
		};
	},
	/*
	 * Get the instrument type from the General MIDI Level 1 instrument number
	 */
	instrumentType: (gmNum) => {
		if (tools.between(gmNum, 72, 79))
	        return 0;
	    else if (tools.between(gmNum, 21, 23) || tools.between(gmNum, 68, 70))
	        return 1;
	    else if (tools.between(gmNum, 64, 67) || gmNum == 71 || gmNum == 109)
	        return 2;
	    else if (tools.between(gmNum, 0, 7) || tools.between(gmNum, 16, 20) || tools.between(gmNum, 38, 39) || tools.between(gmNum, 80, 95))
	        return 7;
	    else if (tools.between(gmNum, 24, 37) || gmNum == 46 || tools.between(gmNum, 104, 107))
	        return 6;
	    else if (tools.between(gmNum, 8, 15) || gmNum == 47 || gmNum == 108 || gmNum == 114 || gmNum == 117)
	        return 8;
	    else if (tools.between(gmNum, 40, 51) || gmNum == 55 || tools.between(gmNum, 110, 111))
	        return 5;
	    else if (tools.between(gmNum, 96, 103) || tools.between(gmNum, 112, 127))
	        return 9;
	    else if (gmNum == 58 || gmNum == 60)
	        return 3;
	    else if (tools.between(gmNum, 52, 63))
	        return 4;
	    else // instrument number not in GM1 spec; give rectangle shape
	        return 4;
	},
	/*
	 * Return whether gmNum is between low and high inclusive
	 */
	between: (gmNum, low, high) => gmNum >= low && gmNum <= high
};
