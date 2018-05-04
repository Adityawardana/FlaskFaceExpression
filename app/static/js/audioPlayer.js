        // loads the audio player
        var startPlay = document.getElementById("start");

        // Get the modal
        var modal = document.getElementById('modal-playlist');

        // Get the button that opens the modal
        var pl_add = document.getElementById("add-playlist");

        // Add Song to playlist
        var pl_happy = document.getElementById("happy-pl");
        var pl_lebihindah = document.getElementById("lebihindah-pl");
        var pl_sugar = document.getElementById("sugar-pl");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // Start the audio
        startPlay.onclick = function() {
            audioPlayer();
        }

        // When the user clicks the button, open the modal
        pl_add.onclick = function() {
            modal.style.display = "block";
            var c_ul = document.createElement("UL");
            c_ul.setAttribute("id","playlist");
            document.getElementById("playlist-content").appendChild(c_ul);
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        // Add Song to list of playlist
        pl_happy.onclick = function() {
            pl_add.style.display = "none";
            var node_list = document.createElement("LI");
            document.getElementById("playlist").appendChild(node_list);
            var c_a = document.createElement("A");
            node_list.appendChild(c_a);
            var list_song = document.createTextNode("Happy");

            c_a.setAttribute("href", "happy.mp3");
            c_a.appendChild(list_song);
        }

        pl_lebihindah.onclick = function() {
            pl_add.style.display = "none";
            var node_list = document.createElement("LI");
            document.getElementById("playlist").appendChild(node_list);
            var c_a = document.createElement("A");
            node_list.appendChild(c_a);
            var list_song = document.createTextNode("Lebih Indah");

            c_a.setAttribute("href", "lebih%20indah.mp3");
            c_a.appendChild(list_song);
        }

        pl_sugar.onclick = function() {
            pl_add.style.display = "none";
            var node_list = document.createElement("LI");
            document.getElementById("playlist").appendChild(node_list);
            var c_a = document.createElement("A");
            node_list.appendChild(c_a);
            var list_song = document.createTextNode("Sugar");

            c_a.setAttribute("href", "sugar.mp3");
            c_a.appendChild(list_song);
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        function audioPlayer(){
            var currentSong = 0;
            // var length_sum_playlist = $("#playlist li a").length;
            // var sum_playlist = length_sum_playlist - 1;
            // var played_song = $("#playlist li a")[currentSong];

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
                //var sum_playlist = $("#playlist li a").length;

                $("#playlist li").removeClass("current-song");
                $("#playlist li:eq("+currentSong+")").addClass("current-song");
                $("#audioPlayer")[0].src = $("#playlist li a")[currentSong].href;
                $("#audioPlayer")[0].play();

                // console.log(currentSong);
                // if(currentSong == length_sum_playlist) {
                //   alert("Playlist Has Been Stopped");
                // }
            });

            // console.log(played_song);
            // console.log(length_sum_playlist);
            // console.log(sum_playlist);
            // console.log(currentSong);

            // if (currentSong == sum_playlist) {
            //     alert("wes bar");
            // }
            // $("#audioPlayer")[sum_playlist].addEventListener("ended", function(){
            //   alert("Playlist Has Been Stopped");
            // });
        }