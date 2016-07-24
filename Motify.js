/**
 * Motify.js: Draws a piano roll for the purpose of selecting motifs
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
                tools.drawNote(i, j, value, reldat2[0], reldat2[1], reldat1[2], reldat1[0], reldat1[1]);
            });
        });
        $('.w').remove();
        $('#info').html(data['name'] + ' - ' + data['composer']);
        $('.but').show();
        $('body').scrollLeft(0);
        // core of motify: allow user to select motifs and print resulting JSON to console
        let newdata = data;
        $.each(data['allnotes']['tracks'], (i, val) => {
            $.each(val['notes'], (j, value) => value['motifs'] = []);
        });
        let reset = newdata;
        let $curr;
        $('.note').click((e) => {
            $(e.target).toggleClass('motif' + $('#motifbox').val());
            $curr = $(e.target);
        });
        $(document).keydown((e) => {
            if (e.which == 39) {
                e.preventDefault();
                $curr = $curr.next();
                $curr.click();
            } else if (e.which == 37) {
                e.preventDefault();
                $curr.click();
                $curr = $curr.prev();
            }
        });
        $('#ptc').click(() => {
            let index;
            for (let k = 0; k < 12; k++) {
                $('.motif' + k).each((i, note) => {
                    index = $(note).attr('id').split('-');
                    newdata['allnotes']['tracks'][parseInt(index[0])]['notes'][parseInt(index[1])]['motifs'].push(k);
                });
            }
            console.log(JSON.stringify(newdata));
            newdata = reset;
        });
    }).fail(() => {
        $('.w').html('Error loading data file; check your browser settings');
    });
});
