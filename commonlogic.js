$(document).ready(function() {
    var database = firebase.database()
    var initID = ""
    var id = ""
    var idArray = []
    var password = 0
    var idStorage = database.ref('/idStorage')
    var displayArray = database.ref('/displayArray')
    var connection = 0
    
    $(document).on("click", ".create", function(){
        $(".splash-one").attr("style", "visibility: hidden")
        $(".splash-three").attr("style", "visibility: visible")
    })
    
    $(document).on("click", ".join", function(){
        $(".splash-one").attr("style", "visibility: hidden")
        $(".splash-two").attr("style", "visibility: visible")
    })
    
    $(document).on("click", "#new-id", function(){
        initID = ($("#crawl-id").val())
        id = initID.toUpperCase()
        password = Math.random().toString(36).slice(-8)
        connection ++
        idStorage.push({
            CrawlId: id,
            password: password,
        connection: connection,  
      })
      $(".splash-three").attr("style", "visibility: hidden")
      $(".splash-four").attr("style", "visibility: visible")
      $("#display-p-and-id").html("<p>Your Crawl ID = "+initID+"</p><p>Your Password = " + password + "</p>")     
    })

    database.ref('idStorage').on('child_added', function(snap){
        idArray.push(snap.val().CrawlId)
        idArray.sort()
        console.log(idArray)
        $(".crawl-section").empty()
        for (i=0; i<idArray.length; i++){
            $(".crawl-section").append("<p data='"+i+"'>" + idArray[i] + "</p>")
        }
    }, function (errorObject){
        console.log("The read failed:" +errorObject)
    })  
 })