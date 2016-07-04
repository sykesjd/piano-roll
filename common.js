var reldata = function(data) {
    var tp = data['allnotes']['tracks'][0]['notes'][0]['pitch'];
    var bp = tp;
    var pitch;
    $.each(data['allnotes']['tracks'], function(i,val){
        $.each(val['notes'], function(j, value){
            pitch = value['pitch'];
            tp = (pitch > tp ? pitch : tp);
            bp = (pitch < bp ? pitch : bp);
        });
    });
    // noteHeight calculated with units vh (percentage of window height)
    var noteHeight = 168/(tp - bp);
    var style = data['rolltype'];
    return [tp, noteHeight, style];
}

var parttype = function(val) {
    // if no type number is given, assume 4 (plain bar)
    type = (val['type'] || val['type'] == 0) ? val['type'] : 4;
    return [val['number'], type];
}

var drawNote = function(i, j, value, part, type, style, tp, noteHeight) {
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
    $note = $('<div></div>').addClass('note').attr('id',i+'-'+j)
                .css({'left': x, 'top': y + 'vh', 'width': width, 'height': noteHeight + 'vh', 'line-height': noteHeight + 'vh'});
    switch (type) {
        // flutes: fully rounded oval
        case 0: $note = flute($note, part, width, noteHeight); break;
        // double reeds: flattened oval
        case 1: $note = doubleReed($note, part, width, noteHeight); break;
        // single reeds: half-rounded oval
        case 2: $note = singleReed($note, part, width, noteHeight); break;
        // conical brass: rounded rectangle
        case 3: $note = conicalBrass($note, part, noteHeight); break;
        // cylindrical brass or non-orchestral instrument: plain rectangle
        case 4: $note = cylinderAndDefault($note, part); break;
        // bowed strings: four-sided diamond
        case 5: $note = bowedStrings($note, part, width, noteHeight); break;
        // plucked strings: six-sided diamond
        case 6: $note = pluckedStrings($note, part, width, noteHeight); break;
        // orchestral keyboard: up-pointing triangle
        case 7: $note = orchKeyboard($note, part, width, noteHeight); break;
        // pitched percussion: thin rectangle with a glow
        case 8: $note = percussion($note, part); break;
        // unpitched percussion: thin white rectangle with a glow
        case 9: $note = percussion($note, 12); break;
        // accompaniment (for songs): small grey diamond
        case 10: $note = accompaniment($note, part, noteHeight); break;
    }
    if (value['motifs']) {
        $.each(value['motifs'],function(k,v){
            $note.addClass('motif'+v);
        });
    }
    if (value['lyric']) {
        $note.text(value['lyric']);
    }
    $note.appendTo('body');
}

var flute = function($note, part, width, height) {
    return $note.addClass('part' + part).css({'border-radius': width/2 + 'px / ' + height/2 + 'vh'});
}

var doubleReed = function($note, part, width, height) {
    return $note.addClass('part' + part).css({'border-radius': width/4 + 'px / ' + height/2 + 'vh'});
}

var singleReed = function($note, part, width, height) {
    return $note.addClass('part' + part).css({'border-radius': width/3 + 'px / ' + height/2 + 'vh'});
}

var conicalBrass = function($note, part, height) {
    return $note.addClass('part' + part).css({'border-radius': height/2 + 'vh'});
}

var cylinderAndDefault = function($note, part) {
    return $note.addClass('part' + part);
}

var bowedStrings = function($note, part, width, height) {
    return $note.addClass('sp' + part)
            .append($('<div></div>').addClass('spu')
                .css({'border-bottom-width': height/2 + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'}))
            .append($('<div></div>').addClass('spd')
                .css({'border-top-width': height/2 + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'}));
}

var pluckedStrings = function($note, part, width, height) {
    return $note.addClass('sp' + part)
            .append($('<div></div>').addClass('spu')
                .css({'border-bottom-width': height/3 + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'}))
            .append($('<div></div>').addClass('part' + part)
                .css({'height': height/3 + 'vh'}))
            .append($('<div></div>').addClass('spd')
                .css({'border-top-width': height/3 + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'}));
}

var orchKeyboard = function($note, part, width, height) {
    return $note.addClass('sp' + part).addClass('spu')
            .css({'border-bottom-width': height + 'vh', 'border-left-width': width/2 + 'px', 'border-right-width': width/2 + 'px'});
}

var percussion = function($note, part) {
    return $note.addClass('perc').addClass('part' + part);
}

var accompaniment = function($note, part, height) {
    return $note.addClass('sp12').css({'left': (x-5)})
            .append($('<div></div>').addClass('spu')
                .css({'border-bottom-width': height/2 + 'vh'}))
            .append($('<div></div>').addClass('spd')
                .css({'border-top-width': height/2 + 'vh'}));
}
