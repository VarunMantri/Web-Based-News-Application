var express=require("express");
var bodyParser=require("body-parser");
var request=require("request");
var MongoClient=require("mongodb").MongoClient;
var dataBase=require("./models/schema.js");
var config=require("./config.js");
var asyn=require("async");


//making connections with local database
var router=express.Router();

router.use(bodyParser.json());

router.route("/")
.get(function(req,res,next)
{
    var category=req.query.category;
    if (!category)
    {
        category="General" ;       
    }
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
                res.render("searchResults",{parsedData:tempData});
                /*
                asyn.forEachOfSeries(docs[0].data,function(item,key,callback)
                {
                    request(item,function(err,responce,body)
                    {
                       if(err!=true && responce.statusCode==200)
                        {
                            var parsedData=JSON.parse(body);
                            tempData.push(parsedData.articles);
                        }
                       callback();
                    });   
                    
                },
                function (err)
                {
                    if (err)
                    {
                        res.render("errorPage");
                    }
                    else
                    {
                        res.render("searchResults",{parsedData:tempData});
                    }
                });
        
                */
        });});
});

module.exports=router;