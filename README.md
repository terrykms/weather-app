# weather-app

1. Search bar shows a list of suggested locations (cities) when user types in letter by letter.
2. {city name},{state code},{country code} is stored as a variable and passed as a parameter in the Geocoding API.
3. Geocoding API fetches the latitude & longitude values, which are then used to fetch the data from Current Weather Data API.
4. If successful, jQuery.ajax() returns a JSON object and the relevant data is rendered into the HTML DOM.

<a href="http://minseokim.byethost11.com/weather-app.html">Demo</a>