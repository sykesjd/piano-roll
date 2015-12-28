function reldata(data) {
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

function parttype(val) {
    part = val['number'];
    // if no type number is given, assume 4 (plain bar)
    type = (val['type'] || val['type'] == 0) ? val['type'] : 4;
    return [part, type];
}

function drawNote(value, part, type, style, tp, noteHeight) {
    // if style is solo or orch, part number corresponds to pitch
    part = (style > 1) ? (value['pitch'] % 12) : part;
    x = value['start'] + 200;
    // y position calculated with units vh (percentage of window height)
    y = (tp - value['pitch'] - 1) * noteHeight/2 + 3;
    // width decremented to space consecutive notes
    width = value['end'] - value['start'] - 1;
    if (part >= 2 && style == 1) {
        // for song accompaniment: small diamond
        $note = $('<div></div>').addClass('note').addClass('sp12').css({"left":(x-5),"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/2+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/2+'vh'}));
    } else {
        switch (type) {
            // flutes: fully rounded oval
            case 0: $note = $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/2+'px / '+noteHeight/2+'vh'});break;
            // double reeds: flattened oval
            case 1: $note = $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/4+'px / '+noteHeight/2+'vh'});break;
            // single reeds: half-rounded oval
            case 2: $note = $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/3+'px / '+noteHeight/2+'vh'});break;
            // conical brass: rounded rectangle
            case 3: $note = $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':noteHeight/2+'vh'});break;
            // cylindrical brass or non-orchestral instrument: plain rectangle
            case 4: $note = $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh'});break;
            // bowed strings: four-sided diamond
            case 5: $note = $('<div></div>').addClass('note').addClass('sp' + part).css({"left":x,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/2+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/2+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'}));break;
            // plucked strings: six-sided diamond
            case 6: $note = $('<div></div>').addClass('note').addClass('sp' + part).css({"left":x,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/3+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('part' + part).css({'width':width,'height':noteHeight/3+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/3+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'}));break;
            // orchestral keyboard: up-pointing triangle
            case 7: $note = $('<div></div>').addClass('note').addClass('sp' + part).addClass('spu').css({'left':x,'top':y+'vh','border-bottom-width':noteHeight+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'});break;
            // pitched percussion: thin rectangle with a glow
            case 8: $note = $('<div></div>').addClass('note').addClass('perc').addClass('part' + part).css({'left':x,'height':noteHeight+'vh','top':y+'vh'});break;
            // unpitched percussion: thin white rectangle with a glow
            case 9: $note = $('<div></div>').addClass('note').addClass('perc').addClass('part12').css({'left':x,'height':noteHeight+'vh','top':y+'vh'});break;
        }
    }
    if (value['motifs']) {
        $.each(value['motifs'],function(k,v){
            $note.addClass('motif'+v);
        });
    }
    $note.appendTo('body');
}
