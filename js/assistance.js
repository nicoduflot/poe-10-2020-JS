loaded(function(){
    // vérification des cookies déjà présent dans le domaine
    //console.log(document.cookie);
    //check cookie ES5
    /*if (document.cookie.split(';').some(function(item) {
        return item.trim().indexOf('accesAdmin20200727=') == 0
    })) {
        console.log('The cookie "accesAdmin20200727" exists (ES5)')
    }*/

    //check cookie ES6
    console.log(document.cookie);
    if (document.cookie.split(';').some((item) => item.trim().startsWith('assistUser='))) {
        //console.log('The cookie "assistUser" exists (ES6)')
        if(document.cookie.split(';').some((item) => item.trim().startsWith('assistUser=true'))){
            $("#aideUserButton").classList.remove("btn-primary");
            $("#aideUserButton").classList.add("btn-success");
            $("#aideUserButton").innerText = "Gérer assistance utilisateur";
        }else{
            $("#aideUserButton").classList.remove("btn-success");
            $("#aideUserButton").classList.add("btn-primary");
            $("#aideUserButton").innerText = "Activer assistance utilisateur";
        }
    }else{
        //console.log('The cookie "assistUser" do not exists (ES6)')
        //$("#aideUserButton").click(); // jquery
        $("#aideUserButton").dispatchEvent(eventClickMouse);
        document.cookie = "assistUser=false;domain=domain('http://localhost/poe-10-2020-JS');max-age=60*60";
    }

    $("#saveAssistUser").addEventListener("click", function (){
        document.cookie = "assistUser=true";
        $("#aideUserButton").classList.remove("btn-primary");
        $("#aideUserButton").classList.add("btn-success");
        $("#aideUserButton").innerText = "Gérer assistance utilisateur";
        //console.log(document.cookie);
    });

    $("#dismissAssistUser").addEventListener("click", function(){
        document.cookie = "assistUser=false";
        $("#aideUserButton").classList.remove("btn-success");
        $("#aideUserButton").classList.add("btn-primary");
        $("#aideUserButton").innerText = "Activer assistance utilisateur";
    });

    $("#destroyAssistUser").addEventListener("click", function(){
        document.cookie = "assistUser=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        $("#aideUserButton").classList.remove("btn-success");
        $("#aideUserButton").classList.add("btn-primary");
        $("#aideUserButton").innerText = "Activer assistance utilisateur";
        console.log(document.cookie);
    });
});
