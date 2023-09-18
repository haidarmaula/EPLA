let myChart = null;

// Create an exercise progress chart
function createChart(labels, itemData) {
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

// Fetch an exercise progress and create a progress chart
function fetchData(exercise = exercises[0].id) {
    fetch(`/fetch-progress?exercise=${exercise}`)
        .then(response => response.json())
        .then(data => {
            let exerciseTitle = document.getElementById('exercise-title');
            exerciseTitle.innerText = exercise;

            let date = Object.keys(data);
            let volume = Object.values(data);

            createChart(date, volume);
        });
}

fetchData();

exercises.forEach(exercise => {
    exercise.addEventListener('click', event => {
        fetchData(exercise.id);

        const parentDetails = exercise.closest('details');
        if (parentDetails) {
            parentDetails.removeAttribute('open');
        }
    });
});

const selectExercises = document.querySelector('[name="select-exercises"]');

selectExercises.addEventListener('click', (event) => {
    event.stopPropagation();
});

document.body.addEventListener('click', () => {
    selectExercises.removeAttribute('open');
});