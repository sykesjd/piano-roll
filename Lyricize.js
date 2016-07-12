/**
 * Lyricize.js: Draws a piano roll for the purpose of adding lyrics
 */
$(() => {
    // get piece name as it appears in the file system
    let piece = $(location).attr('href').split('?')[1];
    $.getJSON('./JSON/' + piece + '.json').done((data) => {
        // calculate data necessary for proper note size and placement
        let reldat1 = tools.reldata(data);
        // for each track in the piece
        $.each(data['allnotes']['tracks'], (i, val) => {
            // get part number and type of track
            let reldat2 = tools.parttype(val);
            $.each(val['notes'], (j, value) => {
                // draw each note to screen
                tools.drawNote(i, j, value, reldat2[0], 4, reldat1[2], reldat1[0], reldat1[1]);
            });
        });
        $('.w').remove();
        $('#info').html(data['name'] + ' - ' + data['composer']);
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
    }).fail(() => {
        $('.w').html('Error loading data file; check your browser settings');
    });
});
