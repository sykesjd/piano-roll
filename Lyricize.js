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
                drawNote(i, j, value, reldat2[0], 4, reldat1[2], reldat1[0], reldat1[1]);
            });
        });
        $('.w').remove();
        $('#info').html(data['name'] + ' - ' + data['composer']);
        $('.but').show();
        $('body').scrollLeft(0);
        // core of motify: allow user to select motifs and print resulting JSON to console
        var newdata = data;
        var reset = data;
        var $curr;
        $('.note').click(function() {
            if ($curr) $curr.toggleClass('selected');
            $(this).toggleClass('selected');
            $curr = $(this);
            $('#entry').focus();
        });
        $(document).keydown(function(e) {
            if (e.which == 9) {
                e.preventDefault();
                $('#entry').focus();
            } else return;
        });
        $('#entry').keydown(function(e) {
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
        $('#ptc').click(function() {
            $('.note').each(function() {
                var index = $(this).attr('id').split('-');
                newdata['allnotes']['tracks'][parseInt(index[0])]['notes'][parseInt(index[1])]['lyric'] = $(this).text();
            });
            console.log(JSON.stringify(newdata));
            newdata = reset;
        });
    }).fail(function() {
        $('.w').html('Error loading data file; check your browser settings');
    });
});
