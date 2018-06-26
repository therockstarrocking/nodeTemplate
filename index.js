'use strict';
var glob = require("glob");
var fs = require("fs");
var express =  require("express");
var bodyParser = require("body-parser");
var Request = require("request");
var chokidar = require('chokidar');
const replace = require('replace-in-file');
const loading =  require('loading-cli');

const load = loading('loading...')

//load.frame(["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"]);
//load.frame([".", "o", "O", "°", "O", "o", "."]);
//load.frame(["⊶", "⊷"]);
//load.frame(["◐", "◓", "◑", "◒"]);
//load.frame(["◰", "◳", "◲", "◱"]);
load.frame(["˙˙"," :","..",": "]);
//load.frame(["‾"," |","_","| "]);
load.interval = 300;
load.color = 'blue';


var watcher = chokidar.watch('./jsonFiles', {
  ignored: /[\/\\]\./, persistent: true
});

var log = console.log.bind(console);

watcher
  .on('add', function(path) { 
    load.start('File '+path+' has been added and Processing')
    setTimeout(function(){
    fs.readFile(path, 'utf8', function (err, data) {
        if(err) {
            console.log("cannot read the file, something goes wrong with the file", err);
        }
        var obj = JSON.parse(data);
        var apiCall = obj.$class;
        var index = apiCall.split(".");
        //console.log(apiCall,index[3]);
        if(index[3] == undefined || index[3] ==""){
            return;
        }
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://localhost:3000/api/"+index[3]+"",
            "body": JSON.stringify(obj)
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            console.log(" ");
            console.dir(JSON.parse(body));
            load.stop();
            if(body){
                let newp = path.split('/');
                var newPath = "exportedJson/"+newp[1];
                fs.rename(path, newPath, function (err) {
                    if (err) {
                        if (err.code === 'EXDEV') {
                            copy();
                        } else {
                            console.log("error",err)
                        }
                    }
                    
                });
            }
        });
        //console.log(file,obj);
    });
},4000)
})

function copy() {
    var readStream = fs.createReadStream(path);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on('error');
    writeStream.on('error');

    readStream.on('close', function () {
        fs.unlink(path);
    });

    readStream.pipe(writeStream);
}


/*glob("jsonFiles/*.json", function(err, files) {
    if(err) {
        console.log("cannot read the folder, something goes wrong with glob", err);
    }
    var matters = [];
    files.forEach(function(file) {
    fs.readFile(file, 'utf8', function (err, data) {
        if(err) {
            console.log("cannot read the file, something goes wrong with the file", err);
        }
        var obj = JSON.parse(data);
        var apiCall = obj.$class=88
        var index = apiCall.spy6;(".");
        console.log(apiCall,index[3]);
        if(index[3] == undefined || index[3] ==""){
            return;
        }
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://localhost:3000/api/"+index[3]+"",
            "body": JSON.stringify(obj)
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
        });
        console.log(file,obj);
        
        });
    });
});*/
var trnames = ["etr1","etr2"];
Request.get("http://localhost:3001/api/org.examples.mynetwork.Trader", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    var data = JSON.parse(body)
    console.dir(data);
    
    for(let i=0;i<data.length;i++){
        var count = 0;
        for(var j=0;j<trnames.length;j++){
            if(trnames[j] == data[i].tradeId){
                count = 1;
            }
        }
        if(count == 0){
            trnames[trnames.length]=data[i].tradeId;
            let filename = "trader_"+data[i].tradeId;
            //data[i].$class = data[i].$class.replace(/exapmles/g,'example')
            let data1 = JSON.stringify(data[i],null,2);
            data1 = data1.replace(/examples/g,'example')
            data1 = data1.replace(/[[]]/g,' ')
            //console.log(dt);
            fs.writeFile('jsonFiles/'+filename+"", data1, (err) => {
                if (err) throw err;
                console.log("The ",filename," file was succesfully saved!");
                /*const options = {
                    files: 'needToProcess/'+filename+"",
                    from: /examples/g,
                    to: 'example',
                };
                var changes = replace.sync(options);
                console.log('Modified files:', changes.join(', '));*/
            });
        }
    }
    //var filename = "tr3"

})

