<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="assets/style.css" rel="stylesheet">

    <title>Mz_Upload</title>
</head>

<body>

<div class="row container ">
    <div class="abrino-send-back row col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-12">

        <input class="hidden" type="file" name="file" id="uploadInput" onchange="upload(this.files)"/>
        <div class="col-md-6" id="drop-zone-send">
            <div class="vcenter">
                <p>
                    <svg id="plus" viewBox="0 0 24 24">
                        <g fill="currentColor" fill-rule="evenodd">
                            <path fill-rule="nonzero" d="M12 22.667c5.891 0 10.667-4.776 10.667-10.667S17.89 1.333 12 1.333 1.333 6.11 1.333 12 6.11 22.667 12 22.667zM12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z"></path>
                            <path d="M11.143 6v5.143H6v1.714h5.143V18h1.714v-5.143H18v-1.714h-5.143V6z"></path>
                        </g>
                    </svg>
                </p>
                <br>
                <p><b>Drag and Drop file here</b></p>
                <p>Or Click Button</p>
                <br>
                <button class="btn btn-primary">Choose File</button>
            </div>
        </div>

        <div id="process-div" class="hidden">
            <div id="dohash-div" class="text-center vcenter hidden">
                <img src="assets/ajax.gif">
                <h4>Preparing file...</h4>
            </div>

            <div id="progressbar-div" class="vcenter hidden">
                <div class="progress">
                    <div style="width: 0" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
                <h4 id="inprogress-text">Please Wait...</h4>
            </div>
        </div>

    </div>
</div>

<script src="assets/jq.js"></script>
<script src="assets/sparkmd5.js"></script>
<script src="assets/script.js"></script>

</body>
</html>