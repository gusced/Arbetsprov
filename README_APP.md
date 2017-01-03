GENERAL INFO
This application are using the lastFMs (http://www.last.fm/sv/home) api to search music artists. It is a very simple application consisting of the following files:

* Default.html -- Open the file in any web browser. Keeps the markup for search form, search results and search history.
* Styles/search.css -- Layout rules
* Script/search.js -- Functions for communicationbetween the webapplication and lastFMs api. It also contains UI functions.

The applocation are using the following ui frameworks. They are managed with bower (https://bower.io/).
* Jquery - Used for UI functions
* Bootstrap - Used for UI layot. 
* Normalize-css - Used to make element to display equaly between browsers and browser versions

INSTRUCTIONS
The webapp is ready to use though the nessesary files are in place. I have copied the css and js files that are managed with bower to the style and script folders.

If bower is setup all the files can be retrieved by using the "bower update" command. It is then using the bower.json file included in the project to know what do fetch.

Start the app by opening Default.html in any web browser. Type in a searchword in the search field. The app will then retriev a list of the 5 most relevant matches from lastFM.


