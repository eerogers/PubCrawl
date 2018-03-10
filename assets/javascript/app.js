// JavaScript function that wraps everything
//test test deleted?
var myMarkers = { lat: 33.684, lng: -117.82 }

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        //options
        center: { lat: 33.684, lng: -117.82 },
        zoom: 12,
    });
    //markers
    var marker = new google.maps.Marker({
        map: map,
        position: myMarkers,
        title: "Tustin"
    });
}




//fun tion to add dynamic entries for to do list
$(function () {
    var $list, $newItemForm;

    $list = $('ul')
    $newItemForm = $("#newItemForm")

    $newItemForm.on("submit", function (event) {
        event.preventDefault()

        var text = $("#itemField").val()
        $list.append('<li class="barsPicked">' + text + '</li>')
        $('input:text').val('')
    });

    $list.on("click", ".barsPicked", function () {
        $(this).remove()
    })
})



$(document).ready(function () {

    var googlePlacesQueryURL = "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/textsearch/json?query=bars+in+Irvine&key=AIzaSyAh5EasiMiQmQHC_7-rQSPoZkZL1X4rK74"
    var key = "AIzaSyAh5EasiMiQmQHC_7-rQSPoZkZL1X4rK74"

    var resultLat
    var resultLng
    var resultCityName
    var searchParameter

    $.ajax({
        url: googlePlacesQueryURL,
        method: 'GET'
    }).then(function (requestResult) {
for(var i=0;i<requestResult.results.length;i++)
{
        // $("#googleResult").empty()
        $("#googleResult").append(requestResult.results[i].name + "<br>")
        $("#googleResult").append(requestResult.results[i].formatted_address + "<br>")
        $("#googleResult").append("lat: " + requestResult.results[i].geometry.location.lat + "<br>")
        $("#googleResult").append("lng: " + requestResult.results[i].geometry.location.lng + "<br><br>")
}
        // $("#googleResult").append(requestResult.results[1].name + "<br>")
        // $("#googleResult").append(requestResult.results[1].formatted_address + "<br>")
        // $("#googleResult").append("lat: " + requestResult.results[1].geometry.location.lat + "<br>")
        // $("#googleResult").append("lng: " + requestResult.results[1].geometry.location.lng + "<br><br>")

        // $("#googleResult").append(requestResult.results[2].name + "<br>")
        // $("#googleResult").append(requestResult.results[2].formatted_address + "<br>")
        // $("#googleResult").append("lat: " + requestResult.results[2].geometry.location.lat + "<br>")
        // $("#googleResult").append("lng: " + requestResult.results[2].geometry.location.lng + "<br><br>")


        console.log('getResponse', requestResult.results[0].formatted_address)

    })








});  //close document.ready



















