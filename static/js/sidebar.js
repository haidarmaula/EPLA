const barsIcon = document.querySelector('[name="bars-icon"]');
const sidebars = document.querySelector('[name="sidebar"]');

barsIcon.addEventListener('click', (event) => {
    sidebars.classList.toggle('hidden');
});