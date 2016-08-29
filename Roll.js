/**
 * Roll.js: draws an animated piano roll synced to an MP3
 */
$(() => {
    getRoll((piece, data) => {
        $('audio').attr('src', './MP3/' + piece + '.mp3');
        $('#now').show();
        // roll animates at 60pps while audio is playing
        let timer = window.setInterval(() => $('body').scrollLeft($('audio')[0].currentTime * 60), 1000/60.0);
        // hide/unhide info on play/pause
        $('audio').on('pause', () => $('#info').animate({right: '10px'}, 500));
        $('audio').on('play', () => $('#info').animate({right: '-2000px'}, 500));
    });
});
