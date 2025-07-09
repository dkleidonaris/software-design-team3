import $ from 'jquery';
import { Chart } from 'chart.js/auto';

import './main.js';

import { API_URL } from './config.js';
import { setTitle } from './helpers.js';
import { ensureLoggedIn } from './auth.js';

ensureLoggedIn();
setTitle("My Daily Log");

const $dateInput = $('#log-date');
const $content = $('.content');
const $prev = $('#prev-date');
const $next = $('#next-date');

let currentDate = new Date();
let currentLog = null;
let allMeals = [];

init();

function init() {
    $dateInput.val(formatDate(currentDate));
    fetchAllMeals();
    fetchAndRenderLog();

    $dateInput.on('change', () => {
        currentDate = new Date($dateInput.val());
        fetchAndRenderLog();
    });

    $prev.on('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        $dateInput.val(formatDate(currentDate));
        fetchAndRenderLog();
    });

    $next.on('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        $dateInput.val(formatDate(currentDate));
        fetchAndRenderLog();
    });
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

async function fetchAllMeals() {
    try {
        allMeals = await $.get(`${API_URL}/meals`);
    } catch (err) {
        console.error('Failed to fetch meals list', err);
    }
}

async function fetchAndRenderLog() {
    $content.html('<div class="d-flex justify-content-center"><div class="spinner-border" role="status"></div></div>');

    try {
        const dateStr = formatDate(currentDate);
        const [user, meals] = await Promise.all([
            $.get(`${API_URL}/users/current`),
            $.get(`${API_URL}/meals`)
        ]);

        allMeals = meals;

        let log;

        try {
            log = await $.get(`${API_URL}/users/current/dailyLogs/byDate?date=${dateStr}`);
        } catch (err) {
            if (err.status === 404) {
                const created = await $.ajax({
                    url: `${API_URL}/dailyLogs`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        user: user._id,
                        date: dateStr,
                        eatMorning: true,
                        eatNoon: true,
                        eatEvening: true,
                        notes: '',
                        extraSnacks: []
                    })
                });
                log = created;
            } else {
                throw err;
            }
        }

        currentLog = log;
        renderLog(log, dateStr, user.currentDietPlan);
    } catch (err) {
        console.error(err);
        $content.html(`<div class="alert alert-danger">Failed to load daily log.</div>`);
    }
}



