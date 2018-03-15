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

    $("#submitSearch").on("click", function (event) {
        event.preventDefault();
        var returnedBarArray = []
        searchInput = $("#searchLocation").val().trim()

        googlePlacesQueryURL = "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/textsearch/json?query=bars+in+" + searchInput + "&key=AIzaSyAh5EasiMiQmQHC_7-rQSPoZkZL1X4rK74"
        var key = "AIzaSyAh5EasiMiQmQHC_7-rQSPoZkZL1X4rK74"

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
                    barLat: '',
                    barLong: '',
                    barIndex: 0
                }

                barObj.barName = requestResult.results[i].name
                barObj.barAddress = requestResult.results[i].formatted_address
                barObj.barLink = requestResult.results[i].photos[0].html_attributions[0]
                barObj.barIndex = i
                
                var incorrectBarLinkNameWrong = requestResult.results[i].photos[0].html_attributions[0]
                var index = incorrectBarLinkNameWrong.indexOf('>')
                var barLinkAddressOnly = incorrectBarLinkNameWrong.substr(3,index-3)
                console.log("addressOnly: "+barLinkAddressOnly)
                
                
                var lat = requestResult.results[i].geometry.location.lat
                var long = requestResult.results[i].geometry.location.lng

                barObj.barLat = lat
                barObj.barLong = long
                console.log("barLat in .then = "+barObj.barLat)
                console.log("barLong in .then = "+barObj.barLong)

                

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
                    // Transfer content to HTML
                    $(".city").html(" Weather Details");
                    $(".wind").text("Wind Speed: " + response.wind.speed);
                    $(".humidity").text("Humidity: " + response.main.humidity);
                    $(".temp").text("Temperature (F) " + response.main.temp);
                    // Log the data in the console as well
                    console.log("Wind Speed: " + response.wind.speed);
                    console.log("Humidity: " + response.main.humidity);
                    console.log("Temperature (F): " + response.main.temp);
                });

            $("#googleResult").empty()
            for (var x = 0; x < returnedBarArray.length; x++) {
                $("#googleResult").append("<span class='addMeToCrawl' dataIndex = " + returnedBarArray[x].barIndex + ">Add_Me_Icon_Here</span><br>" + returnedBarArray[x].barName+"<br>"+returnedBarArray[x].barLink + "<br>" + returnedBarArray[x].barAddress + "<br>" + returnedBarArray[x].barIndex + "<br><br>")
            }

            //Click event that transfers bar search results as a google map marker and to pub list
            $(".addMeToCrawl").on("click", function () {
                console.log("Hello, I'm index#" + $(this).attr("dataIndex"))
                console.log("Hello, address is #" + returnedBarArray[$(this).attr("dataIndex")].barAddress)
                var imABarAndAddMeToList = returnedBarArray[$(this).attr("dataIndex")].barName
                console.log("Bar To Add: " + imABarAndAddMeToList)
                $('ul').append("<li class='barsPicked' dataIndex = " + $(this).attr('dataIndex') + ">" + imABarAndAddMeToList + "</li>")
                var lat = returnedBarArray[$(this).attr("dataIndex")].barLat
                var long = returnedBarArray[$(this).attr("dataIndex")].barLong

                var X = {
                    lat: lat,
                    long: long
                }

                latLongCoord.push(X)
                initMap()



                //click event that removes bars from the list
                $(".barsPicked").on("click", function () {
                    $(this).remove()
                    console.log($(this).attr("dataIndex"))
                    latLongCoord.splice($(this).attr("dataIndex"))
                    initMap()
                })

            })// end transfer bar to google map marker click event

        })// end ajax then
    })// end search click event
});// close document.ready


/* <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript"> */
// This is our API key
// var weatherAPIKey = "166a433c57516f51dfab1f7edaed8413";
// Here we are building the URL we need to query the database
// var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
    // "q="+searchInput+"&appid=" + weatherAPIKey;
// Here we run our AJAX call to the OpenWeatherMap API

// $(searchInput).ready( function () {
//     // $("#submitSearch").on("click", function (event){
//     // $("#submitSearch").on("click", function (searchInput) {
        
//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     })
//         // We store all of the retrieved data inside of an object called "response"
//         .then(function (response) {
//             // Log the queryURL
//             console.log(queryURL);
//             // Log the resulting object
//             console.log(response);
//             // Transfer content to HTML
//             $(".city").html(" Weather Details");
//             $(".wind").text("Wind Speed: " + response.wind.speed);
//             $(".humidity").text("Humidity: " + response.main.humidity);
//             $(".temp").text("Temperature (F) " + response.main.temp);
//             // Log the data in the console as well
//             console.log("Wind Speed: " + response.wind.speed);
//             console.log("Humidity: " + response.main.humidity);
//             console.log("Temperature (F): " + response.main.temp);
//         });
// // })})
    



