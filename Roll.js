var timer;
$(function(){
	var piece = $(location).attr('href').split('?')[1];
	$.getJSON("./JSON/"+piece+".json").done(function(data){
		$('audio').attr('src',"./MP3/"+piece+".mp3");
		$('#info').html(data['name'] + ' - '+ data['composer']);
		var style = data['rolltype'];
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
		var noteHeight = 168/(tp - bp);
		var maxright = 0;
		var part, type, x, y, width;
		$.each(data['allnotes']['tracks'], function(i,val){
			part = val['number'];
			type = (val['type'] || val['type'] == 0) ? val['type'] : 4;
			$.each(val['notes'], function(j, value){
				part = (style > 1) ? (value['pitch'] % 12) : part;
				x = value['start'] + 200;
				y = (tp - value['pitch'] - 1) * noteHeight/2 + 3;
				width = value['end'] - value['start'] - 1;
				if (part >= 2 && style == 1) {
					$('<div></div>').addClass('note').addClass('sp12').css({"left":(x-5),"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/2+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/2+'vh'})).appendTo('body');
				} else {
					switch (type) {
						case 0: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/2+'px / '+noteHeight/2+'vh'}).appendTo('body');break;
						case 1: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/4+'px / '+noteHeight/2+'vh'}).appendTo('body');break;
						case 2: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':width/3+'px / '+noteHeight/2+'vh'}).appendTo('body');break;
						case 3: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh','border-radius':noteHeight/2+'vh'}).appendTo('body');break;
						case 4: $('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':x,'height':noteHeight+'vh','top':y+'vh'}).appendTo('body');break;
						case 5: $('<div></div>').addClass('note').addClass('sp' + part).css({"left":x,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/2+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/2+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).appendTo('body');break;
						case 6: $('<div></div>').addClass('note').addClass('sp' + part).css({"left":x,"top":y+'vh'}).append($('<div></div>').addClass('spu').css({'border-bottom-width':noteHeight/3+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).append($('<div></div>').addClass('part' + part).css({'width':width,'height':noteHeight/3+'vh'})).append($('<div></div>').addClass('spd').css({'border-top-width':noteHeight/3+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'})).appendTo('body');break;
						case 7: $('<div></div>').addClass('note').addClass('sp' + part).addClass('spu').css({'left':x,'top':y+'vh','border-bottom-width':noteHeight+'vh','border-left-width':width/2+'px','border-right-width':width/2+'px'}).appendTo('body');break;
						case 8: $('<div></div>').addClass('note').addClass('perc').addClass('part' + part).css({'left':x,'height':noteHeight+'vh','top':y+'vh'}).appendTo('body');break;
						case 9: $('<div></div>').addClass('note').addClass('perc').addClass('part12').css({'left':x,'height':noteHeight+'vh','top':y+'vh'}).appendTo('body');break;
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