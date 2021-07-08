const maxBPMLabel = document.getElementById('maxBPMLabel')
const maxBPMRange = document.getElementById('maxBPMRange')
const minBPMLabel = document.getElementById('minBPMLabel')
const minBPMRange = document.getElementById('minBPMRange')
const BPMValue = document.getElementById('BPMValue');
// GENRE SELECTION
const genreLabel = document.getElementById('genreLabel')
const genreDropdown = document.getElementById('genreDropdown')
// YEAR SELECTORS
const maxYearLabel = document.getElementById('maxYearLabel')
const maxYearRange = document.getElementById('MaxYearRange')
const currentMaxYear = document.getElementById('currentMaxYear')
const minYearLabel = document.getElementById('minYearLabel')
const minYearRange = document.getElementById('MinYearRange')
const currentMinYear = document.getElementById('currentMinYear')
// ORIGIN 
const originLabel = document.getElementById('originLabel')
const originDropdown = document.getElementById('originDropdown')
// KEY SELECTOR
const keyLabel = document.getElementById('keyLabel')
const keyDropdown = document.getElementById('keyDropdown')
// BUTTON SELECTOR 
const submitBTN = document.getElementById('submitBTN')


/* makeItunesCall creates the call to the iTunes. The call is different than using fetch since we 
 * run into issues with CORS not being enable on iTunes side. Instead of fetch, we have to create
 * a script tag with the src attribute set to the url for the api call, containing a parameter (callback)
 * which calls getItunesData to receive the response. The script tag is made with the id attribute
 * set to artistName so that it can be grabbed in a later function and removed from the DOM.
 * 	Inputs:
 * 		searchTerm (String): search term which should be "(artist)+(song name)"
 * 		artistName (String): the name of the artist
 *	Outputs:
 *		None
 */
function makeItunesCall(searchTerm, artistName) {
	var fullUrl = "https://itunes.apple.com/search?term=" + searchTerm + "&media=music&entity=song&attribute=songTerm&limit=200&callback=getItunesData";
	var scriptEl = document.createElement("script");
	var bodyEl = document.body;

	scriptEl.setAttribute("src", fullUrl);
	scriptEl.setAttribute("class", "api-call");
	scriptEl.setAttribute("id", artistName);
	bodyEl.appendChild(scriptEl);
}

/* getItunesData takes the response from iTunes after the HTML script tag is generated and filters
 * the results to make sure only the desired artist shows in the results. The function also
 * takes care of removing the created script tag for the itunes call. 
 *	Inputs:
 *		response: response from the iTunes call
 *	Outputs:
 */
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

/* initializeSliders creates pointers to the HTML slider elements and calls updateSliderLabel
 * to initialize the slider event listeners so that the labels are updated on the page
 * 	Inputs:
 * 		None
 * 	Outputs:
 * 		None
 */
function initializeSliders() {
	console.log("im in")
	updateSilderLabel(minYearRange, maxYearRange, currentMinYear, currentMaxYear);
}

/* This function generalizes the setup for creating slider event listeners
 * 	Inputs:
 *		minSlider (Object): Slider element to take user input of min value
 *		maxSlider (Object): Slider element to take user input of max value
 *		minOut	  (Object): Output element for minimum value
 *		maxOut    (Object): Output element for maximum value
 *	Outputs: 
 *		None
 */
 function updateSilderLabel(minSlider, maxSlider, minOut, maxOut) {
	minSlider.addEventListener("input", function(){
		minOut.innerHTML = this.value;
		minSlider.setAttribute("value", this.value);
	})
	maxSlider.addEventListener("input", function(){
		maxOut.innerHTML = this.value;
		maxSlider.setAttribute("value", this.value);
	})
}


function getUserInput() {
	console.log("im in")
	var allInput = {minBpm: "",
	                maxBpm: "",
		       minYear: "",
		       maxYear: "",
		         genre: "",
			origin: "",
			   key: ""
	}
	submitBTN.addEventListener("click", function(){
		allInput.minBpm = minBPMRange.value;//getAttribute("value");
		allInput.maxBpm = maxBPMRange.value;//getAttribute("value");
		allInput.minYear = minYearRange.value;//getAttribute("value");
		allInput.maxYear = maxYearRange.value;//getAttribute("value");
		allInput.genre = genreDropdown.value;
		allInput.origin = originDropdown.value;
		allInput.key = keyDropdown.value;

		iterateBpm(allInput);
		console.log(allInput);
	})
	return allInput;
}

function iterateBpm(allInput) {
	var minBpm = Number(allInput.minBpm);
	var maxBpm = Number(allInput.maxBpm);

	var Bpm = minBpm;
	while (Bpm <= minBpm) {//maxBpm) {
		console.log(Bpm)
		GetBpmApi(Bpm); //may need to pass allInput to GetBpmApi to filter results
		Bpm++;
	}
}

function startJamMap() {
	initializeSliders();
	var allInput = getUserInput();
	console.log(allInput)
		
}
startJamMap();


































































































































































































// ------------------------ START OF NEW WORK SPACE ----------

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
