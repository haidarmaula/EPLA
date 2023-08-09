let currentCalendar = document.querySelector('#current-calendar');
let days = document.querySelector('#days');

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
let currentDate = date.getDate()
let selectedDate = currentDate;

const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

let calendar = () => {
    currentCalendar.innerText = `${months[currentMonth]} ${currentYear}`;

    let nextIcon = document.querySelector('#next');

    nextIcon.style.display = "block";

    if (currentMonth == new Date().getMonth()) {
        nextIcon.style.display = "none";
    }
 
    let lastDateofPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    let firstDayofThisMonth = new Date(currentYear, currentMonth, 1).getDay();
    let liTag = '';

    for (let i = 1; i <= firstDayofThisMonth; i++) {
        liTag += `<li class="rounded cursor-pointer font-thin hover:bg-default-2">${lastDateofPrevMonth - firstDayofThisMonth + i}</li>`;
    }

    if (currentMonth == new Date().getMonth() && currentYear == new Date().getFullYear()) {
        for (let i = 1; i <= currentDate; i++) {
            if (i == currentDate) {
                liTag += `<li name="date-in-selected-month" class="rounded cursor-pointer bg-yellow-1 font-medium text-black">${i}</li>`;
                continue;
            } 
            liTag += `<li name="date-in-selected-month" class="rounded cursor-pointer hover:bg-default-2">${i}</li>`;
        }
    } else {
        let lastDateofMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 1; i <= lastDateofMonth; i++) {
            liTag += `<li name="date-in-selected-month" class="rounded cursor-pointer hover:bg-default-2">${i}</li>`;
        }

        let lastDayofThisMonth = new Date(currentYear, currentMonth, lastDateofMonth).getDay();
        let daysinOneWeek = 7

        for (let i = 1; i < daysinOneWeek - lastDayofThisMonth; i++) {
            liTag += `<li class="rounded cursor-pointer font-thin hover:bg-default-2">${i}</li>`;
        }
    }

    days.innerHTML = liTag;

    let date_numbers = document.querySelectorAll('[name="date-in-selected-month"]');

    date_numbers.forEach(date_number => {
        date_number.addEventListener('click', () => {
            selectedDate = date_number.innerText;
            let parameter = `${currentYear}-${currentMonth + 1}-${selectedDate}`;
            let url = `/track-my-workouts?date=${parameter}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    window.location.href = url;
                });
        });
    });
}

calendar();

let prevNextIcon = document.querySelectorAll('[name="prevNextIcon"]');

prevNextIcon.forEach(icon => {
    icon.addEventListener('click', () => {
        currentMonth = icon.id === 'prev' ? currentMonth - 1 : currentMonth + 1;

        if (currentMonth < 0 || currentMonth > 11) {
            date = new Date(currentYear, currentMonth);
            currentYear = date.getFullYear();
            currentMonth = date.getMonth()
        } else {
            date = new Date()
        }

        calendar()
    });
});

let exercisesForm = document.querySelectorAll('[name="exercise-form"]');

exercisesForm.forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();

        let queryString = window.location.search;
        let params = new URLSearchParams(queryString);

        selectedDate = params.get('date');

        let formData = new FormData(form);
        let url = `/track-my-workouts?date=${selectedDate}`;

        formData.append('date', selectedDate);

        let content = form.querySelector('[name="content"]');

        if (form.id === 'save-exercise') {
            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                let exercise = Object.keys(data)[0]
                
                form.id = 'delete-exercise'

                content.innerHTML = `<input type="hidden" name="exercise" value="${exercise}">
                <p class="w-14 rounded bg-default-3 font-normal text-center text-white">${data[exercise][2]}</p>
                <p class="w-14 rounded bg-default-3 font-normal text-center text-white">${data[exercise][3]}</p>
                <p class="w-14 rounded bg-default-3 font-normal text-center text-white">${data[exercise][4]}</p>
                <button type="submit" class="rounded px-2 bg-yellow-1 shadow-inner">Delete</button>`;
            });
        } else {
            let exerciseNameTag = content.querySelector('[name="exercise"]');
            let exercise = exerciseNameTag.value

            formData.append('remove-exercise', exercise);

            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    form.id = 'save-exercise'

                    content.innerHTML = `<input type="hidden" name="exercise" value="${exercise}">
                    <input type="number" name="weight" required step="2.5" min="2.5" placeholder="Weight" class="w-20 rounded bg-default-3 font-normal text-center text-white">
                    <input type="number" name="reps" required min="1" placeholder="Reps" class="w-14 rounded bg-default-3 font-normal text-center text-white">
                    <input type="number" name="sets" required min="1" placeholder="Sets" class="w-14 rounded bg-default-3 font-normal text-center text-white">
                    <button type="submit" class="rounded px-2 bg-yellow-1 shadow-inner">Save</button>`;
                }
            });
        }       
    });
});

