const CURRENT_WEATHER_DATA_API = "https://api.openweathermap.org/data/2.5/weather";
const GEOCODING_API = "http://api.openweathermap.org/geo/1.0/direct";
const API_KEY = "API_KEY"; // insert personal API key that has been generated. 

$(document).ready(function() {
    /* ------- clear suggestions to update with every keydown------ */
    $("#city").keydown(function() {
        $(".suggestion").remove(); 
    })

    /* -------- update suggestions ------- */
    $("#city").keyup(function() {
        var keyword = $(this).val(); // current value in input

        if (keyword != "") {
            $.ajax({
                url: GEOCODING_API + "?q=" + keyword + "&limit=5" + "&appid=" + API_KEY,
                dataType: "json",

                success: function(data) {
                    // for each data, append them to the "suggestions list". 
                    data.forEach(item => {
                        $("<div />", {
                            text: item.name + "," + (item.state ? (item.state + ",") : "") + item.country, // {city name},{state code},{country code}
                            "data-value": item.name + "," + (item.state ? (item.state + ",") : "") + item.country, // {city name},{state code},{country code}
                            class: "suggestion"
                        }).appendTo("#searchResults");
                    })

                    // onclick event: fill in the input box with the selected city. 
                    $(".suggestion").on("click", function() {
                        var key = $(this).data("value");
                        $("#city").val(key);
                    })
                },
                error: function(xhr, status, error) {
                    // define later
                    console.log("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                }          
            })
        }
    })


    /* ------------------------ 
    send cityKey to API and get the relevant information 
        - function getCityCoordinates
    ------------------------------ */

    $("#submitBtn").on("click", function(evt) {
        evt.preventDefault();
        var key = $("#city").val()
        getCityCoordinates(key);
        $(".suggestion").remove(); 
    })

    $("#city").keydown(function(evt) {
        // enter key
        if (evt.keyCode === 13) {
            evt.preventDefault();
            var key = $("#city").val()
            getCityCoordinates(key);
            $("#searchResults").css("display", "none"); 
        }
    })

    $("#city").on("click", function(evt) {
        evt.preventDefault();
        $("#searchResults").css("display", "block");
    })

    function getCityCoordinates(cityKey) {
        if (cityKey != "") {
            $.ajax({
                url: GEOCODING_API + "?q=" + cityKey + "&limit=5" + "&appid=" + API_KEY,
                dataType: "json",
    
                success: function(data) {
                    try {
                        console.log(data)
                        var lat = data[0].lat;
                        var lon = data[0].lon;
                        getWeatherData(lat, lon)
                    }
                    catch (err) {
                        if (data[0] === undefined) {
                        alert("City is not in the database!")
                        }
                    }
    
                },
                error: function(xhr, status, error) {
                    //define later
                    alert("Error: " + xhr.status + " " + xhr.statusText)
                }          
            })
        }
    }

    function getWeatherData(lat, lon) {
        $.ajax({
            url: CURRENT_WEATHER_DATA_API + "?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric",
            dataType: "json",

            success: function(data) {

                /* ------ CITY/STATE/COUNTRY ------- */
                var city = data.name;
                var country = data.sys.country;
                $("#cityName").html(city);
                $("#countryName").html(country);

                /* ------ WEATHER ------- */
                var weather = data.weather[0].main;
                var weatherDesc = data.weather[0].description;
                // $("#weather").html(weatherDesc);
                $("#weatherIcon").attr({
                    src: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png",
                    width: "84px",
                    height: "84px",
                });

                $("#weatherWord").html(weather);




                /* ------ SUNRISE/SUNSET ------ */
                const SECONDS_TO_MILLISECONDS = 1000;
                const MINUTES_TO_SECONDS = 60;
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

                var date = new Date(Date.now());
                var localTimezoneOffset = date.getTimezoneOffset() * MINUTES_TO_SECONDS // convert from minutes to seconds
                var timeConversionFactor = localTimezoneOffset + data.timezone;

                var currentLocalTime = new Date((data.dt + timeConversionFactor) * SECONDS_TO_MILLISECONDS);
                var sunrise = new Date((data.sys.sunrise + timeConversionFactor) * SECONDS_TO_MILLISECONDS);
                var sunset = new Date((data.sys.sunset + timeConversionFactor) * SECONDS_TO_MILLISECONDS)

                $("#sunrise").html(sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                $("#sunset").html(sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

                $("#date").html(currentLocalTime.toLocaleDateString(undefined, options)); // edit the code



                /* ------ TEMPERATURE ----- */
                var temp = data.main.temp;
                var tempFeelsLike = data.main.feels_like;
                var minTemp = data.main.temp_min;
                var maxTemp = data.main.temp_max;   
                
                $("#currentTemp").html(temp.toFixed(1));
                $("#maxTemp").html(maxTemp.toFixed(1));
                $("#minTemp").html(minTemp.toFixed(1));         
                $("#feelsLike").html(tempFeelsLike.toFixed(1))

                /* ------ HUMIDITY/WIND/PRECIPITATION ------ */
                var humidity = data.main.humidity;
                var windSpeed = data.wind.speed;
                var windDirection = data.wind.deg; // conversion to direction function needed

                $("#humidity").html(humidity);
                $("#windSpeed").html(windSpeed);
                $("#windDirection").html(windDirection);
                


                // change display from none to initial. 
                $("#weatherContainer").removeAttr("style")

                //last update (local time)
                var lastUpdate = new Date(data.dt * SECONDS_TO_MILLISECONDS);
                $("#lastUpdated").html("Last Updated: " + lastUpdate)
            },
            error: function(xhr, status, error) {
                //define later
                console.log("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        })
    }

    $(".nav-link").each(function() {

        $(this).on("click", function() {
            // set all .details to display: none
            $(".details").addClass("hidden");
            $(".nav-link").removeClass("active");

            // then change the selected content to disply: block
            var selectorID = "#" + $(this).data("target");
            $(selectorID).removeClass("hidden");
            $(this).addClass("active");
        })
    })
})