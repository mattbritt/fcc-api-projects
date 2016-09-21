var port = 8080;                                            //server port 8080


var express = require('express');                           //setup express
var app = express();            

app.set('view engine', 'pug');                              //use pug

app.get('/', function(req, res){
// render landing page


//example json for timestamp:
   var timestamp_ob = {'unix': 1450137600,
             'natural': "December 15, 2015" };
             
   res.render('index',{timestamp:JSON.stringify(timestamp_ob)}); 
    
});

app.get('/timestamp/:dateStr', function(req, res){
//timestamp service (reachable at'/timestamp')

    var ts = require('./timestamp');
    
    res.end(ts(req.params.dateStr));
 
});




app.listen(port);


