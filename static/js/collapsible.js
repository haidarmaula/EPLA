var collapsible = document.getElementsByName("collapsible");
        
for (i = 0; i < collapsible.length; i++) {
    collapsible[i].addEventListener("click", function() {
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        } 
    });
}