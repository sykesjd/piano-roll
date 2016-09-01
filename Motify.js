/**
 * Motify.js: Draws a piano roll for the purpose of selecting motifs
 */
let newdata, reset, $curr;
$(() => {
    getRoll((piece, data) => {
        $('.but').show();
        $('body').scrollLeft(0);
        data.allnotes.tracks.forEach((track) => {
            track.notes.forEach((note) => note.motifs = []);
        });
        newdata = data;
        reset = newdata;
        handlers.attachClickListeners();
        handlers.attachKeyboardListeners();
    });
});

/*
 * Keycodes for keyboard listeners
 */
const keys = {
    LARROW: 37,
    RARROW: 39
};

/*
 * Event handlers for the Motify functionality
 */
const handlers = {
    /*
     * Click handlers:
     *  - Clicking on a note toggles the currently seleted motif for the note then focuses on the note
     *  - Clicking on the "Print to Console" button prints the motified data to console
     */
    attachClickListeners: () => {
        $('.note').click((e) => {
            let target = $(e.target).hasClass('note') ? $(e.target) : $(e.target).parent('.note');
            target.toggleClass('motif' + $('#motifbox').val());
            $curr = target;
        });
        $('#ptc').click(() => {
            let index;
            for (let k = 0; k < 12; k++) {
                $('.motif' + k).each((i, note) => {
                    index = $(note).attr('id').split('-');
                    newdata.allnotes.tracks[parseInt(index[0])].notes[parseInt(index[1])].motifs.push(k);
                });
            }
            console.log(JSON.stringify(newdata));
            newdata = reset;
        });
    },
    /*
     * Keyboard handlers:
     *  - Right arrow: focuses on the next note and toggles currently selected motif for the note
     *  - Left arrow: toggles currently selected motif for the focused note then focuses on the previous note
     */
    attachKeyboardListeners: () => {
        $(document).keydown((e) => {
            if (e.which == keys.RARROW) {
                e.preventDefault();
                $curr = $curr.next();
                $curr.click();
            } else if (e.which == keys.LARROW) {
                e.preventDefault();
                $curr.click();
                $curr = $curr.prev();
            }
        });
    }
};
