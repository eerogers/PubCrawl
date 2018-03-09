// JavaScript function that wraps everything
//test test deleted?

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        //options
        center: { lat: 33.74585, lng: -117.82617 },
        zoom: 12,
    });
    //markers
    var marker = new google.maps.Marker({
        map: map,
        position: { lat: 33.74585, lng: -117.82617 },
        title: 'Tustin'
    });
}

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

    // var database = firebase.database()
    //







});  //close document.ready



















