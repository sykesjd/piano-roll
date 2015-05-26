var timer;
$(function(){
	var params = $(location).attr('href').split('?')[1].split('-');
	var piece = params[1];
	var style = params[0];
	$.getJSON("./JSON/"+piece+".json").done(function(data){
		$('audio').attr('src',"./MP3/"+piece+".mp3");
		$('#info').html(data['name'] + ' - '+ data['composer']);
		var tp, bp, pitch, range, maxright, part, type;
		tp = data['allnotes']['tracks'][0]['notes'][0]['pitch'];
		bp = tp;
		$.each(data['allnotes']['tracks'], function(i,val){
			$.each(val['notes'], function(j, value){
				pitch = value['pitch'];
				tp = (pitch > tp ? pitch : tp);
				bp = (pitch < bp ? pitch : bp);
			});
		});
		range = tp - bp;
		maxright = 0;
		$.each(data['allnotes']['tracks'], function(i,val){
			part = val['number'];
			type = (val['type'] || val['type'] == 0) ? val['type'] : 4;
			$.each(val['notes'], function(j, value){
				part = (style == "Solo" || style == "Orch") ? (value['pitch'] % 12) : part;
				y = (tp - value['pitch'] - 1)*84/range + 3;
				width = value['end'] - value['start'] - 1;
				if (part >= 2 && style == "Song") {
					$('<div></div>').addClass('note').addClass('sp12').css({"left":value['start']+195,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':84/range+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':84/range+'vh'})).appendTo('body');
				} else {
					switch (type) {
						case 0: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(168/range)+'vh','top':y+'vh','border-radius':width/2+'px / '+(84/range)+'vh'}).appendTo('body');break;
						case 1: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(168/range)+'vh','top':y+'vh','border-radius':width/4+'px / '+(84/range)+'vh'}).appendTo('body');break;
						case 2: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(168/range)+'vh','top':y+'vh','border-radius':width/3+'px / '+(84/range)+'vh'}).appendTo('body');break;
						case 3: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(168/range)+'vh','top':y+'vh','border-radius':(84/range)+'vh'}).appendTo('body');break;
						case 4: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(168/range)+'vh','top':y+'vh'}).appendTo('body');break;
						case 5: $('<div></div>').addClass('note').addClass('sp' + part).css({"left":value['start']+200,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':(84/range)+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('spd').css({'border-top-width':(84/range)+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).appendTo('body');break;
						case 6: $('<div></div>').addClass('note').addClass('sp' + part).css({"left":value['start']+200,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':(56/range)+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('part' + part).css({'width':width,'height':(56/range)+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':(56/range)+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).appendTo('body');break;
						case 7: $('<div></div>').addClass('note').addClass('sp' + part).addClass('spu').css({'left':value['start']+200,'top':y+'vh','border-bottom-width':(168/range)+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'}).appendTo('body');break;
						case 8: $('<div></div>').addClass('note').addClass('part' + part).css({'width':'5px','left':value['start']+200,'height':(168/range)+'vh','top':y+'vh'}).appendTo('body');break;
						case 9: $('<div></div>').addClass('note').addClass('part12').css({'width':'5px','left':value['start']+200,'height':(168/range)+'vh','top':y+'vh'}).appendTo('body');break;
					}
				}
				maxright = (value['end'] > maxright ? value['end'] : maxright);
			});
		});
		$('#scrollallow').css({'left':maxright});
		$('.w').remove();
		$('.but,#now,#info').show();
		$('body').scrollLeft(0);
		$('#play').click(function(){
			if ($('audio')[0].paused) {
				$('body').scrollLeft($('audio')[0].currentTime*60);
				timer = window.setInterval(function(){
					$('body').scrollLeft($('audio')[0].currentTime*60);
				}, 1000/60.0);
				$('audio').trigger("play");
				$('#info').animate({right:'-2000px'},500);
			}
		});
		$('#pause').click(function(){
			$('audio').trigger("pause");
		});
		$('#back').click(function(){
			$('audio').trigger("pause");
			$('audio')[0].currentTime = 0;
			$('body').scrollLeft(0);
		});
		$('audio').on('pause',function(){
			window.clearInterval(timer);
			$('#info').animate({right:'10px'},500);
		});
	}).fail(function(){
		$('.w').html("Error loading data file; check your browser settings");
	});
});