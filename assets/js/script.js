







































































































































































































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
    for(i=0; i < inputData.length; i++) {
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
