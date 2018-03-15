
// ICU coordinates as a starting point
var startLat = 33.6490513251
var startLong = -117.8434728082
var newCenterLat = startLat
var newCenterLong = startLong

var searchInput  //holds city input search value
var googlePlacesQueryURL  //holds query for ajax call
var returnedBarArray = []  //holds results of bars after search

//object to hold lat,long coordinates
var coord = {
    lat: 0,
    long: 0
}

//to hold aray of coord.  to be used by function initmap() in plotting flags in map
var latLongCoord = []

//google maps function to plot flags in map
function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: new google.maps.LatLng(newCenterLat, newCenterLong)
    });

    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var labelIndex = 0

    for (var i = 0; i < latLongCoord.length; i++) {
        var coords = latLongCoord[i]
        console.log("langLongCoord in initmap()= "+coords.lat+" latLongCoord.length: "+latLongCoord.length)
        var latLng = new google.maps.LatLng(coords.lat, coords.long);

        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            label: labels[i]
            // label: labels[labelIndex++ % labels.length]
        })
    }
}

// JavaScript function that wraps everything
$(document).ready(function () {
    
    // click event on search via city.  this click even triggers everything
    $("#submitSearch").on("click", function (event) {
        event.preventDefault();
        
        //initialize
        $("#barsPicked").empty()
        returnedBarArray = [] 

        searchInput = $("#searchLocation").val().trim()

        //querystring for google maps api
        googlePlacesQueryURL = "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/textsearch/json?query=bars+in+" + searchInput + "&key=AIzaSyAh5EasiMiQmQHC_7-rQSPoZkZL1X4rK74"
        var key = "AIzaSyAh5EasiMiQmQHC_7-rQSPoZkZL1X4rK74"

        // not needed?------------------------
        // var resultLat
        // var resultLng
        // var resultCityName
        // var searchParameter
        // var markerLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        //----------------------------

        //ajax call for google maps places
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
                    barRating:'',
                    barLink: '',
                    barLat: '',
                    barLong: '',
                    barIndex: 0,
                    barPhoto: ''
                }

                //this code block gets values from the JSON file.  barObj properties and objects pushed into returnedBarArray.  
                barObj.barName = requestResult.results[i].name
                barObj.barAddress = requestResult.results[i].formatted_address
                barObj.barRating = requestResult.results[i].rating

                var incorrectBarLinkNameWrong = requestResult.results[i].photos[0].html_attributions[0]
                var index = incorrectBarLinkNameWrong.indexOf('>')
                var barLinkAddressOnly = incorrectBarLinkNameWrong.substr(3,index-3)
                
                var newBarLinkValue = "<a target='_blank' "+barLinkAddressOnly+">"+barObj.barName+"</a>"

                barObj.barLink = newBarLinkValue
                barObj.barIndex = i
                
                barObj.barPhoto = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photoreference="+requestResult.results[i].photos[0].photo_reference+"&key=AIzaSyAh5EasiMiQmQHC_7-rQSPoZkZL1X4rK74"
                                
                var lat = requestResult.results[i].geometry.location.lat
                var long = requestResult.results[i].geometry.location.lng

                barObj.barLat = lat
                barObj.barLong = long            

                returnedBarArray.push(barObj)

            }
            
            //sets new center map point.  used by initmap()
            newCenterLat = returnedBarArray[0].barLat
            newCenterLong = returnedBarArray[0].barLong
           
            initMap() //reinitialize - empty map

            //debug
            //console.log('returnedBay Array: ', returnedBarArray)

            //this code block empties the results section in the html, then appends the results
            $("#googleResult").empty()
            for (var x = 0; x < returnedBarArray.length; x++) {
                $("#googleResult").append("<span class='addMeToCrawl' dataIndex = " + returnedBarArray[x].barIndex + ">Add_Me_Icon_Here</span><br><img src='" + returnedBarArray[x].barPhoto+"'><br>"+returnedBarArray[x].barName+"<br>"+returnedBarArray[x].barRating + "<br>" + returnedBarArray[x].barAddress + "<br>" + returnedBarArray[x].barIndex + "<br><br>")
            }

            //Click event that transfers bar search results as a google map marker and to pub list
            $(".addMeToCrawl").on("click", function () {
                var imABarAndAddMeToList = returnedBarArray[$(this).attr("dataIndex")].barName
               
                //append to Suggested Bar List
    //------> this is the place where items are added to a list
                $('#sugs').append("<li class='barsPicked' dataIndex = " + $(this).attr('dataIndex') + ">" + imABarAndAddMeToList + "</li>")
        
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
                $(document.body).on("click", ".barsPicked",function () {
                    $(this).remove()
                    
                    latLongCoord.splice($(this).attr("dataIndex"),1)
                    console.log("remove click event - index: "+latLongCoord.length)
                    
                    initMap()
                })

            })// end transfer bar to google map marker click event

        })// end ajax then
    })// end search click event
});// close document.ready























