/**
 ************
 * PACKAGES *
 ************
 */
var FFmpeg = require('fluent-ffmpeg');
var Promise = require('es6-promise').Promise;

/**
 *************
 * FUNCTIONS *
 *************
 */

/**
 * Reads in the meta data from a file
 * @param path to the file to be analyzed
 */
function readFileMetaData(path) {
  return new Promise(function(resolve, reject) {
    console.log("promise running");
    FFmpeg.ffprobe(this.value, function(err, metadata) {
      resolve(metadata);
    });
  });
}

function setUpTimeRangeSlider(metadata) {
  console.log("setting up");
  endTime = parseInt(metadata.format.duration, 10);
  $( "#time-range" ).slider({
    range: true,
    min: 0,
    max: endTime,
    values: [ 0, endTime ],
    slide: updateTimeRangeSlider
  });
}

function setUpTimeRangeSlider(event, ui) {
  $( "#time-detail" )
    .val( ui.values[ 0 ] + " " + ui.values[ 1 ] );
}

function convertVideoToGif(path) {
  return new Promise(function(resolve, reject){
    var convert = new FFmpeg({ source: path })
      .withSize('320x240')
      .withFps(24)
      .setStartTime(120)
      .setDuration(120)
      .on('start', function(commandLine) {
          console.log('Spawned FFmpeg with command: ' + commandLine);
      })
      .on('progress', function(progress) {
          console.log('Processing: ' + progress.percent + '% done');
      })
      .on('error', function(err) {
        reject('An error occurred: ' + err.message);
      })
      .on('end', function() {
        resolve('Processing finished !');
      })
      .saveToFile('temp.gif');
  });
}

/**
 *******************
 * EVENT LISTENERS *
 *******************
 */
document.querySelector('#file').addEventListener("change", function(evt) {
  readFileMetaData(this.value).then(setUpTimeRangeSlider);
}, false);

document.querySelector('#start').addEventListener("click", function(evt) {
  convertVideoToGif(document.querySelector('#file').value);
}, false);
