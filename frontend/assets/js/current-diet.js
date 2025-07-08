import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/my-diet.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/current`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch current user');

    const user = await response.json();

    if (user.currentDietPlan && user.currentDietPlan._id) {
      window.location.href = `/plans?id=${user.currentDietPlan._id}`;
    } else {
      window.location.href = '/my-diet.html';
    }
  } catch (err) {
    console.error('Error fetching user or diet plan:', err);
    window.location.href = '/my-diet.html';
  }
});
