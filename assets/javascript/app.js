// JavaScript function that wraps everything
//test test deleted?

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
var latLongCoord = [{
    lat: 0, long: 0
},
{
    lat: 0, long: 0
}]

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
        searchInput = $("#searchLocation").val().trim()
        console.log(searchInput)


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

                var lat = requestResult.results[i].geometry.location.lat
                var long = requestResult.results[i].geometry.location.lng

                barObj.barLat = lat
                barObj.barLong = long

                latLongCoord.push(X)
                returnedBarArray.push(barObj)

            }
            newCenterLat = returnedBarArray[0].barLat
            newCenterLong = returnedBarArray[0].barLong
            initMap()

            console.log('returnedBay Array: ', returnedBarArray)
            $("#googleResult").html("")
            for (var x = 0; x < returnedBarArray.length; x++) {
                $("#googleResult").append("<span class='addMeToCrawl' dataIndex = " + returnedBarArray[x].barIndex + ">"+markerLabels[x]+"</span><br><br>" + returnedBarArray[x].barLink + "<br>" + returnedBarArray[x].barAddress + "<br>" + returnedBarArray[x].barIndex + "<br>" + returnedBarArray[x].barLat + "<br>" + returnedBarArray[x].barLong + "<br><br>")
            }

            //Click event that transfers bar search results as a google map marker
            $(".addMeToCrawl").on("click", function () {
                console.log("Hello, I'm index#" + $(this).attr("dataIndex"))
                console.log("Hello, address is #" + returnedBarArray[$(this).attr("dataIndex")].barAddress)
                var imABarAndAddMeToList = returnedBarArray[$(this).attr("dataIndex")].barName
                console.log("Bar To Add: " + imABarAndAddMeToList)
                $('ul').append('<li class="barsPicked">' + imABarAndAddMeToList + '</li>')
               
               //click event that removes bars from the list
                $(".barsPicked").on("click", function () {
                    $(this).remove()
                })
                
            })// end transfer bar to google map marker click event
            
        })// end ajax then
    })// end search click event
});// close document.ready

   





















