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
                const days = [
                    { name: 'Monday', color: '#f8bbd0' },
                    { name: 'Tuesday', color: '#ce93d8' },
                    { name: 'Wednesday', color: '#81d4fa' },
                    { name: 'Thursday', color: '#a5d6a7' },
                    { name: 'Friday', color: '#fff59d' },
                    { name: 'Saturday', color: '#ffcc80' },
                    { name: 'Sunday', color: '#90caf9' },
                ];

                const timesOfDay = ['morning', 'noon', 'evening'];

                const scheduleMap = {};
                for (const dayObj of days) {
                    scheduleMap[dayObj.name] = { morning: null, noon: null, evening: null };
                }

                plan.schedule.forEach(entry => {
                    const day = entry.day;
                    const time = entry.timeOfDay.toLowerCase();
                    if (scheduleMap[day]) {
                        scheduleMap[day][time] = entry;
                    }
                });

                function generateScheduleHtmlTable(multiplier = 1) {
                    let html = '<table class="table table-bordered text-center align-middle" style="table-layout: fixed;">';

                    html += '<thead><tr><th></th>';
                    days.forEach(dayObj => {
                        html += `<th style="background-color: ${dayObj.color}; font-weight: bold;">${dayObj.name}</th>`;
                    });
                    html += '</tr></thead>';

                    html += '<tbody>';
                    timesOfDay.forEach(time => {
                        html += `<tr><th style="text-transform: capitalize;">${time}</th>`;
                        days.forEach(dayObj => {
                            const entry = scheduleMap[dayObj.name][time];
                            if (entry && entry.meal) {
                                const meal = entry.meal;
                                const itemsList = meal.items.map(item => `<li>${item}</li>`).join('');
                                html += `<td style="font-size: 0.9rem; text-align: left;">
                                    <strong>${meal.name}</strong><br/>
                                    <small>Calories: ${(meal.calories * multiplier).toFixed(0)} kcal</small><br/>
                                    <small>Protein: ${(meal.protein * multiplier).toFixed(1)} g</small><br/>
                                    <ul style="padding-left: 15px; margin-bottom: 0;">${itemsList}</ul>
                                </td>`;
                            } else {
                                html += '<td>-</td>';
                            }
                        });
                        html += '</tr>';
                    });
                    html += '</tbody></table>';

                    return html;
                }

                const scheduleHtml = generateScheduleHtmlTable();

                const adjustHtml = `
                    <div class="card p-4 mt-4 shadow-sm" style="background-color:rgb(202, 234, 210);">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <h6 class="text-muted mb-1">🎯 Target Calories</h6>
                                <p class="fs-5 fw-bold text-primary">${plan.targetGoal} kcal</p>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-muted mb-1">⚙️ Base TDEE</h6>
                                <p class="fs-5 fw-bold text-success">${plan.baseTdee} kcal</p>
                            </div>
                        </div>
                        <hr/>
                        <div class="mb-2">
                            <label for="customCalories" class="form-label"><strong>🔧 Adjust calories</strong> <small class="text-muted">(500 - 5000)</small></label>
                            <input type="number" id="customCalories" min="500" max="5000" class="form-control" placeholder="Enter your desired daily calories">
                        </div>
                        <button id="adjustPlanBtn" class="btn btn-outline-primary w-100 mt-2">Modify plan to my needs</button>
                    </div>
                `;


                container.html(`
                    <div class="plan-details">
                        <div class="mb-4 p-3 rounded shadow-sm" style="background-color:rgb(223, 231, 226);">
                            <h2 class="fw-bold text-success mb-2" style="font-size: 1.8rem;">${plan.title}</h2>
                            <p class="text-muted mb-0" style="font-size: 1rem;">${plan.description || 'No description provided.'}</p>
                        </div>

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
                    const updatedHtml = generateScheduleHtmlTable(multiplier);
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
                        <div class="card shadow-sm mb-4 p-3 border-0 rounded-3" style="background-color: #f5f8f7;">
                            <div class="d-flex flex-column">
                            <h5 class="fw-bold text-success mb-1">${plan.title}</h5>
                            <p class="text-muted mb-3" style="min-height: 40px;">${plan.description || 'No description provided.'}</p>
                            <a href="?id=${plan._id}" class="btn btn-outline-success mt-auto align-self-start">View Plan →</a>
                            </div>
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
