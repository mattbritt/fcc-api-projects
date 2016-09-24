//module for little-url microservice

var exports = module.exports = [];

var mongo = require('mongodb').MongoClient;
//var mongoUrl = 'mongodb://' + process.env.ip + ':27017/urls_db'
var mongoUrl = 'mongodb://localhost:27017/urls_db';


exports.newUrl = function(res, newUrl){
//take new url into mongodb, generate shorturl, return json
   
//check if valid url
    var validUrl = require('valid-url');
    if(!validUrl.isUri(newUrl)){                                //valid-url requires http:// in string
        //url invalid
        return {
                'error:':'Wrong url format, make sure you have a valid protocol and real site.'
                }
    }
    
//url is valid    

//connect to db:
    mongo.connect(mongoUrl, function(err, db){
       
       if(err) throw err;
       
       var coll = db.collection('urls');

//check if newUrl exists in database, if so return existing record, else create new record
coll.findOne(
        { original_url: newUrl },
        { _id: false, original_url: true, short_url: true },
        function(err, data){
           if(err) throw err;
           
           if(data == null){                                    //url not in db, create new entry
              getSequence();
           }
           else{                                                //url already in db, return existing entry
              console.log('found newUrl in db');
               res.jsonp({
                            original_url: data.original_url,
                            short_url: 'https://fcc-api-projects-matthewlbritt.c9users.io/little_url/' + data.short_url
                        });
               res.end();
           }
            
        });



//create incremental counter 

function getSequence(){
//implements incrementing sequence numbers, returns next sequence number

    var counters = db.collection('counters');
    
    var sequenceJSON = {
                    '_id': 'urls_db',
                    'seq': 0
                    };
    
    counters.insert( sequenceJSON, function(err, data){
        insertCounter(err, data);
    });

function insertCounter(err, data){
//increments counter    
           if(!err && err.code == 11000){           //11000 == duplicate key
            throw err;
        }
        else{
                counters.findAndModify(
                {_id: 'urls_db'},
                [],
                { $inc: { seq: 1 }},
                { new: true },
                function(err, seqDoc){
                    if(err) throw err;
                    addUrl(newUrl, seqDoc.value.seq);
                });
        }
    }
    
}






function addUrl(longUrl, sequence){
//add urls to db

var hexUrl = sequence.toString(16);             //use hex for shorter address
var insertJSON = {                              
                    'original_url': longUrl,
                    'short_url': hexUrl
                };

coll.insert(insertJSON, function(err, data){
               if(err) throw err;
               else{
                   insertJSON = {               //update json to remove _id field that gets added on insert
                                    original_url: insertJSON.original_url,
                                    short_url: 'https://fcc-api-projects-matthewlbritt.c9users.io/little-url/' + insertJSON.short_url
                                };
                   
                    res.jsonp(insertJSON);
                    res.end();
                    db.close(); 
               } 
            });

}

       
  
    });
    
}


exports.getUrl = function(res, shortUrl){
//lookup shortUrl in mongodb and return full url (will redirect in server.js)    
    
mongo.connect(mongoUrl, function(err, db){
   if(err) throw err;
   
    var coll = db.collection('urls');
    coll.findOne({
                short_url: shortUrl
            },function(err, data){
               if(err) throw err;
               
               if(data == null){
                res.jsonp({'error': 'This url is not in the database'});   
               }
               else{
                res.redirect(data.original_url);
                res.end();
               }
            });
    
});    
    
}




