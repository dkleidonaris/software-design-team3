import $ from 'jquery';
const API_URL = import.meta.env.VITE_API_URL;

bindLoginHandler();

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        showLoggedOutContent();
        return Promise.resolve(false);
    }

    return $.ajax({
        url: API_URL + '/auth/status',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => {
        console.log(res);
        $('[data="firstName"]').html(res.firstName);
        showLoggedInContent();
        return true;
    }).catch(() => {
        showLoggedOutContent();
        return false;
    });
}

async function ensureLoggedIn() {
  const isAuthenticated = await checkAuthStatus();

  if (!isAuthenticated) {
    // Save the current URL (e.g. /dashboard.html?section=2)
    localStorage.setItem('redirectAfterLogin', window.location.href);
    
    // Redirect to login
    window.location.href = '/login';
  }
}

function bindLoginHandler() {
    $('#login-btn').on('click', function () {
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();

        if (!email || !password) {
            alert('Please enter both username and password.');
            return;
        }

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
            }
        });
    });
}

function bindLogoutHandler() {
    $('#logoutBtn').on('click', function () {
        logout();
    });
}

function showLoggedInContent() {
    $('.loggedInContent').show();
    $('.loggedOutContent').hide();
}

function showLoggedOutContent() {
    $('.loggedInContent').hide();
    $('.loggedOutContent').show();
}

function logout() {
    localStorage.removeItem('token');
    alert('You were successfully logged out!');
    checkAuthStatus();
}

export {
    checkAuthStatus,
    ensureLoggedIn,
    bindLoginHandler,
    bindLogoutHandler
};