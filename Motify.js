var timer;
$(function(){
	// get piece name as it appears in the file system
	var piece = $(location).attr('href').split('?')[1];
	$.getJSON("./JSON/"+piece+".json").done(function(data){
		// find range of piece to determine proper note height
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
		var part, type, x, y, width;
		// for each track in the piece
		$.each(data['allnotes']['tracks'], function(i,val){
			part = val['number'];
			// if no type number is given, assume 4 (plain bar)
			type = (val['type'] || val['type'] == 0) ? val['type'] : 4;
			// for each note in the track
			$.each(val['notes'], function(j, value){
				// if style is solo or orch, part number corresponds to pitch
				part = (style > 1) ? (value['pitch'] % 12) : part;
				x = value['start'] + 200;
				// y position calculated with units vh (percentage of window height)
				y = (tp - value['pitch'] - 1) * noteHeight/2 + 3;
				// width decremented to space consecutive notes
				width = value['end'] - value['start'] - 1;
				if (part >= 2 && style == 1) {
					// for song accompaniment: small diamond
					$('<div></div>').addClass('note').addClass('sp12').css({"left":(x-5),"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/2+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/2+'vh'})).appendTo('body');
				} else {
					switch (type) {
						// flutes: fully rounded oval
						case 0: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/2+'px / '+noteHeight/2+'vh'}).appendTo('body');break;
						// double reeds: flattened oval
						case 1: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/4+'px / '+noteHeight/2+'vh'}).appendTo('body');break;
						// single reeds: half-rounded oval
						case 2: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/3+'px / '+noteHeight/2+'vh'}).appendTo('body');break;
						// conical brass: rounded rectangle
						case 3: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':noteHeight/2+'vh'}).appendTo('body');break;
						// cylindrical brass or non-orchestral instrument: plain rectangle
						case 4: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh'}).appendTo('body');break;
						// bowed strings: four-sided diamond
						case 5: $('<div></div>').addClass('note').addClass('sp' + part).css({"left":x,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/2+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/2+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).appendTo('body');break;
						// plucked strings: six-sided diamond
						case 6: $('<div></div>').addClass('note').addClass('sp' + part).css({"left":x,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/3+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('part' + part).css({'width':width,'height':noteHeight/3+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/3+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).appendTo('body');break;
						// orchestral keyboard: up-pointing triangle
						case 7: $('<div></div>').addClass('note').addClass('sp' + part).addClass('spu').css({'left':x,'top':y+'vh','border-bottom-width':noteHeight+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'}).appendTo('body');break;
						// pitched percussion: thin rectangle with a glow
						case 8: $('<div></div>').addClass('note').addClass('perc').addClass('part' + part).css({'left':x,'height':noteHeight+'vh','top':y+'vh'}).appendTo('body');break;
						// unpitched percussion: thin white rectangle with a glow
						case 9: $('<div></div>').addClass('note').addClass('perc').addClass('part12').css({'left':x,'height':noteHeight+'vh','top':y+'vh'}).appendTo('body');break;
					}
				}
			});
		});
		$('.w').remove();
		$('#info').html(data['name'] + ' - '+ data['composer']);
		$('.but').show();
		$('body').scrollLeft(0);
		// core of motify: allow user to select motifs and print resulting JSON to console
		var motifs = {"motifs":[]};
		for (var i = 1; i < 13; i++) {
			motifs['motifs'].append({"number":i,"notes":[]});
		}
		var reset = motifs;
		$('.note').click(function(){
			$(this).toggleClass('motif'+$("#motifbox").val());
		});
		$('#ptc').click(function(){
			for (var i = 1; i < 13; i++) {
				$('.motif'+i).each(function(){
					motifs['motifs'][i - 1]['notes'].append({'left':$(this).css('left'),'width':$(this).css('width'),'top':$(this).css('top')});
				});
			}
			console.log(JSON.stringify(motifs));
			motifs = reset;
		});
	}).fail(function(){
		$('.w').html("Error loading data file; check your browser settings");
	});
});