/**
 * common.js: Get data from worker and print roll to page, then do page-specific functionality
 */
const getRoll = (callback) => {
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
     				callback(piece, data);
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
 		$('.w').text('Your browser does not support Web Workers');
 	}
};
