function makeItunesCall(searchTerm, artistName) {
	var fullUrl = "https://itunes.apple.com/search?term=" + searchTerm + "&media=music&entity=song&attribute=songTerm&limit=200&callback=getItunesData";
	var scriptEl = document.createElement("script");
	var bodyEl = document.body;

	scriptEl.setAttribute("src", fullUrl);
	scriptEl.setAttribute("class", "api-call");
	scriptEl.setAttribute("id", artistName);
	bodyEl.appendChild(scriptEl);
}


function getItunesData(response) {
	console.log(response.results)
	var scriptEl = document.getElementsByClassName("api-call");
	var bodyEl = document.body;
	var searchResults = response.results;
	var artistName = scriptEl[0].attributes.id.nodeValue;

	console.log(filterResults(response.results, artistName), "filtered");	

	var scriptElId = document.getElementById(scriptEl[0].attributes.id.nodeValue);
	bodyEl.removeChild(scriptElId);	

}

/* filterResults ensures that the array from the iTunes api call contains only the artist given as searchTerm in makeItunesCall.
 * Artists that are not in searchTerm will be remove from the array.
 *	Inputs:
 *		arr (Array): array which contains all the results from the iTunes api call
 *		artistName (String):
 *	Outputs:
 *		arr (Array): array with elements not containing artistName removed
 */
function filterResults(arr, artistName) {
	//console.log(arr)
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].artistName !== artistName) {
			arr.splice(i, i+1);
			i--;
		}
	}
	return arr;
}

/* parseBpmResults receives an array of objects from the GetBPM api call and creates and formats a string to be used in the 
 * iTunes api call.
 * 	Inputs:
 * 		bpmObjArr (Array): data container for a specific song containing name, songName, mbid, genres, year, and from
 * 	Outputs:
 * 		None
 */
function parseBpmResults(bpmObjArr) {
	var limit = 0;
	for (var i = 0; i < bpmObjArr.length; i++) {
		if (i > limit) {
			break;
		}
		var artistName = bpmObjArr[i].name;
		var songName = bpmObjArr[i].songName;
		var searchString = artistName + " " + songName;

		searchString = plusDelimitString(searchString);
		console.log(searchString)
		makeItunesCall(searchString, artistName);
	}	
}


function plusDelimitString(str) {
	var tempArr = str.split(" ");
	return tempArr.join("+");
}

function initializeSliders() {
	var maxYearSlider = document.getElementById("MaxYearRange");
	var minYearSlider = document.getElementById("MinYearRange");
	var minYearOutput = document.getElementById("currentMinYear");
	var maxYearOutput = document.getElementById("currentMaxYear");

	updateSilderLabel(minYearSlider, maxYearSlider, minYearOutput, maxYearOutput);
}

function updateSilderLabel(minSlider, maxSlider, minOut, maxOut) {
	minSlider.addEventListener("input", function(){
		minOut.innerHTML = this.value;
	})
	maxSlider.addEventListener("input", function(){
		maxOut.innerHTML = this.value;
	})

}

initializeSliders();

//GetBpmApi(100);

































































































































































































// ------------------------ START OF NEW WORK SPACE ----------

// EMPTY ARRAY TO PUSH OBJECTS

// BPM RANGE SELECTOR
var maxBPMLabel = document.getElementById('maxBPMLabel')
var maxBPMRange = document.getElementById('maxBPMRange')
var minBPMLabel = document.getElementById('minBPMLabel')
var minBPMRange = document.getElementById('minBPMRange')
var BPMValue = document.getElementById('BPMValue');
// GENRE SELECTION
var genreLabel = document.getElementById('genreLabel')
var genreDropdown = document.getElementById('genreDropdown')
// YEAR SELECTORS
var maxYearLable = document.getElementById('maxYearLabel')
var maxYearRange = document.getElementById('MaxYearRange')
var currentMaxYear = document.getElementById('currentMaxYear')
var minYearLabel = document.getElementById('minYearLabel')
var minYearRange = document.getElementById('MinYearRange')
var currentMinYear = document.getElementById('currentMinYear')
// ORIGIN 
var originLabel = document.getElementById('originLabel')
var originDropdown = document.getElementById('originDropdown')
// KEY SELECTOR
var keyLabel = document.getElementById('keyLabel')
var keyDropdown = document.getElementById('keyDropdown')
// BUTTON SELECTOR 
var submitBTN = document.getElementById('submitBTN')

console.log(genreDropdown.value)



function GetBpmApi(integer) {
    fetch(`https://api.getsongbpm.com/tempo/?api_key=893450d85c97cdffba8a49349f3d8974&bpm=${integer}`)
    .then(function (response) {
        console.log(response)
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        var objArr = createArrObj(data)
        parseBpmResults(objArr)
    })
}


submitBTN.addEventListener('click', GetBpmApi)



function createArrObj(inputData){
    var arrayOfObjects = [];
    for(i=0; i < inputData.tempo.length; i++) {
        songInfo = {
            name: inputData.tempo[i].artist.name,
            mbid: inputData.tempo[i].artist.mbid,
            songName: inputData.tempo[i].song_title,
            year: inputData.tempo[i].album.year
        }
        arrayOfObjects.push(songInfo)
    }
    return arrayOfObjects;
}
