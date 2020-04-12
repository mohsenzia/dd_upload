var uploadedFiles, uploadIndex = 0, uploadCount = 0, uploadXHR = [], progress = [];
var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    input = document.getElementById('uploadInput'),
    running = false,
    ua = navigator.userAgent.toLowerCase();


$(function () {

    $('#drop-zone-send').on('click', function () {
        $('#uploadInput').trigger('click');
    });

    //Drag & Drop
    $("html").on("dragover drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $('#drop-zone-send').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();

        $("#uploadInput").prop("files", e.originalEvent.dataTransfer.files);
        upload(e.originalEvent.dataTransfer.files);
    });
});

function upload(files) {
    uploadedFiles = files;

    uploadIndex = 0;
    uploadCount = 0;

    $('#process-div').removeClass('hidden');
    $('#dohash-div').removeClass('hidden');
    doIncrementalHash();
}

function doIncrementalHash() {

    chunkSize = 20971520,// read in chunks of 20MB
        chunks = Math.ceil(uploadedFiles[uploadIndex].size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        uniqueId = 'chunk_' + (new Date().getTime()),
        fileReader = new FileReader();

    fileReader.onload = function (e) {

        spark.append(e.target.result); // append array buffer
        currentChunk += 1;

        if (currentChunk < chunks) {
            loadNext();
        } else {
            running = false;
            md5 = spark.end();

            uploadedFiles[uploadIndex]['md5'] = md5;

            uploadIndex++;

            if (uploadIndex >= input.files.length) {
                uploading(uploadedFiles);
            } else
                doIncrementalHash();
        }
    };

    fileReader.onerror = function () {
        running = false;
        console.log('<strong>Oops, something went wrong.</strong>', 'error');
    };

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = start + chunkSize >= uploadedFiles[uploadIndex].size ? uploadedFiles[uploadIndex].size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(uploadedFiles[uploadIndex], start, end));
    }

    running = true;
    loadNext();
}

function uploading(files) {

    $('#dohash-div').addClass('hidden');
    $('#progressbar-div').removeClass('hidden');

    for (i = 0; i < files.length; i++, uploadCount++) {
        file = files[i];

        uploadXHR[i] = new XMLHttpRequest();
        uploadXHR[i].open("POST", 'server.php?do=upload', true);
        uploadXHR[i].setRequestHeader("Content-MD5", file.md5);
        uploadXHR[i].setRequestHeader("Dislay-Name", file.name);
        uploadXHR[i].addEventListener("readystatechange", stateHandler(i), false);
        uploadXHR[i].upload.addEventListener("progress", progressHandler(i), false);
        uploadXHR[i].send(file);

        progress[i] = {bytes: 0};
    }
}

function progressHandler(i) {
    return function (event) {
        if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            percentComplete = parseInt(percentComplete);
            $('.progress-bar').css('width', percentComplete + '%').html(percentComplete + '%');
        }
    }
}

function stateHandler(i) {
    return function (event) {


        if (this.readyState == 4) {
            if (this.status >= 100 && this.status < 400) {
                $('.progress-bar').addClass('bg-success');
                $('#inprogress-text').html('<small style="color: #00c215;">SUCCESS</small>');
                return;

            } else {
                $('.progress-bar').addClass('bg-danger');
                $('#inprogress-text').html('<small style="color: #e9000a">ERROR!</small><br><small>Error Code: ' + this.status + '</small>');
            }

            uploadCount--;
            if (uploadCount == 0) {
                uploadIndex = 0;
                uploadedFiles = [];

                console.log('Upload End');
            }
        } else if (this.readyState == 0) {
            alert('Connetion Failed');
            setTimeout(function () {
                window.location.reload();
            }, 2000);
            console.log(this.status);
        }
    }
}