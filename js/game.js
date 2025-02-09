(function($){
    var _action = false;
    var roles = {
        'c': '&nbsp;',
        'm': 'М',
        'd': 'Д',
        's': 'Ш'
    };

    function checkValues(){
        var m = $('.role_field_all[value="m"]').length;
        var d = $('.role_field_all[value="d"]').length;
        var s = $('.role_field_all[value="s"]').length;

        if((m != 2) | (d != 1) | (s != 1)){
            alert("Не правильно отмечены роли!");
            return -1;
        }

        return 0;
    }

    function saveData() {
        const nicknames = [];
        document.querySelectorAll('.nick_acpl').forEach((input, index) => {
            nicknames[index] = input.value;
            localStorage.setItem('nicknames', JSON.stringify(nicknames));
        });

        const roles = [];
        document.querySelectorAll('.role_field_all').forEach((input, index) => {
            roles[index] = input.value;
            localStorage.setItem('roles', JSON.stringify(roles));
        });

        const falls = [];
        document.querySelectorAll('[id^=fall_field_]').forEach((input, index) => {
            falls[index] = input.value;
            localStorage.setItem('falls', JSON.stringify(falls));
        });

        const points = [];
        document.querySelectorAll('[id^=points_]').forEach((input, index) => {
            points[index] = input.value;
            localStorage.setItem('points', JSON.stringify(points));
        });
    }

    function loadData() {
        const nicknames = JSON.parse(localStorage.getItem('nicknames')) || [];
        document.querySelectorAll('.nick_acpl').forEach((input, index) => {
            if(nicknames[index]) input.value = nicknames[index];
        });

        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        document.querySelectorAll('.role_field_all').forEach((input, index) => {
            if(roles[index]) {
                input.value = roles[index];
                document.getElementById(`role_view_${index}`).innerHTML = roles[index];
            }
        });

        const falls = JSON.parse(localStorage.getItem('falls')) || [];
        document.querySelectorAll('[id^=fall_field_]').forEach((input, index) => {
            if(falls[index]) input.value = falls[index];
        });

        const points = JSON.parse(localStorage.getItem('points')) || [];
        document.querySelectorAll('[id^=points_]').forEach((input, index) => {
            if(points[index]) input.value = points[index];
        });
    }

    function setRole(delta, value){
        if(roles.hasOwnProperty(value)){
            var input = $('#role_field_'+delta);
            var view = $('#role_view_'+delta);
            $(input).attr('value', value);
            $(input).val(value);
            $(view).html(roles[value]);
        }
    }

    function check_all(){
        for(var i = 0; i < 10; i++){
            var val = parseInt($('#fall_field_'+i).val());
            var view = $('#falls_view_'+i);
            var bp = $('#BP_field_'+i).attr('value');

            var role = $('#role_field_'+i).attr('value');
            $('#role_view_'+i).html(roles[role]);

            if($(view).attr('class') != 'fall_'+val){
                $(view).attr('class', 'fall_'+val);
            }

            if(bp != ""){
                $('#bp_'+bp).html(i+1);
                $('#bp_'+bp).addClass('b_pl');
            }
        }

        clear_fk();
        for(var i = 0; i < 10; i++){
            if($('#FK_field_'+i).val() != ""){
                var val = parseInt($('#FK_field_'+i).val());
                $('#fk_'+val).addClass('fk_selected');
                $('#fk_'+val).html((i+1));

                if(i == 0){
                    $('.show_'+val).css("display", "table-cell");
                }

                if(i==0){
                    var bm = get_bm();
                    process_bm(bm);
                }
            }
        }

        var m = $('#mafia');
        var c = $('#city');
        switch($('#winner_field').val() ){
            case 'c':
                $(c).addClass('win_team');
                $(m).removeClass('win_team');
                break;
            case 'm':
                $(m).addClass('win_team');
                $(c).removeClass('win_team');
                break;
        }
    }

    function process_bm(mass){
        var field = [$('#BM_field_0'), $('#BM_field_1'), $('#BM_field_2')];
        for(var i = 0; i<3; i++){
            $(field[i]).attr('value', '');
            $(field[i]).val('');
        }

        var l = mass.length;
        var tmp;
        for(var j = 0; j<l-1; j++){
            for(i = 0; i<l-1; i++){
                if(mass[i]>mass[i+1]){
                    tmp = mass[i];
                    mass[i] = mass[i+1];
                    mass[i+1] = tmp;
                }
            }
        }

        $('.bm_selected').each(function(){
            $(this).removeClass('bm_selected');
        });

        for(i = 0; i<l; i++){
            $(field[i]).attr('value', mass[i]);
            $(field[i]).val(mass[i]);
            $('.bm_pos_'+mass[i]).each(function(){
                $(this).addClass('bm_selected');
            });
        }
    }

    function in_bm(mass, elem){
        for(var i=0; i<mass.length; i++){
            if(mass[i] == elem){
                return i;
            }
        }

        return -1;
    }

    function get_bm(){
        var res = [];
        var field = [$('#BM_field_0'), $('#BM_field_1'), $('#BM_field_2')];
        for(var i = 0; i<3; i++){
            if($(field[i]).val() != ''){
                res.push(parseInt($(field[i]).val()));
            }
        }
        return res;
    }

    function set_bm(pos){
        var bm = get_bm();
        var ip = in_bm(bm, pos);
        var l = bm.length;
        if(ip<0){
            if(l < 3){
                bm.push(pos);
            }
        } else {
            var tmp = [];
            for(var i = 0; i<l; i++){
                if(ip != i){
                    tmp.push(bm[i]);
                }
            }
            bm = tmp;
        }

        process_bm(bm);
    }

    function hide_bm(delta){
        $('.bm_line_'+delta).css("display", "none");
        $('.hide_'+delta).css("display", "none");
        $('.show_'+delta).css("display", "table-cell");
        $('.nick_'+delta).css("display", "table-cell");
    }

    function show_bm(delta){
        $('.nick_'+delta).css("display", "none");
        $('.bm_line_'+delta).css("display", "table-cell");
        $('.hide_'+delta).css("display", "table-cell");
        $('.show_'+delta).css("display", "none");
    }

    function points_callc(delta, cur, target){
        var tar = (target == 0)?"#points_":"#add_points_";
        tar += delta;
        var data = +$(tar).val();
        data += values[cur];
        data = data.toFixed(6);
        $(tar).attr('value', +data);
        $(tar).val(+data);
    }

    function updateTotal(rowIndex) {
        const points = parseFloat(document.getElementById(`points_${rowIndex}`).value) || 0;
        const addPoints = parseFloat(document.getElementById(`add_points_${rowIndex}`).value) || 0;
        const total = points + addPoints;
        document.getElementById(`bp_${rowIndex}`).textContent = total.toFixed(2);
    }

    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker зарегистрирован');
                })
                .catch(error => {
                    console.log('Ошибка регистрации ServiceWorker:', error);
                });
        });
    }

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
    });
})(jQuery);
