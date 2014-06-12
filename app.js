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
    console.log("debug");
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
  return new Promise(function(resolve, reject){
    var convert = new FFmpeg({ source: inputs.filePath })
      .withSize(inputs.height + "x" + inputs.width)
      .withFps(inputs.framesPerSecond)
      .setStartTime(inputs.startTime)
      .setDuration(inputs.endTime - inputs.startTime)
      .withNoAudio()
      .saveToFile('temp.gif')
      .on('start', function(commandLine) {
          //console.log('Started Processing');
      })
      .on('progress', function(progress) {
          //console.log('Processing: ' + progress.percent + '% done');
          //document.querySelector('#progress-bar').style.width = process.percent;
      })
      .on('error', function(err) {
        reject(Error(err.message));
      })
      .on('end', function() {
        document.querySelector('#progress-bar').style.width = 100;
        document.querySelector('#progress-bar').className = 'ui successful progress';
        resolve('Processing finished!');
      });
  });
}

/**
 * Reads the input values in html and stores to a json object
 * @return json object
 */
function readInputs() {
  return new Promise(function(resolve, reject) {
    var inputs = {
      filePath: '/',
      startTime: 0,
      endTime: 5,
      framesPerSecond: 10,
      height: 100,
      width: 100
    };

    inputs.filePath = document.querySelector('#file').value;
    inputs.startTime = document.querySelector('#start-time').value;
    inputs.endTIme = document.querySelector('#end-time').value;
    inputs.framesPerSecond = document.querySelector('#frames-per-second').value;

    resolve(inputs);
  });
}

/**
 *******************
 * EVENT LISTENERS *
 *******************
 */
document.querySelector('#file').addEventListener("change", function(evt) {
  readFileMetaData(this.value)
    .then(setupTimes);
}, false);

document.querySelector('#start-time').addEventListener("change", function(evt) {
  document.querySelector('#end-time').min = document.querySelector('#start-time').value
}, false);

document.querySelector('#end-time').addEventListener("change", function(evt) {
  document.querySelector('#start-time').max = document.querySelector('#end-time').value;
}, false);

document.querySelector('#start').addEventListener("click", function(evt) {
  readInputs()
    .then(convertVideoToGif)
    .then(debug);
}, false);
