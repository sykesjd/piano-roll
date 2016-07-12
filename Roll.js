/**
 * Roll.js: draws an animated piano roll synced to an MP3
 */
$(() => {
    // get piece name as it appears in the file system
    let piece = $(location).attr('href').split('?')[1];
    $.getJSON('./JSON/' + piece + '.json').done((data) => {
        // calculate data necessary for proper note size and placement
        let reldat1 = tools.reldata(data);
        // maxright used to determine how far right the roll goes in order to correctly place an invisible dummy note which will allow the window to scroll past the end
        let maxright = 0;
        // for each track in the piece
        $.each(data['allnotes']['tracks'], (i, val) => {
            // get part number and type of track
            let reldat2 = tools.parttype(val);
            $.each(val['notes'], (j, value) => {
                // draw each note to screen
                tools.drawNote(i, j, value, reldat2[0], reldat2[1], reldat1[2], reldat1[0], reldat1[1]);
                // increase maxright if further right
                maxright = (value['end'] > maxright ? value['end'] : maxright);
            });
        });
        // move dummy note, show interface elements
        $('#scrollallow').css({'left': maxright});
        $('.w').remove();
        $('audio').attr('src', './MP3/' + piece + '.mp3');
        $('#info').html(data['name'] + ' - ' + data['composer']);
        $('#now').show();
        // roll animates at 60pps while audio is playing
        let timer = window.setInterval(() => {
            $('body').scrollLeft($('audio')[0].currentTime * 60);
        }, 1000/60.0);
        // hide/unhide info on play/pause
        $('audio').on('pause', () => {
            $('#info').animate({right: '10px'}, 500);
        });
        $('audio').on('play', () => {
            $('#info').animate({right: '-2000px'}, 500);
        });
    }).fail(() => {
        $('.w').html('Error loading data file; check your browser settings');
    });
});
