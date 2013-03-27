var https = require('https');
var fs = require("fs");

var o = {
  ca: fs.readFileSync("/data/Certficate/ca.pem"),
  key: fs.readFileSync("/data/Certificate/www.sly.mn.key"),
  cert: fs.readFileSync("/data/Certificate/certificate.pem")
};
//var https_server = https.createServer(https_options);
https.createServer(o, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);
