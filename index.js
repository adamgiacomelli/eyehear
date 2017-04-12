var express = require('express');
var youtubeStream = require('youtube-audio-stream');
var app = express();

var getAudio = function(req, res) {
  console.log("getAudio", req.query);
  var requestUrl = 'http://youtube.com/watch?v=' + req.query.videoId
  try {
    youtubeStream(requestUrl).pipe(res);
  } catch (exception) {
    res.status(500).send(exception)
  }
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/audio/', getAudio);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
