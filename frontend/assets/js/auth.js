import $ from 'jquery';
const API_URL = import.meta.env.VITE_API_URL;

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
    localStorage.removeItem('redirectAfterLogin');
    window.location.href = '/';
}

export {
    checkAuthStatus,
    ensureLoggedIn,
    bindLogoutHandler
};