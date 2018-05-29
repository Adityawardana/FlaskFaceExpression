var detector = null;
$(document).ready(function () {
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
    var pl_akhirnya = document.getElementById("akhirnya-pl");
    var pl_ayah = document.getElementById("ayah-pl");
    var pl_bahagia = document.getElementById("bahagia-pl");
    var pl_benciUntukMencinta = document.getElementById("benciUntukMencinta-pl");
    var pl_beritaKepadaKawan = document.getElementById("beritaKepadaKawan-pl");
    var pl_bukaSemangatBaru = document.getElementById("bukaSemangatBaru-pl");
    var pl_bukanDiaTapiAku = document.getElementById("bukanDiaTapiAku-pl");
    var pl_bunda = document.getElementById("bunda-pl");
    var pl_happy = document.getElementById("happy-pl");
    var pl_lebihIndah = document.getElementById("lebihIndah-pl");
    var pl_manusiaBodoh = document.getElementById("manusiaBodoh-pl");
    var pl_pastiBisa = document.getElementById("pastiBisa-pl");
    var pl_santaiSaja = document.getElementById("santaiSaja-pl");
    var pl_selamatPagi = document.getElementById("selamatPagi-pl");
    var pl_semuaTentangKita = document.getElementById("semuaTentangKita-pl");
    var pl_sepertiYangKauMinta = document.getElementById("sepertiYangKauMinta-pl");
    var pl_sugar = document.getElementById("sugar-pl");
    var pl_tetapSemangat = document.getElementById("tetapSemangat-pl");
    var pl_uptownFunk = document.getElementById("uptownFunk-pl");
    var pl_weWillNotGoDown = document.getElementById("weWillNotGoDown-pl");

    // Get the <span> element that closes the modal
    var close_modal = document.getElementsByClassName("close_modal")[0];

    var dps = []; //dataPoints
    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Grafik Ketertarikan User"
        },
        axisY: {
            title: "Nilai Ketertarikan",
            includeZero: true
        },
        data: [{
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
    detector.addEventListener("onInitializeSuccess", function () {
        log('#logs', "The detector reports initialized");
        //Display canvas instead of video feed because we want to draw the feature points on it
        startAudioPlayer();
        $("#face_video_canvas").css("display", "block");
        $("#face_video").css("display", "none");
    });

    //Add a callback to notify when camera access is allowed
    detector.addEventListener("onWebcamConnectSuccess", function () {
        log('#logs', "Webcam access allowed");
    });

    //Add a callback to notify when camera access is denied
    detector.addEventListener("onWebcamConnectFailure", function () {
        log('#logs', "webcam denied");
        console.log("Webcam access denied");
    });

    //Add a callback to notify when detector is stopped
    detector.addEventListener("onStopSuccess", function () {
        log('#logs', "The detector reports stopped");
        $("#results").html("");
    });

    //Add a callback to receive the results from processing an image.
    //The faces object contains the list of the faces detected in an image.
    //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
    detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
        $('#results').html("");
        $("#modal").hide();

        if (faces.length > 0) {
            drawFeaturePoints(image, faces[0].featurePoints);
        }

        dps.push({
            x: parseFloat(timestamp.toFixed(2)),
            y: parseFloat(faces[0].expressions["mouthOpen"])
        });

        var ts = timestamp.toFixed(2);
        var mo = faces[0].expressions["mouthOpen"];

        var pushMo = {
            "timestamp": ts,
            "mouthopen": mo
        }

        $.ajax({
            url: "/mouthOpen",
            type: "POST",
            data: JSON.stringify(pushMo),
            contentType: "application/json",
            dataType: 'json',
            success: function (msg) {
                console.log(msg)
            },
            error: function (err) {
                console.log(err)
            }
        });

        console.log(dps);

        if (dps.length > dataLength) {
            dps.shift();
        }

        chart.render();
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

    // When the user clicks on <span> (x), close the modal
    close_modal.onclick = function () {
        modal_pl.style.display = "none";
    }

    // When the user clicks the button, open the modal
    pl_add.onclick = function () {
        modal_pl.style.display = "block";
        var c_ul = document.createElement("UL");
        c_ul.setAttribute("id", "playlist");
        document.getElementById("playlist-content").appendChild(c_ul);
    }

    // -------------------- Add Song to list of playlist -----------------------------------
    pl_akhirnya.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Akhirnya");

        c_a.setAttribute("href", "/static/songs/akhirnya.mp3");
        c_a.appendChild(list_song);
    }

    pl_ayah.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Ayah");

        c_a.setAttribute("href", "/static/songs/ayah.mp3");
        c_a.appendChild(list_song);
    }

    pl_bahagia.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Bahagia");

        c_a.setAttribute("href", "/static/songs/bahagia.mp3");
        c_a.appendChild(list_song);
    }

    pl_benciUntukMencinta.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Benci Untuk Mencinta");

        c_a.setAttribute("href", "/static/songs/benci%20untuk%20mencinta.mp3");
        c_a.appendChild(list_song);
    }

    pl_beritaKepadaKawan.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Berita Kepada Kawan");

        c_a.setAttribute("href", "/static/songs/berita%20kepada%20kawan.mp3");
        c_a.appendChild(list_song);
    }

    pl_bukaSemangatBaru.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Buka Semangat Baru");

        c_a.setAttribute("href", "/static/songs/buka%20semangat%20baru.mp3");
        c_a.appendChild(list_song);
    }

    pl_bukanDiaTapiAku.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Bukan Dia Tapi Aku");

        c_a.setAttribute("href", "/static/songs/bukan%20dia%20tapi%20aku.mp3");
        c_a.appendChild(list_song);
    }

    pl_bunda.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Bunda");

        c_a.setAttribute("href", "/static/songs/bunda.mp3");
        c_a.appendChild(list_song);
    }

    pl_happy.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Happy");

        c_a.setAttribute("href", "/static/songs/happy.mp3");
        c_a.appendChild(list_song);
    }

    pl_lebihIndah.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Lebih Indah");

        c_a.setAttribute("href", "/static/songs/lebih%20indah.mp3");
        c_a.appendChild(list_song);
    }

    pl_manusiaBodoh.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Manusia Bodoh");

        c_a.setAttribute("href", "/static/songs/manusia%20bodoh.mp3");
        c_a.appendChild(list_song);
    }

    pl_pastiBisa.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Pasti Bisa");

        c_a.setAttribute("href", "/static/songs/pasti%20bisa.mp3");
        c_a.appendChild(list_song);
    }

    pl_santaiSaja.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Santai Saja");

        c_a.setAttribute("href", "/static/songs/santai%20saja.mp3");
        c_a.appendChild(list_song);
    }

    pl_selamatPagi.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Selamat Pagi");

        c_a.setAttribute("href", "/static/songs/selamat%20pagi.mp3");
        c_a.appendChild(list_song);
    }

    pl_semuaTentangKita.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Semua Tentang Kita");

        c_a.setAttribute("href", "/static/songs/semua%20tentang%20kita.mp3");
        c_a.appendChild(list_song);
    }

    pl_sepertiYangKauMinta.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Seperti Yang Kau Minta");

        c_a.setAttribute("href", "/static/songs/seperti%20yang%20kau%20minta.mp3");
        c_a.appendChild(list_song);
    }

    pl_sugar.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Sugar");

        c_a.setAttribute("href", "/static/songs/sugar.mp3");
        c_a.appendChild(list_song);
    }

    pl_tetapSemangat.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Tetap Semangat");

        c_a.setAttribute("href", "/static/songs/tetap%20semangat.mp3");
        c_a.appendChild(list_song);
    }

    pl_uptownFunk.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("Uptown Funk");

        c_a.setAttribute("href", "/static/songs/uptown%20funk.mp3");
        c_a.appendChild(list_song);
    }

    pl_weWillNotGoDown.onclick = function () {
        pl_add.style.display = "none";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("We Will Not Go Down");

        c_a.setAttribute("href", "/static/songs/we%20will%20not%20go%20down.mp3");
        c_a.appendChild(list_song);
    }
    // ----------------------------- end of add playlist ---------------------------------------
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
    var graph_result_modal = document.getElementById('modal-result');

    log('#logs', "Clicked the stop button");
    if (detector && detector.isRunning) {
        detector.removeEventListener();
        detector.stop();
        $("#audioPlayer")[0].pause();
        $("#audioPlayer")[0].currentTime = 0;
    }
    graph_result_modal.style.display = "block";
    log('#logs', "Audio Stopped");
}

//function executes when the Reset button is pushed.
function onReset() {
    log('#logs', "Clicked the reset button");
    if (detector && detector.isRunning) {
        detector.reset();

        $('#results').html("");
    }
}

function startAudioPlayer() {
    var currentSong = 0;

    $("#audioPlayer")[0].src = $("#playlist li a")[0];
    $("#audioPlayer")[0].play();
    $("#playlist li a").click(function (e) {
        e.preventDefault();
        $("#audioPlayer")[0].src = this;
        $("#audioPlayer")[0].play();
        $("#playlist li").removeClass("current-song");
        currentSong = $(this).parent().index();
        $(this).parent().addClass("current-song");
    });

    $("#audioPlayer")[0].addEventListener("ended", function () {
        currentSong++;
        $("#playlist li").removeClass("current-song");
        $("#playlist li:eq(" + currentSong + ")").addClass("current-song");
        $("#audioPlayer")[0].src = $("#playlist li a")[currentSong].href;
        $("#audioPlayer")[0].play();
    });
}