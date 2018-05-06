var detector = null;
$(document).ready(function(){
  // SDK Needs to create video and canvas nodes in the DOM in order to function
  // Here we are adding those nodes a predefined div.
  var divRoot = $("#affdex_elements")[0];
  var width = 640;
  var height = 480;
  var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
  //  var selectedSOng = document.getElementById("selected_song");

  // loads the audio player
  var startPlay = document.getElementById("start");

  // Get the modal
  var modal_pl = document.getElementById('modal-playlist');

  // Get the button that opens the modal
  var pl_add = document.getElementById("add-playlist");

  // Add Song to playlist
  var pl_happy = document.getElementById("happy-pl");
  var pl_lebihindah = document.getElementById("lebihindah-pl");
  var pl_sugar = document.getElementById("sugar-pl");

  // Get the <span> element that closes the modal
  var close_modal = document.getElementsByClassName("close_modal")[0];

  var dps = []; //dataPoints
  var chart = new CanvasJS.Chart("chartContainer", {
      title :{
        text: "Grafik Ketertarikan User"
      },
      axisY :{
        title: "Nilai Ketertarikan",
        includeZero: true
      },
      data  :[{
        type: "splineArea",
        color: "rgba(54,158,173,.7)",
        dataPoints: dps
      }]
  });

   var xVal = 0;
   var yVal = 0;
   var dataLength = 50;

  //Construct a CameraDetector and specify the image width / height and face detector mode.
  detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

  //Enable detection of all Expressions, Emotions and Emojis classifiers.
  detector.detectAllEmotions();
  detector.detectAllExpressions();
  detector.detectAllEmojis();
  detector.detectAllAppearance();

  //Add a callback to notify when the detector is initialized and ready for runing.
  detector.addEventListener("onInitializeSuccess", function() {
    log('#logs', "The detector reports initialized");
    //Display canvas instead of video feed because we want to draw the feature points on it
    startAudioPlayer();
    $("#face_video_canvas").css("display", "block");
    $("#face_video").css("display", "none");
  });

  //Add a callback to notify when camera access is allowed
  detector.addEventListener("onWebcamConnectSuccess", function() {
    log('#logs', "Webcam access allowed");
  });

  //Add a callback to notify when camera access is denied
  detector.addEventListener("onWebcamConnectFailure", function() {
    log('#logs', "webcam denied");
    console.log("Webcam access denied");
  });

  //Add a callback to notify when detector is stopped
  detector.addEventListener("onStopSuccess", function() {
    log('#logs', "The detector reports stopped");
    $("#results").html("");
  });

  //Add a callback to receive the results from processing an image.
  //The faces object contains the list of the faces detected in an image.
  //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
  detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
    $('#results').html("");
    $("#modal").hide();

    //log('#results', "Timestamp: " + timestamp.toFixed(2));
    //log('#results', "Number of faces found: " + faces.length);

    if (faces.length > 0) {

      // log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
      //log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
      //  return val.toFixed ? Number(val.toFixed(0)) : val;
      //}));
       //log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
       //  return val.toFixed ? Number(val.toFixed(0)) : val;
       //}));
      //log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
      drawFeaturePoints(image, faces[0].featurePoints);

      // Primitive UI for happy
      if (faces[0].emotions["joy"]>50) {
        document.getElementById("emotion_result").innerHTML = "Senang"
      }
      else if (faces[0].emotions["sadness"]>50) {
        document.getElementById("emotion_result").innerHTML = "Sedih"
      }
      else if (faces[0].emotions["anger"]>50) {
        document.getElementById("emotion_result").innerHTML = "Marah"
      }
      else if (faces[0].emotions["surprise"]>50) {
        document.getElementById("emotion_result").innerHTML = "Terkejut"
      }
      else if (faces[0].emotions["disgust"]>50) {
        document.getElementById("emotion_result").innerHTML = "Jijik"
      }
      else if (faces[0].emotions["contempt"]>50) {
        document.getElementById("emotion_result").innerHTML = "Jijik"
      }
      else if (faces[0].emotions["fear"]>50) {
        document.getElementById("emotion_result").innerHTML = "Takut"
      }
      else {
        document.getElementById("emotion_result").innerHTML = ""
      }
    }

    dps.push({
        x: parseFloat(timestamp.toFixed(2)),
        y: parseFloat(faces[0].expressions["mouthOpen"])
    });

    console.log(dps);

    if (dps.length > dataLength){
        dps.shift();
    }

    chart.render();
//    startAudioPlayer();
    //    document.getElementById("selected_song").play();
  });

  //Draw the detected facial feature points on the image
  function drawFeaturePoints(img, featurePoints) {
    var contxt = $('#face_video_canvas')[0].getContext('2d');

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    contxt.strokeStyle = "#FFFFFF";
    for (var id in featurePoints) {
      contxt.beginPath();
      contxt.arc(featurePoints[id].x,
        featurePoints[id].y, 2, 0, 2 * Math.PI);
      contxt.stroke();
    }
  }

