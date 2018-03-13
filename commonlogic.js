$(document).ready(function() {
    var database = firebase.database()
    var initID = ""
    var id = ""
    var idArray = []
    var password = 0
    var idStorage = database.ref('/idStorage')
    var displayArray = database.ref('/displayArray')
    var connection = 0
    var guessedID = ""
    var guessID = ""
    var guessedPassword = ""
    var pairedArray = []
    var pairs =[]
    
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
        password = (Math.random().toString(36).slice(-8)).toUpperCase()
        console.log(password)
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
        pairedArray.push(snap.val())
        //for(i=0; i<pairedArray.length; i++){
        //console.log(pairedArray[i].password)
        //}
    //    console.log(idArray)
        $(".crawl-section").empty()
        for (i=0; i<idArray.length; i++){
            $(".crawl-section").append("<p data='"+i+"'>" + idArray[i] + "</p>")
        }
    }, function (errorObject){
        console.log("The read failed:" +errorObject)
    })
    
    $(document).on("click", "#key-info", function(){
        guessedPassword = ($("#project-key").val()).toUpperCase()
        console.log(guessedPassword)
        guessedID = $("#project-id").val()
        guessID = guessedID.toUpperCase()
        console.log(guessedPassword)
        console.log(guessID)
        for (i=0; i<pairedArray.length; i++){
            pairs.push(pairedArray[i].CrawlId + pairedArray[i].password)
        }
        console.log(pairs)
        console.log(pairs.includes(guessID + guessedPassword))
        if (pairs.includes(guessID + guessedPassword)) {
            window.location = "index.html"
        }
        else {
            $("#incorrect").text("Incorrect login information. Please check your id and password and try again.")
        }
    console.log(guessID + guessedPassword)
    })

 })