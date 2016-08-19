/**
 * common.js: Provides helper funcitions for drawing a piano roll
 */
const tools = {
    /*
     * Gets the data necessary for determining how notes are drawn
     */
    reldata: (data) => {
        let tp = data['allnotes']['tracks'][0]['notes'][0]['pitch'];
        let bp = tp;
        let pitch;
        $.each(data['allnotes']['tracks'], (i,val) => {
            $.each(val['notes'], (j, value) => {
                pitch = value['pitch'];
                tp = (pitch > tp ? pitch : tp);
                bp = (pitch < bp ? pitch : bp);
            });
        });
        // noteHeight calculated with units vh (percentage of window height)
        let noteHeight = 168/(tp - bp);
        let style = data['rolltype'];
        return [tp, noteHeight, style];
    },
    /*
     * Gets the part number and type (assume plain bar if not given) for a note
     */
    parttype: (val) => [val['number'], (val['type'] || val['type'] == 0) ? val['type'] : 4],
    /*
     * Builds the base CSS styling for a note
     */
    noteStyle: (x, y, width, noteHeight) => {
        return {
            'left': x,
            'top': y + 'vh',
            'width': width,
            'height': noteHeight + 'vh',
            'line-height': noteHeight + 'vh'
        };
    },
    /*
     * Draws a note to the roll
     */
    drawNote: (i, j, value, part, type, style, tp, noteHeight) => {
        // if style is solo or orch, part number corresponds to pitch
        part = (style > 1) ? (value['pitch'] % 12) : part;
        // if style is song, note type is accomp if not melody or counter-melody
        type = (style == 1 && part >= 2) ? 10 : type;
        // width decremented to space consecutive notes
        width = value['end'] - value['start'] - 1;
        // entire roll starts at 200 pixels from the left
        x = value['start'] + 200;
        // y position calculated with units vh (percentage of window height)
        y = (tp - value['pitch'] - 1) * noteHeight/2 + 3;
        $note = $('<div></div>').addClass('note').attr('id',i+'-'+j).css(tools.noteStyle(x, y, width, noteHeight));
        switch (type) {
            case 0: $note = tools.flute($note, part, width, noteHeight); break;
            case 1: $note = tools.doubleReed($note, part, width, noteHeight); break;
            case 2: $note = tools.singleReed($note, part, width, noteHeight); break;
            case 3: $note = tools.conicalBrass($note, part, noteHeight); break;
            case 4: $note = tools.cylinderAndDefault($note, part); break;
            case 5: $note = tools.bowedStrings($note, part, width, noteHeight); break;
            case 6: $note = tools.pluckedStrings($note, part, width, noteHeight); break;
            case 7: $note = tools.orchKeyboard($note, part, width, noteHeight); break;
            // pitched percussion
            case 8: $note = tools.percussion($note, part); break;
            // unpitched percussion
            case 9: $note = tools.percussion($note, 12); break;
            case 10: $note = tools.accompaniment($note, part, noteHeight); break;
        }
        if (value['motifs'])
            $.each(value['motifs'], (k,v) => $note.addClass('motif'+v));
        if (value['lyric'])
            $note.text(value['lyric']);
        $note.appendTo('body');
    },
    /*
     * Draws a flute note (fully rounded oval) to the roll
     */
    flute: ($note, part, width, height) =>
        $note.addClass('part' + part).css({'border-radius': width/2 + 'px / ' + height/2 + 'vh'}),
    /*
     * Draws a double reed note (flattened oval) to the roll
     */
    doubleReed: ($note, part, width, height) =>
        $note.addClass('part' + part).css({'border-radius': width/4 + 'px / ' + height/2 + 'vh'}),
    /*
     * Draws a single reed note (half-rounded oval) to the roll
     */
    singleReed: ($note, part, width, height) =>
        $note.addClass('part' + part).css({'border-radius': width/3 + 'px / ' + height/2 + 'vh'}),
    /*
     * Draws a conical brass note (rounded rectangle) to the roll
     */
    conicalBrass: ($note, part, height) =>
        $note.addClass('part' + part).css({'border-radius': height/2 + 'vh'}),
    /*
     * Draws a default/cylindrical brass note (rectangle) to the roll
     */
    cylinderAndDefault: ($note, part) =>
        $note.addClass('part' + part),
    /*
     * Draws a bowed string note (four-sided diamond) to the roll
     */
    bowedStrings: ($note, part, width, height) =>
        $note.addClass('sp' + part)
            .append($('<div></div>').addClass('spu')
                .css({'border-bottom-width': height/2 + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'}))
            .append($('<div></div>').addClass('spd')
                .css({'border-top-width': height/2 + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'})),
    /*
     * Draws a plucked string note (six-sided diamond) to the roll
     */
    pluckedStrings: ($note, part, width, height) =>
        $note.addClass('sp' + part)
            .append($('<div></div>').addClass('spu')
                .css({'border-bottom-width': height/3 + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'}))
            .append($('<div></div>').addClass('part' + part)
                .css({'height': height/3 + 'vh'}))
            .append($('<div></div>').addClass('spd')
                .css({'border-top-width': height/3 + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'})),
    /*
     * Draws an orchestral keyboard note (up-pointing triangle) to the roll
     */
    orchKeyboard: ($note, part, width, height) =>
        $note.addClass('sp' + part).addClass('spu')
            .css({'border-bottom-width': height + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'}),
    /*
     * Draws a percussion note (thin white-glowing rectangle) to the roll
     */
    percussion: ($note, part) =>
        $note.addClass('perc').addClass('part' + part),
    /*
     * Draws a song accompaniment note (small grey diamond) to the roll
     */
    accompaniment: ($note, part, height) =>
        $note.addClass('sp12')
            .append($('<div></div>').addClass('spu')
                .css({'border-bottom-width': height/2 + 'vh'}))
            .append($('<div></div>').addClass('spd')
                .css({'border-top-width': height/2 + 'vh'}))
};
