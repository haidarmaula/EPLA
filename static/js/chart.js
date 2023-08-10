let myChart = null;

function createChart (labels, itemData) {
    const ctx = document.getElementById('myChart');

    const data = {
        labels: labels,
        datasets: [{
            label: 'Volume',
            data: itemData,
            borderWidth: 2,
            borderColor: '#F7C873',
            fill: true
        }]
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(
        ctx,
        config
    );
}

let exercises = document.querySelectorAll('[name="exercise"]')

function fetchData(exercise = exercises[0].innerText) {
    fetch(`/fetch-progress?exercise=${exercise}`)
        .then(response => response.json())
        .then(data => {
            let exerciseTitle = document.getElementById('exercise-title');
            exerciseTitle.innerText = exercise;

            let date = Object.keys(data);
            let volume = Object.values(data);

            console.log(data)
            console.log(date)

            createChart(date, volume);
        });
}

fetchData();

exercises.forEach(exercise => {
    exercise.addEventListener('click', event => {
        toggleOptions();
        fetchData(exercise.innerText);
    });
});

function toggleOptions() {
    let options = document.getElementById('options');

    options.classList.toggle('hidden');
}   