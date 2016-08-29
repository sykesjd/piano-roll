/**
 * Lyricize.js: Draws a piano roll for the purpose of adding lyrics
 */
$(() => {
    getRoll((piece, data) => {
        $('.but').show();
        $('body').scrollLeft(0);
        // core of motify: allow user to select motifs and print resulting JSON to console
        let newdata = data;
        let reset = data;
        let $curr;
        $('.note').click((e) => {
            if ($curr) $curr.toggleClass('selected');
            $(e.target).toggleClass('selected');
            $curr = $(e.target);
            $('#entry').focus();
        });
        $(document).keydown((e) => {
            if (e.which == 9) {
                e.preventDefault();
                $('#entry').focus();
            } else return;
        });
        $('#entry').keydown((e) => {
            if (e.which == 32 || e.which == 9) {
                // space or tab: to next note
                e.preventDefault();
                if ($curr.text() == '' || $('#entry').val() != '')
                    $curr.text($('#entry').val());
                $('#entry').val('');
                $curr.next().click();
            } else if (e.which == 13) {
                // return: to previous note
                e.preventDefault();
                if ($curr.text() == '' || $('#entry').val() != '')
                    $curr.text($('#entry').val());
                $('#entry').val('');
                $curr.prev().click();
            } else if (e.which == 27) {
                // esc: clear note
                e.preventDefault();
                $curr.text('');
                $('#entry').val('');
            } else return;
        });
        $('#ptc').click(() => {
            let index;
            $('.note').each((i, note) => {
                index = $(note).attr('id').split('-');
                newdata['allnotes']['tracks'][parseInt(index[0])]['notes'][parseInt(index[1])]['lyric'] = $(note).text();
            });
            console.log(JSON.stringify(newdata));
            newdata = reset;
        });
    });
});
