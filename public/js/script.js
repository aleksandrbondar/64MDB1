const themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

  fetch(`/api/theme/${newTheme}`, { method: 'GET', timeout: 5000 })
    .then(
      response => {
        if (response.status === 200) {
          window.location.reload();
        }
      }
    )
    .catch(error => {
      console.error('Error:', error);
    });
});

function setRealHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setRealHeight);
window.addEventListener('load', setRealHeight);