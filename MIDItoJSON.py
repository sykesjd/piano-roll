"""
MIDItoJSON.py
Converts a MIDI file to a JSON readable by the Piano Roll program.

Uses a modified version of Echonest Remix's MIDIToText API; see relevant files in util folder.

Jesse David Sykes, 6 June 2015
"""

import os
import sys
import json
sys.path.append('./util')
from MidiInFile import MidiInFile
from MidiToText import MidiToText

usage = """
Usage:
	python MIDItoJSON.py <input_mid>

Example:
	python MIDItoJSON.py BWV552.midi
"""

"""
Tee: provides a means of piping standard output into a text file.

Usage:
	f = open('file','w')
	original = sys.stdout
	sys.stdout = Tee(sys.stdout, f)
	print "appears in file"
	sys.stdout = original
	print "doesn't appear in file"
	f.close()

Courtesy of Thrustmaster on StackOverflow, 4 Jul 2012
"""
class Tee(object):
	def __init__(self, *files):
		self.files = files
	def write(self, obj):
		for f in self.files:
			f.write(obj)

def main(input_filename):
	# get info from user
	(workname, composer, rolltype) = info()
	# remove extension from filename
	input_name = inputname(input_filename)
	# read in midi as text and write to a temporary file
	readmidi(input_filename,input_name)
	# reformat events into a list of lists, where each sublist is a track; zeroth track holds tempi
	(ntracks, division, tracks, parttypes) = converttoeventlists(input_name)
	# merge tracks together into a unified event log
	events = mergelogs(tracks)
	# change times on events from MIDI clocks to microseconds
	events = clockstomus(events, division)
	# convert pairs of events into note objects, times from microseconds to pixels
	notes = eventstonotes(ntracks, events)
	# package all info into one dictionary, write to JSON file
	jsonout(input_name, workname, composer, rolltype, notes, parttypes)
	# print success message
	print "JSON written to", input_name+'.json', "successfully!"
	# remove temporary file
	os.remove(input_name+"_temp.txt")

# gets piece info from user
def info():
	workname = raw_input("Enter work name: ")
	composer = raw_input("Enter composer name: ")
	print "What type of roll do you want?"
	print "0: Voice 1: Song 2: Solo 3: Orchestra"
	rolltype = int(raw_input("Enter type number: "))
	return (workname, composer, rolltype)

# strips filename of its extension
def inputname(filename):
	path, file = os.path.split(filename)
	return file.split('.')[0]

# uses MidiToText to read MIDI file
def readmidi(filename,name):
	midiIn = MidiInFile(MidiToText(), filename)
	with open(name+'_temp.txt','w') as tempOut:
		original = sys.stdout
		sys.stdout = Tee(tempOut)
		midiIn.read()
		sys.stdout = original

# converts MidiToText output to a list of lists containing note and tempi events
def converttoeventlists(name):
	with open(name+"_temp.txt",'r') as tempIn:
		line = tempIn.readline()
		division = int(line.split(" ")[-1])
		ntracks = int(line.split(' ')[3].split(',')[0])
		tracks = []
		tempi = []
		parttypes = []
		i = -1
		for line in tempIn:
			sections = line.split(' ')
			if sections[0] == "Start":
				tracks.append([])
				parttypes.append(0 if i == -1 else parttypes[i])
				i += 1
			elif sections[0] == "tempo:":
				tempi.append(["tempo",int(sections[1]),int(sections[3])])
			elif sections[0] == "patch_change":
				instrnum = int(sections[5], 16)
				percchannel = int(sections[3], 16) == 9
				parttypes[i] =  9 if percchannel else instrtype(instrnum)
			elif sections[0] == "note_on" or sections[0] == "note_off":
				tracks[i].append([sections[0],int(sections[5], 16),int(sections[-1])])
	tracks.insert(0, tempi)
	return (ntracks, division, tracks, parttypes)

