# Jam Map

# How it works

### GetSongBPM API
The primary purpose for GetSongBPM API is to first create a search for music filtered by BPM, then filter the search further based on user input such as genre, country origin, year released, and the musical key of the song

### iTunes API
Calls to iTunes API makes use of their audio samples and artist images. To retrieve data from iTunes, a call was made by dynamically creating a script tag with the `src` attribute set to the URL for the API call. Within the URL, the parameter for `callback` must be used to handle the data after receiving the data. `callback` requires a function for which the API call will throw the data. Once the processing of the retrieve data is done, the generated script tag is removed from the HTML body.  

### Velocity.js
### Howler.js

# Visit the site!

# Authors
Paul B., Peter C., and Denzal M.

# Credits
Thank you to the UC Berkeley Bootcamp teaching staff for providing starter code and introducing me to web design.

**References**
* [HTML](https://www.w3schools.com/html/default.asp)
* [CSS](https://www.w3schools.com/css/default.asp)
* [Markdown reference](https://guides.github.com/features/mastering-markdown/)
* [Bootstrap](https://getbootstrap.com/)
* [iTunes API]()
* [GetSongBPM API]()
* [Velocity.js]()
* [Howler.js]()