# Jam Map
Jam Map is designed around the idea that a user may want to find songs to add to their playlist based on some categorical options (genre and year) or music fundamentals (tempo and key). The goal is to present the user with results that have the same feel as familiar songs and fill out their playlist. The results come with cover art and samples to help the user quickly decide on a song they enjoy.

<p align="center">
	<img src="https://media.giphy.com/media/lHnyOACjCMbHKtjNBP/giphy.gif">
<p>

# How it works
To receive a list of potential songs, the user first specifies a range of beats per minute (or BPM), a range of years, and genre (key feature still in progress). The app will reference the [GetSongBPM API](https://getsongbpm.com/api) which allows for filtering by BPM, year, genre, and key. With these filtered results, the next step is to get cover art and samples to attach to the results which is achieved by calling [iTunes' API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html). Results from GetSongBPM are limited to the most played songs within the last 30 days and are mostly older songs as opposed to more modern songs.

### GetSongBPM API
The primary purpose for GetSongBPM API is to first create a search for music filtered by BPM, then filter the search further based on user input such as genre, country origin, year released, and the musical key of the song. The single and only call to GetSongBPM gives us access to the tempo object when given a BPM:

```
https://api.getsongbpm.com/tempo/?api_key={api-key}&bpm={integer}.
```
The results containing information about the artist and song for a particular BPM is then used to further filter. The tempo object gives access to information on the common genres for the artist and year of the particular song. To incorporate filtering based on key, it would require another call, given the song name resulting from the previous call.

### iTunes API
Calls to iTunes API makes use of their audio samples and artist images. A normal use of fetch would not work in our case due to cross-domain issues. As iTunes' API documentation suggests, we can instead make calls by through JSONP. This process involves dynamically creating a script tag with the `src` attribute set to the URL for the API call. Within the URL, the parameter for `callback` must be used to handle the data after receiving the data. `callback` requires a function for which the API call will throw the data. Once the processing of the retrieve data is done, the generated script tag is removed from the HTML body. As an example, a script tag to be created on the DOM looks like

```
<script src="https://itunes.apple.com/search?term={searchTerm}&media=music&entity=song&attribute=songTerm&limit=200&callback=someCallbackFunction"></script>
```

The issue with this arises when making multiple calls in a short period of time. Calls to the callback function and the data received are essentially intermingled, and it becomes difficult to associate data from iTunes with the GetSongBPM calls. To deal with this, we make use of Ajax to handle the calls. In this case, Ajax is able to associate the data received to the particular instance of the callback function. Our call to iTunes instead looks like

```
var url = "https://itunes.apple.com/search?term=" + searchTerm + "&media=music&entity=song&attribute=songTerm&limit=200&callback=getItunesData";
	$.ajax({
		url: url,
		dataType: 'jsonp',

	}).done(function(response) {code to handle data...}).
```
The jsonpCallback property is not specified in this case in order to allow Ajax to associate the calls to the callback functions with the corresponding response. With all the details of the response out of the way, we can find cover art and samples by accessing the `artworkUrl100` and `previewUrl`, respectively.

### Velocity.js
Velocity allowed us to make a simple animation on the sliders for BPM and year. We used a simple spring-physics-based-easing on the sliders, so that the slider quickly grows in width and "bounces" near the stopping width. The use case here basically grabs the slider element within the DOM and uses Velocity to change the property in an animated way:

```
Velocity(sliderElement, {width: {endWidth}, {duration, [tension, friction]}})
```


# Visit the site!
[Jam Map](https://pdpco.github.io/jam-map/)

# Authors
Paul B., Peter C., and Denzal M.

# Credits
Thank you to the UC Berkeley Bootcamp teaching staff for providing the resources and help to us in completing this project. 

**References**
* [HTML](https://www.w3schools.com/html/default.asp)
* [CSS](https://www.w3schools.com/css/default.asp)
* [Markdown reference](https://guides.github.com/features/mastering-markdown/)
* [Bulma](https://bulma.io/)
* [Bootstrap](https://getbootstrap.com/)
* [iTunes API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html)
* [Ajax](https://api.jquery.com/jquery.ajax/)
* [GetSongBPM API](https://getsongbpm.com/api)
* [Velocity.js](http://velocityjs.org/)
