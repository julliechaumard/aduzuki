console.log("On est dans le fichier adhesion_prof.js (de PUBLIC)");


function prof_diplome() {

    console.log("On est dans function prof_diplome");
    console.log("check_prof_diplome");
    // Get the checkbox
    var check_prof_diplome = document.getElementById("check_prof_diplome");
    // Get the output text
    var prof_diplome = document.getElementById("prof_diplome");

    console.log("check_prof_diplome", check_prof_diplome);

        for (let cssClass of prof_diplome.classList) {
            console.log("cssClass: ",cssClass);
        };


    // If the checkbox is checked, display the output text
    if (check_prof_diplome.checked == true){
        console.log("if (check_prof_diplome.checked == true)");
        console.log("prof_diplome", prof_diplome);
        prof_diplome.style.display = "block";
    } else {
        console.log("ELSE if (check_prof_diplome.checked == true)");
        prof_diplome.style.display = "none";
    }
}


function prof_formation() {

    console.log("On est dans function prof_formation");

    // Get the checkbox
    var check_prof_formation = document.getElementById("check_prof_formation");
    // Get the output text
    var prof_formation = document.getElementById("prof_formation");

    console.log("check_prof_formation", check_prof_formation);

        for (let cssClass of prof_formation.classList) {
            console.log("cssClass: ",cssClass);
        };


    // If the checkbox is checked, display the output text
    if (check_prof_formation.checked == true){
        console.log("if (check_prof_formation.checked == true)");
        console.log("prof_formation", prof_formation);

        prof_formation.style.display = "block";
    } else {
        console.log("ELSE if (check_prof_diplome.checked == true)");

        prof_formation.style.display = "none";
    }
}

function prof_eleve() {

    console.log("On est dans function prof_eleve");

    // Get the checkbox
    var check_prof_eleve = document.getElementById("check_prof_eleve");
    // Get the output text
    var eleve = document.getElementById("eleve");

    console.log("check_prof_eleve", check_prof_eleve);

        for (let cssClass of eleve.classList) {
            console.log("cssClass: ",cssClass);
        };


    // If the checkbox is checked, display the output text
    if (check_prof_eleve.checked == true){
        console.log("if (check_prof_eleve.checked == true)");
        console.log("eleve", eleve);

        eleve.style.display = "block";
    } else {
        console.log("ELSE if (check_prof_eleve.checked == true)");

        eleve.style.display = "none";
    }
}

function ajout_eleve2() {
    console.log("On est dans function ajout_eleve2");
    // Get the checkbox
    var check_eleve2 = document.getElementById("check_eleve2");
    // Get the output text
    var eleve2 = document.getElementById("eleve2");

    // If the checkbox is checked, display the output text
    if (check_eleve2.checked == true){
        eleve2.style.display = "block";
    } else {
        eleve2.style.display = "none";
    }
}

function ajout_eleve3() {
    console.log("On est dans function ajout_eleve3");
    // Get the checkbox
    var check_eleve3 = document.getElementById("check_eleve3");
    // Get the output text
    var eleve3 = document.getElementById("eleve3");

    // If the checkbox is checked, display the output text
    if (check_eleve3.checked == true){
        eleve3.style.display = "block";
    } else {
        eleve3.style.display = "none";
    }
}

function ajout_eleve4() {

    // Get the checkbox
    var check_eleve4 = document.getElementById("check_eleve4");
    // Get the output text
    var eleve4 = document.getElementById("eleve4");

    // If the checkbox is checked, display the output text
    if (check_eleve4.checked == true){
        eleve4.style.display = "block";
    } else {
        eleve4.style.display = "none";
    }
}

function ajout_eleve5() {

    // Get the checkbox
    var check_eleve5 = document.getElementById("check_eleve5");
    // Get the output text
    var eleve5 = document.getElementById("eleve5");

    // If the checkbox is checked, display the output text
    if (check_eleve5.checked == true){
        eleve5.style.display = "block";
    } else {
        eleve5.style.display = "none";
    }
}