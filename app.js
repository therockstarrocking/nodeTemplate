var express = require("express");
var fs = require("fs");
var app = express();
var path = require("path");

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname,"app.html"));
})
app.get("/prereqs-ubuntu.sh",function(req, res) {
    var filename = "prereqs-ubuntu.sh";
    var filePath = path.join(__dirname,filename);
    var stat = fs.statSync(filePath);
    var fileToSend = fs.readFileSync(filePath);
    res.set('Content-Type', 'application');
    res.set('Content-Length', stat.size);
    res.set('Content-Disposition', filename);
    res.send(fileToSend);
});

app.listen(8082, function () {
   console.log("Example app listening at http://localhost:8082")
})