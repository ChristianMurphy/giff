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
    FFmpeg.ffprobe(path, function(err, metadata) {
      resolve(metadata);
    });
  });
}

function setupTimes(metadata) {
  return new Promise(function(resolve, reject) {
    document.querySelector('#end-time').max = parseInt(metadata.format.duration, 10);
    document.querySelector('#end-time').value = parseInt(metadata.format.duration, 10);
    resolve(metadata);
  });
}

/**
 * Used to intercept the output of a promise, print the value, then continue
 * @param object output of previews command
 */
function debug(object) {
  return new Promise(function(resolve, reject){
    console.log("debug")
    console.log(object);
    resolve(object);
  });
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
        reject(Error(err.message));
      })
      .on('end', function() {
        resolve('Processing finished !');
      })
      .saveToFile('temp.gif');
  });
}

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
    resolve(inputs);
  });
}

/**
 *******************
 * EVENT LISTENERS *
 *******************
 */
document.querySelector('#file').addEventListener("change", function(evt) {
  readFileMetaData(this.value).then(debug).then(setupTimes);
}, false);

document.querySelector('#start-time').addEventListener("change", function(evt) {
  document.querySelector('#end-time').min = document.querySelector('#start-time').value
}, false);

document.querySelector('#end-time').addEventListener("change", function(evt) {
  document.querySelector('#start-time').max = document.querySelector('#end-time').value;
}, false);

document.querySelector('#start').addEventListener("click", function(evt) {
  convertVideoToGif(document.querySelector('#file').value);
}, false);
