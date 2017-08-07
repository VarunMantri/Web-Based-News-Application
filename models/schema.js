var mongoose=require("mongoose");
var schema=mongoose.Schema;

var uris=new schema({
    uri:{type:String}
});

var data=new schema(
{
    _id:{type:String},
    data:[uris]
}
);

var mod=mongoose.model("newsData",data);
module.exports=mod;