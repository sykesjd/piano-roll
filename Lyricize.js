/**
 * Lyricize.js: Draws a piano roll for the purpose of adding lyrics
 */
let newdata, reset, $curr;
$(() => {
    getRoll((piece, data) => {
        $('.but').show();
        $('body').scrollLeft(0);
        newdata = data;
        reset = data;
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
    SPACE: 32
};

/*
 * Event handlers for the Lyricize functionality
 */
const handlers = {
    /*
     * Click handlers:
     *  - Clicking on a note selects the note for text entry
     *  - Clicking on the "Get JSON" button lyricizes the data and opens the JSON in a new tab
     */
    attachClickListeners: () => {
        $('.note').click((e) => {
            if ($curr) $curr.toggleClass('selected');
            $(e.target).toggleClass('selected');
            $curr = $(e.target);
            $('#entry').focus();
        });
        $('#getJSON').click(() => {
            let index;
            $('.note').each((i, note) => {
                index = $(note).attr('id').split('-');
                newdata.allnotes.tracks[parseInt(index[0])].notes[parseInt(index[1])].lyric = $(note).text();
            });
            window.open('data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(newdata)));
            window.focus();
            newdata = reset;
        });
    },
    /*
     * Keyboard handlers:
     *  - TAB: focus on entry box if not already, else submit text to current note then move to next
     *  - SPACE: submit text to current note then move to next
     *  - RETURN: submit text to current note then move to previous
     *  - ESCAPE: clear current note of text
     */
    attachKeyboardListeners: () => {
        $(document).keydown((e) => {
            if (e.which == keys.TAB) {
                e.preventDefault();
                if ($curr) $('#entry').focus();
            } else return;
        });
        $('#entry').keydown((e) => {
            if (e.which == keys.SPACE || e.which == keys.TAB) {
                e.preventDefault();
                handlers.submitText();
                $curr.next().click();
            } else if (e.which == keys.RETURN) {
                e.preventDefault();
                handlers.submitText();
                $curr.prev().click();
            } else if (e.which == keys.ESCAPE) {
                e.preventDefault();
                $curr.text('');
                $('#entry').val('');
            } else return;
        });
    },
    /*
     * Submits the entry box text to the currently selected note
     */
    submitText: () => {
        if ($curr.text() == '' || $('#entry').val() != '')
            $curr.text($('#entry').val());
        $('#entry').val('');
    }
};
