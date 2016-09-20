var port = 8080;


var express = require('express');
var app = express();

app.set('view engine', 'pug');

app.get('/', function(req, res){
  
   var ob = {'unix': 1450137600,
             'natural': "December 15, 2015" };
   res.render('index',{json:JSON.stringify(ob)}); 
    
});

app.get('/timestamp/:dateStr', function(req, res){
    
    var ts = require('./timestamp');
    
    res.end(ts(req.params.dateStr));
 
});




app.listen(port);


