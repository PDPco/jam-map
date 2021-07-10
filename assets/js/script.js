const maxBPMLabel = document.getElementById('maxBPMLabel')
const maxBPMRange = document.getElementById('maxBPMRange')
const MaxBPMValue = document.getElementById('MaxBPMValue')
const minBPMLabel = document.getElementById('minBPMLabel')
const minBPMRange = document.getElementById('minBPMRange')
const MinBPMValue = document.getElementById('MinBPMValue')
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

var prevSearch;
if(localStorage.getItem("previousSearch")){
	prevSearch = JSON.parse(localStorage.getItem('previousSearch'))
} else {
	prevSearch = []
}


localStorage.clear()

var test = {
		name: "guy",
		mbid: "",
		songName: "blah",
		year: "1990",
		genre: "thing",
		origin: "US",
		BPM: "100"
}
generateCard(test);

function generateCard(bpmResult) {
	var resultingCardsContainer = document.getElementsByClassName('resultingCards');
	var musicCard = document.getElementsByClassName('music-card');
	var clone = musicCard[0].cloneNode(true);
	var songName = clone.getElementsByClassName('title');
	var songInfoArr = clone.getElementsByClassName('songinfo');
	var artistName = clone.getElementsByClassName('artist');

	clone.setAttribute('id', 'current');
	artistName[0].innerHTML = bpmResult.name;
	songName[0].innerHTML = bpmResult.songName;
	songInfoArr[0].innerHTML = "BPM: " + bpmResult.BPM;
	songInfoArr[1].innerHTML = "Genre: " + bpmResult.genre;
	songInfoArr[2].innerHTML = "Release Year: " + bpmResult.year;
	songInfoArr[3].innerHTML = "Key: " + "N/A";
	
	resultingCardsContainer[0].appendChild(clone);

	makeItunesCall('michael+jackson+bad', 'michael jackson');//Test: remove later
	//Grab onto the exemplary card, create a copy somehow, then create a pointer to the copy
	//(Maybe use a class to define the card)
	//Pass back the pointer to the top node, so that the rest of the tree
	//can be accessed by displayResults
}

