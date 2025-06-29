import $ from 'jquery';

import './main.js';

import { API_URL } from './config.js';
import { setTitle } from './helpers.js';
import { ensureLoggedIn } from './auth.js';

ensureLoggedIn();
setTitle("My Diet");

let currentPlanId = null;

await fetchCurrentUser();
fetchAndRenderDietPlans();


async function fetchCurrentUser() {
    ensureLoggedIn();

    try {
        const response = await $.get(`${API_URL}/users/current`);
        currentPlanId = response.currentDietPlan || null;
    } catch (err) {
        console.error("Failed to fetch user", err);
    }
}

function fetchAndRenderDietPlans() {
    ensureLoggedIn();

    $.get(`${API_URL}/dietPlans`, function (plans) {
        const $main = $('.content');
        $main.empty();

        if (!plans.length) {
            $main.append('<p>No diet plans available at the moment.</p>');
            return;
        }

        const $row = $('<div class="row g-4"></div>');

        plans.forEach(plan => {
            const isSelected = plan._id === currentPlanId;
            const btnClass = isSelected ? 'btn-secondary disabled' : 'btn-success';
            const btnText = isSelected ? 'Selected' : 'Choose';

            const card = `
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm ${isSelected ? 'border-success' : ''}">
                        <div class="card-body d-flex flex-column">
                           <h5 class="card-title">
                                <a href="plans?id=${plan._id}" class="text-decoration-none">${plan.title}</a>
                            </h5>
                            <p class="card-text flex-grow-1">${plan.description}</p>
                            <button class="btn ${btnClass} mt-3 select-plan-btn" data-id="${plan._id}" ${isSelected ? 'disabled' : ''}>${btnText}</button>
                        </div>
                    </div>
                </div>`;
            $row.append(card);
        });

        $main.append($row);

        $('.select-plan-btn').on('click', function () {
            const planId = $(this).data('id');
            updateUserDietPlan(planId);
        });
    });
}

function updateUserDietPlan(planId) {
    ensureLoggedIn();

    const $btn = $(`.select-plan-btn[data-id="${planId}"]`);
    $btn
        .prop('disabled', true)
        .removeClass('btn-success')
        .addClass('btn-secondary')
        .html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...`);

    $.ajax({
        url: `${API_URL}/users/current/dietPlan`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ currentDietPlan: planId }),
        success: function () {
            currentPlanId = planId;
            fetchAndRenderDietPlans();
        },
        error: function () {
            $btn
                .prop('disabled', false)
                .removeClass('btn-secondary')
                .addClass('btn-success')
                .text('Choose');

            alert("Failed to update diet plan.");
        }
    });
}

