'use strict';

// Module to control application life.
var app = require('app');

// Module to create native browser window.
var BrowserWindow = require('browser-window');
var jade = require('jade');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    // and load the index.html of the app.
    console.log(__dirname + '/views/choose.jade');
    var html = jade.renderFile(__dirname + '/views/choose.jade');
    console.log(html);
    var webPage = 'data:text/html,' + encodeURIComponent(html);
    mainWindow.loadUrl(webPage);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
