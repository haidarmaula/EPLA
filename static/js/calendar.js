let currentCalendar = document.querySelector('#current-calendar');
let days = document.querySelector('#days');
let prevNextIcon = document.querySelectorAll('[name="prevNextIcon"]');

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
let currentDate = date.getDate()

const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

let calendar = () => {
    currentCalendar.innerText = `${months[currentMonth]} ${currentYear}`;
    let liTag = '';
 
    let lastDateofPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    let firstDayofThisMonth = new Date(currentYear, currentMonth, 1).getDay();

    for (let i = 1; i <= firstDayofThisMonth; i++) {
        liTag += `<li class="rounded cursor-pointer font-thin hover:bg-default-2">${lastDateofPrevMonth - firstDayofThisMonth + i}</li>`;
    }

    let lastDateofMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 1; i <= lastDateofMonth; i++) {
        if (i == currentDate && currentMonth == new Date().getMonth() && currentYear == new Date().getFullYear()) {
            liTag += `<li class="rounded cursor-pointer bg-yellow-1 font-medium text-black">${i}</li>`;
            continue;
        } 
        liTag += `<li class="rounded cursor-pointer hover:bg-default-2">${i}</li>`;
    }

    let lastDayofThisMonth = new Date(currentYear, currentMonth, lastDateofMonth).getDay();
    let daysinOneWeek = 7

    for (let i = 1; i < daysinOneWeek - lastDayofThisMonth; i++) {
        liTag += `<li class="rounded cursor-pointer font-thin hover:bg-default-2">${i}</li>`;
    }

    days.innerHTML = liTag;
}

calendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener('click', () => {
        currentMonth = icon.id === 'prev' ? currentMonth - 1 : currentMonth + 1;

        if (currentMonth < 0 || currentMonth > 11) {
            date = new Date(currentYear, currentMonth);
            currentYear = date.getFullYear();
            currentMonth = date.getMonth()
        }

        calendar()
    });
});