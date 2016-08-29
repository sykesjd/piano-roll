/**
 * Motify.js: Draws a piano roll for the purpose of selecting motifs
 */
$(() => {
    getRoll((piece, data) => {
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
            let target = $(e.target).hasClass('note') ? $(e.target) : $(e.target).parent('.note');
            target.toggleClass('motif' + $('#motifbox').val());
            $curr = target;
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
    });
});
