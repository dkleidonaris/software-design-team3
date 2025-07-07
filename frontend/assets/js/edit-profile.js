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
});

function fetchCurrentUser() {
    ensureLoggedIn();

    $('#user-spinner').removeClass('hidden');
    $('#edit-user-form').hide();

    $.ajax({
        url: `${API_URL}/users/current`,
        method: 'GET',
        success: (user) => {
            // Store user ID globally
            window.currentUserId = user._id;

            $('#firstName').val(user.firstName);
            $('#lastName').val(user.lastName);
            $('#email').val(user.email);
            $('#age').val(user.age);
            $('#gender').val(user.gender);
            $('#weight').val(user.weight);
            $('#height').val(user.height);
            $('#activityLevel').val(user.activityLevel);

            $('#user-spinner').addClass('hidden');
            $('#edit-user-form').show();
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

