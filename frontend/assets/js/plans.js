import $ from 'jquery';

import './main.js';

import { setTitle } from './helpers';
import { API_URL } from './config.js';

setTitle();

$(document).ready(function () {
    const container = $("#plans-container");

    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get("id");

    if (planId) {
        $('.allPlans').remove();
        $.ajax({
            url: `${API_URL}/dietPlans/${planId}`,
            method: "GET",
            success: function (plan) {
                const container = $("#plans-container");

                // Ομαδοποίηση των γευμάτων ανά ημέρα
                const scheduleByDay = {};
                plan.schedule.forEach(entry => {
                    if (!scheduleByDay[entry.day]) {
                        scheduleByDay[entry.day] = [];
                    }
                    scheduleByDay[entry.day].push(entry);
                });

                let scheduleHtml = '';
                for (const [day, entries] of Object.entries(scheduleByDay)) {
                    scheduleHtml += `<h5 class="mt-3">${day}</h5><ul class="list-group mb-2">`;
                    entries.forEach(entry => {
                        const meal = entry.meal;
                        if (meal) {
                            const itemsList = meal.items.map(item => `<li>${item}</li>`).join('');

                            scheduleHtml += `
                        <li class="list-group-item">
                            <div><strong>${entry.timeOfDay}</strong>: ${meal.name}</div>
                            <ul class="mb-1 small">
                                <li><strong>Calories:</strong> ${meal.calories} kcal</li>
                                <li><strong>Protein:</strong> ${meal.protein} g</li>
                                <li><strong>Fat:</strong> ${meal.fat} g</li>
                                <li><strong>Sugar:</strong> ${meal.sugar} g</li>
                                <li><strong>Weight:</strong> ${meal.weight} g</li>
                                <li><strong>Category:</strong> ${meal.category}</li>
                                <li><strong>Items:</strong>
                                    <ul>${itemsList}</ul>
                                </li>
                            </ul>
                        </li>`;
                        }
                    });

                    scheduleHtml += '</ul>';
                }

                container.html(`
                <div class="plan-details">
                    <h2>${plan.title}</h2>
                    <p>${plan.description || 'No description provided.'}</p>
                    <p><strong>Target Calories:</strong> ${plan.targetGoal}</p>
                    <p><strong>Base TDEE:</strong> ${plan.baseTdee}</p>

                    <div class="mt-4">
                        <h4>Weekly Schedule</h4>
                        ${scheduleHtml}
                    </div>

                    <button class="btn btn-secondary mt-4" onclick="window.location.href='plans.html'">← Back to plans</button>
                </div>
            `);
            },
            error: function (err) {
                console.error("Error fetching plan:", err);
                $("#plans-container").html('<p class="text-danger">Failed to load diet plan details. Try again later.</p>');
            }
        });
    }
    else {
        // Αν δεν υπάρχει ID, φέρνουμε όλα τα plans
        $.ajax({
            url: `${API_URL}/dietPlans`,
            method: "GET",
            success: function (plans) {
                container.html('');

                if (plans.length === 0) {
                    container.html('<p>No diet plans available at the moment.</p>');
                    return;
                }

                plans.forEach(plan => {
                    const planCard = `
                        <div class="plan-card">
                            <a href="?id=${plan._id}" class="plan-title">${plan.title}</a>
                            <div class="plan-description">${plan.description || 'No description provided.'}</div>
                        </div>
                    `;
                    container.append(planCard);
                });
            },
            error: function (err) {
                console.error("Error fetching plans:", err);
                container.html('<p class="text-danger">Failed to load diet plans. Please try again later.</p>');
            }
        });
    }
});
