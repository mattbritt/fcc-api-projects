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
    
   
    
    var dateStr = req.params.dateStr;
    
    if(isNumeric(dateStr)){
    var date = new Date(parseInt(dateStr));
    }
    else{
        var date = new Date(dateStr);
    }
    var natDate = getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear();
    
    
    if(date.getTime()){
     var json = {
         'unix': date.getTime(),
         'natural': natDate
     }   
    }
    else{
    var json = {
                'unix': null,
                'natural': null
                }
    }
    res.end(JSON.stringify(json));
    
});




app.listen(port);


function getMonth(num){
// helper function to convert month from number into the actual month name
// may be able to find a better way in the Date() api, but after looking a bit I realized it was quicker to write this


    switch(num){
        case 0:
            return 'January';
            break;                  
        case 1:
            return 'February';
            break;
        case 2:
            return 'March';
            break;
        case 3:
            return 'April';
            break;
        case 4:
            return 'May';
            break;
        case 5:
            return 'June';
            break;
        case 6:
            return 'July';
            break;
        case 7:
            return 'August';
            break;
        case 8:
            return 'September';
            break;
        case 9:
            return 'October';
            break;
        case 10:
            return 'November';
            break;
        case 11:
            return 'December';
            break;
        
        
    }

}


function isNumeric(num){
    //helper function to check if a variable is a number
    //via http://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
    return (!isNaN(parseFloat(num)) && isFinite(num));
}