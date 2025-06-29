import $ from 'jquery';
const API_URL = import.meta.env.VITE_API_URL;

bindLoginHandler();

function bindLoginHandler() {
    $('#login-btn').on('click', function () {
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
            data: JSON.stringify({ email: email, password: password }),
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
    });
}