function renderLog(log, dateStr, dietPlan) {
    const mealOptions = allMeals.map(meal =>
        `<option value="${meal._id}">${meal.name}</option>`
    ).join('');

    const snackList = log.extraSnacks.map((snack, i) =>
        `<li class="list-group-item d-flex justify-content-between align-items-center">
      ${snack.name}
      <button class="btn btn-sm btn-outline-danger remove-snack" data-index="${i}">×</button>
    </li>`
    ).join('');

    const card = `
    <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title">Daily Log – ${dateStr}</h5>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="eatMorning" ${log.eatMorning ? 'checked' : ''}>
          <label class="form-check-label" for="eatMorning">Ate Breakfast</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="eatNoon" ${log.eatNoon ? 'checked' : ''}>
          <label class="form-check-label" for="eatNoon">Ate Lunch</label>
        </div>
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" id="eatEvening" ${log.eatEvening ? 'checked' : ''}>
          <label class="form-check-label" for="eatEvening">Ate Dinner</label>
        </div>

        <label for="notes" class="form-label">Notes:</label>
        <textarea id="notes" class="form-control mb-3">${log.notes || ''}</textarea>

        <label class="form-label">Extra Snacks:</label>
        <ul class="list-group mb-3" id="snack-list">
          ${snackList || '<li class="list-group-item text-muted">No snacks</li>'}
        </ul>

        <div class="input-group mb-3">
          <select class="form-select" id="new-snack">${mealOptions}</select>
          <button class="btn btn-outline-primary" id="add-snack">Add Snack</button>
        </div>

        <button class="btn btn-success" id="save-log">Save Changes</button>

        <hr class="my-4" />
        <h6>Nutrition Overview</h6>
        <canvas id="calorieChart" height="100"></canvas>
        <canvas id="macroChart" height="100" class="mt-4" style="max-height: 220px;"></canvas>
      </div>
    </div>
  `;

    $content.html(card);

    setTimeout(() => {
        renderCharts(log, dietPlan);
    }, 0);


    $('#add-snack').on('click', () => {
        const newSnackId = $('#new-snack').val();
        const meal = allMeals.find(m => m._id === newSnackId);

        if (
            meal &&
            !currentLog.extraSnacks.some(s => (typeof s === 'object' ? s._id : s) === newSnackId)
        ) {
            currentLog.extraSnacks.push(meal);
            renderLog(currentLog, formatDate(currentDate));
        }
    });

    $('.remove-snack').on('click', function () {
        const index = $(this).data('index');
        currentLog.extraSnacks.splice(index, 1);
        renderLog(currentLog, formatDate(currentDate));
    });


    $('#save-log').on('click', async () => {
        const $btn = $('#save-log');

        const updated = {
            eatMorning: $('#eatMorning').is(':checked'),
            eatNoon: $('#eatNoon').is(':checked'),
            eatEvening: $('#eatEvening').is(':checked'),
            notes: $('#notes').val(),
            extraSnacks: currentLog.extraSnacks.map(snack => typeof snack === 'string' ? snack : snack._id)
        };

        console.log(updated);

        $btn
            .prop('disabled', true)
            .html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...');

        try {
            await $.ajax({
                url: `${API_URL}/dailyLogs/${currentLog._id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updated)
            });


            $btn
                .removeClass('btn-danger')
                .addClass('btn-success')
                .html('<i class="bi bi-check-circle-fill me-2"></i>Saved!');

            setTimeout(() => {
                $btn
                    .prop('disabled', false)
                    .removeClass('btn-success')
                    .html('Save Changes');
            }, 1500);

            fetchAndRenderLog();
        } catch (err) {
            $btn
                .prop('disabled', false)
                .removeClass('btn-success')
                .addClass('btn-danger')
                .html('Error saving');

            setTimeout(() => {
                $btn.removeClass('btn-danger').html('Save Changes');
            }, 1500);
        }
    });

}

function renderCharts(log, dietPlan) {
    const today = new Date(currentDate).toLocaleString('en-US', { weekday: 'long' });
    const mealFlags = [log.eatMorning, log.eatNoon, log.eatEvening];
    const slots = ['morning', 'noon', 'evening'];

    let mainMeals = [];

    if (dietPlan && dietPlan.schedule) {
        dietPlan.schedule.forEach(entry => {
            if (entry.day === today && slots.includes(entry.timeOfDay)) {
                const index = slots.indexOf(entry.timeOfDay);
                if (mealFlags[index] && typeof entry.meal === 'object') {
                    mainMeals.push(entry.meal); // already populated
                }
            }
        });
    }

    const snacks = log.extraSnacks.filter(m => typeof m === 'object');
    const allEaten = [...mainMeals, ...snacks];

    const totalCalories = allEaten.reduce((sum, m) => sum + (m.calories || 0), 0);

    const macros = allEaten.reduce((acc, m) => {
        acc.protein += Number(m.protein) || 0;
        acc.fat += Number(m.fat) || 0;
        acc.carbs += Number(m.carbs || m.sugar || 0); // fallback to sugar if no carbs field
        return acc;
    }, { protein: 0, fat: 0, carbs: 0 });

    // Destroy existing charts (important if re-rendering)
    Chart.getChart('calorieChart')?.destroy();
    Chart.getChart('macroChart')?.destroy();

    new Chart(document.getElementById('calorieChart'), {
        type: 'bar',
        data: {
            labels: ['Calories'],
            datasets: [{
                label: 'Total',
                data: [totalCalories],
                backgroundColor: '#198754'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    new Chart(document.getElementById('macroChart'), {
        type: 'pie',
        data: {
            labels: ['Protein', 'Fat', 'Sugar'],
            datasets: [{
                data: [macros.protein, macros.fat, macros.carbs],
                backgroundColor: ['#0d6efd', '#dc3545', '#ffc107']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

