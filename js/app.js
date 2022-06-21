/* 
    Globals
*/
const ENDPOINT_API = `https://www.breakingbadapi.com/api/characters/`;
const descriptionScreen = document.getElementById("conteudo");
const resultsScreen = document.getElementById("resultados");
const CACHE_VALUES = "app_screen_info";

var numberOfRegisters = 10;
var index = 0;
var jsonData;
var filesImg = [];

/* 
    Interaction Events
*/
const backButton = document.getElementById("btVoltar");
const loadMoreButton = document.getElementById("btCarregarMais");
const installWindow = null;
const btInstall = document.getElementById("btInstall");
/*
    Getting Ajax AJAX
*/
function loadAPI() {

    const ajax = new XMLHttpRequest();
    ajax.open("GET", ENDPOINT_API, true);
    ajax.send();

    // Get Request
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            jsonData = JSON.parse(this.responseText);
            console.log(jsonData);
            if (jsonData.length > 0) {
                cacheData();
                resultsScreen.className = "row";
                updateData();
            }
        }

    }
}

function updateData() {
    let htmlContent = "";
    let limite;
    if ((index + numberOfRegisters) < jsonData.length) {
        limite = (index + numberOfRegisters);
    } else {
        limite = jsonData.length;
        loadMoreButton.style.display = "none";
    }

    for (let i = index; i < limite; i++) {
        //create card
        htmlContent += createCard(i, jsonData[i].name, jsonData[i].status, jsonData[i].img);
    }

    resultsScreen.innerHTML += htmlContent;

    index += numberOfRegisters;

}

/* 
    =Events
*/
backButton.addEventListener("click", function () {
    document.getElementById("conteudo").style.display = "none";
});

loadMoreButton.addEventListener("click", function () {
    updateData();
});

function onClickCard(id) {
    document.getElementById("conteudo").style.display = "block";
    document.getElementById("conteudo").style.backgroundImage =  "url('" + jsonData[id].img +"')";
    document.getElementById("conteudo_nome").innerHTML = jsonData[id].nickname;
    document.getElementById("conteudo_numero").innerHTML = "#" + id;
}


/*
#
# Sistema de Template
#
*/

function createCard(id, nome, tipo, img) {
    return `<div class="col-12 col-md-3" onClick="javascript:onClickCard(\'' + ${id} + '\');" data-id="' + ${id} + '"><div class="card_item" style="background: linear-gradient(0deg, transparent, rgba(9,9,121,0) 35%, rgba(0,212,255,0) 100%), url('${img}')"><div class="information"><h3>${nome}</h3><span class="badge rounded-pill bg-badge">${tipo}</span></div></div></div>`;
}

/*
    Cache Dinâmico (json / imgs)
*/
const cacheData = function () {
    localStorage[CACHE_VALUES] = JSON.stringify(jsonData);
}

/*
    =Install
*/

window.addEventListener('beforeinstallprompt', gravarJanela);

function gravarJanela(evt) {
    installWindow = evt;
}

const installApp = function () {

    btInstall.removeAttribute("hidden");
    btInstall.addEventListener("click", function () {

        installWindow.prompt();

        installWindow.userChoice.then((choice) => {

            if (choice.outcome === 'accepted') {
                console.log("Usuário fez a instalação do app");
            } else {
                console.log("Usuário NÃO fez a instalação do app");
            }

        });

    });

}

/*
    =Utils
*/
function padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

loadAPI();