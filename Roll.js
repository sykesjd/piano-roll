$(function() {
    // get piece name as it appears in the file system
    var piece = $(location).attr('href').split('?')[1];
    $.getJSON('./JSON/' + piece + '.json').done(function(data) {
        // calculate data necessary for proper note size and placement
        var reldat1 = reldata(data);
        // maxright used to determine how far right the roll goes in order to correctly place an invisible dummy note which will allow the window to scroll past the end
        var maxright = 0;
        // for each track in the piece
        $.each(data['allnotes']['tracks'], function(i, val) {
            // get part number and type of track
            var reldat2 = parttype(val);
            $.each(val['notes'], function(j, value){
                // draw each note to screen
                drawNote(i, j, value, reldat2[0], reldat2[1], reldat1[2], reldat1[0], reldat1[1]);
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
        var timer = window.setInterval(function() {
            $('body').scrollLeft($('audio')[0].currentTime * 60);
        }, 1000/60.0);
        $('audio').on('pause', function() {
            // pause animation, unhide info
            $('#info').animate({right: '10px'}, 500);
        });
        $('audio').on('play', function() {
            $('#info').animate({right: '-2000px'}, 500);
        });
    }).fail(function() {
        $('.w').html('Error loading data file; check your browser settings');
    });
});
