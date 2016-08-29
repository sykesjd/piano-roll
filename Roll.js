/**
 * Roll.js: draws an animated piano roll synced to an MP3
 */
$(() => {
 	if (typeof(Worker) !== 'undefined') {
 		// get piece name as it appears in the file system
 		let piece = $(location).attr('href').split('?')[1];
        $.getJSON('./JSON/' + piece + '.json').done((data) => {
            let w = new Worker('NoteWorker.js');
     		w.onmessage = (event) => {
     			if (event.data.meta) {
     				$('#info').html(event.data.meta.name + ' - ' + event.data.meta.composer);
     				w.terminate();
     				$('.w').remove();
     				$('audio').attr('src', './MP3/' + piece + '.mp3');
     		        $('#now').show();
     		        // roll animates at 60pps while audio is playing
     		        let timer = window.setInterval(() => $('body').scrollLeft($('audio')[0].currentTime * 60), 1000/60.0);
     		        // hide/unhide info on play/pause
     		        $('audio').on('pause', () => $('#info').animate({right: '10px'}, 500));
     		        $('audio').on('play', () => $('#info').animate({right: '-2000px'}, 500));
     			} else if (event.data.maxright) {
     				$('#scrollallow').css({'left': event.data.maxright});
     			} else {
     				$(event.data).appendTo('#roll');
     			}
     		};
     		w.postMessage(data);
        }).fail(() => {
            $('.w').html('Error loading data file; check your browser settings');
        });
 	} else {
 		$('#result').text('Your browser does not support Web Workers');
 	}
});