# determines instrument type from instrument number using General MIDI Level 1 spec
def instrtype(gm1num):
	if between(gm1num, 72, 79):
		return 0
	elif between(gm1num, 21, 23) or between(gm1num, 68, 70):
		return 1
	elif between(gm1num, 64, 67) or gm1num == 71 or gm1num == 109:
		return 2
	elif between(gm1num, 0, 7) or between(gm1num, 16, 20) or between(gm1num, 80, 95):
		return 7
	elif between(gm1num, 24, 39) or gm1num == 46 or between(gm1num, 104, 107):
		return 6
	elif between(gm1num, 8, 15) or gm1num == 47 or gm1num == 108 or gm1num == 114 or gm1num == 117:
		return 8
	elif between(gm1num, 40, 51) or gm1num == 55 or between(gm1num, 110, 111):
		return 5
	elif between(gm1num, 96, 103) or between(gm1num, 112, 127):
		return 9
	elif gm1num == 58 or gm1num == 60:
		return 3
	elif between(gm1num, 52, 63):
		return 4
	else: # instrument number not in GM1 spec; give rectangle shape
		return 4

# helper method: returns true if gm1num between low and high inclusive
def between(gm1num,low,high):
	return gm1num >= low and gm1num <= high

# merges track event logs into one event log
def mergelogs(tracks):
	events = []
	newlength = 0
	for i in range(len(tracks)):
		newlength += len(tracks[i])
	for j in range(newlength):
		l = 0
		while not tracks[l]:
			l += 1
		fev = l
		mintime = tracks[l][0][2]
		for k in range(l+1,len(tracks)):
			if tracks[k] and tracks[k][0][2] < mintime:
				fev = k
				mintime = tracks[k][0][2]
		event = tracks[fev].pop(0)
		event[1] = str(event[1])
		event[2] = str(event[2])
		if event[0] == "note_on" or event[0] == "note_off":
			event.insert(0, str(fev-1))
		events.append(event)
	return events

# converts event time from MIDI clocks to microseconds
def clockstomus(events, division):
	newevents = []
	tempo = 0
	temppoint = 0
	temptemp = 0
	for event in events:
		if event[0] == 'tempo':
			temptemp = temptemp + (int(event[2])-temppoint)*tempo/division
			temppoint = int(event[2])
			tempo = int(event[1])
		elif event[0].isdigit():
			event[3] = str((int(event[3])-temppoint)*tempo/division+temptemp)+'\n'
			newevents.append(event)
	return newevents

# converts events to note objects, times from microseconds to pixels
def eventstonotes(ntracks, events):
	notes = []
	for i in range(ntracks):
		notes.append([])
	tempnon = []
	for event in events:
		if event[0].isdigit() and event[1] == 'note_on':
			tempnon.append(event)
		elif event[0].isdigit() and event[1] == 'note_off':
			newnote = {}
			newnote['pitch'] = int(event[2])
			for i in range(len(tempnon)):
				if tempnon[i][0] == event[0] and tempnon[i][2] == event[2]:
					break
			newnote['start'] = int(tempnon[i][3]) / 1000000.0 * 60
			tempnon.pop(i)
			newnote['end'] = int(event[3]) / 1000000.0 * 60
			notes[int(event[0])].append(newnote)
	return notes

# packages note objects into a dictionary, output the dict to JSON file
def jsonout(name, workname, composer, rolltype, notes, parttypes):
	notesobj = {}
	notesobj['name'] = workname
	notesobj['composer'] = composer
	notesobj['rolltype'] = rolltype
	notesobj['allnotes'] = {}
	notesobj['allnotes']['tracks'] = []
	trobj = notesobj['allnotes']['tracks']
	for i in range(len(notes)):
		trobj.append({})
		trobj[i]['number'] = i
		if rolltype == 3:
			trobj[i]['type'] = parttypes[i]
		else:
			trobj[i]['type'] = 4
		trobj[i]['notes'] = []
		for j in range(len(notes[i])):
			trobj[i]['notes'].append(notes[i][j])
	with open(name+'.json','w') as output:
		json.dump(notesobj, output)

if __name__ == '__main__':
	try:
		input_filename = sys.argv[1]
		if input_filename.split('.')[1] != 'mid':
			print "Not a standard MIDI file"
			sys.exit(-1)
	except:
		print usage
		sys.exit(-1)
	main(input_filename)
