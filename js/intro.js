function loaded(callable){document.addEventListener("DOMContentLoaded", callable);}
function $(selector){return document.querySelector(selector);}
function $$(selector){return document.querySelectorAll(selector);}

var colorNow = "bg-danger";

function connectXhr(){
    let xhr = null; 
    if(window.XMLHttpRequest || window.ActiveXObject){
        if(window.ActiveXObject){
            try{
                xhr = new ActiveXObject("Msxml2.XMLHTTP"); 
            }catch(e){
                xhr = new ActiveXObject("Microsoft.XMLHTTP"); 
            } 
        }else{
            xhr = new XMLHttpRequest();
        }
    }else{
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return;
    }
    return xhr;
}

function afficheEmails(emails){
    let html = "";
    for(email of emails){
        //console.log(email);
        html += `<tr>` ;
        html += `<td><input type="checkbox" id="idEmail-${email.id}" /></td>` ;
        html += `<td>${email.sender}</td><td>${email.title}</td><td><a href="">Read</a></td>` ;
        html += `</tr>` ;
    }
    return html;
}

function resSearch(results, search){
    let html = "";
    html += `<table class="table">`;
    for(result of results){
        if(result.ville.includes(search) || result.codepostal.includes(search) ){
            //console.log(result.ville, result.codepostal);
            html += `<tr><td>${result.ville}</td><td>${result.codepostal}</td></tr>`;
        }
    }
    html += `</table>`;
    $("#divSearchResult").innerHTML = html;
}

function tabUsers(users){
    let html = "";
    for(user of users){
        //html += `<tr>`;
        html += `<tr `;
        html += `onclick="pinPointUser('${user.address.geo.lat}', '${user.address.geo.lng}', 'map')" `;
        //html += `data-lat="${user.address.geo.lat}" data-lng="${user.address.geo.lng}"`;
        html += `>`;
        html += `<td>${user.id}</td>`;
        html += `<td>${user.name}</td>`;
        html += `<td>${user.username}</td>`;
        html += `</tr>`;
    }
    return html;
}

//map

// Fonction d'initialisation de la carte
function initMap(lat, lon, macarteid) {
    // Créer l'objet "macarte" et l'insère dans l'élément HTML qui a l'ID "map"
    macarte = L.map(macarteid).setView([lat, lon], 11);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">' +
            'OpenStreetMap' +
            '</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}

function pinPointUser(lat, lon, macarteid){
    map.remove(macarte);
    $("#pinPoint").innerHTML = `<div id="map"></div>`;
    initMap(lat, lon, macarteid);
}


loaded(function(){
    console.log("DOM chargé");
    //console.log($("p")); //on teste si jquery chargé pour bootstrap ne casse pas les pieds
    //console.log($$("p")); //idem ligne précédente
    //les paragraphes travestis
    $$("#dataColor p").forEach(function(paragraph){
        //console.log(paragraph.dataset.color);
        paragraph.addEventListener("click", function(){
            if(this.style.color == "" || this.style.color == "black"){
                this.style.color = this.dataset.color; // this.css({color:this.dataset.color, fontWeight:"bold"});
                this.style.fontWeight = "bold";
            }else{
                this.style.color = "black"; // this.css({color:this.dataset.color, fontWeight:"bold"});
                this.style.fontWeight = "normal";
            }
        });
    });
    // puissance 4 presque fini
    $$("#P4 th").forEach(function(tableCol){
        let coord = 0;
        let cell = "";
        tableCol.addEventListener("click", function(){
            coord = this.dataset.col;
            for(let i = 6; i >= 1; i--){
                cell = $("td[data-col=\""+coord+"\"][data-row=\""+i+"\"]");
                if(cell.classList.contains("bg-primary") || cell.classList.contains("bg-danger")){
                }else{
                    cell.classList.add(colorNow);
                    colorNow = (colorNow == "bg-danger")? "bg-primary" : "bg-danger" ;
                    break;
                }
            }
        });
    });
    //le pendu ha ha ha que c'est drôle
    // $("#sendLetter").addEventListener("click", function(){
    //     //$("#pendu").value = "     o\r    I";
    //     let letter = $("#letterProp").value;
    //     console.log(letter);
    // });
    //connexion ajax vers le json emails.json
    // utiliser la fonction : 
    // let xhr = connectXhr();
    let tabEmail = "";
    let xhrEmail = connectXhr(); 
    //.open => se connecter à la ressource
    //.send => envoyer la demande à la ressource
    //.responseText => le résultat de la requête
    //.onreadystatechange => methode d'alerte du changement d'état de la requête
    //.readystate => si c'est en état "prêt"
    //.DONE => prêt pour la ressource
    xhrEmail.onreadystatechange = function(){
        if (xhrEmail.readyState === XMLHttpRequest.DONE) {
            if (xhrEmail.status === 200) {
                let jsonEmails = JSON.parse(xhrEmail.responseText);
                $("#listeEmails table tbody").innerHTML = afficheEmails(jsonEmails);
            } else {
                alert('Il y a eu un problème avec la requête.');
            }
        }
    };
    xhrEmail.open('GET', './json/emails.json', true);
    xhrEmail.send();
    $("#selectAll").addEventListener("click", function(){//console.log("clique selectAll");//$("#selectAll").checked = true;
        let checkThis = ($("#selectAll").checked === true)? true : false;
        $$("#listeEmails table tbody input[type=checkbox]").forEach(function(checkbox){
            checkbox.checked = checkThis;
        });
    });
    //recherche auto
    $("#searchCity").addEventListener("focus", function(){
        $("#searchCity").addEventListener("keyup", function(){
            let searchWords =$("#searchCity").value;
            if($("#searchCity").value.length > 2){
                fetch("./json/villes.json")
                .then( (response) => response.json() )
                .then( (json) => {
                    resSearch(json, $("#searchCity").value);
                });
            }else{
                $("#divSearchResult").innerHTML = "";
            }
        });
    });

    fetch("./json/users.json")
        .then( (response) => response.json() )
        .then( (json) => {
            //console.log(json);
            $("#listeUsers table tbody").innerHTML = tabUsers(json);
        });

    $$("#listeUsersTable tr").forEach(function(trUser){
        trUser.addEventListener("click", function(){
            console.log("clique");
        });
    });
    // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
    initMap(50.637380, 3.062568, "map");

    // vérification des cookies déjà présent dans le domaine
    //console.log(document.cookie);
    //check cookie ES5
    /*if (document.cookie.split(';').some(function(item) {
        return item.trim().indexOf('accesAdmin20200727=') == 0
    })) {
        console.log('The cookie "accesAdmin20200727" exists (ES5)')
    }*/

    //check cookie ES6
    if (document.cookie.split(';').some((item) => item.trim().startsWith('assistUser='))) {
        console.log('The cookie "assistUser" exists (ES6)')
        // si  assistUser à true
        // => span id aideUser avec classe aideUserOn
        // si  assistUser à false
        // => span id aideUser avec classe aideUserOff
    }else{
        console.log('The cookie "assistUser" do not exists (ES6)')
        //trigger de la modale
        $("#aideUserButton").click();
        //event lisntener sur le OK de la modale
        // => création du cookie assistUser à true
        //event listenner sur le POK de la modale
        // => création du cookie assistUser à false
    }

});
