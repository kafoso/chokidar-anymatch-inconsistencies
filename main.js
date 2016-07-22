'use strict';

var chokidar = require('chokidar');
var anymatch = require('anymatch');

var ignored = [
    'example'
];

chokidar
    .watch('.', {ignored: ignored})
    .on('ready', function(){
        console.log("ready 1");
        this.on('change', function(path){
            path = path.replace(/\\/, '/'); // Windows love
            console.log("change 1");
            console.log("path: " + path);
            console.log("anymatch:", anymatch(ignored, path)); // = false
        });
    });
chokidar
    .watch('.') // No ignored option here
    .on('ready', function(){
        console.log("ready 2");
        this.on('change', function(path){
            path = path.replace(/\\/, '/'); // Windows love
            console.log("change 2");
            console.log("path: " + path);
            console.log("anymatch:", anymatch(ignored, path)); // = false
        });
    });

/*
Saving example/foo.txt will output:

    change 2
    path: example/foo.txt
    anymatch: false

Since "change 1" never happened, we know that chokidar is definitely ignoring the file. However, in "change 2", we can
see that the anymatch logic produces false, meaning chokidar should NOT have ignored the file and we SOULD have seen the
"change 1" event occur. That is if chokidar truly follows pure anymatch logic. Something is up...
*/
