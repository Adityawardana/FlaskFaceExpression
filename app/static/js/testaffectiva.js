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
    var graph_result_modal = document.getElementById('modal-result');

    // Get the button that opens the modal
    var pl_add = document.getElementById("add-playlist");
    var formSongKategori = document.querySelector("#kategoriLagu");
    var logSongKategori = document.querySelector("#logKategoriSong");
    var divKategori = document.getElementById("kategoriList");
    var resultKategori = document.getElementById("resultKategori");
    var audio_ctrl = document.getElementById("audio-control");

    // Add Song to playlist
    // --- Pop ---
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
    var pl_selamatPagi = document.getElementById("selamatPagi-pl");
    var pl_semuaTentangKita = document.getElementById("semuaTentangKita-pl");
    var pl_sepertiYangKauMinta = document.getElementById("sepertiYangKauMinta-pl");
    var pl_sugar = document.getElementById("sugar-pl");
    var pl_tetapSemangat = document.getElementById("tetapSemangat-pl");
    var pl_uptownFunk = document.getElementById("uptownFunk-pl");
    var pl_weWillNotGoDown = document.getElementById("weWillNotGoDown-pl");
    var pl_moreThanWords = document.getElementById("moreThanWords-pl");
    var pl_despacito = document.getElementById("despacito-pl");
    var pl_pernah = document.getElementById("pernah-pl");
    var pl_tentangRindu = document.getElementById("tentangRindu-pl");
    var pl_indonesiaRaya = document.getElementById("indonesiaRaya-pl");
    var pl_kembaliPulang = document.getElementById("kembaliPulang-pl");
    var pl_pujaanHati = document.getElementById("pujaanHati-pl");
    var pl_sekaliIniSaja = document.getElementById("sekaliIniSaja-pl");
    var pl_bersamamu = document.getElementById("bersamamu-pl");
    var pl_brightAsTheSun = document.getElementById("brightAsTheSun-pl");
    var pl_attention = document.getElementById("attention-pl");
    var pl_allOfMe = document.getElementById("allOfMe-pl");

    // --- Dangdut ---
    var pl_lagiSyantik = document.getElementById("lagiSyantik-pl");
    var pl_nasiPadang = document.getElementById("nasiPadang-pl");
    var pl_sayang = document.getElementById("sayang-pl");
    var pl_sayang2 = document.getElementById("sayang2-pl");
    var pl_jaranGoyang = document.getElementById("jaranGoyang-pl");
    var pl_ditinggalRabi = document.getElementById("ditinggalRabi-pl");
    var pl_goyangDumang = document.getElementById("goyangDumang-pl");
    var pl_sakitnyaTuhDisini = document.getElementById("sakitnyaTuhDisini-pl");
    var pl_penasaran = document.getElementById("penasaran-pl");
    var pl_darahMuda = document.getElementById("darahMuda-pl");

    // --- Rock ---
    var pl_heaven = document.getElementById("heaven-pl");
    var pl_itsMyLife = document.getElementById("itsMyLife-pl");
    var pl_smellsLikeTeenSpirit = document.getElementById("smellsLikeTeenSpirit-pl");
    var pl_bringMeToLife = document.getElementById("bringMeToLife-pl");
    var pl_sweetChildOfMine = document.getElementById("sweetChildOfMine-pl");
    
    // --- Jazz ---
    var pl_carelessWhisper = document.getElementById("carelessWhisper-pl");
    var pl_feelingGood = document.getElementById("feelingGood-pl");
    var pl_pastiBisa = document.getElementById("pastiBisa-pl");
    var pl_cryMeARiver = document.getElementById("cryMeARiver-pl");
    var pl_sway = document.getElementById("sway-pl");

    // --- Reggae ---
    var pl_santaiSaja = document.getElementById("santaiSaja-pl");
    var pl_welcomeToMyParadise = document.getElementById("welcomeToMyParadise-pl");
    var pl_noWomenNoCry = document.getElementById("noWomenNoCry-pl");
    var pl_kembaliBerdansa = document.getElementById("kembaliBerdansa-pl");
    var pl_diSayidan = document.getElementById("diSayidan-pl");

    // --- Religi ---
    var pl_deenAssalam = document.getElementById("deenAssalam-pl");
    var pl_rapuh = document.getElementById("rapuh-pl");
    var pl_tomboAti = document.getElementById("tomboAti-pl");
    var pl_bilaWaktuTelahBerakhir = document.getElementById("bilaWaktuTelahBerakhir-pl");
    var pl_ramadhan = document.getElementById("ramadhan-pl");


    // Get the <span> element that closes the modal
    var close_modal = document.getElementsByClassName("close_modal")[0];
    var close_modal_result = document.getElementsByClassName("close_modal_result")[0];

    var dps = []; //dataPoints
    var chart = new CanvasJS.Chart("chartContainer", {
        backgroundColor: "#f7f7f7",
        title: {
            text: "Grafik Mouth Open"
        },
        axisY: {
            title: "Nilai Mouth Open",
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
        document.getElementById("log-message").innerHTML = "The detector reports initialized";
        //Display canvas instead of video feed because we want to draw the feature points on it
        startAudioPlayer();
        $("#face_video_canvas").css("display", "block");
        $("#face_video").css("display", "none");
    });

    //Add a callback to notify when camera access is allowed
    detector.addEventListener("onWebcamConnectSuccess", function () {
        log('#logs', "Webcam access allowed");
        document.getElementById("log-message").innerHTML = "Webcam access allowed";
    });

    //Add a callback to notify when camera access is denied
    detector.addEventListener("onWebcamConnectFailure", function () {
        log('#logs', "webcam denied");
        document.getElementById("log-message").innerHTML = "Webcam access denied";
        console.log("Webcam access denied");
    });

    //Add a callback to notify when detector is stopped
    detector.addEventListener("onStopSuccess", function () {
        log('#logs', "The detector reports stopped");
        document.getElementById("log-message").innerHTML = "The detector reports stopped";
        $("#results").html("");
    });

    //Add a callback to receive the results from processing an image.
    //The faces object contains the list of the faces detected in an image.
    //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
    detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
        $('#results').html("");
        document.getElementById("log-message").innerHTML = "The detector is recording";
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
        var sp = $("#playlist li").text();
        var ks = $("#logKategoriSong").text();

        var pushMo = {
            "timestamp": ts,
            "mouthopen": mo,
            "songplaylist": sp,
            "kategorisong": ks
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

        // console.log(dps);
        // console.log(ks);
        // console.log(sp);

        if (dps.length > dataLength) {
            dps.shift();
        }

        chart.render();
    });

    formSongKategori.addEventListener("submit", function(event) {
        divKategori.style.display = "none";
        resultKategori.style.display = "inline";
        pl_add.style.display = "inline-block";
        var data = new FormData(formSongKategori);
        var output = "";
        for (const entry of data) {
          output = entry[1] + "\r";
        };
        logSongKategori.innerText = output;
        event.preventDefault();
    }, false);

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

    // When the user clicks on <span> (x), close the modal
    close_modal_result.onclick = function () {
        graph_result_modal.style.display = "none";
    }

    // When the user clicks the button, open the modal
    pl_add.onclick = function () {
        modal_pl.style.display = "block";
        var c_ul = document.createElement("UL");
        c_ul.setAttribute("id", "playlist");
        document.getElementById("playlist-content").appendChild(c_ul);
    }

    // -------------------- Add Song to list of playlist -----------------------------------
    // --- Pop ---
    pl_akhirnya.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Akhirnya ");

        c_a.setAttribute("href", "/static/songs/akhirnya.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_ayah.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Ayah ");

        c_a.setAttribute("href", "/static/songs/ayah.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_bahagia.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Bahagia ");

        c_a.setAttribute("href", "/static/songs/bahagia.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_benciUntukMencinta.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Benci Untuk Mencinta ");

        c_a.setAttribute("href", "/static/songs/benci%20untuk%20mencinta.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_beritaKepadaKawan.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Berita Kepada Kawan ");

        c_a.setAttribute("href", "/static/songs/berita%20kepada%20kawan.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_bukaSemangatBaru.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Buka Semangat Baru ");

        c_a.setAttribute("href", "/static/songs/buka%20semangat%20baru.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_bukanDiaTapiAku.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Bukan Dia Tapi Aku ");

        c_a.setAttribute("href", "/static/songs/bukan%20dia%20tapi%20aku.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_bunda.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Bunda ");

        c_a.setAttribute("href", "/static/songs/bunda.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_happy.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Happy ");

        c_a.setAttribute("href", "/static/songs/happy.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_lebihIndah.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Lebih Indah ");

        c_a.setAttribute("href", "/static/songs/lebih%20indah.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_manusiaBodoh.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Manusia Bodoh ");

        c_a.setAttribute("href", "/static/songs/manusia%20bodoh.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_selamatPagi.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Selamat Pagi ");

        c_a.setAttribute("href", "/static/songs/selamat%20pagi.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_semuaTentangKita.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Semua Tentang Kita ");

        c_a.setAttribute("href", "/static/songs/semua%20tentang%20kita.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_sepertiYangKauMinta.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Seperti Yang Kau Minta ");

        c_a.setAttribute("href", "/static/songs/seperti%20yang%20kau%20minta.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_sugar.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Sugar ");

        c_a.setAttribute("href", "/static/songs/sugar.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_tetapSemangat.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Tetap Semangat ");

        c_a.setAttribute("href", "/static/songs/tetap%20semangat.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_uptownFunk.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Uptown Funk ");

        c_a.setAttribute("href", "/static/songs/uptown%20funk.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_weWillNotGoDown.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-We Will Not Go Down ");

        c_a.setAttribute("href", "/static/songs/we%20will%20not%20go%20down.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_moreThanWords.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-More Than Words ");

        c_a.setAttribute("href", "/static/songs/more%20than%20words.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_despacito.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Despacito ");

        c_a.setAttribute("href", "/static/songs/despacito.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_pernah.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Pernah ");

        c_a.setAttribute("href", "/static/songs/pernah.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_tentangRindu.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Tentang Rindu ");

        c_a.setAttribute("href", "/static/songs/tentang%20rindu.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_indonesiaRaya.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Indonesia Raya ");

        c_a.setAttribute("href", "/static/songs/indonesia%20raya.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_kembaliPulang.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Kembali Pulang ");

        c_a.setAttribute("href", "/static/songs/kembali%20pulang.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_pujaanHati.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Pujaan Hati ");

        c_a.setAttribute("href", "/static/songs/pujaan%20hati.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_sekaliIniSaja.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Sekali Ini Saja ");

        c_a.setAttribute("href", "/static/songs/sekali%20ini%20saja.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_bersamamu.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Bersamamu ");

        c_a.setAttribute("href", "/static/songs/bersamamu.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_brightAsTheSun.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Bright As The Sun ");

        c_a.setAttribute("href", "/static/songs/bright%20as%20the%20sun.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_attention.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Attention ");

        c_a.setAttribute("href", "/static/songs/attention.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }
    
    pl_allOfMe.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-All Of Me ");

        c_a.setAttribute("href", "/static/songs/all%20of%20me.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }
    
    // --- Dangdut ---
    pl_lagiSyantik.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Lagi Syantik ");

        c_a.setAttribute("href", "/static/songs/lagi%20syantik.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_nasiPadang.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Goyang Nasi Padang ");

        c_a.setAttribute("href", "/static/songs/nasi%20padang.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_sayang.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Sayang ");

        c_a.setAttribute("href", "/static/songs/sayang.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_sayang2.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Sayang 2 ");

        c_a.setAttribute("href", "/static/songs/sayang%202.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_jaranGoyang.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Jaran Goyang ");

        c_a.setAttribute("href", "/static/songs/jaran%20goyang.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_ditinggalRabi.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Ditinggal Rabi ");

        c_a.setAttribute("href", "/static/songs/ditinggal%20rabi.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_goyangDumang.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Goyang Dumang ");

        c_a.setAttribute("href", "/static/songs/goyang%20dumang.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_sakitnyaTuhDisini.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Sakitnya Tuh Disini ");

        c_a.setAttribute("href", "/static/songs/sakitnya%20tuh%20disini.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_penasaran.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Penasaran ");

        c_a.setAttribute("href", "/static/songs/penasaran.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_darahMuda.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Darah Muda ");

        c_a.setAttribute("href", "/static/songs/darah%20muda.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }
    
    // --- Rock ---
    pl_heaven.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Heaven ");

        c_a.setAttribute("href", "/static/songs/heaven.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_itsMyLife.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Its My Life ");

        c_a.setAttribute("href", "/static/songs/its%20my%20life.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_smellsLikeTeenSpirit.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Smells Like Teen Spirit ");

        c_a.setAttribute("href", "/static/songs/smells%20like%20teen%20spirit.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_bringMeToLife.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Bring Me To Life ");

        c_a.setAttribute("href", "/static/songs/bring%20me%20to%20life.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_sweetChildOfMine.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Sweet Child Of Mine ");

        c_a.setAttribute("href", "/static/songs/sweet%20child%20of%20mine.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    // --- Jazz ---
    pl_carelessWhisper.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Careless Whisper ");

        c_a.setAttribute("href", "/static/songs/careless%20whisper.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_feelingGood.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Feeling Good ");

        c_a.setAttribute("href", "/static/songs/feeling%20good.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_pastiBisa.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Pasti Bisa ");

        c_a.setAttribute("href", "/static/songs/pasti%20bisa.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_cryMeARiver.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Cry Me A River ");

        c_a.setAttribute("href", "/static/songs/cry%20me%20a%20river.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_sway.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-sway ");

        c_a.setAttribute("href", "/static/songs/sway.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }
       
    // --- Reggae ---
    pl_santaiSaja.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Santai Saja ");

        c_a.setAttribute("href", "/static/songs/santai%20saja.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_welcomeToMyParadise.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Welcome To My Paradise ");

        c_a.setAttribute("href", "/static/songs/welcome%20to%20my%20paradise.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_noWomenNoCry.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-No Women No Cry ");

        c_a.setAttribute("href", "/static/songs/no%20women%20no%20cry.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_kembaliBerdansa.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Kembali Berdansa ");

        c_a.setAttribute("href", "/static/songs/kembali%20berdansa.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_diSayidan.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Di Sayidan ");

        c_a.setAttribute("href", "/static/songs/di%20sayidan.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    // --- Religi ---    
    pl_deenAssalam.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Deen Assalam ");

        c_a.setAttribute("href", "/static/songs/deen%20assalam.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_rapuh.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Rapuh ");

        c_a.setAttribute("href", "/static/songs/rapuh.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_tomboAti.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Tombo Ati ");

        c_a.setAttribute("href", "/static/songs/tombo%20ati.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }

    pl_bilaWaktuTelahBerakhir.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Bila Waktu Telah Berakhir ");

        c_a.setAttribute("href", "/static/songs/bila%20waktu%20telah%20berakhir.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
    }
    
    pl_ramadhan.onclick = function () {
        pl_add.style.display = "none";
        audio_ctrl.style.display = "block";
        var node_list = document.createElement("LI");
        document.getElementById("playlist").appendChild(node_list);
        var c_a = document.createElement("A");
        node_list.appendChild(c_a);
        var list_song = document.createTextNode("-Ramadhan ");

        c_a.setAttribute("href", "/static/songs/ramadhan.mp3");
        c_a.appendChild(list_song);
        swal('Lagu Telah Ditambahkan');
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
    document.getElementById("log-message").innerHTML = "Button Start is clicked";
}

//function executes when the Stop button is pushed.
function onStop() {
    var graph_result_modal = document.getElementById('modal-result');

    log('#logs', "Clicked the stop button");
    document.getElementById("log-message").innerHTML = "Clicked the stop button";
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
    document.getElementById("log-message").innerHTML = "Clicked reset button";
    location.reload()
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