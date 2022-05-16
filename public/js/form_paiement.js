// test
// authetification banque


    console.log("On est dans function choix_cb");

    // Get the checkbox
    var check_cb = document.getElementById("check_cb");
    // Get the output text
    var paiement_cb = document.getElementById("paiement_cb");
    // Get the checkbox
    var check_nocb = document.getElementById("check_nocb");
    // Get the output text
    var paiement_nocb = document.getElementById("paiement_nocb");
    // Get the checkbox
    var check_virement = document.getElementById("check_virement");
    // Get the output text
    var paiement_virement = document.getElementById("paiement_virement");
    // Get the checkbox
    var check_cheque = document.getElementById("check_cheque");
    // Get the output text
    var paiement_cheque = document.getElementById("paiement_cheque");


    check_cb.onclick = function() {
        console.log("check_cb.checked = ", check_cb.checked);
        if (check_cb.checked == true){
            console.log("check_cb.checked == true");
            check_nocb.checked = false;
            check_virement.checked = false;
            check_cheque.checked = false;
            paiement_cb.style.display = "block";
            paiement_nocb.style.display = "none";
            paiement_cheque.style.display = "none";
            paiement_virement.style.display = "none";
        } else {
            console.log("check_cb.checked == true / ELSE");
            paiement_cb.style.display = "none";
        }
    }

    check_nocb.onclick = function() {
        if (check_nocb.checked == true){
            check_cb.checked = false;
            paiement_nocb.style.display = "block";
            paiement_cb.style.display = "none";
        } else {
            paiement_nocb.style.display = "none";
        }
    }

    check_virement.onclick = function() {
        if (check_virement.checked == true){
            check_cheque.checked = false;
            paiement_virement.style.display = "block";
            paiement_cheque.style.display = "none";
        } else {
            paiement_virement.style.display = "none";
        }
    }

    check_cheque.onclick = function() {
        if (check_cheque.checked == true){
            check_virement.checked = false;
            paiement_cheque.style.display = "block";
            paiement_virement.style.display = "none";
        } else {
            paiement_cheque.style.display = "none";
        }
    }



