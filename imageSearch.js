//module for imageSearch microservice

var exports = module.exports = [];

var mongo = require('mongodb').MongoClient;                           //setup mongo
var mongoUrl = 'mongodb://localhost:27017/urls_db';                     //probably should have given db more generic name

var  cx = '014053609165208983843%3A6tw9ybskcb4';                        //custom search # for google
var apiKey = 'AIzaSyA7xRxsofH5RukLpvndspxV5HZC9A_sj-0';                 //google api key number


exports.doSearch = function(req, res){
//executes search, stashes data in db and returns results 

//check that parameters are valid
if(req.params.imgQuery == null){
    res.jsonp({ 'error': 'no search submitted' });
    res.end;
}

var  query = req.params.imgQuery;

if(req.query.offset != null){                                   
var page = Math.round(req.query.offset);                                //round to int; floats cause crash (and don't make sense)
}
else page = 1;
if(page < 1) page = 1;

//add record to db
addRecord(query);

if(page > 90){                                                           //google custom search api seems to only return ~100 results; need at least 10
    res.jsonp({'error': 'API cannot return page higher than 90; reduce ?offset='});
    res.end;
    return;
}



//make request to google custom search api to get data
var requestUrl = 'https://www.googleapis.com/customsearch/v1?q=' + query + '&cx=' + cx + '&searchType=image&start=' + page + '&key=' + apiKey;

var request = require('request');
request(requestUrl, function(err, response, body){
   if(err) throw err;
   
   var itemsJSON = JSON.parse(response.body);                           //parse to get our data in JSON form
   
   var totalResults = itemsJSON.searchInformation.totalResults;
   
   if(totalResults < page * 10){
       res.jsonp({ 'error': 'offset too high; not enough results for offset', 'totalResults': totalResults});
       res.end();
   }
   
   itemsJSON = itemsJSON.items;                                        //just need items
    
    var items = parseItems(itemsJSON);                                  //helper function to return array of object in correct format

   res.jsonp(items);
   res.end();
    
});



function addRecord(queryStr){
//create record/document and insert into mongodb

//create record
var date = new Date();

var recordJSON = {
                    term: queryStr,
                    when: date.toISOString()
                };

//connect to mongo
mongo.connect(mongoUrl, function(err, db){
    if(err) throw err;
    
    var coll = db.collection('imageSearch');

//insert record, close db    
    coll.insert(recordJSON, function(err){
        if(err) throw err;
        db.close();
    });
 
});
}

function parseItems(itemsJSON){
//take in raw items data and extract just the info we need; returns array of objects ready to be output

var retArray = [];

for(var i = 0; i < itemsJSON.length; i++){
  
    retArray[i] = {
                    url: itemsJSON[i].link,
                    snippet: itemsJSON[i].snippet,
                    thumbnail: itemsJSON[i].image.thumbnailLink,
                    context: itemsJSON[i].image.contextLink
                    };
    }

return retArray;
    
}


}