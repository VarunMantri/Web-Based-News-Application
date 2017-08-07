//author Varun Rajiv Mantri



// Main Server file 

var express=require("express");
var restHandler=require("./restHandle.js");
var config=require("./config.js");
var app=express();

//setting the default view engine as 'ejs'
app.set("view engine","ejs");
app.use("images",express.static(__dirname+"/img"));
//setting up the location information for styles content
app.use("/styles",express.static(__dirname + "/styles"));
//mounting the default route 
app.use("/",restHandler);
//listening on default port 3000 and hostname:localhost
app.listen(config.port,config.hostname,function(){
    console.log("Server running on http://"+config.hostname+":"+config.port);
});
