$(function(){
    // get piece name as it appears in the file system
    var piece = $(location).attr('href').split('?')[1];
    $.getJSON('./JSON/' + piece + '.json').done(function(data) {
        // calculate data necessary for proper note size and placement
        var reldat1 = reldata(data);
        // for each track in the piece
        $.each(data['allnotes']['tracks'], function(i, val) {
            // get part number and type of track
            var reldat2 = parttype(val);
            $.each(val['notes'], function(j, value) {
                // draw each note to screen
                drawNote(i, j, value, reldat2[0], reldat2[1], reldat1[2], reldat1[0], reldat1[1]);
            });
        });
        $('.w').remove();
        $('#info').html(data['name'] + ' - ' + data['composer']);
        $('.but').show();
        $('body').scrollLeft(0);
        // core of motify: allow user to select motifs and print resulting JSON to console
        var newdata = data;
        $.each(data['allnotes']['tracks'], function(i, val) {
            $.each(val['notes'], function(j, value) {
                value['motifs'] = [];
            });
        });
        var reset = newdata;
        var $curr;
        $('.note').click(function() {
            $(this).toggleClass('motif' + $('#motifbox').val());
            $curr = $(this);
        });
        $(document).keydown(function(e) {
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
        $('#ptc').click(function() {
            for (var k = 0; k < 12; k++) {
                $('.motif' + k).each(function() {
                    var index = $(this).attr('id').split('-');
                    newdata['allnotes']['tracks'][parseInt(index[0])]['notes'][parseInt(index[1])]['motifs'].push(k);
                });
            }
            console.log(JSON.stringify(newdata));
            newdata = reset;
        });
    }).fail(function() {
        $('.w').html('Error loading data file; check your browser settings');
    });
});
