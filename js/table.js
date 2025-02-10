window.setFall = function(delta, value) {
    const fallInput = document.getElementById(`fall_field_${delta}`);
    const fallView = document.getElementById(`falls_view_${delta}`);

    if (fallInput && fallView) {
        fallInput.value = value;
        fallView.textContent = value;
        fallView.className = `fall_${value}`;
    }
};
// Function to handle kill order
let killOrder = [];

function handleKillOrder(delta) {
    if (!killOrder.includes(delta)) {
        killOrder.push(delta);
        const order = killOrder.indexOf(delta) + 1;
        document.getElementById(`fk_${delta}`).textContent = order;
    }
}

// Function to create the voting table
function createTable() {
    const table = document.createElement('table');
    table.id = 'game_settings';
    table.className = 'main-game-table';

    const tbody = document.createElement('tbody');

    // Create table header row
    const headerRow = document.createElement('tr');
    const headers = ['№', 'Никнейм', 'Фолы', '', 'Роль', 'Баллы', 'Доп', 'Итог'];
    headers.forEach((headerText, index) => {
        const th = document.createElement('td');

        if (index === 3) {
            const icon = document.createElement('img');
            icon.src = 'images/gun.png';
            icon.alt = 'Gun Icon';
            icon.style.width = '40px';
            icon.style.height = '20px';
            th.appendChild(icon);
        } else {
            th.textContent = headerText;
        }

        if (index >= 4) {
            th.classList.add('hs');
        }
        headerRow.appendChild(th);
    });
    tbody.appendChild(headerRow);

    // Create table rows
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        row.id = `line_${i}`;
        row.className = 'active_line';

        // Player number
        const numberCell = document.createElement('td');
        numberCell.id = `vpl_${i}`;
        numberCell.className = 'col1 to_vote';
        numberCell.setAttribute('data-delta', i);
        numberCell.setAttribute('data-invote', '0');
        numberCell.textContent = i + 1;

        numberCell.addEventListener('click', function () {
            put_to_vote(i);
        });

        row.appendChild(numberCell);

        // Nickname
        const nicknameCell = document.createElement('td');
        nicknameCell.className = 'col2 nss';
        const nicknameTable = document.createElement('table');
        nicknameTable.className = 'bm_nick';
        const nicknameRow = document.createElement('tr');
        for (let j = 0; j < 10; j++) {
            const bmCell = document.createElement('td');
            bmCell.className = `bm_pick bm_line_${i} bm_pos_${j} all_bm_buttons`;
            bmCell.setAttribute('data-pos', j);
            bmCell.setAttribute('data-line', i);
            bmCell.textContent = j + 1;
            nicknameRow.appendChild(bmCell);
        }
        nicknameRow.appendChild(createActionButtons(i));
        nicknameTable.appendChild(nicknameRow);
        nicknameCell.appendChild(nicknameTable);
        row.appendChild(nicknameCell);

        // Foul
        const fallsCell = document.createElement('td');
        fallsCell.className = 'col3 nss';
        fallsCell.appendChild(createFallsWidget(i));
        row.appendChild(fallsCell);

        // Kill order
        const iconCell = document.createElement('td');
        iconCell.id = `fk_${i}`;
        iconCell.className = 'col4 fk_pick nss';
        iconCell.setAttribute('data-delta', i);

        iconCell.addEventListener('click', function () {
            handleKillOrder(i);
        });

        row.appendChild(iconCell);

        // Role
        const roleCell = document.createElement('td');
        roleCell.className = 'col5 hs';
        roleCell.appendChild(createRoleInput(i));
        row.appendChild(roleCell);

        // Points
        const pointsCell = document.createElement('td');
        pointsCell.className = 'col6 hs';
        pointsCell.appendChild(createPointsInput(i));
        row.appendChild(pointsCell);

        // Additional points
        const addPointsCell = document.createElement('td');
        addPointsCell.className = 'col7 hs';
        addPointsCell.appendChild(createAddPointsInput(i));
        row.appendChild(addPointsCell);

        // Total
        const totalCell = document.createElement('td');
        totalCell.id = `bp_${i}`;
        totalCell.className = 'col8 bp_select hs';
        totalCell.setAttribute('data-delta', i);
        row.appendChild(totalCell);

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    return table;
}

