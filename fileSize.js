//module for the file-size microservice

var exports = module.exports = [];


exports.fileSize = function(req, res){
//get file size and return jsonp

res.jsonp({ 'size': req.file.size });
res.end();
    
    
}