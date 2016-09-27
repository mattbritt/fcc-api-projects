var port = 8080;                                            //server port 8080

var express = require('express');                           //setup express
var app = express();            

app.set('view engine', 'pug');                              //use pug

app.get('/', function(req, res){
// render landing page


//example json for timestamp:
   var timestamp_ob = {'unix': 1450137600,
             'natural': "December 15, 2015" };

//example json for whoami:
    var whoami_ob = {"ipaddress":"24.155.221.251",
                    "language":"en-US",
                    "software":"Windows NT 10.0; Win64; x64"};
                    
//example json for little-url:
    var littleUrl_ob = {
                            original_url: 'http://www.google.com',
                            short_url: 'https://fcc-api-projects-matthewlbritt.c9users.io/little-url/3'
                        };

//example json for imageSearch:
    var imageSearch_ob = {
                            url: "http://www.lolcats.com/images/u/07/22/lolcatsdotcomib5v9oe8urvsgmh0.jpg",
                            snippet: "But...but.",
                            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQglV4aDos7gGBZjy24XaqKNyKWtwF4SuzQpedertobFUYqKMxKOndy5bk",
                            context: "http://www.lolcats.com/page-3.html"
                        };
                        
//example json for /latest/imageSearch/:
    var imageSearchLatest_ob = {
                                term: "lol cats funny",
                                when: "2016-09-24T23:44:59.411Z"  
                              };

             
   res.render('index',
        {   
            timestamp: JSON.stringify( timestamp_ob ),
            whoami: JSON.stringify( whoami_ob ),
            littleUrlJson: JSON.stringify( littleUrl_ob ),
            imageSearch: JSON.stringify( imageSearch_ob ),
            imageSearchLatest: JSON.stringify( imageSearchLatest_ob )
        }); 
    
});

app.get('/timestamp/:dateStr', function(req, res){
//timestamp service (reachable at'/timestamp')

    var ts = require('./timestamp');                            //use timestamp.js module for logic
    res.jsonp(ts(req.params.dateStr));
    
    res.end();
});


app.get('/whoami/', function(req, res){
//request header parser will live at /whoami/

    var whoami = require('./whoami');                           //use whoami.js module for logic
    res.jsonp(whoami(req)); 
    
    res.end();
});


app.get('/little-url/new/:newUrl(*)', function(req, res){
//little-url microservice (add new url)

    var newUrl = req.params.newUrl; 
    
    var littleUrl = require('./little-url');
    littleUrl.newUrl(res, newUrl);
 
});

app.get('/little-url/:shortUrl', function(req, res){
//little-url microservice (redirect based on short irl)   

    var shortUrl = req.params.shortUrl;

    var littleUrl = require('./little-url');
    littleUrl.getUrl(res, shortUrl);
   
});

app.get('/imagesearch/:imgQuery', function(req, res){
//imagesearch microservice (returns image metadata from Google Image Search)

var imageSearch = require('./imageSearch');
imageSearch.doSearch(req, res);
    
});

app.get('/latest/imagesearch/', function(req, res){
//returns last 10 imagesearch queries

var imageSearch = require('./imageSearch');
imageSearch.getLatest(req, res);
    
});


app.get('/file-size/', function(req, res){
// allows a file be uploaded and returns a json with the file size.

//render fileSize.pug, the file sumbit page
 res.render('fileSize');
 
});

//set up multer vars:
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
//var bodyParser = require('body-parser');
//app.use(bodyParser.json());


app.post('/file-size/', upload.single('upl'), function(req, res){
//accept the file upload post    
  var fileSize = require('./fileSize');
  fileSize.fileSize(req, res);
});

app.listen(port);