function displayResults(bpmResults) {
	for (var i = 0; bpmResults.length; i++) {
		generateCard(bpmResults[i]);
	}

	//Iterate thorugh bpmObjArr and place info in elements
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

/* getItunesData takes the response from iTunes after the HTML script tag is generated and filters
* the results to make sure only the desired artist shows in the results. The function also
* takes care of removing the created script tag for the itunes call. 
*	Inputs:
*		response: response from the iTunes call
*	Outputs:
*/
function getItunesData(response) {
	//console.log(response.results)
	var scriptEl = document.getElementsByClassName("api-call");
	var bodyEl = document.body;
	var searchResults = response.results;
	var artistName = scriptEl[0].attributes.id.nodeValue;
	//need to print itunes data to this pointer
	var resultCard = document.getElementById('current');
	
	var filteredResults = filterResults(response.results, artistName);	
	
	var scriptElId = document.getElementById(scriptEl[0].attributes.id.nodeValue);
	bodyEl.removeChild(scriptElId);
	
	//console.log(filteredResults)
	
	var m4aURL = filteredResults[0].previewUrl;
	var audioEl = document.createElement("audio");
	var sourceEl = document.createElement("source");
	
	//create audio element function
	//display results to html function
	audioEl.setAttribute("controls", "");
	sourceEl.setAttribute("src", m4aURL);
	sourceEl.setAttribute("type", "audio/mp4")
	audioEl.appendChild(sourceEl);
	
	bodyEl.appendChild(audioEl);
	
}

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

/* plusDelimitString takes in `str` which is assumed to be the artist and song name delimited by spaces and replaces
 * the space by `+`. This ensures that the resulting string can be inserted into `fullUrl` and used in the iTunes API 
 * without issue.
 * 	Inputs:
 * 		str (String): string presumably containing the artist and song name with each word
 * 			      delimited by spaces.
 * 	Outputs:
 * 		    (String): string with artist and song name delimited by `+`
 */
function plusDelimitString(str) {
	var tempArr = str.split(" ");
	return tempArr.join("+");
}

/* parseBpmResults receives an array of objects from the GetBPM api call and creates and formats a string to be used in the 
 * iTunes api call.
 * 	Inputs:
 * 		bpmObjArr (Array): data container for a specific song containing name, songName, mbid, genres, year, and from
 * 	Outputs:
 * 		None
 */
function parseBpmResults(bpmResults) {
	var limit = 0;
	for (var i = 0; i < bpmResults.length; i++) {
		if (i > limit) {
			break;
		}
		var artistName = bpmResults[i].name;
		var songName = bpmResults[i].songName;
		var searchString = artistName + " " + songName;
		
		searchString = plusDelimitString(searchString);
		console.log(searchString)
		makeItunesCall(searchString, artistName);
		displayResults(bpmResults);
	}	
}

/* iterateBpm takes the object, `allInput`, containing the user chose BPM range and iterates from
 * the minimum BPM to the maximum BPM.
 *	Input:
 *		allInput (Object): Object containing user chosen BPM range, Year range, genre, country
 *				   origin and musical key.
 *	Ouput:
 *		None
 */
function iterateBpm(allInput) {
	var minBpm = Number(allInput.minBpm);
	var maxBpm = Number(allInput.maxBpm);

	var Bpm = minBpm;
	while (Bpm <= minBpm) {//maxBpm) {
		console.log(Bpm)
		GetBpmApi(Bpm, allInput); //may need to pass allInput to GetBpmApi to filter results
		Bpm++;
	}
}

/* getUserInput waits for the user to submit their input values and those chosen values are stored in an
 * object used by iterateBpm and GetBpmApi.
 *	Inputs:
 *		None
 *	Outputs:
 *		None
 */
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
	submitBTN.addEventListener("click", function(event){
		event.preventDefault();
		allInput.minBpm = minBPMRange.value;//getAttribute("value");
		allInput.maxBpm = maxBPMRange.value;//getAttribute("value");
		allInput.minYear = minYearRange.value;//getAttribute("value");
		allInput.maxYear = maxYearRange.value;//getAttribute("value");
		allInput.genre = genreDropdown.value;
		allInput.origin = originDropdown.value;
		allInput.key = keyDropdown.value;

		iterateBpm(allInput);
		console.log(allInput);
		// ADDING THE ALLINPUT VALUES TO LOCAL STORAGE TO STORE ON PAGE AND RETRIEVE FOR SEARCH HISTORY TAB
		prevSearch.push(allInput) // push allInput object to empty global array and saves array to localstorage
		console.log(prevSearch)
		localStorage.setItem("previousSearch", JSON.stringify(prevSearch))
		createSearchHistory()

		// Possibly add setitems for local storage to save all inputs from user
	})
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

/* initializeSliders creates pointers to the HTML slider elements and calls updateSliderLabel
 * to initialize the slider event listeners so that the labels are updated on the page
 * 	Inputs:
 * 		None
 * 	Outputs:
 * 		None
 */
function initializeSliders() {
	console.log("im in")
	updateSilderLabel(minBPMRange, maxBPMRange, MinBPMValue, MaxBPMValue);
	updateSilderLabel(minYearRange, maxYearRange, currentMinYear, currentMaxYear);
}

function startJamMap() {
	initializeSliders();
	getUserInput();
}
startJamMap();




// ------------------------ START OF NEW WORK SPACE ----------

console.log(genreDropdown.value)

/*
To initialize the fetch from getsongbpm api and print response and data to console for access.
input: 
-integer parameter which is defined by the user input
- userInput which is defined by user through selectors

output:
createArrObj saved to filtered arr and printed to console with retrieved results or no results found

*/ 

function GetBpmApi(integer, userInput) {
    fetch(`https://api.getsongbpm.com/tempo/?api_key=893450d85c97cdffba8a49349f3d8974&bpm=${integer}`)
    .then(function (response) {
        console.log(response)
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        var objArr = createArrObj(data, userInput)
		 if (objArr.length === 0) {
		 	console.log('No results found')
		 } else {
		 	console.log(objArr)
			parseBpmResults(objArr)
		 }
    })
}

/*
Initializes a for loop to filter data give to retrieve results that match the user criteria

input: 
-inputData = data meant to be filtered through, which would be results from fetch of getsongbpm
-userInput = matches from the user input of what desired results should meet. which would be allInput defined above line 175.

output: object that meets all parameters set within if statement. pushed to the array where sorted and then returned within an array, arrayOfObjects
*/

function createArrObj(inputData, userInput){
    var arrayOfObjects = [];
	
    for(i=0; i < inputData.tempo.length; i++) {
		var parsedInt = parseInt(inputData.tempo[i].album.year)
		var userParsedMinInt = parseInt(userInput.minYear)
		var userParsedMaxInt = parseInt(userInput.maxYear)
		// console.log(inputData.tempo[i].artist.genres.includes(userInput.genre))
		// console.log(inputData.tempo[i].artist.from.includes(userInput.origin))
		if(inputData.tempo[i].artist.genres === null || inputData.tempo[i].artist.from === null){
			continue;
		}
		if(userParsedMinInt > userParsedMaxInt) {
			console.log('Your minimum year must be smaller than your maxmimum')
			return;
		}
		// ADDED CONSOLE LOG FOR WHEN SLIDER OF MIN IS BIGGER THAN MAX.
		if(inputData.tempo[i].artist.genres.includes(userInput.genre) && inputData.tempo[i].artist.from.includes(userInput.origin) && parsedInt >= userParsedMinInt && parsedInt <= userParsedMaxInt) { // need to write functionality for taking the specified year
			songInfo = {
				name: inputData.tempo[i].artist.name,
				mbid: inputData.tempo[i].artist.mbid,
				songName: inputData.tempo[i].song_title,
				year: inputData.tempo[i].album.year,
				genre: inputData.tempo[i].artist.genres,
				origin: inputData.tempo[i].artist.from,
				BPM: inputData.tempo[i].artist.tempo
			}
			arrayOfObjects.push(songInfo)
			// console.log(songInfo)
		}
	}
	// console.log(arrayOfObjects.length)
    return arrayOfObjects;
}

// CREATE THE ELEMENTS FOR A SEARCH HISTORY **WIP**
// NEXT STEP IS TO ADD SELECTORS AND CREATE ELEMENTS

function createSearchHistory() {
	for( i=0; i < prevSearch.length; i++) {
		console.log(prevSearch[i])
	}
}