// test
// authetification banque


function choix_cb() {
    console.log("On est dans function choix_cb");
    // Get the checkbox
    var check_cb = document.getElementById("check_cb");
    // Get the output text
    var paiement_cb = document.getElementById("paiement_cb");

    // If the checkbox is checked, display the output text
    if (check_cb.checked == true){
        paiement_cb.style.display = "block";
    } else {
        paiement_cb.style.display = "none";
    }
}


