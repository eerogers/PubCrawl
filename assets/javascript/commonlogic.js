 // Initialize Firebase
$(document).ready(function() { 
    
var config = {
    apiKey: "AIzaSyCl09xlknVjb5CyhG8vHftZ0DhXQKQ2xxQ",
    authDomain: "pubcrawlappl.firebaseapp.com",
    databaseURL: "https://pubcrawlappl.firebaseio.com",
    projectId: "pubcrawlappl",
    storageBucket: "pubcrawlappl.appspot.com",
    messagingSenderId: "711134769554"
  };
  firebase.initializeApp(config);

    var database = firebase.database()
    var initID = ""
    var id = ""
    var idArray = []
    var password = 0
    var idStorage = database.ref('/idStorage')
    var displayArray = database.ref('/displayArray')
    var guessedID = ""
    var guessID = ""
    var guessedPassword = ""
    var pairedArray = []
    var pairs =[]
    var activeAccount = database.ref('/activeAccount')
    var codedMessages = ""
    var codedSuggestions = ""
    var chatsBox = database.ref('/chatsBox')
    var suggestionsBox = database.ref('/suggestionsBox')
    var crawlSync = ""
    var user = ""
    var suggArray = []
    var deletedSuggestions = database.ref('/deletedSuggestions')
    var deleted = []
   
function mainLoad(){
    console.log("working")
}
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
        console.log(idArray.includes(id))
        if (idArray.includes(id)) {
         $("#redundant").text("That ID already exists, please enter a new name.")
        }
        else {
        password = (Math.random().toString(36).slice(-8)).toUpperCase()
        console.log(password)
        idStorage.push({
            CrawlId: id,
            password: password,
        })
        $("#crawl-id").val("")  
      $(".splash-three").attr("style", "visibility: hidden")
      $(".splash-four").attr("style", "visibility: visible")
      $("#display-p-and-id").html("<p>Your Crawl ID = "+initID+"</p><p>Your Password = " + password + "</p>") 
    }    
    })

    database.ref('idStorage').on('child_added', function(snap){
        idArray.push(snap.val().CrawlId)
        idArray.sort()
        pairedArray.push(snap.val())
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
            activeAccount.push({
                ID: guessID,
            }) 
            window.location = "index.html"
        }
        else {
            $("#incorrect").text("Incorrect login information. Please check your id and password and try again.")
        }
        $("#project-id").val("")
        $("#project-key").val("")
    })

   database.ref('/activeAccount').on('child_added', function(snap){
        crawlSync = snap.val().ID
        $(".jumbotron").text(crawlSync)
    }, function (errorObject){
        console.log("The read failed:" +errorObject)

    })
//chat
     $(document).on("click", "#enter", function(){
        chatsBox.push({
            user: user,
            group: crawlSync,
            message: $("#entry-chat").val()
        })
        $("#entry-chat").val("")
      })
    
    database.ref('/chatsBox').on('child_added', function(snap){
        console.log(snap.val().group)
        if(snap.val().group == crawlSync) {
            $(".chat-box").append("<br>" + snap.val().user + ": " + snap.val().message)
        }
     }, function (errorObject){
         console.log("The read failed:" +errorObject)
     })

     $(document).on("click", "#personalID", function(){
         user = $("#entry-id").val()
         $("#entry-id").val("")
     })

//suggestions
    $(document).on("click", "#add", function(){
        suggestionsBox.push({
            user: user,
            group: crawlSync,
            suggestion: $("#itemField").val(),
            randomID: Math.random().toString(36).slice(-8)
        })
        $("#itemField").val("")
    })
   
    database.ref('/suggestionsBox').on('child_added', function(snap){
        console.log(snap.val().group)
        console.log(deleted.includes(snap.val().suggestion))
        if(snap.val().group == crawlSync) {
            $("#sugs").append("<button class='x-buttons' id='"+snap.val().randomID+"'>X</button><p class='barsPicked' id='"+snap.val().randomID+"' dataIndex ='"+snap.val().randomID+"'>" + snap.val().suggestion + "</li>")
        }
    }, function (errorObject){
        console.log("The read failed:" +errorObject)
    })

    $(document).on("click", ".x-buttons", function(){
        var deleteData = ($(this).attr("id"))
        deletedSuggestions.push({
            group: crawlSync,
            randomID: deleteData
          })
        $(this).remove()
        $("#" + deleteData).remove()
    })

function mainLoad(){
    deletedSuggestions.push({
        group: "x",
        suggestion: "x"
    })
}
    mainLoad()
    database.ref('/deletedSuggestions').on('child_added', function(snap){
        for(i=0;i<deleted.length;i++){
            console.log($("#" + deleted[i]))
            $("#" + deleted[i]).remove()
            $("#" + deleted[i]).remove() //try it here twice to see if that helps with reload problem
        }
        if (snap.val().group == crawlSync){
            deleted.push(snap.val().randomID)
            console.log(deleted)
        }
        }, function (errorObject){
            console.log("The read failed:" +errorObject)
        })
})