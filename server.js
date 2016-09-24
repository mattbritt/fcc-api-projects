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
                        }


             
   res.render('index',
        {   
            timestamp: JSON.stringify( timestamp_ob ),
            whoami: JSON.stringify( whoami_ob ),
            littleUrlJson: JSON.stringify( littleUrl_ob )
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



app.listen(port);


