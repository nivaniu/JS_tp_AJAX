const KEY_UP = "ArrowUp";
const KEY_DOWN = "ArrowDown";
const KEY_RIGHT = "ArrowRight";
const STATE_DONE = 4;
const STATUS_SUCCESS = 200;
const NO_SUGGEST_LIST = -2;
const NONE_CHOSEN = -1;
const CLASS_SELECTED = 'selected';
var input = document.getElementById("searchBar");
var suggestion = document.getElementById("suggestions");
var suggestedDiv = -2;
input.addEventListener("keyup", function (event) {
    if (suggestedDiv !== NO_SUGGEST_LIST) {
        if (event.key === KEY_UP) { //up
            nextSelection();
            return;
        } else if (event.key === KEY_DOWN) {
            previousSelection();
            return;
        }else if( event.key === KEY_RIGHT){
            if (suggestDivs[suggestedDiv]!=null){
                input.value = suggestDivs[suggestedDiv].textContent;
                clearSuggestions();
                return;
            }
        }
    }
    getSuggestions();
});
var suggestDivs;

function nextSelection() {
    if (suggestedDiv === NO_SUGGEST_LIST) return;
    if (suggestedDiv === NONE_CHOSEN)
        suggestedDiv = suggestDivs.length - 1;
    else if (suggestedDiv === 0) {
        suggestDivs[suggestedDiv].classList.remove(CLASS_SELECTED);
        suggestedDiv = suggestDivs.length - 1;
    } else {
        suggestDivs[suggestedDiv].classList.remove(CLASS_SELECTED);
        suggestedDiv--;
    }
    selectDiv();
}

function previousSelection() {
    if (suggestedDiv === NO_SUGGEST_LIST) return;
    if (suggestedDiv === suggestDivs.length-1) {
        suggestDivs[suggestedDiv].classList.remove(CLASS_SELECTED);
        suggestedDiv = 0;
    } else if (suggestedDiv === NONE_CHOSEN){
        suggestedDiv++;
    }else{
        suggestDivs[suggestedDiv].classList.remove(CLASS_SELECTED);
        suggestedDiv++;
    }
    selectDiv();
}

function selectDiv() {
    if (suggestedDiv === NO_SUGGEST_LIST) return;
    suggestDivs[suggestedDiv].classList.add(CLASS_SELECTED);
}

function getSuggestions() {
    function affichage() {
        if (xhr.readyState === STATE_DONE && xhr.status === STATUS_SUCCESS) {
            clearSuggestions();
            if (xhr.responseText === '') return;
            suggestedDiv = NONE_CHOSEN;
            let suggestOptions = JSON.parse(xhr.responseText);
            for (let i = 0; i < suggestOptions.length; i++) {
                let div = document.createElement("div");
                let indexBegins = suggestOptions[i].search(input.value);
                let indexEnds = indexBegins+input.value.length;
                let start = '<span>' +suggestOptions[i].substr(0,indexBegins)+'<strong>'+suggestOptions[i].substr(indexBegins,indexEnds);
                let end =   '</strong>'+suggestOptions[i].substr(indexEnds, suggestOptions[i].length)+'</span>';
                div.innerHTML = start+end;
                div.addEventListener('click', function () {
                    input.value = this.textContent;
                });
                div.addEventListener("mouseover",function () {
                    if (suggestDivs[suggestedDiv]!= null){
                        suggestDivs[suggestedDiv].classList.remove(CLASS_SELECTED)
                    }
                    suggestedDiv =  i;
                    selectDiv();
                });
                suggestDivs.push(div);
                suggestion.appendChild(div);
            }
        }
    }

    var xhr = new XMLHttpRequest();
    let url = "http://localhost:1234/town.php";
    xhr.open('GET', url + "?s=" + input.value);
    xhr.addEventListener('readystatechange', affichage);
    xhr.send();
}

function clearSuggestions() {
    suggestion.innerHTML = "";
    suggestedDiv = NO_SUGGEST_LIST;
    suggestDivs = [];
}