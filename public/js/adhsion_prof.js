function prof_diplome() {
    // Get the checkbox
    var check_prof_diplome = document.getElementById("check_prof_diplome");
    // Get the output text
    var prof_diplome = document.getElementById("prof_diplome");
  
    // If the checkbox is checked, display the output text
    if (check_prof_diplome.checked == true){
        prof_diplome.classList.toggle = ("prof_diplome_visible");
    } else {
        prof_diplome.classList.toggle = ("prof_diplome_hidden");
    }
}