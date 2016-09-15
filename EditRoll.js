/**
 * EditRoll.js: Draws a piano roll for the purpose of adding motifs and lyrics
 */
let newdata, reset, $lcurr, $mcurr;
$(() => {
    getRoll((piece, data) => {
        $('.but').show();
        $('body').scrollLeft(0);
        data.allnotes.tracks.forEach((track) => {
            track.notes.forEach((note) => note.motifs = []);
        });
        newdata = data;
        reset = data;
        $('#mode').change((e) => {
            if ($lcurr) $lcurr.toggleClass('selected');
            $lcurr = null;
            $mcurr = null;
            $('.mode').hide();
            $('#' + e.target.value).show();
        });
        handlers.attachClickListeners();
        handlers.attachKeyboardListeners();
    });
});

/*
 * Keycodes for keyboard listeners
 */
const keys = {
    TAB: 9,
    RETURN: 13,
    ESCAPE: 27,
    SPACE: 32,
    LARROW: 37,
    RARROW: 39
};

/*
 * Event handlers for the motify and lyricize functionalities
 */
const handlers = {
    /*
     * Click handlers:
     *  - Clicking on a note selects the note for motif selection or text entry
     *  - Clicking on the "Get JSON" button modifies and opens the roll JSON in a new tab
     */
    attachClickListeners: () => {
        $('.note').click((e) => {
            switch ($('#mode').val()) {
                case 'motify':
                    let target = $(e.target).hasClass('note') ? $(e.target) : $(e.target).parent('.note');
                    target.toggleClass('motif' + $('#motifbox').val());
                    $mcurr = target;
                    break;
                case 'lyricize':
                    if ($lcurr) $lcurr.toggleClass('selected');
                    $(e.target).toggleClass('selected');
                    $lcurr = $(e.target);
                    $('#entry').focus();
                    break;
            }
        });
        $('#getJSON').click(() => {
            let index, loc, motifs;
            $('.note').each((i, note) => {
                index = $(note).attr('id').split('-');
                loc = newdata.allnotes.tracks[parseInt(index[0])].notes[parseInt(index[1])];
                loc.lyric = $(note).text();
                motifs = ($(note).attr('class').split(/\s+/)).filter((m) => m.match('^motif'));
                motifs.forEach((m) => loc.motifs.push(parseInt(m.split('motif')[1])));
            });
            window.open('data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(newdata)));
            window.focus();
            newdata = reset;
        });
    },
    /*
     * Keyboard handlers:
     *  - RARROW: focuses on the next note and toggles currently selected motif for the note (motify mode)
     *  - LARROW: toggles currently selected motif for the focused note then focuses on the previous note (motify mode)
     *  - TAB: focus on entry box if not already, else submit text to current note then move to next (lyricize mode)
     *  - SPACE: submit text to current note then move to next (lyricize mode)
     *  - RETURN: submit text to current note then move to previous (lyricize mode)
     *  - ESCAPE: clear current note of text (lyricize mode)
     */
    attachKeyboardListeners: () => {
        $(document).keydown((e) => {
            if (e.which == keys.RARROW) {
                e.preventDefault();
                if ($mcurr) {
                    $mcurr = $mcurr.next();
                    $mcurr.click();
                }
            } else if (e.which == keys.LARROW) {
                e.preventDefault();
                if ($mcurr) {
                    $mcurr.click();
                    $mcurr = $mcurr.prev();
                }
            } else if (e.which == keys.TAB) {
                e.preventDefault();
                if ($lcurr) $('#entry').focus();
            } else return;
        });
        $('#entry').keydown((e) => {
            if (e.which == keys.SPACE || e.which == keys.TAB) {
                e.preventDefault();
                if ($lcurr) {
                    handlers.submitText();
                    $lcurr.next().click();
                }
            } else if (e.which == keys.RETURN) {
                e.preventDefault();
                if ($lcurr) {
                    handlers.submitText();
                    $lcurr.prev().click();
                }
            } else if (e.which == keys.ESCAPE) {
                e.preventDefault();
                if ($lcurr) {
                    $lcurr.text('');
                    $('#entry').val('');
                }
            } else return;
        });
    },
    /*
     * Submits the entry box text to the currently selected note (lyricize mode)
     */
    submitText: () => {
        if ($lcurr.text() == '' || $('#entry').val() != '')
            $lcurr.text($('#entry').val());
        $('#entry').val('');
    }
};
