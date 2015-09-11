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
					$('<div></div>').addClass('note').addClass('sp12').attr('id',i+'-'+j).css({"left":(x-5),"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/2+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/2+'vh'})).appendTo('body');
				} else {
					switch (type) {
						// flutes: fully rounded oval
						case 0: $('<div></div>').addClass('note').addClass('part' + part).attr('id',i+'-'+j).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/2+'px / '+noteHeight/2+'vh'}).appendTo('body');break;
						// double reeds: flattened oval
						case 1: $('<div></div>').addClass('note').addClass('part' + part).attr('id',i+'-'+j).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/4+'px / '+noteHeight/2+'vh'}).appendTo('body');break;
						// single reeds: half-rounded oval
						case 2: $('<div></div>').addClass('note').addClass('part' + part).attr('id',i+'-'+j).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/3+'px / '+noteHeight/2+'vh'}).appendTo('body');break;
						// conical brass: rounded rectangle
						case 3: $('<div></div>').addClass('note').addClass('part' + part).attr('id',i+'-'+j).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':noteHeight/2+'vh'}).appendTo('body');break;
						// cylindrical brass or non-orchestral instrument: plain rectangle
						case 4: $('<div></div>').addClass('note').addClass('part' + part).attr('id',i+'-'+j).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh'}).appendTo('body');break;
						// bowed strings: four-sided diamond
						case 5: $('<div></div>').addClass('note').addClass('sp' + part).attr('id',i+'-'+j).css({"left":x,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/2+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/2+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).appendTo('body');break;
						// plucked strings: six-sided diamond
						case 6: $('<div></div>').addClass('note').addClass('sp' + part).attr('id',i+'-'+j).css({"left":x,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/3+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('part' + part).css({'width':width,'height':noteHeight/3+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/3+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).appendTo('body');break;
						// orchestral keyboard: up-pointing triangle
						case 7: $('<div></div>').addClass('note').addClass('sp' + part).attr('id',i+'-'+j).addClass('spu').css({'left':x,'top':y+'vh','border-bottom-width':noteHeight+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'}).appendTo('body');break;
						// pitched percussion: thin rectangle with a glow
						case 8: $('<div></div>').addClass('note').addClass('perc').addClass('part' + part).attr('id',i+'-'+j).css({'left':x,'height':noteHeight+'vh','top':y+'vh'}).appendTo('body');break;
						// unpitched percussion: thin white rectangle with a glow
						case 9: $('<div></div>').addClass('note').addClass('perc').addClass('part12').attr('id',i+'-'+j).css({'left':x,'height':noteHeight+'vh','top':y+'vh'}).appendTo('body');break;
					}
				}
			});
		});
		$('.w').remove();
		$('#info').html(data['name'] + ' - '+ data['composer']);
		$('.but').show();
		$('body').scrollLeft(0);
		// core of motify: allow user to select motifs and print resulting JSON to console
		var newdata = data;
		$.each(data['allnotes']['tracks'], function(i,val){
			$.each(val['notes'], function(j,value){
				value['motifs'] = [];
			});
		});
		var reset = newdata;
		var $curr;
		$('.note').click(function(){
			$(this).toggleClass('motif'+$("#motifbox").val());
			$curr = $(this);
		});
		$(document).keydown(function(e) {
			if (e.which == 39) {
				e.preventDefault();
				$curr = $curr.next();
				$curr.click();
			} else if (e.which == 37) {
				e.preventDefault();
				$curr.click();
				$curr = $curr.prev();
			}
		});
		$('#ptc').click(function(){
			for (var k = 0; k < 12; k++) {
				$('.motif'+k).each(function(){
					var index = $(this).attr('id').split('-');
					newdata['allnotes']['tracks'][parseInt(index[0])]['notes'][parseInt(index[1])]['motifs'].push(k);
				});
			}
			console.log(JSON.stringify(newdata));
			newdata = reset;
		});
	}).fail(function(){
		$('.w').html("Error loading data file; check your browser settings");
	});
});