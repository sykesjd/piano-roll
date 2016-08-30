/**
 * NoteWorker.js: calculates styling data for all notes to print to page
 */
const LEFT_START = 200;

/*
 * Receives data from page and sends back metadata and notes to be drawn
 */
onmessage = (message) => {
    let json = message.data;
    let drawData = drawTools.drawData(json);
    json.allnotes.tracks.forEach((track, i) => {
        track.notes.forEach((note, j) => {
            let noteDrawData = drawTools.noteDrawData(note, track, drawData);
            switch (noteDrawData.type) {
                case 0: drawNote.flute(i, j, noteDrawData); break;
                case 1: drawNote.doubleReed(i, j, noteDrawData); break;
                case 2: drawNote.singleReed(i, j, noteDrawData); break;
                case 3: drawNote.conicalBrass(i, j, noteDrawData); break;
                case 4: drawNote.cylinderAndDefault(i, j, noteDrawData); break;
                case 5: drawNote.bowedStrings(i, j, noteDrawData); break;
                case 6: drawNote.pluckedStrings(i, j, noteDrawData); break;
                case 7: drawNote.orchKeyboard(i, j, noteDrawData); break;
                case 8: case 9: drawNote.percussion(i, j, noteDrawData); break;
                case 10: drawNote.accompaniment(i, j, noteDrawData); break;
            }
        });
    });
    postMessage({
        meta: {
            name: json.name,
            composer: json.composer
        }
    });
};

/*
 * Helper methods calcuating draw data for notes
 */
const drawTools = {
    drawData: (json) => {
        let style = json.rolltype;
        let tp = json.allnotes.tracks[0].notes[0].pitch;
        let bp = tp;
        let maxright = 0;
        json.allnotes.tracks.forEach((track) => {
            track.notes.forEach((note) => {
                tp = (note.pitch > tp ? note.pitch : tp);
                bp = (note.pitch < bp ? note.pitch : bp);
                maxright = (note.end > maxright ? note.end : maxright);
            });
        });
        maxright += LEFT_START;
        postMessage({
            maxright: maxright
        });
        let noteHeight = 168/(tp - bp);
        return {
            style: style,
            tp: tp,
            noteHeight: noteHeight
        };
    },
    noteDrawData: (note, track, drawData) => {
        // if style is solo or orch, part number corresponds to pitch
        let partNum = (drawData.style > 1) ? (note.pitch % 12) : (drawData.style == 9 ? 12 : track.number);
        // if style is song, note type is accomp if not melody or counter-melody
        let type = (drawData.style == 1 && track.number >= 2) ? 10 : ((track.type || track.type == 0) ? track.type : 4);
        // width decremented to space consecutive notes
        let width = note.end - note.start - 1;
        // entire roll starts at 200 pixels from the left
        let x = note.start + LEFT_START;
        // y position calculated with units vh (percentage of window height)
        let y = (drawData.tp - note.pitch - 1) * drawData.noteHeight/2 + 3;
        let motifs = note.motifs ? note.motifs : [];
        let motifString = '';
        motifs.forEach((m) => {
            motifString += ' motif' + m;
        });
        let lyric = note.lyric ? note.lyric : '';
        return {
            partNum: partNum,
            type: type,
            width: width,
            height: drawData.noteHeight,
            x: x,
            y: y,
            motifs: motifString,
            lyric: lyric
        };
    }
};

/*
 * Methods for drawing notes for different instrument types
 */
