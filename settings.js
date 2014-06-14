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
 * @return file metadata
 */
function readFileMetaData(path) {
  return new Promise(function(resolve, reject) {
    FFmpeg.ffprobe(path, function(err, metadata) {
      resolve(metadata);
    });
  });
}

/**
 * takes the end time from meta data and applies as max for input
 * @param metadata information about the video from ffmpeg
 * @return file metadata
 */
function setupTimes(metadata) {
  return new Promise(function(resolve, reject) {
    document.querySelector('#end-time').max = parseInt(metadata.format.duration, 10);
    document.querySelector('#end-time').value = parseInt(metadata.format.duration, 10);
    resolve(metadata);
  });
}

/**
 * Used to intercept the output of a promise, print the value, then continue
 * @param object output of previous command
 * @return the same object input
 */
function debug(object) {
  return new Promise(function(resolve, reject){
    console.log(object);
    resolve(object);
  });
}

/**
 * takes in a set of inputs and uses then to configure ffmpeg for conversion
 * @param inputs from the ui
 * @return success string
 */
function convertVideoToGif(inputs) {
  return new Promise(function(resolve, reject) {
    var convert = new FFmpeg({ source: sessionStorage.file })
      .withSize(inputs.sizePercentage + '%')
      .withFps(inputs.framesPerSecond)
      .setStartTime(inputs.startTime)
      .setDuration(inputs.endTime - inputs.startTime)
      .withNoAudio()
      .saveToFile('temp.gif')
      .on('error', function(err) {
        window.location = 'failure.html';
        reject();
      })
      .on('end', function() {
        window.location = 'success.html';
        resolve();
      });
  });
}

/**
 * Reads the input values in html and stores to a json object
 * @return json object
 */
function readHTMLInputs() {
  return new Promise(function(resolve, reject) {
    var inputs = {
      startTime: 0,
      endTime: 100,
      framesPerSecond: 15,
      sizePercentage: 100
    };

    inputs.startTime = document.querySelector('#start-time').value;
    inputs.endTime = document.querySelector('#end-time').value;
    inputs.framesPerSecond = document.querySelector('#frames-per-second').value;
    inputs.sizePercentage = document.querySelector('#size-percentage').value;

    resolve(inputs);
  });
}

/**
 *******************
 * EVENT LISTENERS *
 *******************
 */
 window.onload = function () {
   readFileMetaData(sessionStorage.file)
     .then(setupTimes);
 };

document.querySelector('#start-time').addEventListener("change", function(evt) {
  document.querySelector('#end-time').min = document.querySelector('#start-time').value;
}, false);

document.querySelector('#end-time').addEventListener("change", function(evt) {
  document.querySelector('#start-time').max = document.querySelector('#end-time').value;
}, false);

document.querySelector('#start').addEventListener("click", function(evt) {
  readHTMLInputs()
    .then(convertVideoToGif);
}, false);
