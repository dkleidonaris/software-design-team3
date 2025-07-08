import $ from 'jquery';
import './main.js';
import { API_URL } from './config.js';
import { ensureLoggedIn } from './auth.js';

ensureLoggedIn();

$('#height').on('input', function () {
    this.value = this.value.replace(',', '.');
});

$(document).ready(() => {
    fetchCurrentUser();

    $('#edit-user-form').on('submit', function (e) {
        e.preventDefault();
        updateCurrentUser();
    });

    // Add event listeners for calorie calculation
    const calorieFields = ['gender', 'weight', 'height', 'age', 'activityLevel'];
    calorieFields.forEach(field => {
        $(`#${field}`).on('change input', updateCalorieDisplay);
    });
});

function fetchCurrentUser() {
    ensureLoggedIn();

    $('#user-spinner').show();
    $('#edit-user-form').hide();

    $.ajax({
        url: `${API_URL}/users/current`,
        method: 'GET',
        success: (user) => {
            window.currentUserId = user._id;

            $('#firstName').val(user.firstName);
            $('#lastName').val(user.lastName);
            $('#email').val(user.email);
            $('#age').val(user.age);
            $('#gender').val(user.gender);
            $('#weight').val(user.weight);
            $('#height').val(user.height);
            $('#activityLevel').val(user.activityLevel || 'moderate');

            $('#user-spinner').hide();
            $('#edit-user-form').show();
            
            updateCalorieDisplay();
        },
        error: () => {
            alert("Failed to load user profile.");
            window.location.href = "/";
        }
    });
}

function updateCurrentUser() {
    ensureLoggedIn();

    const $btn = $('#save-btn');
    $btn.prop('disabled', true).html(`
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...
    `);

    const updated = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        age: Number($('#age').val()),
        gender: $('#gender').val(),
        weight: Number($('#weight').val()),
        height: Number($('#height').val()),
        activityLevel: $('#activityLevel').val()
    };

    const password = $('#password').val().trim();
    if (password) {
        updated.hashedPassword = password;
    }

    const userId = window.currentUserId;

    $.ajax({
        url: `${API_URL}/users/${userId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updated),
        success: () => {
            $btn.html(`Saved ✅`);
            setTimeout(() => {
                $btn.prop('disabled', false).text("Save Changes");
                $('#password').val('');
            }, 1000);
        },
        error: () => {
            alert("Update failed.");
            $btn.prop('disabled', false).text("Save Changes");
        }
    });
}

function calculateCalories() {
    const gender = $('#gender').val();
    const weight = parseFloat($('#weight').val());
    const height = parseFloat($('#height').val());
    const age = parseInt($('#age').val());
    const activityLevel = $('#activityLevel').val();

    if (!weight || !height || !age) return 0;

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Apply activity multiplier
    const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very': 1.725,
        'extra': 1.9
    };

    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
}

function updateCalorieDisplay() {
    const calories = calculateCalories();
    $('#calorie-value').text(calories);
    $('#calorie-info').toggle(calories > 0);
}