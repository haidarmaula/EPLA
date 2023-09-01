const exercises = document.getElementsByName("exercise");
        
exercises.forEach(exercise => {
    exercise.addEventListener("click", function() {
        const svgArrow = exercise.querySelector('svg');
        svgArrow.classList.toggle('rotated');

        const content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        } 
    });
});