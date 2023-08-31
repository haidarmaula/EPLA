const detailsElements = document.querySelectorAll('details');

detailsElements.forEach((details) => {
    details.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});

document.body.addEventListener('click', () => {
    detailsElements.forEach((details) => {
        details.removeAttribute('open');
    });
});

function setupOptions(summary, options) {
    options.forEach((label) => {
        label.addEventListener('click', () => {
            const selectedText = label.textContent;
            summary.textContent = selectedText;

            const parentDetails = label.closest('details');
            if (parentDetails) {
                parentDetails.removeAttribute('open');
            }
        });
    });
}

const typeSummary = document.querySelector('summary[name="type"] p');
const typeOptions = document.querySelectorAll('#type-options li label');
setupOptions(typeSummary, typeOptions);

const muscleSummary = document.querySelector('summary[name="muscle"] p');
const muscleOptions = document.querySelectorAll('#muscle-options li label');
setupOptions(muscleSummary, muscleOptions);

const difficultySummary = document.querySelector('summary[name="difficulty"] p');
const difficultyOptions = document.querySelectorAll('#difficulty-options li label');
setupOptions(difficultySummary, difficultyOptions);