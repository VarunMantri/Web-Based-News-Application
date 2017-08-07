//author : Varun Rajiv Mantri
//This is a routes file which handles all the get requests on ('/') route


var express=require("express");
var bodyParser=require("body-parser");
var request=require("request");
var MongoClient=require("mongodb").MongoClient;
var dataBase=require("./models/schema.js");
var config=require("./config.js");
var asyn=require("async");


var router=express.Router();

router.use(bodyParser.json());

//handling the default route
router.route("/")
.get(function(req,res,next)
{
    var category=req.query.category;
    if (!category)
    {
        category="General" ;       
    }
    //connecting to the data base to pull latest news feeds
    MongoClient.connect(config.url,function(err,db){
        if (err) throw err;
        console.log("database connected");
        var collection=db.collection("verifiedURL");
        tempData=[];
        collection.find({'_id':category}).toArray(function(err,docs){
                if(err) throw err;
                docs[0].data.forEach(function(item)
                {
                    tempData.push({'url':item["url"],'title':item["title"],'urlToImage':item["urlToImage"],'description':item["description"]})
                });
                //once the responce is built into JSON formatted list, it is sent to the searchResults.ejs page where 
                //all the data is rendered and sent to clinet browser as a document
                res.render("searchResults",{parsedData:tempData});
        });});
});

module.exports=router;