function createActionButtons(line) {
    const hideButton = document.createElement('td');
    hideButton.className = `hide_${line} all_hide all_bm_actions`;
    hideButton.setAttribute('data-line', line);
    hideButton.innerHTML = '<img src="images/hide.png" alt="hide icon">';

    const showButton = document.createElement('td');
    showButton.className = `show_${line} all_show all_bm_actions`;
    showButton.setAttribute('data-line', line);
    showButton.innerHTML = '<img src="images/show.png" alt="show icon">';

    const nickCell = document.createElement('td');
    nickCell.className = `nick_${line} all_nicks`;
    const nicknameInput = document.createElement('input');
    nicknameInput.className = 'user_entity_acp nick_acpl selected form-text form-autocomplete';
    nicknameInput.setAttribute('data-delta', line);
    nicknameInput.setAttribute('type', 'text');
    nicknameInput.setAttribute('name', `field_rate_game_players[und][${line}][target_id]`);
    nicknameInput.setAttribute('value', '');
    nicknameInput.setAttribute('maxlength', '1024');
    nickCell.appendChild(nicknameInput);

    const container = document.createElement('div');
    container.appendChild(hideButton);
    container.appendChild(showButton);
    container.appendChild(nickCell);

    return container;
}

function createFallsWidget(delta) {
    const fallsWidget = document.createElement('table');
    fallsWidget.className = 'falls_widget';

    const fallsRow = document.createElement('tr');

    const fallInput = document.createElement('input');
    fallInput.id = `fall_field_${delta}`;
    fallInput.setAttribute('type', 'hidden');
    fallInput.setAttribute('value', '0');
    fallsRow.appendChild(fallInput);

    const fallCell = document.createElement('td');
    fallCell.className = 'fall_click border_0';
    fallCell.setAttribute('data-delta', delta);

    const fallView = document.createElement('div');
    fallView.id = `falls_view_${delta}`;
    fallView.className = 'fall_0';
    fallView.textContent = '0';
    fallCell.appendChild(fallView);

    fallCell.addEventListener('click', function () {
        const currentValue = parseInt(document.getElementById(`fall_field_${delta}`).value) || 0;
        const newValue = currentValue + 1;
        if (newValue <= 4) {
            window.setFall(delta, newValue);
        }
    });

    fallsRow.appendChild(fallCell);

    const removeClickCell = document.createElement('td');
    removeClickCell.className = 'remove_click border_0';
    removeClickCell.setAttribute('data-delta', delta);
    removeClickCell.innerHTML = '-';
    removeClickCell.addEventListener('click', function () {
        const currentValue = parseInt(document.getElementById(`fall_field_${delta}`).value) || 0;
        const newValue = currentValue - 1;
        if (newValue >= 0) {
            window.setFall(delta, newValue);
        }
    });

    fallsRow.appendChild(removeClickCell);

    fallsWidget.appendChild(fallsRow);
    return fallsWidget;
}

function createRoleInput(delta) {
    const roleInput = document.createElement('input');
    roleInput.id = `role_field_${delta}`;
    roleInput.className = 'role_field_all';
    roleInput.setAttribute('type', 'hidden');
    roleInput.setAttribute('name', `field_role[und][${delta}][value]`);
    roleInput.setAttribute('value', 'c');

    const roleView = document.createElement('div');
    roleView.id = `role_view_${delta}`;
    roleView.className = 'role';
    roleView.setAttribute('data-delta', delta);

    const container = document.createElement('div');
    container.appendChild(roleInput);
    container.appendChild(roleView);

    return container;
}

function createPointsInput(delta) {
    const pointsInput = document.createElement('input');
    pointsInput.id = `points_${delta}`;
    pointsInput.setAttribute('type', 'text');
    pointsInput.setAttribute('name', `field_points[und][${delta}][value]`);
    pointsInput.setAttribute('value', '');
    pointsInput.setAttribute('size', '60');
    pointsInput.setAttribute('maxlength', '128');
    pointsInput.className = 'form-text';

    const container = document.createElement('div');
    container.className = 'form-item form-type-textfield form-item-field-points-und-0-value';
    container.appendChild(pointsInput);

    return container;
}

function createAddPointsInput(delta) {
    const addPointsInput = document.createElement('input');
    addPointsInput.id = `add_points_${delta}`;
    addPointsInput.setAttribute('type', 'text');
    addPointsInput.setAttribute('name', `field_add_points[und][${delta}][value]`);
    addPointsInput.setAttribute('value', '');
    addPointsInput.setAttribute('size', '60');
    addPointsInput.setAttribute('maxlength', '128');
    addPointsInput.className = 'form-text';

    const container = document.createElement('div');
    container.className = 'form-item form-type-textfield form-item-field-add-points-und-0-value';
    container.appendChild(addPointsInput);

    return container;
}

// Add the table to the DOM
document.addEventListener('DOMContentLoaded', () => {
    const tableWrapper = document.querySelector('.main-game-table-wrapper');
    tableWrapper.appendChild(createTable());
});
