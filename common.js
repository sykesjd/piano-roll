function initialize(piece, data) {
	$('audio').attr('src',"./MP3/"+piece+".mp3");
	var tp, bp, pitch;
	tp = data['allnotes']['tracks'][0]['notes'][0]['pitch'];
	bp = tp;
	$.each(data['allnotes']['tracks'], function(i,val){
		$.each(val['notes'], function(j, value){
			pitch = value['pitch'];
			tp = (pitch > tp ? pitch : tp);
			bp = (pitch < bp ? pitch : bp);
		});
	});
	return [tp, (tp - bp)];
}

function bar(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'])*90/reldat[1] + 5;
	width = value['end'] - value['start'] - 1;
	$('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(180/reldat[1])+'vh','top':y+'vh'}).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function diamond(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'] - 1)*90/reldat[1] + 5;
	$('<div></div>').addClass('note').addClass('part2').css({"left":value['start']+190,"top":y+'vh'}).append($('<div></div>').css({'width':'0px','height':'0px','border-bottom':180/reldat[1]+'vh solid #666','border-left':'10px solid transparent','border-right':'10px solid transparent'})).append($('<div></div>').css({'width':'0px','height':'0px','border-top':180/reldat[1]+'vh solid #666','border-left':'10px solid transparent','border-right':'10px solid transparent'})).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function flute(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'])*90/reldat[1] + 5;
	width = value['end'] - value['start'] - 1;
	$('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(180/reldat[1])+'vh','top':y+'vh','border-radius':width/2+'px / '+(90/reldat[1])+'vh'}).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function dreed(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'])*90/reldat[1] + 5;
	width = value['end'] - value['start'] - 1;
	$('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(180/reldat[1])+'vh','top':y+'vh','border-radius':width/4+'px / '+(90/reldat[1])+'vh'}).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function sreed(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'])*90/reldat[1] + 5;
	width = value['end'] - value['start'] - 1;
	$('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(180/reldat[1])+'vh','top':y+'vh','border-radius':width/3+'px / '+(90/reldat[1])+'vh'}).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function conic(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'])*90/reldat[1] + 5;
	width = value['end'] - value['start'] - 1;
	$('<div></div>').addClass('note').addClass('part' + part).css({'width':width,'left':value['start']+200,'height':(180/reldat[1])+'vh','top':y+'vh','border-radius':(90/reldat[1])+'vh'}).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function bowed(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'])*90/reldat[1] + 5;
	width = value['end'] - value['start'] - 1;
	$('<div></div>').addClass('note').addClass('sp' + part).css({"left":value['start']+200,"top":y+'vh'}).append($('<div></div>').css({'width':'0px','height':'0px','border-bottom':(90/reldat[1])+'vh solid ' + bcolor(part),'border-left':width/2+'px solid transparent','border-right':width/2+'px solid transparent'})).append($('<div></div>').css({'width':'0px','height':'0px','border-top':(90/reldat[1])+'vh solid ' + bcolor(part),'border-left':width/2+'px solid transparent','border-right':width/2+'px solid transparent'})).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function pluck(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'])*90/reldat[1] + 5;
	width = value['end'] - value['start'] - 1;
	$('<div></div>').addClass('note').addClass('sp' + part).css({"left":value['start']+200,"top":y+'vh'}).append($('<div></div>').css({'width':'0px','height':'0px','border-bottom':(60/reldat[1])+'vh solid ' + bcolor(part),'border-left':width/2+'px solid transparent','border-right':width/2+'px solid transparent'})).append($('<div></div>').css({'width':width,'height':(60/reldat[1])+'vh','background':bcolor(part)})).append($('<div></div>').css({'width':'0px','height':'0px','border-top':(60/reldat[1])+'vh solid ' + bcolor(part),'border-left':width/2+'px solid transparent','border-right':width/2+'px solid transparent'})).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function keyboard(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'])*90/reldat[1] + 5;
	width = value['end'] - value['start'] - 1;
	$('<div></div>').addClass('note').addClass('sp' + part).css({'width':'0px','left':value['start']+200,'height':'0px','top':y+'vh','border-bottom':(180/reldat[1])+'vh solid ' + bcolor(part),'border-left':width/2+'px solid transparent','border-right':width/2+'px solid transparent'}).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function perc(value, reldat, part, maxright) {
	y = (reldat[0] - value['pitch'])*90/reldat[1] + 5;
	$('<div></div>').addClass('note').addClass('part' + part).css({'width':(90/reldat[1])+'vh','left':value['start']+200,'height':(180/reldat[1])+'vh','top':y+'vh'}).appendTo('body');
	return (value['end'] > maxright ? value['end'] : maxright);
}

function orchnote(type, value, reldat, part, maxright) {
	switch (type) {
		case 0: return flute(value, reldat, part, maxright);
		case 1: return dreed(value, reldat, part, maxright);
		case 2: return sreed(value, reldat, part, maxright);
		case 3: return conic(value, reldat, part, maxright);
		case 4: return bar(value, reldat, part, maxright);
		case 5: return bowed(value, reldat, part, maxright);
		case 6: return pluck(value, reldat, part, maxright);
		case 7: return keyboard(value, reldat, part, maxright);
		case 8: return perc(value, reldat, part, maxright);
		case 9: return perc(value, reldat, 12, maxright);
	}
}

function bcolor(part) {
	switch (part) {
		case 0: return "#FF0000";
		case 1: return "#007FFF";
		case 2: return "#FFFF00";
		case 3: return "#7F00FF";
		case 4: return "#00FF00";
		case 5: return "#FF007F";
		case 6: return "#00FFFF";
		case 7: return "#FF7F00";
		case 8: return "#0000FF";
		case 9: return "#7FFF00";
		case 10: return "#FF00FF";
		case 11: return "#00FF7F";
	}
}

function finalize(data, maxright) {
	$('<div></div>').addClass('note').css({'width':'125vw','left':maxright,'top':'25vh','height':'50vh'}).appendTo('body');
	$('.w').remove();
	$('#info').html(data['name'] + ' - '+ data['composer']).show();
	$('.but').show();
	$('<div id="now"></div>').appendTo('body');
	$('body').scrollLeft(0);
	$('#play').click(function(){
		if ($('audio')[0].paused) {
			$('body').scrollLeft($('audio')[0].currentTime*60);
			timer = window.setInterval(function(){
				$('body').scrollLeft($('audio')[0].currentTime*60);
			}, 1000/60.0);
			$('audio').trigger("play");
		}
	});
	$('#pause').click(function(){
		$('audio').trigger("pause");
	});
	$('#back').click(function(){
		$('audio')[0].currentTime = 0;
		$('audio').trigger("pause");
		$('body').scrollLeft(0);
	});
	$('audio').on('pause',function(){
		window.clearInterval(timer);
	});
}