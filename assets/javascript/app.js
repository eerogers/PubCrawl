// JavaScript function that wraps everything



// ICU coordinates as a starting point
var startLat = 33.6490513251
var startLong = -117.8434728082
var newCenterLat = startLat
var newCenterLong = startLong


var searchInput
var googlePlacesQueryURL
var returnedBarArray = []


var coord = {
    lat: 0,
    long: 0
}
var latLongCoord = []


function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        // center: new google.maps.LatLng(startLat, startLong)
        center: new google.maps.LatLng(newCenterLat, newCenterLong)
    });

    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var labelIndex = 0

    for (var i = 0; i < latLongCoord.length; i++) {
        var coords = latLongCoord[i]
        //      console.log(latLongCoord[i])
        var latLng = new google.maps.LatLng(coords.lat, coords.long);

        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            label: labels[labelIndex++ % labels.length]
        })
    }
}

$(document).ready(function () {

    $("#search-btn").on("click", function (event) {
        event.preventDefault();
        var returnedBarArray = []
        searchInput = $("#searchLocation").val().trim()

        googlePlacesQueryURL = "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/textsearch/json?query=bars+in+" + searchInput + "&key=AIzaSyDQliyGgJ5yyh30hSGDwzbv9SUqNhzLya0"
        var key = "AIzaSyDQliyGgJ5yyh30hSGDwzbv9SUqNhzLya0"

        var resultLat
        var resultLng
        var resultCityName
        var searchParameter
        var markerLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

        $.ajax({
            url: googlePlacesQueryURL,

            method: 'GET'
        }).then(function (requestResult) {
            latLongCoord = []

            var X
            var barObj

            for (var i = 0; i < requestResult.results.length; i++) {

                X = {
                    lat: lat,
                    long: long
                }

                barObj = {
                    barName: '',
                    barAddress: '',
                    barLink: '',
                    barRating: '',
                    barIcon: '',
                    barHours: '',
                    barOpen: false,
                    barLat: '',
                    barLong: '',
                    barIndex: 0,
                    barPhoto: ''
                }

                barObj.barName = requestResult.results[i].name
                barObj.barAddress = requestResult.results[i].formatted_address
                barObj.barLink = requestResult.results[i].photos[0].html_attributions[0]
                barObj.barRating = requestResult.results[i].rating
                barObj.barIcon = requestResult.results[i].icon
                barObj.barOpen = requestResult.results[i].opening_hours.open_now
                barObj.barHours = requestResult.results[i].opening_hours.weekday_text
                barObj.barIndex = i
                barObj.barPhoto = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photoreference=" + requestResult.results[i].photos[0].photo_reference + "&key=AIzaSyDQliyGgJ5yyh30hSGDwzbv9SUqNhzLya0"

                var lat = requestResult.results[i].geometry.location.lat
                var long = requestResult.results[i].geometry.location.lng

                barObj.barLat = lat
                barObj.barLong = long
                // console.log("barLat in .then = " + barObj.barLat)
                // console.log("barLong in .then = " + barObj.barLong)
                // console.log("Open true" + requestResult.results[i].opening_hours[0])
                // console.log("open hours " + requestResult.results[i].opening_hours[1])
                // console.log("response" + requestResult.results)



                returnedBarArray.push(barObj)

            }
            newCenterLat = returnedBarArray[0].barLat
            newCenterLong = returnedBarArray[0].barLong

            initMap()

            console.log('returnedBay Array: ', returnedBarArray)
            var weatherAPIKey = "166a433c57516f51dfab1f7edaed8413";
            // Here we are building the URL we need to query the database
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
                "q="+searchInput+"&appid=" + weatherAPIKey;
            // Here we run our AJAX call to the OpenWeatherMap API

            $.ajax({
                url: queryURL,
                method: "GET"
            })
                // We store all of the retrieved data inside of an object called "response"
                .then(function (response) {
                    // Log the queryURL
                    console.log(queryURL);
                    // Log the resulting object
                    console.log(response);
                    var windSpeed = response.wind.speed * 2.23
                    var updatedTemp = (response.main.temp * 1.8) - 459.67
                    // Transfer content to HTML
                    $(".city").html(" Weather Details");
                    $(".wind").text("Wind Speed: " + Math.floor(windSpeed) + " mph");
                    $(".humidity").text("Humidity: " + response.main.humidity + "%");
                    $(".temp").text(Math.floor(updatedTemp) + "°");
                    // Log the data in the console as well
                    console.log("Wind Speed: " + response.wind.speed);
                    console.log("Humidity: " + response.main.humidity);
                    console.log(updatedTemp + "°");
                    $(".current-weather").css("display", "inline-flex")
                });




            $("#search-results-box").empty()
            for (var x = 0; x < returnedBarArray.length; x++) {
                if (returnedBarArray[x].barOpen) {
                    var openNow = "Open Now"
                }
                else {
                    var openNow = "Closed"
                }
                $("#search-results-box").append('<div class = "container search-boxes" id = "search-results-' + x + '">\
                <div class="row"  id = "search-result-' + x + '">\
                <div class="col-md-4">\
                <div class="container justify-content-start"><img src="' + returnedBarArray[x].barPhoto + '"\
                class="img-fluid rounded search-images" id="search-image-' + x + '">\
                </div> \
                </div> \
                <div class="col-md-8"> \
                <div class="container justify-content-end"> \
                <h5 class="card-title search-titles" id="search-title-' + x + '">' + returnedBarArray[x].barName + '</h5> \
                <p class="search-p" id = "search-rating">' + returnedBarArray[x].barRating + '</p>\
                <p class="search-p" id = "search-address">' + returnedBarArray[x].barAddress + '</p>\
                <p class="search-p" id = "search-hours">' + openNow + '</p>\
                <button type = "button" class = "addMeToCrawl" dataIndex = "' + returnedBarArray[x].barIndex + '">Add to Itinerary</button>\
                </div> \
                </div> \
                </div> \
                </div>')
        
            }

            //Click event that transfers bar search results as a google map marker and to pub list
            $(".addMeToCrawl").on("click", function () {
                var imABarAndAddMeToList = returnedBarArray[$(this).attr("dataIndex")].barName

                //append to Suggested Bar List
                $('ol').append("<li class='barsPicked' dataIndex = " + $(this).attr('dataIndex') + ">" + imABarAndAddMeToList + "</li>")
                var lat = returnedBarArray[$(this).attr("dataIndex")].barLat
                var long = returnedBarArray[$(this).attr("dataIndex")].barLong

                var X = {
                    lat: lat,
                    long: long
                }

                //coordinates of Bars in Suggested Bar List added to latLongCoord.  Used by initMap() to place flags
                latLongCoord.push(X)
                initMap()



                //click event that removes bars from the suggested list and removes flag in map
                //$(".barsPicked").on("click", function () {
                $(document.body).on("click", ".barsPicked", function () {
                    $(this).remove()

                    latLongCoord.splice($(this).attr("dataIndex"), 1)
                    console.log("remove click event - index: " + latLongCoord.length)

                    initMap()
                })

            })// end transfer bar to google map marker click event

        })// end ajax then
    })// end search click event
});// close document.ready























