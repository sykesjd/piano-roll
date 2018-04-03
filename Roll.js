/**
 * Roll.js: draws an animated piano roll synced to an MP3
 */
const PPS = 60;
$(() => {
    getRoll((piece, data) => {
        $('#now').show();
        $('audio').attr('src', './MP3/' + piece + '.mp3');
        let timer = window.setInterval(() => $('#roll').css('left', $('audio')[0].currentTime * PPS * -1), 1000.0/PPS);
        $('audio').on('pause', () => $('#info').animate({right: '10px'}, 500));
        $('audio').on('play', () => $('#info').animate({right: '-2000px'}, 500));
    });
});
