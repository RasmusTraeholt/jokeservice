let http = require('http');

let port = process.env.PORT || 8080;

http.createServer(function(request, response) {
    response.writeHead(200);
    response.write('We made it!');
    response.end();
}).listen(port);

console.log('yaaawddd');