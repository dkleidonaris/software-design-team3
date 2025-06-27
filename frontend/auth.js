import $ from 'jquery';
const API_URL = import.meta.env.VITE_API_URL;


export function checkAuthStatus() {
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

function showLoggedInContent() {
    $('.loggedInContent').show();
    $('.loggedOutContent').hide();
}

function showLoggedOutContent() {
    $('.loggedInContent').hide();
    $('.loggedOutContent').show();
}

export function logout() {
    localStorage.removeItem('token');
    checkAuthStatus;
}