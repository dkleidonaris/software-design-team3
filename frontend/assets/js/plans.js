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
                const scheduleByDay = {};
                plan.schedule.forEach(entry => {
                    if (!scheduleByDay[entry.day]) {
                        scheduleByDay[entry.day] = [];
                    }
                    scheduleByDay[entry.day].push(entry);
                });

                function generateScheduleHtml(multiplier = 1) {
                    let html = '';
                    for (const [day, entries] of Object.entries(scheduleByDay)) {
                        html += `<h5 class="mt-3">${day}</h5><ul class="list-group mb-2">`;
                        entries.forEach(entry => {
                            const meal = entry.meal;
                            if (meal) {
                                const itemsList = meal.items.map(item => `<li>${item}</li>`).join('');
                                html += `
                                    <li class="list-group-item">
                                        <div><strong>${entry.timeOfDay}</strong>: ${meal.name}</div>
                                        <ul class="mb-1 small">
                                            <li><strong>Calories:</strong> ${(meal.calories * multiplier).toFixed(0)} kcal</li>
                                            <li><strong>Protein:</strong> ${(meal.protein * multiplier).toFixed(1)} g</li>
                                            <li><strong>Fat:</strong> ${(meal.fat * multiplier).toFixed(1)} g</li>
                                            <li><strong>Sugar:</strong> ${(meal.sugar * multiplier).toFixed(1)} g</li>
                                            <li><strong>Weight:</strong> ${(meal.weight * multiplier).toFixed(0)} g</li>
                                            <li><strong>Category:</strong> ${meal.category}</li>
                                            <li><strong>Items:</strong>
                                                <ul>${itemsList}</ul>
                                            </li>
                                        </ul>
                                    </li>`;
                            }
                        });
                        html += '</ul>';
                    }
                    return html;
                }

                const scheduleHtml = generateScheduleHtml();

                const adjustHtml = `
                    <div class="mb-3 mt-4">
                        <label for="customCalories" class="form-label"><strong>Adjust calories (500 - 5000):</strong></label>
                        <input type="number" id="customCalories" min="500" max="5000" class="form-control" placeholder="Enter desired daily calories">
                        <button id="adjustPlanBtn" class="btn btn-primary mt-2">Modify plan to my needs</button>
                    </div>
                `;

                container.html(`
                    <div class="plan-details">
                        <h2>${plan.title}</h2>
                        <p>${plan.description || 'No description provided.'}</p>
                        <p><strong>Target Calories:</strong> ${plan.targetGoal}</p>
                        <p><strong>Base TDEE:</strong> ${plan.baseTdee}</p>
                        ${adjustHtml}
                        <div class="mt-4">
                            <h4>Weekly Schedule</h4>
                            <div id="scheduleContent">
                                ${scheduleHtml}
                            </div>
                        </div>
                        <button class="btn btn-secondary mt-4" onclick="window.location.href='plans.html'">← Back to plans</button>
                    </div>
                `);

                $("#adjustPlanBtn").on("click", function () {
                    const customCalories = parseFloat($("#customCalories").val());
                    if (isNaN(customCalories) || customCalories < 500 || customCalories > 5000) {
                        alert("Please enter a valid calorie amount between 500 and 5000.");
                        return;
                    }
                    const multiplier = customCalories / plan.baseTdee;
                    const updatedHtml = generateScheduleHtml(multiplier);
                    $("#scheduleContent").html(updatedHtml);
                });
            },
            error: function (err) {
                console.error("Error fetching plan:", err);
                $("#plans-container").html('<p class="text-danger">Failed to load diet plan details. Try again later.</p>');
            }
        });
    } else {
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
