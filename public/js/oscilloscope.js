// if (navigator.getUserMedia) {
//    console.log('getUserMedia supported.');
//    navigator.getUserMedia (
//       // constraints - only audio needed for this app
//       {
//          audio: true
//       },
//
//       // Success callback
//       function(stream) {
//          source = audioCtx.createMediaStreamSource(stream);
//          source.connect(analyser);
//       },
//
//       // Error callback
//       function(err) {
//          console.log('The following gUM error occured: ' + err);
//       }
//    );
// } else {
//    console.log('getUserMedia not supported on your browser!');
// }

var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

analyser.getByteTimeDomainData(dataArray);

// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
var canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source
var WIDTH = canvas.width;
var HEIGHT = canvas.height;


var audioElement = document.getElementById("player");
var source = audioCtx.createMediaElementSource(audioElement);

audioElement.addEventListener("canplay", function() {
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  draw();
});

function updateVideoId() {
  audioElement.pause();
  var input = document.getElementById("videoIdInput").value;
  audioElement.src = "audio/?videoId=" + input;
  audioElement.play();
}

function draw() {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = 'rgb(100, 100, 100)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);


  var barWidth = (WIDTH / bufferLength)*8;
  var barHeight;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      canvasCtx.fillStyle = '#AAE000';
      canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

      canvasCtx.fillStyle = '#000000';
      canvasCtx.font = "7px Arial";
      canvasCtx.fillText(barHeight.toFixed(1),x,HEIGHT);

      x += barWidth + 1;
    }

  // canvasCtx.lineWidth = 2;
  // canvasCtx.strokeStyle = 'rgb(100, 0, 0)';
  //
  // canvasCtx.beginPath();
  //
  // var sliceWidth = canvas.width * 1.0 / bufferLength;
  // var x = 0;
  //
  // for (var i = 0; i < bufferLength; i++) {
  //
  //   var v = dataArray[i] / 128.0;
  //   var y = v * canvas.height / 2;
  //
  //   if (i === 0) {
  //     canvasCtx.moveTo(x, y);
  //   } else {
  //     canvasCtx.lineTo(x, y);
  //   }
  //
  //   x += sliceWidth;
  // }
  //
  // canvasCtx.lineTo(canvas.width, canvas.height / 2);
  // canvasCtx.stroke();
};