//  function checkVisibilityOfModal(){
//    if($('#modal').css("display") == 'none') {
////        startAudioPlayer();
//        console.log("audio player started");
//        return true;
//    }
//    else {
//        return false;
//    }
//  }

    // When the user clicks on <span> (x), close the modal
    close_modal.onclick = function() {
        modal_pl.style.display = "none";
    }

    // When the user clicks the button, open the modal
    pl_add.onclick = function() {
        modal_pl.style.display = "block";
        var c_ul = document.createElement("UL");
        c_ul.setAttribute("id","playlist");
        document.getElementById("playlist-content").appendChild(c_ul);
    }

    // Add Song to list of playlist
    pl_happy.onclick = function() {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Happy");

        c_a.setAttribute("href", "/static/songs/happy.mp3");
        c_a.appendChild(list_song);
    }

    pl_lebihindah.onclick = function() {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Lebih Indah");

        c_a.setAttribute("href", "/static/songs/lebih%20indah.mp3");
        c_a.appendChild(list_song);
    }

    pl_sugar.onclick = function() {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Sugar");

        c_a.setAttribute("href", "/static/songs/sugar.mp3");
        c_a.appendChild(list_song);
    }
});

function log(node_name, msg) {
  $(node_name).append("<span>" + msg + "</span><br />")
}

//function executes when Start button is pushed.
function onStart() {
  $("#modal").show();
  if (detector && !detector.isRunning) {
    $("#logs").html("");
    detector.start();
  }
  log('#logs', "Clicked the start button");
}

//function executes when the Stop button is pushed.
function onStop() {
  log('#logs', "Clicked the stop button");
  if (detector && detector.isRunning) {
    detector.removeEventListener();
    detector.stop();
    $("#audioPlayer")[0].pause();
    $("#audioPlayer")[0].currentTime = 0;
  }
  log('#logs', "Audio Stopped");

//  var dwn = document.createElement("a");
//  adown.appendChild(dwn);
//  document.getElementById("download-txt").appendChild(dwn);
//
//  dwn.download = "export.txt";
//  dwn.href = "data:text/plain;base64," + btoa(JSON.stringify(dps));
//  dwn.innerHTML = "download example text";
}

//function executes when the Reset button is pushed.
function onReset() {
  log('#logs', "Clicked the reset button");
  if (detector && detector.isRunning) {
    detector.reset();

    $('#results').html("");
  }
}

function startAudioPlayer(){
    var currentSong = 0;

    $("#audioPlayer")[0].src = $("#playlist li a")[0];
    $("#audioPlayer")[0].play();
    $("#playlist li a").click(function(e){
        e.preventDefault();
        $("#audioPlayer")[0].src = this;
        $("#audioPlayer")[0].play();
        $("#playlist li").removeClass("current-song");
        currentSong = $(this).parent().index();
        $(this).parent().addClass("current-song");
    });

    $("#audioPlayer")[0].addEventListener("ended", function(){
        currentSong++;
        $("#playlist li").removeClass("current-song");
        $("#playlist li:eq("+currentSong+")").addClass("current-song");
        $("#audioPlayer")[0].src = $("#playlist li a")[currentSong].href;
        $("#audioPlayer")[0].play();
    });
}