import $ from 'jquery';

import './main.js';

import { setTitle } from './helpers';
import { API_URL } from './config.js';

bindLoginHandler();

setTitle();

function bindLoginHandler() {
    // Handle form submit (Enter or click)
    $('#login-form').on('submit', function (e) {
        e.preventDefault(); // prevent page reload
        handleLogin();
    });
}

function handleLogin() {
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    if (!email || !password) {
        alert('Please enter both username and password.');
        return;
    }

    const $icon = $('#login-icon');
    $icon.addClass('spin');

    $.ajax({
        url: API_URL + '/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (response) {
            localStorage.setItem('token', response.accessToken);
            window.location.href = localStorage.getItem('redirectAfterLogin') || '/';
        },
        error: function (xhr) {
            const err = xhr.responseJSON?.message || 'Login failed. Please try again.';
            alert(err);
        },
        complete: function () {
            $icon.removeClass('spin');
        }
    });
}
