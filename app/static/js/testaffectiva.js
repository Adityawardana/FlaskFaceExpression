var detector = null;
$(document).ready(function(){
  // SDK Needs to create video and canvas nodes in the DOM in order to function
  // Here we are adding those nodes a predefined div.
  var divRoot = $("#affdex_elements")[0];
  var width = 640;
  var height = 480;
  var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
//  var selectedSOng = document.getElementById("selected_song");

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

    document.getElementById("selected_song").play();
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
    document.getElementById("selected_song").pause();
    document.getElementById("selected_song").currentTime = 0;
  }
  log('#logs', "Audio Stopped");

  var dwn = document.createElement("a");
  adown.appendChild(dwn);
  document.getElementById("download-txt").appendChild(dwn);

  dwn.download = "export.txt";
  dwn.href = "data:text/plain;base64," + btoa(JSON.stringify(dps));
  dwn.innerHTML = "download example text";
};

//function executes when the Reset button is pushed.
function onReset() {
  log('#logs', "Clicked the reset button");
  if (detector && detector.isRunning) {
    detector.reset();

    $('#results').html("");
  }
};