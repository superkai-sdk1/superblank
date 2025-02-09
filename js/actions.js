(function($){
    function setFall(delta, value) {
        if ((value >= 0) && (value <= 4)) {
            const input = document.getElementById(`fall_field_${delta}`);
            const view = document.getElementById(`falls_view_${delta}`);
            const addPoints = document.getElementById(`add_points_${delta}`);

            if (input && view) {
                input.value = value;
                view.textContent = value;
                view.className = `fall_${value}`;

                if (value === 4) {
                    const penalty = -0.5;
                    const currentPoints = parseFloat(addPoints.value) || 0;
                    addPoints.setAttribute('data-fall-penalty', penalty);
                    addPoints.value = (currentPoints + penalty).toFixed(2);
                }
            }
        }
    }

    function applyFallPenalty() {
        for (let i = 0; i < 10; i++) {
            const fallInput = document.getElementById(`fall_field_${i}`);
            const addPoints = document.getElementById(`add_points_${i}`);

            if (fallInput && addPoints) {
                const fallValue = parseInt(fallInput.value) || 0;

                if (fallValue === 4) {
                    const currentPoints = parseFloat(addPoints.value) || 0;
                    const penalty = -0.5;
                    addPoints.value = (currentPoints + penalty).toFixed(2);
                }
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
                str = str + " Голосв / После деления - " + tmp + " голосов";
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

    function get_cnt_bm(){
        var bm = get_bm();
        var bm_cnt = 0;
        var role = '';
        for(var j=0; j<3; j++){
            role = $('#role_field_'+bm[j]).attr('value');
            if((role == 'm') | (role == 'd')){
                bm_cnt++;
            }
        }

        return bm_cnt;
    }

    function set_winner_mafia(){

        for(var i=0; i<10; i++){

            var points = 0;
            var add_points = 0;

            switch($('#role_field_'+i).attr('value')){
                case 'm':
                    points += mafia[0];
                    break;
                case 'd':
                    points += don[0];
                    break;
                case 'c':
                    points += city[1];
                    break;
                case 's':
                    points += sheriff[1];
                    break;
                    $('#points_'+i).attr('value', +points);
                    $('#points_'+i).val(+points);
                    $('#add_points_'+i).attr('value', +add_points);
                    updateTotal(i);
            }

            if($('#FK_field_0').attr('value') != ''){
                if($('#FK_field_0').attr('value') == i){
                    var bmp = 0;
                    switch($('#role_field_'+i).attr('value')){
                        case 'c':
                            bmp += first_killed[1];
                            switch(get_cnt_bm()){
                                case 0:
                                    bmp += bm_03[1];
                                    break;
                                case 1:
                                    bmp += bm_13[1];
                                    break;
                                case 2:
                                    bmp += bm_23[1];
                                    break;
                                case 3:
                                    bmp += bm_33[1];
                                    break;
                            }
                            break;
                        case 's':
                            bmp += first_killed[1];
                            switch(get_cnt_bm()){
                                case 0:
                                    bmp += bms_03[1];
                                    break;
                                case 1:
                                    bmp += bms_13[1];
                                    break;
                                case 2:
                                    bmp += bms_23[1];
                                    break;
                                case 3:
                                    bmp += bms_33[1];
                                    break;
                            }
                            break;
                    }

                    if(bmp_target[0] == 0){
                        points += bmp;
                    } else {
                        add_points += bmp;
                    }
                }
            }

            points = points.toFixed(6);
            add_points = add_points.toFixed(6);

            $('#points_'+i).attr('value', +points);
            $('#points_'+i).val(+points);
            $('#add_points_'+i).attr('value', +add_points);
            $('#add_points_'+i).val(+add_points);
        }

        $('#winner_field').attr('value', 'm');
        $('#winner_field').val('m');
    }

    function set_winner_city(){

        for(var i=0; i<10; i++){

            var points = 0;
            var add_points = 0;

            switch($('#role_field_'+i).attr('value')){
                case 'm':
                    points =+ mafia[1];
                    break;
                case 'd':
                    points =+ don[1];
                    break;
                case 'c':
                    points =+ city[0];
                    break;
                case 's':
                    points =+ sheriff[0];
                    break;
                    $('#points_'+i).attr('value', +points);
                    $('#points_'+i).val(+points);
                    $('#add_points_'+i).attr('value', +add_points);
                    $('#add_points_'+i).val(+add_points);
                    updateTotal(i);
            }

            if($('#FK_field_0').attr('value') != ''){
                if($('#FK_field_0').attr('value') == i){
                    var bmp = 0;
                    switch($('#role_field_'+i).attr('value')){
                        case 'c':
                            bmp += first_killed[0];
                            switch(get_cnt_bm()){
                                case 0:
                                    bmp += bm_03[0];
                                    break;
                                case 1:
                                    bmp += bm_13[0];
                                    break;
                                case 2:
                                    bmp += bm_23[0];
                                    break;
                                case 3:
                                    bmp += bm_33[0];
                                    break;
                            }
                            break;
                        case 's':
                            bmp += first_killed[0];
                            switch(get_cnt_bm()){
                                case 0:
                                    bmp += bms_03[0];
                                    break;
                                case 1:
                                    bmp += bms_13[0];
                                    break;
                                case 2:
                                    bmp += bms_23[0];
                                    break;
                                case 3:
                                    bmp += bms_33[0];
                                    break;
                            }
                            break;
                    }

                    if(bmp_target[0] == 0){
                        points += bmp;
                    } else {
                        add_points += bmp;
                    }
                }
            }

            points = points.toFixed(6);
            add_points = add_points.toFixed(6);

            $('#points_'+i).attr('value', +points);
            $('#points_'+i).val(+points);
            $('#add_points_'+i).attr('value', +add_points);
            $('#add_points_'+i).val(+add_points);
        }

        $('#winner_field').attr('value', 'c');
        $('#winner_field').val('c');
    }

    function clear_fk(){
        $('.fk_selected').each(function(){
            $(this).removeClass('fk_selected');
        });

        $('.all_bm_buttons').each(function(){
            $(this).css("display", "none");
        });

        $('.all_bm_actions').each(function(){
            $(this).css("display", "none");
        });

        $('.all_nicks').each(function(){
            $(this).css("display", "table-cell");
        });
    }

    function set_fk(delta){

        var pos = $('.fk_selected').length + $('.miss-select').length;
        if(pos<10){
            var input = $('#FK_field_'+pos);

            if(delta == -1){
                $('.miss-last').each(function(){ $(this).removeClass('miss-last') });
                $('#miss-container').append('<td class="allpos miss-select miss-last" data-misspos="'+pos+'">'+(pos+1)+'</td>');
                $(input).attr('value', delta);
                $(input).val(delta);
            } else {
                var view = $('#fk_'+delta);
                $(view).html((pos+1)+'<i class="fa fa-crosshairs"></i>');
                $('.miss-last').each(function(){ $(this).removeClass('miss-last') });
                $(view).addClass('fk_selected');
                $(view).addClass('allpos');
                $(view).attr('data-misspos', pos);
                _action = true;
                $(view).addClass('miss-last');

                $(input).attr('value', delta);
                $(input).val(delta);

                if(pos == 0){
                    $('.nick_'+delta).css("display", "none");
                    $('.bm_line_'+delta).css("display", "table-cell");
                    $('.hide_'+delta).css("display", "table-cell");
                }
                if(pos == 0) {
                    $('#line_'+delta).addClass('kill');
                }
            }
        }
    }

    function rem_fk(delta){
        var pos = $('.miss-select').length + $('.fk_selected').length-1;
        var input = $('#FK_field_'+pos);

        if(delta == -1){

        }

        var view = $('#fk_'+delta);
        var val = parseInt($(input).val());
        if(pos == 0) {
            $('#line_'+delta).removeClass('kill');
        }
        if(val == delta){
            $(view).html("");
            $(view).removeClass('fk_selected');
            $(input).attr('value', '');
            $(input).val('');

            if(pos == 0){
                $('.nick_'+delta).css("display", "table-cell");
                $('.bm_line_'+delta).css("display", "none");
                $('.hide_'+delta).css("display", "none");
            }

        }
    }

    function set_bp(delta){
        var pos = $('.b_pl').length;
        if(pos < best_player.length){
            $('#BP_field_'+pos).attr('value', delta);
            $('#BP_field_'+pos).val(delta);
            $('#bp_'+delta).html((pos+1)+'<i class="fa fa-star"></i>');
            $('#bp_'+delta).addClass('b_pl');

            var tar = (best_player[pos][1] == 0)?"#points_":"#add_points_";
            var points = +$(tar+delta).attr('value');
            points += best_player[pos][0];
            $(tar+delta).attr('value', points);
            $(tar+delta).val(points);
        }
    }

    function rem_bp(delta){
        var pos = $('.b_pl').length - 1;
        if($('#BP_field_'+pos).attr('value') == delta){
            $('#BP_field_'+pos).attr('value', '');
            $('#BP_field_'+pos).val('');
            $('#bp_'+delta).html('&nbsp;');
            $('#bp_'+delta).removeClass('b_pl');

            var tar = (best_player[pos][1] == 0)?"#points_":"#add_points_";
            var points = +$(tar+delta).attr('value');
            points -= best_player[pos][0];
            $(tar+delta).attr('value', points);
            $(tar+delta).val(points);
        }
    }

    document.addEventListener('dblclick', function(e) {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchstart', function() {}, {passive: true});

    $(document).ready(function() {
        $('#settingsToggle').click(function() {
            if($(this).is(':checked')) {
                $('.col5, .col6, .col7, .col8').css('display', 'table-cell');
            } else {
                $('.col5, .col6, .col7, .col8').css('display', 'none');
            }
        });

        $('#settingsToggle').click(function() {
            $('.hs').toggle();
            $(this).text(function(i, text) {
                return text === "Скрыть роли и баллы" ? "Показать роли и баллы" : "Скрыть роли и баллы";
            });
        });

        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                document.querySelector('.dropdown-content').classList.toggle('show');
            });
        }

        document.addEventListener('click', function(e) {
            if (!e.target.matches('#menuToggle')) {
                const dropdowns = document.getElementsByClassName('dropdown-content');
                for (let dropdown of dropdowns) {
                    if (dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                    }
                }
            }
        });

        document.querySelectorAll('.vote_butt').forEach(button => {
            button.addEventListener('click', function () {
                document.querySelectorAll('.vote_butt').forEach(btn => btn.classList.remove('vote_st'));
                this.classList.add('vote_st');
                document.querySelector('.vote-table').style.display = 'table';
            });
        });

        $('#save_day').click(function() {
            save_day();
            $('.vote-table-wrapper').hide();
            $('#vote_res').show();
        });
    });

    window.setFall = setFall;
})(jQuery);
