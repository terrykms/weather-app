const CURRENT_WEATHER_DATA_API = "https://api.openweathermap.org/data/2.5/weather";
const GEOCODING_API = "http://api.openweathermap.org/geo/1.0/direct";
const API_KEY = "1501a965f1790381be648537630b699a";

$(document).ready(function() {
    $("#submitBtn").on("click", function() {
        var city = $("#city").val()
        getCityCoordinates(city);
    })

    const getCityCoordinates = cityName => {
        $.ajax({
            url: GEOCODING_API + "?q=" + cityName + "&limit=5" + "&appid=" + API_KEY,
            dataType: "json",
            success: function(result) {
                console.log(result);
                // $("p").text(result)
                $("p").text("Latitude:" + result[0].lat + "Longitude:" + result[0].lon)


            },
            error: function(xhr, status, error) {
                console.log("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }          
        })
    }
})