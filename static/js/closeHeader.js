const headerButton = document.querySelector('[name="header-button"]');
const header = document.querySelector('header');

headerButton.addEventListener('click', () => {
    header.style.display = 'none';
});