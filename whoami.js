// module for the whoami request header parser microservice

module.exports = function whoami(req){
  
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var lang = req.acceptsLanguages();
    var software = req.headers['user-agent'];
  
  software = software.match(/\((.*?\))/);
  software = software[0].substring(1,software[0].length - 1);


var whoami_json = {
                    'ipaddress': ip,
                    'language': lang[0],
                    'software': software
                    }    
    
    return whoami_json;
    
    
    
    
}


