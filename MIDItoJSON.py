"""
MIDItoJSON.py
Converts a MIDI file to a JSON readable by the Piano Roll program.

Uses a modified version of Echonest Remix's MIDIToText API; see relevant files in util folder.

Jesse David Sykes, 2 May 2015
"""

import os
import sys
import json
sys.path.append('./util')
from MidiInFile import MidiInFile
from MidiToText import MidiToText

ORCHESTRA = False

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
	workname = raw_input("Enter work name: ")
	composer = raw_input("Enter composer name: ")
	path, file = os.path.split(input_filename)
	input_name = file.split('.')[0]
	midiIn = MidiInFile(MidiToText(), input_filename)
	with open(input_name+'_p1.txt','w') as part1o:
		original = sys.stdout
		sys.stdout = Tee(part1o)
		midiIn.read()
		sys.stdout = original
	with open(input_name+"_p1.txt",'r') as part1i:
		line = dr.readline()
		division = int(line.split(" ")[-1])
		ntracks = int(line.split(' ')[3].split(',')[0])
		tracks = []
		tempi = []
		i = -1
		for line in part1i:
			sections = line.split(' ')
			if sections[0] == "Start":
				tracks.append([])
				i += 1
			elif sections[0] == "tempo:":
				tempi.append(["tempo",int(sections[1]),int(sections[3])])
			elif sections[0] == "note_on" or sections[0] == "note_off":
				tracks[i].append([sections[0],int(sections[5], 16),int(sections[-1])])
	if ORCHESTRA:
		print "You indicated this to be an orchestral work."
		parttypes = []
		print "Enter the type number of each part:"
		print "\t0: Flute\t1: Double Reed (e.g. Oboe)\t2: Single Reed (e.g. Clarinet)"
		print "\t3: Conical Bore (e.g. French horn)\t4:Cylindrical Bore (e.g. Trumpet)"
		print "\t5: Bowed (e.g. Violin)\t6: Plucked (e.g. Guitar)\t7: Keyboard"
		print "\t8: Pitched percussion\t9: Non-pitched percussion"
		for i in range(ntracks):
			parttypes.append(int(raw_input("Part " + str(i) + ": ")))
	tracks.insert(0, tempi)
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
	with open(input_name+"_p2.txt",'w') as part2o:
		for event in events:
			part2o.write(" ".join(event) + '\n')
	with open(input_name+"_p2.txt",'r') as part2i:
		with open(input_name+"_p3.txt",'w') as part3o:
			part3o.write(input_name+'\n\n')
			tempo = 0
			temppoint = 0
			temptemp = 0
			for line in part2i:
				sections = line.split(' ')
				if sections[0] == 'tempo':
					temptemp = temptemp + (int(sections[2])-temppoint)*tempo/division
					temppoint = int(sections[2])
					tempo = int(sections[1])
				elif sections[0].isdigit():
					sections[3] = str((int(sections[3])-temppoint)*tempo/division+temptemp)+'\n'
					part3o.write(' '.join(sections))
	notes = []
	for i in range(ntracks):
		notes.append([])
	tempnon = []
	with open(input_name+"_p3.txt",'r') as part3i:
		for line in part3i:
			sections = line.split(' ')
			if sections[0].isdigit() and sections[1] == 'note_on':
				tempnon.append(sections)
			elif sections[0].isdigit() and sections[1] == 'note_off':
				newnote = {}
				newnote['pitch'] = int(sections[2])
				for i in range(len(tempnon)):
					if tempnon[i][0] == sections[0] and tempnon[i][2] == sections[2]:
						break
				newnote['start'] = int(tempnon[i][3]) / 1000000.0 * 60
				tempnon.pop(i)
				newnote['end'] = int(sections[3]) / 1000000.0 * 60
				notes[int(sections[0])].append(newnote)
	notesobj = {}
	notesobj['name'] = workname
	notesobj['composer'] = composer
	notesobj['allnotes'] = {}
	notesobj['allnotes']['tracks'] = []
	trobj = notesobj['allnotes']['tracks']
	for i in range(len(notes)):
		trobj.append({})
		trobj[i]['number'] = i
		if ORCHESTRA:
			trobj[i]['type'] = parttypes[i]
		trobj[i]['notes'] = []
		for j in range(len(notes[i])):
			trobj[i]['notes'].append(notes[i][j])
	with open(input_name+'.json','w') as output:
		json.dump(notesobj, output)
	print "JSON written to", input_name+'.json', "successfully!"
	os.remove(input_name+"_p1.txt")
	os.remove(input_name+"_p2.txt")
	os.remove(input_name+"_p3.txt")

if __name__ == '__main__':
	try:
		input_filename = sys.argv[1]
		if input_filename.split('.')[1] != 'mid':
			print "Not a standard MIDI file"
			sys.exit(-1)
		if len(sys.argv) > 2 and sys.argv[2] == '--orch':
			ORCHESTRA = True
	except:
		print usage
		sys.exit(-1)
	main(input_filename)