const drawNote = {
    flute: (i, j, noteDrawData) => {
        postMessage('<div class="note part' + noteDrawData.partNum + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'width:' + noteDrawData.width + 'px;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;'
                                    + 'border-radius:' + noteDrawData.width / 2 + 'px / ' + noteDrawData.height / 2 + 'vh;"></div>');
    },
    doubleReed: (i, j, noteDrawData) => {
        postMessage('<div class="note part' + noteDrawData.partNum + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'width:' + noteDrawData.width + 'px;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;'
                                    + 'border-radius:' + noteDrawData.width / 4 + 'px / ' + noteDrawData.height / 2 + 'vh;"></div>');
    },
    singleReed: (i, j, noteDrawData) => {
        postMessage('<div class="note part' + noteDrawData.partNum + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'width:' + noteDrawData.width + 'px;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;'
                                    + 'border-radius:' + noteDrawData.width / 3 + 'px / ' + noteDrawData.height / 2 + 'vh;"></div>');
    },
    conicalBrass: (i, j, noteDrawData) => {
        postMessage('<div class="note part' + noteDrawData.partNum + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'width:' + noteDrawData.width + 'px;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;'
                                    + 'border-radius:' + noteDrawData.height / 2 + 'vh;"></div>');
    },
    cylinderAndDefault: (i, j, noteDrawData) => {
        postMessage('<div class="note part' + noteDrawData.partNum + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'width:' + noteDrawData.width + 'px;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;">' + noteDrawData.lyric + '</div>');
    },
    bowedStrings: (i, j, noteDrawData) => {
        postMessage('<div class="note sp' + noteDrawData.partNum + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'width:' + noteDrawData.width + 'px;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;">\
                        <div class="spu" style="border-bottom-width:' + noteDrawData.height / 2 + 'vh;'
                                                + 'border-left-width:' + noteDrawData.width / 2 + 'px;'
                                                + 'border-right-width:' + noteDrawData.width / 2 + 'px;"></div>\
                        <div class="spd" style="border-top-width:' + noteDrawData.height / 2 + 'vh;'
                                                + 'border-left-width:' + noteDrawData.width / 2 + 'px;'
                                                + 'border-right-width:' + noteDrawData.width / 2 + 'px;"></div>\
                    </div>');
    },
    pluckedStrings: (i, j, noteDrawData) => {
        postMessage('<div class="note sp' + noteDrawData.partNum + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'width:' + noteDrawData.width + 'px;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;">\
                        <div class="spu" style="border-bottom-width:' + noteDrawData.height / 3 + 'vh;'
                                                + 'border-left-width:' + noteDrawData.width / 2 + 'px;'
                                                + 'border-right-width:' + noteDrawData.width / 2 + 'px;"></div>\
                        <div class="part' + noteDrawData.partNum + '" style="height:' + noteDrawData.height / 3 + 'vh;"></div>\
                        <div class="spd" style="border-top-width:' + noteDrawData.height / 3 + 'vh;'
                                                + 'border-left-width:' + noteDrawData.width / 2 + 'px;'
                                                + 'border-right-width:' + noteDrawData.width / 2 + 'px;"></div>\
                    </div>');
    },
    orchKeyboard: (i, j, noteDrawData) => {
        postMessage('<div class="note sp' + noteDrawData.partNum + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'width:' + noteDrawData.width + 'px;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;">\
                        <div class="spu" style="border-bottom-width:' + noteDrawData.height + 'vh;'
                                                + 'border-left-width:' + noteDrawData.width / 2 + 'px;'
                                                + 'border-right-width:' + noteDrawData.width / 2 + 'px;"></div>\
                    </div>');
    },
    percussion: (i, j, noteDrawData) => {
        postMessage('<div class="note perc part' + noteDrawData.partNum + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;"></div>');
    },
    accompaniment: (i, j, noteDrawData) => {
        postMessage('<div class="note sp12' + noteDrawData.motifs + '"\
                            id="' + i + '-' + j + '"\
                            style="left:' + noteDrawData.x + 'px;'
                                    + 'top:' + noteDrawData.y + 'vh;'
                                    + 'width:' + noteDrawData.width + 'px;'
                                    + 'height:' + noteDrawData.height + 'vh;'
                                    + 'line-height:' + noteDrawData.height + 'vh;">\
                        <div class="spu" style="border-bottom-width:' + noteDrawData.height / 2 + 'vh;"></div>\
                        <div class="spd" style="border-top-width:' + noteDrawData.height / 2 + 'vh;"></div>\
                    </div>');
    }
};
