var express=require("express");
var restHandler=require("./restHandle.js");
var config=require("./config.js");
var app=express();

app.set("view engine","ejs");
app.use("images",express.static(__dirname+"/img"));
app.use("/styles",express.static(__dirname + "/styles"));
app.use("/",restHandler);
app.listen(config.port,config.hostname,function(){
    console.log("Server running on http://"+config.hostname+":"+config.port);
});