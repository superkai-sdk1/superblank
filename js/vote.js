(function($){
    function put_to_vote(delta) {
        var pos = $('.voute_line[data-act="1"]').length;
        if(pos == 0){
            $('.vote-table').css('display', 'table');
            $('.vote-table-mirror').css('display', 'table');
        }
        var line = $('#vt_'+pos);
        var view = $('#vv_'+pos);
        var dv = $('#dv_'+pos);
        var pl = $('#vpl_'+delta);
        var butt = $('#save_day');
        if($(pl).attr('data-invote') == 0){
            $(pl).attr('data-invote', '1');
            $(view).html(delta+1);
            $(line).attr('data-act', '1');
            $(line).css('display', 'table-row');
            $(dv).css('display', 'table-cell');
            $(dv).html(delta+1);
            if($(butt).css('display') == 'none'){
                $(butt).css('display', 'table-row');
            }
        }
    }

    function rem_from_vote(delta){
        var pos = $('.voute_line[data-act="1"]').length - 1;
        if(pos == 0){
            $('.vote-table').css('display', 'none');
            $('.vote-table-mirror').css('display', 'none');
        }
        var view = $('#vv_'+pos);
        if($(view).html() == delta){
            delta -= 1;
            var pl = $('#vpl_'+delta);
            var line = $('#vt_'+pos);
            var dv = $('#dv_'+pos);
            var butt = $('#save_day');
            $(pl).attr('data-invote', '0');
            $(view).html('');
            $(line).attr('data-act', '0');
            $(line).css('display', 'none');
            $(dv).css('display', 'none');
            $(dv).html("");
            $('#vt_'+pos+' .vote_st').each(function (){
                $(this).removeClass('vote_st');
            });
            $('#vt_'+pos+' .vote_nd').each(function (){
                $(this).removeClass('vote_nd');
            });

            if(pos == 0){
                $(butt).css('display', 'none');
            }
        }
    }

    function save_day(){
        var day = '';
        $('.voute_line[data-act="1"]').each(function (){
            var pos = $(this).data('line');
            var dv = $('#dv_'+pos);
            var line = $('#vt_'+pos);
            var view = $('#vv_'+pos);
            var st = $('#vt_'+pos+' .vote_st');
            var nd = $('#vt_'+pos+' .vote_nd');
            var pl = $(view).html();
            var tmp =0;
            var ppstr = pl;
            if($(st).length){
                tmp = ($(st).data('pos')+1);
                if(tmp == 6){ tmp += '+'; }
                str = pl + " - " + tmp + " голосов";
            } else {
                str = pl + " - " + tmp + " голосов";
            }

            if($(nd).length) {
                tmp = ($(nd).data('pos')+1);
                if(tmp == 6){ tmp += '+'; }
                str = str + " Голосов / После деления - " + tmp + " голосов";
            }

            $(line).css('display', 'none');
            $('#vpl_'+(pl-1)).attr('data-invote', '0');
            $(view).html('');
            $(line).attr('data-act', '0');
            $(dv).css('display', 'none');
            $(dv).html("");

            if(day != ''){
                day += '<br>';
            }

            day += str;
        });

        $('.vote_st').each(function (){
            $(this).removeClass('vote_st');
        });
        $('.vote_nd').each(function (){
            $(this).removeClass('vote_nd');
        });

        $('.vote-table').css('display', 'none');
        $('.vote-table-mirror').css('display', 'none');

        $('#save_day').css('display', 'none');

        var lp = parseInt($("#vote_res").attr("data-line"));
        var lpn = lp+1;
        $("#vote_res").attr("data-line", lpn);
        $("#vr_l"+lp).after('<div class="vote_day" id="vr_l'+lpn+'"><p>'+lpn+'</p><div data-day="'+lpn+'" class="helper">'+day+'</div></div>');
    }

    function createVotingTable() {
        const table = document.createElement('table');
        table.className = 'vote-table';
        table.style.display = 'none';

        const tbody = document.createElement('tbody');
        for (let i = 0; i < 10; i++) {
            const row = document.createElement('tr');
            row.className = 'voute_line';
            row.id = `vt_${i}`;
            row.setAttribute('data-act', '0');
            row.setAttribute('data-line', `${i}`);

            const viewCell = document.createElement('td');
            viewCell.id = `vv_${i}`;
            viewCell.className = 'voute_p';
            viewCell.setAttribute('data-delta', `${i}`);
            row.appendChild(viewCell);

            for (let j = 0; j < 6; j++) {
                const btnCell = document.createElement('td');
                btnCell.className = 'vote_butt';
                btnCell.setAttribute('data-line', `${i}`);
                btnCell.setAttribute('data-pos', `${j}`);
                btnCell.textContent = j + 1;
                row.appendChild(btnCell);
            }

            tbody.appendChild(row);
        }

        const saveRow = document.createElement('tr');
        saveRow.id = 'save_day';
        const saveCell = document.createElement('td');
        saveCell.className = 'voute_line';
        saveCell.setAttribute('colspan', '7');
        saveCell.textContent = 'Сохранить день';
        saveRow.appendChild(saveCell);
        tbody.appendChild(saveRow);

        table.appendChild(tbody);
        return table;
    }

    window.createVotingTable = createVotingTable;
    window.put_to_vote = put_to_vote;
    window.rem_from_vote = rem_from_vote;
    window.save_day = save_day;

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.vote_butt').forEach(button => {
            button.addEventListener('click', function () {
                document.querySelectorAll('.vote_butt').forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                document.querySelector('.vote-table').style.display = 'table';
            });
        });

        const voteTableWrapper = document.createElement('div');
        voteTableWrapper.className = 'vote-table-wrapper';
        voteTableWrapper.appendChild(createVotingTable());
        document.body.appendChild(voteTableWrapper);
    });
})(jQuery);
